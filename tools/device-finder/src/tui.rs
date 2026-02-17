use anyhow::Result;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, KeyEventKind},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use crate::{detect_all_devices, Device, DevicePlatform, DeviceStatus};
use ratatui::{
    backend::CrosstermBackend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Style},
    text::{Line, Span},
    widgets::{Block, Borders, List, ListItem, Paragraph, Scrollbar, ScrollbarOrientation, ScrollbarState},
    Terminal,
};
use std::io;

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
    let mut devices = detect_all_devices().unwrap_or_default();
    let mut selected = 0;
    let mut filter_platform: Option<DevicePlatform> = None;
    let mut scroll_state = ScrollbarState::default();

    loop {
        terminal.draw(|f| {
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([
                    Constraint::Length(3),
                    Constraint::Min(0),
                    Constraint::Length(4),
                    Constraint::Length(3),
                ])
                .split(f.area());

            let filtered: Vec<&Device> = devices
                .iter()
                .filter(|d| {
                    if let Some(ref plat) = filter_platform {
                        &d.platform == plat
                    } else {
                        true
                    }
                })
                .collect();

            let title = format!(
                " Device Finder {} ",
                if let Some(ref p) = filter_platform {
                    format!("[{}]", match p {
                        DevicePlatform::IOS => "iOS",
                        DevicePlatform::Android => "Android",
                        DevicePlatform::Web => "Web",
                        DevicePlatform::Unknown => "All",
                    })
                } else {
                    "[All]".to_string()
                }
            );

            let items: Vec<ListItem> = filtered
                .iter()
                .enumerate()
                .map(|(i, d)| {
                    let status_color = match d.status {
                        DeviceStatus::Connected => Color::Green,
                        DeviceStatus::Disconnected => Color::Red,
                        DeviceStatus::Booting => Color::Yellow,
                        DeviceStatus::Shutdown => Color::DarkGray,
                        DeviceStatus::Unknown => Color::Gray,
                    };

                    let content = Line::from(vec![
                        Span::raw(format!("{:6} ", platform_emoji(&d.platform))),
                        Span::raw(d.name.clone()),
                        Span::raw("  "),
                        Span::styled(d.status_name(), Style::default().fg(status_color)),
                    ]);

                    let style = if i == selected {
                        Style::default().bg(Color::LightBlue).fg(Color::Black)
                    } else {
                        Style::default()
                    };

                    ListItem::new(content).style(style)
                })
                .collect();

            let list = List::new(items)
                .block(Block::bordered().title(title).border_style(Style::default().fg(Color::Cyan)))
                .highlight_style(Style::default().bg(Color::LightBlue).fg(Color::Black))
                .highlight_symbol("▶ ");

            f.render_widget(list, chunks[1]);

            if filtered.len() > 0 {
                scroll_state = scroll_state.content_length(filtered.len()).position(selected);
                f.render_stateful_widget(
                    Scrollbar::new(ScrollbarOrientation::VerticalRight)
                        .thumb_style(Style::default().fg(Color::LightBlue)),
                    chunks[1],
                    &mut scroll_state,
                );
            }

            if !filtered.is_empty() && selected < filtered.len() {
                if let Some(device) = filtered.get(selected) {
                    let details = format_device_details(device);
                    let detail_block = Paragraph::new(details)
                        .style(Style::default().fg(Color::White))
                        .block(Block::bordered()
                            .title(" Details ")
                            .border_style(Style::default().fg(Color::Cyan)));
                    f.render_widget(detail_block, chunks[2]);
                }
            } else {
                let no_device = Paragraph::new(" No device selected ")
                    .style(Style::default().fg(Color::DarkGray))
                    .block(Block::bordered()
                        .title(" Details ")
                        .border_style(Style::default().fg(Color::DarkGray)));
                f.render_widget(no_device, chunks[2]);
            }

            let help_text = if filtered.is_empty() {
                " No devices found | ↑↓: Navigate | Tab: Filter | r: Refresh | q: Quit ".to_string()
            } else {
                format!(
                    " {:}/{:} | ↑↓: Navigate | Tab: Filter | r: Refresh | q: Quit ",
                    selected + 1,
                    filtered.len()
                )
            };

            let help = Paragraph::new(help_text)
                .style(Style::default().fg(Color::DarkGray))
                .block(Block::bordered().borders(Borders::NONE));
            f.render_widget(help, chunks[3]);
        })?;

        if event::poll(std::time::Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                if key.kind == KeyEventKind::Press {
                    match key.code {
                        KeyCode::Char('q') => break,
                        KeyCode::Down | KeyCode::Char('j') => {
                            let filtered: Vec<&Device> = devices
                                .iter()
                                .filter(|d| {
                                    if let Some(ref plat) = filter_platform {
                                        &d.platform == plat
                                    } else {
                                        true
                                    }
                                })
                                .collect();
                            if selected < filtered.len().saturating_sub(1) {
                                selected += 1;
                            }
                        }
                        KeyCode::Up | KeyCode::Char('k') => {
                            if selected > 0 {
                                selected -= 1;
                            }
                        }
                        KeyCode::Tab => {
                            filter_platform = match filter_platform {
                                None => Some(DevicePlatform::IOS),
                                Some(DevicePlatform::IOS) => Some(DevicePlatform::Android),
                                Some(DevicePlatform::Android) => Some(DevicePlatform::Web),
                                Some(DevicePlatform::Web) => None,
                                Some(DevicePlatform::Unknown) => None,
                            };
                            selected = 0;
                        }
                        KeyCode::Char('r') => {
                            devices = detect_all_devices().unwrap_or_default();
                            selected = 0;
                        }
                        KeyCode::PageDown => {
                            let filtered: Vec<&Device> = devices
                                .iter()
                                .filter(|d| {
                                    if let Some(ref plat) = filter_platform {
                                        &d.platform == plat
                                    } else {
                                        true
                                    }
                                })
                                .collect();
                            selected = (selected + 10).min(filtered.len().saturating_sub(1));
                        }
                        KeyCode::PageUp => {
                            selected = selected.saturating_sub(10);
                        }
                        KeyCode::Home => {
                            selected = 0;
                        }
                        KeyCode::End => {
                            let filtered: Vec<&Device> = devices
                                .iter()
                                .filter(|d| {
                                    if let Some(ref plat) = filter_platform {
                                        &d.platform == plat
                                    } else {
                                        true
                                    }
                                })
                                .collect();
                            selected = filtered.len().saturating_sub(1);
                        }
                        _ => {}
                    }
                }
            }
        }
    }

    Ok(())
}

fn platform_emoji(platform: &DevicePlatform) -> &'static str {
    match platform {
        DevicePlatform::IOS => "📱",
        DevicePlatform::Android => "🤖",
        DevicePlatform::Web => "🌐",
        DevicePlatform::Unknown => "❓",
    }
}

fn format_device_details(device: &Device) -> String {
    let mut details = format!(
        " Platform: {}  |  Type: {}  |  Status: {}  |  ID: {}",
        device.platform_name(),
        device.type_name(),
        device.status_name(),
        device.id
    );

    if let Some(ref os) = device.os_version {
        details.push_str(&format!("\n OS Version: {}", os));
    }
    if let Some(ref model) = device.model {
        details.push_str(&format!("\n Model: {}", model));
    }
    if let Some(ref udid) = device.udid {
        if udid != &device.id {
            details.push_str(&format!("\n UDID: {}", udid));
        }
    }

    details
}
