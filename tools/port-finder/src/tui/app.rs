use crate::port::{self, PortInfo};
use anyhow::Result;
use copypasta::{ClipboardContext, ClipboardProvider};
use ratatui::widgets::TableState;
use sysinfo::{Pid, System};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SortColumn {
    Port,
    Pid,
    Memory,
    Cpu,
}

pub struct App {
    pub ports: Vec<PortInfo>,
    pub state: TableState,
    pub show_all: bool,
    pub filter_mode: bool,
    pub filter_text: String,
    pub message: Option<String>,
    pub sort_column: SortColumn,
    pub group_mode: bool,
    pub inspect_mode: bool,
    clipboard: Option<ClipboardContext>,
}

impl App {
    pub fn new() -> Result<Self> {
        let mut ports = port::list_ports(false)?;
        ports.sort_by_key(|p| p.port);
        
        let mut state = TableState::default();
        if !ports.is_empty() {
            state.select(Some(0));
        }
        
        let clipboard = ClipboardContext::new().ok();

        Ok(Self {
            ports,
            state,
            show_all: false,
            filter_mode: false,
            filter_text: String::new(),
            message: None,
            sort_column: SortColumn::Port,
            group_mode: false,
            inspect_mode: false,
            clipboard,
        })
    }

    pub fn refresh(&mut self) -> Result<()> {
        let mut ports = port::list_ports(self.show_all)?;
        self.sort_ports(&mut ports);
        self.ports = ports;

        if self.ports.is_empty() {
            self.state.select(None);
        } else if let Some(selected) = self.state.selected() {
            if selected >= self.ports.len() {
                self.state.select(Some(self.ports.len() - 1));
            }
        } else {
             self.state.select(Some(0));
        }
        Ok(())
    }
    
    fn sort_ports(&self, ports: &mut Vec<PortInfo>) {
        match self.sort_column {
            SortColumn::Port => ports.sort_by_key(|p| p.port),
            SortColumn::Pid => ports.sort_by_key(|p| p.pid.unwrap_or(0)),
            SortColumn::Memory => ports.sort_by(|a, b| b.memory.cmp(&a.memory)), // Descending
            SortColumn::Cpu => ports.sort_by(|a, b| b.cpu_usage.partial_cmp(&a.cpu_usage).unwrap()), // Descending
        }
    }

    pub fn cycle_sort(&mut self) {
        self.sort_column = match self.sort_column {
            SortColumn::Port => SortColumn::Pid,
            SortColumn::Pid => SortColumn::Memory,
            SortColumn::Memory => SortColumn::Cpu,
            SortColumn::Cpu => SortColumn::Port,
        };
        let _ = self.refresh();
        self.message = Some(format!("Sorted by {:?}", self.sort_column));
    }
    
    pub fn toggle_group(&mut self) {
        self.group_mode = !self.group_mode;
        // When toggling, we should probably reset selection or ensure it's valid
        self.state.select(Some(0)); 
        self.message = Some(format!("Group Mode: {}", if self.group_mode { "ON" } else { "OFF" }));
    }

    pub fn toggle_inspect(&mut self) {
        self.inspect_mode = !self.inspect_mode;
    }
    
    pub fn copy_selected(&mut self) {
        if let Some(selected) = self.state.selected() {
            if let Some(info) = self.ports.get(selected) {
                // Determine what to copy based on context? For now just local address
                let text = format!("{}", info.local_addr);
                if let Some(ctx) = &mut self.clipboard {
                     if ctx.set_contents(text.clone()).is_ok() {
                         self.message = Some(format!("Copied {}", text));
                     } else {
                         self.message = Some("Clipboard error".to_string());
                     }
                } else {
                    self.message = Some("Clipboard unavailable".to_string());
                }
            }
        }
    }

    pub fn next(&mut self) {
        if self.inspect_mode { return; } // Disable nav in popup? Or maybe just keep it.
        if self.ports.is_empty() {
            return;
        }
        
        let i = match self.state.selected() {
            Some(i) => {
                if i >= self.ports.len() - 1 {
                    0
                } else {
                    i + 1
                }
            }
            None => 0,
        };
        self.state.select(Some(i));
    }

    pub fn prev(&mut self) {
        if self.inspect_mode { return; }
        if self.ports.is_empty() {
            return;
        }

        let i = match self.state.selected() {
            Some(i) => {
                if i == 0 {
                    self.ports.len() - 1
                } else {
                    i - 1
                }
            }
            None => 0,
        };
        self.state.select(Some(i));
    }

    pub fn toggle_all(&mut self) {
        self.show_all = !self.show_all;
        let _ = self.refresh();
    }

    pub fn toggle_filter(&mut self) {
        self.filter_mode = !self.filter_mode;
    }

    pub fn kill_selected(&mut self) -> Result<()> {
        if let Some(selected) = self.state.selected() {
            if let Some(info) = self.ports.get(selected) {
                if let Some(pid) = info.pid {
                    let mut sys = System::new_all();
                    sys.refresh_all();
                    if let Some(process) = sys.process(Pid::from_u32(pid)) {
                        process.kill();
                        self.message = Some(format!("Killed PID {}", pid));
                        self.refresh()?;
                    }
                }
            }
        }
        Ok(())
    }


}
