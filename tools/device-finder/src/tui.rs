use anyhow::Result;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, KeyEventKind, MouseEventKind},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use crate::{detect_all_devices, Device, DevicePlatform, DeviceStatus};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout, Margin, Rect},
    style::{Color, Style, Modifier},
    widgets::{Block, Borders, Cell, Paragraph, Row, Scrollbar, ScrollbarOrientation, ScrollbarState, Table, TableState},
    Frame, Terminal,
};
use std::io;
use std::time::{Duration, Instant};

#[derive(Clone, Copy, PartialEq)]
enum SortBy {
    Name,
    Platform,
    Status,
    Type,
    OSVersion,
}

struct AppState {
    devices: Vec<Device>,
    selected: usize,
    scroll_offset: usize,
    filter_platform: Option<DevicePlatform>,
    sort_by: SortBy,
    sort_asc: bool,
    loading: bool,
    loading_start: Instant,
    scroll_state: ScrollbarState,
}

impl AppState {
    fn new() -> Self {
        Self {
            devices: Vec::new(),
            selected: 0,
            scroll_offset: 0,
            filter_platform: None,
            sort_by: SortBy::Platform,
            sort_asc: true,
            loading: true,
            loading_start: Instant::now(),
            scroll_state: ScrollbarState::default(),
        }
    }

    fn get_filtered_and_sorted(&self) -> Vec<&Device> {
        let mut filtered: Vec<&Device> = self.devices
            .iter()
            .filter(|d| {
                if let Some(ref plat) = self.filter_platform {
                    &d.platform == plat
                } else {
                    true
                }
            })
            .collect();

        filtered.sort_by(|a, b| {
            let ord = match self.sort_by {
                SortBy::Name => a.name.cmp(&b.name),
                SortBy::Platform => a.platform_name().cmp(&b.platform_name()),
                SortBy::Status => a.status_name().cmp(&b.status_name()),
                SortBy::Type => a.type_name().cmp(&b.type_name()),
                SortBy::OSVersion => a.os_version.as_ref().unwrap_or(&String::new()).cmp(b.os_version.as_ref().unwrap_or(&String::new())),
            };
            if self.sort_asc { ord } else { ord.reverse() }
        });

        filtered
    }
}

pub fn run() -> Result<()> {
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let res = run_app(&mut terminal);

    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = res {
        eprintln!("Error: {:?}", err);
    }

    Ok(())
}

