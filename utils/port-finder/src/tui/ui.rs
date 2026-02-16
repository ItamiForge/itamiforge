use super::app::App;
use ratatui::{
    prelude::*,
    widgets::{Block, Borders, Cell, Clear, Paragraph, Row, Table, Wrap},
};

const BANNER: &str = r#"
 ██████╗  ██████╗ ██████╗ ████████╗    ███████╗██╗███╗   ██╗██████╗ ███████╗██████╗ 
 ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝    ██╔════╝██║████╗  ██║██╔══██╗██╔════╝██╔══██╗
 ██████╔╝██║   ██║██████╔╝   ██║       █████╗  ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝
 ██╔═══╝ ██║   ██║██╔══██╗   ██║       ██╔══╝  ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
 ██║     ╚██████╔╝██║  ██║   ██║       ██║     ██║██║ ╚████║██████╔╝███████╗██║  ██║
 ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝
"#;

pub fn draw(frame: &mut Frame, app: &mut App) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(8),
            Constraint::Min(10),
            Constraint::Length(3),
        ])
        .split(frame.area());

    // Banner
    let banner = Paragraph::new(BANNER)
        .style(Style::default().fg(Color::Cyan))
        .alignment(Alignment::Center);
    frame.render_widget(banner, chunks[0]);

    if app.inspect_mode {
        render_inspect_popup(frame, app);
        return; // Don't render full table interaction underneath if modal is exclusive? 
        // Actually, let's render background table then popup on top.
    }

    // Borrow state mutably before using other fields
    let state = &mut app.state;
    // Borrow other fields immutably
    let ports = &app.ports;
    let filter_text = &app.filter_text;
    let show_all = app.show_all;
    let message = &app.message;
    let sort_column = app.sort_column;

    // Filter ports logic inlined
    let filtered_ports_refs: Vec<&crate::port::PortInfo> = if filter_text.is_empty() {
        ports.iter().collect()
    } else {
        ports
            .iter()
            .filter(|p| {
                p.port.to_string().contains(filter_text)
                    || p.process_name.to_lowercase().contains(&filter_text.to_lowercase())
            })
            .collect()
    };

    // Grouping Logic
    let rows: Vec<Row> = if app.group_mode {
        use std::collections::HashMap;
        let mut groups: HashMap<u32, Vec<&crate::port::PortInfo>> = HashMap::new();
        let mut no_pid: Vec<&crate::port::PortInfo> = Vec::new();

        for p in filtered_ports_refs {
            if let Some(pid) = p.pid {
                groups.entry(pid).or_default().push(p);
            } else {
                no_pid.push(p);
            }
        }

        // Convert groups to rows
        let mut sorted_groups: Vec<_> = groups.into_iter().collect();
        // Sort groups based on app.sort_column of the representative element
        sorted_groups.sort_by(|(_, a_ports), (_, b_ports)| {
             let a = a_ports[0];
             let b = b_ports[0];
             // Reuse sort logic manually or simplistically
             match sort_column {
                super::app::SortColumn::Port => a.port.cmp(&b.port),
                super::app::SortColumn::Pid => a.pid.unwrap_or(0).cmp(&b.pid.unwrap_or(0)),
                super::app::SortColumn::Memory => b.memory.cmp(&a.memory),
                super::app::SortColumn::Cpu => b.cpu_usage.partial_cmp(&a.cpu_usage).unwrap(),
            }
        });

        let mut group_rows: Vec<Row> = sorted_groups.iter().map(|(_, process_ports)| {
            let p = process_ports[0]; // Representative
            let ports_str = process_ports.iter().map(|p| p.port.to_string()).collect::<Vec<_>>().join(", ");
            let count = process_ports.len();
            let port_display = if count > 1 {
                format!("{} ({})", ports_str, count)
            } else {
                ports_str
            };

            let state_style = match p.state.as_str() {
                "Listen" => Style::default().fg(Color::Green),
                _ => Style::default(),
            };

            Row::new(vec![
                Cell::from(port_display).style(Style::default().fg(Color::Cyan)),
                Cell::from(p.protocol.as_str()),
                Cell::from(p.state.as_str()).style(state_style),
                Cell::from(p.pid.map(|id| id.to_string()).unwrap_or("-".to_string())),
                Cell::from(p.smart_label()),
                Cell::from(p.local_addr.as_str()).style(Style::default().fg(Color::DarkGray)),
                Cell::from(p.format_duration()).style(Style::default().fg(Color::Magenta)),
                Cell::from(format!("{:.1}%", p.cpu_usage)),
                Cell::from(p.format_memory()),
                Cell::from(p.user.as_str()),
            ])
        }).collect();

        // Add no_pid entries at the end (or filtered out?)
        // Let's just add them as individuals
        for p in no_pid {
             let state_style = match p.state.as_str() {
                "Listen" => Style::default().fg(Color::Green),
                 _ => Style::default(),
            };
            group_rows.push(Row::new(vec![
                Cell::from(p.port.to_string()).style(Style::default().fg(Color::Cyan)),
                Cell::from(p.protocol.as_str()),
                Cell::from(p.state.as_str()).style(state_style),
                Cell::from("-"),
                Cell::from(p.smart_label()),
                Cell::from(p.local_addr.as_str()).style(Style::default().fg(Color::DarkGray)),
                Cell::from(p.format_duration()).style(Style::default().fg(Color::Magenta)),
                Cell::from("-"),
                Cell::from("-"),
                Cell::from("-"),
            ]));
        }
        
        group_rows

    } else {
        filtered_ports_refs
            .iter()
            .map(|p| {
                let state_style = match p.state.as_str() {
                    "Listen" => Style::default().fg(Color::Green),
                    "Established" => Style::default().fg(Color::Cyan),
                    "TimeWait" => Style::default().fg(Color::Yellow),
                    "CloseWait" => Style::default().fg(Color::Red),
                    _ => Style::default(),
                };

                Row::new(vec![
                    Cell::from(p.port.to_string()).style(Style::default().fg(Color::Cyan)),
                    Cell::from(p.protocol.as_str()),
                    Cell::from(p.state.as_str()).style(state_style),
                    Cell::from(p.pid.map(|id| id.to_string()).unwrap_or("-".to_string())),
                    Cell::from(p.smart_label()),
                    Cell::from(p.local_addr.as_str()).style(Style::default().fg(Color::DarkGray)),
                    Cell::from(p.format_duration()).style(Style::default().fg(Color::Magenta)),
                    Cell::from(format!("{:.1}%", p.cpu_usage)),
                    Cell::from(p.format_memory()),
                    Cell::from(p.user.as_str()),
                ])
            })
            .collect()
    };

    // Port table
    let header_cells = ["PORT(S)", "PROTO", "STATE", "PID", "PROCESS", "LOCAL", "TIME", "CPU", "MEM", "USER"];
    let header = Row::new(header_cells)
        .style(Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD));



    let table = Table::new(
        rows,
        [
            Constraint::Length(8),
            Constraint::Length(6),
            Constraint::Length(12),
            Constraint::Length(8),
            Constraint::Length(20),
            Constraint::Min(20),
            Constraint::Length(8),
            Constraint::Length(8),
            Constraint::Length(10),
            Constraint::Length(10),
        ],
    )
    .header(header)
    .block(
        Block::default()
            .borders(Borders::ALL)
            .title(format!(
                " Ports ({}) [{}] [Sort: {:?}] ",
                ports.len(),
                if show_all { "ALL" } else { "LISTEN" },
                sort_column
            )),
    )
    .row_highlight_style(Style::default().bg(Color::DarkGray));

    frame.render_stateful_widget(table, chunks[1], state);

    // Footer
    let mode_indicator = if show_all { "ALL" } else { "LISTEN" };
    let group_indicator = if app.group_mode { "GRP:ON" } else { "GRP:OFF" };
    let msg = message.as_deref().unwrap_or("");
    let footer = Paragraph::new(format!(
        " [q]uit [r]efresh [a]ll({}) [g]roup({}) [s]ort [Enter]inspect [c]opy [K]ill  {}",
        mode_indicator, group_indicator, msg
    ))
    .style(Style::default().fg(Color::DarkGray))
    .block(Block::default().borders(Borders::ALL));

    frame.render_widget(footer, chunks[2]);

    if app.inspect_mode {
        render_inspect_popup(frame, app);
    }
}