fn run_app(terminal: &mut Terminal<CrosstermBackend<io::Stdout>>) -> Result<()> {
    let mut state = AppState::new();

    // Initial detection in background
    state.devices = detect_all_devices().unwrap_or_default();
    state.loading = false;

    loop {
        terminal.draw(|f| {
            let area = f.area();

            if state.loading {
                draw_splash(f, area, state.loading_start);
                return;
            }

            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([
                    Constraint::Length(1),  // Header
                    Constraint::Min(0),     // Table
                    Constraint::Length(4),  // Details
                    Constraint::Length(1),  // Status bar
                ])
                .split(area);

            draw_header(f, chunks[0], &state);
            draw_table(f, chunks[1], &mut state);
            draw_details(f, chunks[2], &state);
            draw_status_bar(f, chunks[3], &state);
        })?;

        if event::poll(Duration::from_millis(50))? {
            match event::read()? {
                Event::Key(key) => {
                    if key.kind == KeyEventKind::Press {
                        match key.code {
                            KeyCode::Char('q') => break,
                            KeyCode::Char('s') => {
                                state.sort_by = match state.sort_by {
                                    SortBy::Name => SortBy::Platform,
                                    SortBy::Platform => SortBy::Status,
                                    SortBy::Status => SortBy::Type,
                                    SortBy::Type => SortBy::OSVersion,
                                    SortBy::OSVersion => SortBy::Name,
                                };
                                state.selected = 0;
                                state.scroll_offset = 0;
                            }
                            KeyCode::Char('S') => {
                                state.sort_asc = !state.sort_asc;
                            }
                            KeyCode::Char('g') => {
                                state.selected = 0;
                                state.scroll_offset = 0;
                            }
                            KeyCode::Char('G') => {
                                let filtered = state.get_filtered_and_sorted();
                                state.selected = filtered.len().saturating_sub(1);
                            }
                            KeyCode::Down | KeyCode::Char('j') => {
                                let filtered = state.get_filtered_and_sorted();
                                if state.selected < filtered.len().saturating_sub(1) {
                                    state.selected += 1;
                                }
                            }
                            KeyCode::Up | KeyCode::Char('k') => {
                                if state.selected > 0 {
                                    state.selected -= 1;
                                }
                            }
                            KeyCode::PageDown => {
                                let filtered = state.get_filtered_and_sorted();
                                state.selected = (state.selected + 10).min(filtered.len().saturating_sub(1));
                            }
                            KeyCode::PageUp => {
                                state.selected = state.selected.saturating_sub(10);
                            }
                            KeyCode::Home => {
                                state.selected = 0;
                            }
                            KeyCode::End => {
                                let filtered = state.get_filtered_and_sorted();
                                state.selected = filtered.len().saturating_sub(1);
                            }
                            KeyCode::Tab => {
                                state.filter_platform = match state.filter_platform {
                                    None => Some(DevicePlatform::IOS),
                                    Some(DevicePlatform::IOS) => Some(DevicePlatform::Android),
                                    Some(DevicePlatform::Android) => Some(DevicePlatform::Web),
                                    Some(DevicePlatform::Web) => None,
                                    Some(DevicePlatform::Unknown) => None,
                                };
                                state.selected = 0;
                                state.scroll_offset = 0;
                            }
                            KeyCode::Char('r') => {
                                state.loading = true;
                                state.loading_start = Instant::now();
                            }
                            _ => {}
                        }
                    }
                }
                Event::Mouse(mouse_event) => {
                    match mouse_event.kind {
                        MouseEventKind::ScrollDown => {
                            let filtered = state.get_filtered_and_sorted();
                            if state.selected < filtered.len().saturating_sub(1) {
                                state.selected += 1;
                            }
                        }
                        MouseEventKind::ScrollUp => {
                            if state.selected > 0 {
                                state.selected -= 1;
                            }
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        }

        // Check if we need to reload
        if state.loading && state.loading_start.elapsed() > Duration::from_millis(100) {
            state.devices = detect_all_devices().unwrap_or_default();
            state.loading = false;
            state.selected = 0;
            state.scroll_offset = 0;
        }
    }

    Ok(())
}

fn draw_splash(f: &mut Frame, area: Rect, start: Instant) {
    let elapsed = start.elapsed().as_millis() as f32 / 1000.0;
    let frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let frame_idx = ((elapsed * 10.0) as usize) % frames.len();
    
    let text = format!(
        "\n\n\n  {} Loading devices...\n\n  device-finder v0.1.0",
        frames[frame_idx]
    );
    
    let splash = Paragraph::new(text)
        .style(Style::default().fg(Color::Cyan))
        .block(Block::default());
    
    f.render_widget(splash, area);
}

fn draw_header(f: &mut Frame, area: Rect, state: &AppState) {
    let filter_text = match state.filter_platform {
        Some(DevicePlatform::IOS) => "[iOS]",
        Some(DevicePlatform::Android) => "[Android]",
        Some(DevicePlatform::Web) => "[Web]",
        _ => "[All]",
    };

    let sort_icon = if state.sort_asc { "▲" } else { "▼" };
    let sort_text = match state.sort_by {
        SortBy::Name => "name",
        SortBy::Platform => "platform",
        SortBy::Status => "status",
        SortBy::Type => "type",
        SortBy::OSVersion => "os",
    };

    let header_text = format!(
        "  Device Finder {} | Sort: {} {} | Tab: Filter | s: Sort | S: Dir | q: Quit",
        filter_text, sort_text, sort_icon
    );

    let header = Paragraph::new(header_text)
        .style(Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD));
    f.render_widget(header, area);
}

fn draw_table(f: &mut Frame, area: Rect, state: &mut AppState) {
    let filtered = state.get_filtered_and_sorted();
    
    let header_cells = ["Platform", "Name", "Type", "Status", "OS Version"]
        .iter()
        .map(|h| Cell::from(*h).style(Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD)));
    
    let header = Row::new(header_cells)
        .style(Style::default().bg(Color::DarkGray))
        .height(1);

    let rows: Vec<Row> = filtered
        .iter()
        .enumerate()
        .map(|(idx, device)| {
            let is_selected = idx == state.selected;
            
            let status_color = match device.status {
                DeviceStatus::Connected => Color::Green,
                DeviceStatus::Disconnected => Color::Red,
                DeviceStatus::Booting => Color::Yellow,
                DeviceStatus::Shutdown => Color::DarkGray,
                DeviceStatus::Unknown => Color::Yellow,
            };

            let platform_color = match device.platform {
                DevicePlatform::IOS => Color::Blue,
                DevicePlatform::Android => Color::Green,
                DevicePlatform::Web => Color::Cyan,
                DevicePlatform::Unknown => Color::Gray,
            };

            let style = if is_selected {
                Style::default().bg(Color::LightBlue).fg(Color::Black)
            } else {
                Style::default()
            };

            let status_text = match device.status {
                DeviceStatus::Shutdown => format!("{} (off)", device.status_name()),
                DeviceStatus::Unknown => "not installed".to_string(),
                _ => device.status_name().to_string(),
            };

            let cells = vec![
                Cell::from(format!("{} {}", platform_emoji(&device.platform), device.platform_name()))
                    .style(if is_selected { style } else { Style::default().fg(platform_color) }),
                Cell::from(device.name.clone()),
                Cell::from(device.type_name()),
                Cell::from(status_text).style(if is_selected { style } else { Style::default().fg(status_color) }),
                Cell::from(device.os_version.as_ref().unwrap_or(&"-".to_string()).clone()),
            ];

            Row::new(cells).style(style).height(1)
        })
        .collect();

    let table = Table::new(rows, [
        Constraint::Length(12),
        Constraint::Min(20),
        Constraint::Length(12),
        Constraint::Length(16),
        Constraint::Length(12),
    ])
    .header(header)
    .block(Block::default().borders(Borders::ALL).border_style(Style::default().fg(Color::DarkGray)))
    .row_highlight_style(Style::default().bg(Color::LightBlue).fg(Color::Black))
    .highlight_symbol("▶ ");

    let mut table_state = TableState::default();
    table_state.select(Some(state.selected));

    f.render_stateful_widget(table, area, &mut table_state);

    // Draw scrollbar
    if filtered.len() > 0 {
        state.scroll_state = state.scroll_state.content_length(filtered.len()).position(state.selected);
        let scrollbar = Scrollbar::new(ScrollbarOrientation::VerticalRight)
            .thumb_style(Style::default().fg(Color::LightBlue))
            .track_style(Style::default().fg(Color::DarkGray));
        
        f.render_stateful_widget(
            scrollbar,
            area.inner(Margin::new(0, 1)),
            &mut state.scroll_state,
        );
    }
}

fn draw_details(f: &mut Frame, area: Rect, state: &AppState) {
    let filtered = state.get_filtered_and_sorted();
    
    let content = if let Some(device) = filtered.get(state.selected) {
        let mut text = format!(
            "Platform: {} | Type: {} | Status: {}",
            device.platform_name(),
            device.type_name(),
            device.status_name()
        );
        
        if let Some(ref os) = device.os_version {
            text.push_str(&format!(" | OS: {}", os));
        }
        if let Some(ref model) = device.model {
            text.push_str(&format!(" | Model: {}", model));
        }
        
        text.push_str(&format!("\nID: {}", device.id));
        
        if let Some(ref udid) = device.udid {
            if udid != &device.id {
                text.push_str(&format!(" | UDID: {}", udid));
            }
        }
        
        text
    } else {
        "No device selected".to_string()
    };

    let paragraph = Paragraph::new(content)
        .style(Style::default().fg(Color::White))
        .block(Block::default()
            .title(" Details ")
            .title_style(Style::default().fg(Color::Cyan))
            .borders(Borders::ALL)
            .border_style(Style::default().fg(Color::DarkGray)));

    f.render_widget(paragraph, area);
}

fn draw_status_bar(f: &mut Frame, area: Rect, state: &AppState) {
    let filtered = state.get_filtered_and_sorted();
    let _total = state.devices.len();
    
    let text = format!(
        "  {}/{} devices | ↑↓: Navigate | PgUp/PgDn: Page | Home/End: Jump | r: Refresh | q: Quit",
        state.selected + 1,
        filtered.len()
    );

    let status = Paragraph::new(text)
        .style(Style::default().fg(Color::DarkGray));
    
    f.render_widget(status, area);
}

fn platform_emoji(platform: &DevicePlatform) -> &'static str {
    match platform {
        DevicePlatform::IOS => "📱",
        DevicePlatform::Android => "🤖",
        DevicePlatform::Web => "🌐",
        DevicePlatform::Unknown => "❓",
    }
}