fn render_inspect_popup(frame: &mut Frame, app: &App) {
    if let Some(selected) = app.state.selected() {
        if let Some(port) = app.ports.get(selected) {
            let area = centered_rect(60, 60, frame.area());
            
            // Re-fetch process info details if needed, but we have them in PortInfo now
            
            let text = vec![
                Line::from(vec![Span::raw("Port: "), Span::styled(port.port.to_string(), Style::default().fg(Color::Cyan))]),
                Line::from(vec![Span::raw("PID: "), Span::styled(port.pid.map(|p| p.to_string()).unwrap_or_default(), Style::default().fg(Color::Yellow))]),
                Line::from(vec![Span::raw("Parent PID: "), Span::styled(port.parent_pid.map(|p| p.to_string()).unwrap_or("-".to_string()), Style::default().fg(Color::Yellow))]),
                Line::from(vec![Span::raw("Process: "), Span::styled(port.process_name.clone(), Style::default().add_modifier(Modifier::BOLD))]),
                Line::from(vec![Span::raw("Command: "), Span::styled(port.command.clone(), Style::default().fg(Color::Green))]),
                Line::from(vec![Span::raw("User: "), Span::styled(port.user.clone(), Style::default().fg(Color::Blue))]),
                Line::from(vec![Span::raw("Memory: "), Span::styled(port.format_memory(), Style::default().fg(Color::Magenta))]),
                Line::from(vec![Span::raw("CPU: "), Span::styled(format!("{:.1}%", port.cpu_usage), Style::default().fg(Color::Red))]),
                Line::from(vec![Span::raw("Local: "), Span::styled(port.local_addr.clone(), Style::default().fg(Color::DarkGray))]),
                Line::from(vec![Span::raw("Protocol: "), Span::styled(port.protocol.clone(), Style::default())]),
                Line::from(vec![Span::raw("State: "), Span::styled(port.state.clone(), Style::default())]),
                Line::from(""),
                Line::from(Span::styled("Press [Esc] or [Enter] to close", Style::default().fg(Color::DarkGray))),
            ];

            let paragraph = Paragraph::new(text)
                .block(Block::default().borders(Borders::ALL).title(" Process Details "))
                .wrap(Wrap { trim: true });

            frame.render_widget(Clear, area); // Clear background
            frame.render_widget(paragraph, area);
        }
    }
}

fn centered_rect(percent_x: u16, percent_y: u16, r: Rect) -> Rect {
    let popup_layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Percentage((100 - percent_y) / 2),
            Constraint::Percentage(percent_y),
            Constraint::Percentage((100 - percent_y) / 2),
        ])
        .split(r);

    let layout = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Percentage((100 - percent_x) / 2),
            Constraint::Percentage(percent_x),
            Constraint::Percentage((100 - percent_x) / 2),
        ])
        .split(popup_layout[1]);

    layout[1]
}
