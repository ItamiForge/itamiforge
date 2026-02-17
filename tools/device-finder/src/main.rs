mod cli;
mod tui;

use anyhow::Result;
use clap::Parser;
use device_finder::{detect_all_devices, detect_platform_devices, Device, DevicePlatform, DeviceStatus};

fn main() -> Result<()> {
    let cli = cli::Cli::parse();

    match cli.command {
        cli::Command::List(list_opts) => run_list(list_opts),
        cli::Command::Find(find_opts) => run_find(find_opts),
        cli::Command::Info(info_opts) => run_info(info_opts),
        cli::Command::Tui => tui::run(),
    }
}

fn run_list(opts: cli::ListOpts) -> Result<()> {
    let devices = if let Some(platform) = opts.platform {
        let plat = match platform.as_str() {
            "ios" => DevicePlatform::IOS,
            "android" => DevicePlatform::Android,
            "web" => DevicePlatform::Web,
            _ => DevicePlatform::Unknown,
        };
        detect_platform_devices(plat)?
    } else {
        detect_all_devices()?
    };

    if devices.is_empty() {
        println!("No devices found.");
        if cfg!(target_os = "macos") {
            println!("\nNote: For iOS simulators, make sure Xcode is installed.");
        }
        println!("For Android, ensure ADB is installed and devices are connected.");
        return Ok(());
    }

    if opts.json {
        println!("{}", serde_json::to_string_pretty(&devices)?);
    } else {
        print_device_list(&devices, opts.verbose);
    }

    Ok(())
}

fn run_find(opts: cli::FindOpts) -> Result<()> {
    let devices = detect_all_devices()?;
    
    let matching: Vec<&Device> = devices
        .iter()
        .filter(|d| {
            d.name.to_lowercase().contains(&opts.query.to_lowercase())
                || d.id.to_lowercase().contains(&opts.query.to_lowercase())
                || d.model.as_ref().map(|m| m.to_lowercase().contains(&opts.query.to_lowercase())).unwrap_or(false)
        })
        .collect();

    if matching.is_empty() {
        println!("No devices found matching '{}'", opts.query);
        std::process::exit(1);
    }

    for device in matching {
        println!("{}", device.id);
    }

    Ok(())
}

fn run_info(opts: cli::InfoOpts) -> Result<()> {
    let devices = detect_all_devices()?;
    
    let device = devices
        .iter()
        .find(|d| d.id == opts.id || d.name == opts.id);

    match device {
        Some(d) => {
            if opts.json {
                println!("{}", serde_json::to_string_pretty(d)?);
            } else {
                print_device_info(d);
            }
        }
        None => {
            println!("Device '{}' not found", opts.id);
            std::process::exit(1);
        }
    }

    Ok(())
}

fn print_device_list(devices: &[Device], verbose: bool) {
    use colored::*;
    
    let header = format!("{:<6} {:<20} {:<15} {:<12} {}", 
        "PLATFORM", "NAME", "TYPE", "STATUS", "ID");
    println!("{}", header);
    println!("{}", "-".repeat(header.len()));

    for device in devices {
        let platform = match device.platform {
            DevicePlatform::IOS => "iOS".cyan(),
            DevicePlatform::Android => "Android".green(),
            DevicePlatform::Web => "Web".magenta(),
            DevicePlatform::Unknown => "Unknown".normal(),
        };
        
        let status = match device.status {
            DeviceStatus::Connected => "Connected".green(),
            DeviceStatus::Disconnected => "Disconnected".red(),
            DeviceStatus::Booting => "Booting".yellow(),
            DeviceStatus::Shutdown => "Shutdown".dimmed(),
            DeviceStatus::Unknown => "Unknown".normal(),
        };
        
        let device_type = device.type_name();
        
        if verbose {
            println!("{:<6} {:<20} {:<15} {:<12} {}", 
                platform,
                device.name,
                device_type,
                status,
                device.id
            );
            
            if let Some(ref os) = device.os_version {
                println!("       OS: {}", os);
            }
            if let Some(ref model) = device.model {
                println!("       Model: {}", model);
            }
            println!();
        } else {
            println!("{:<6} {:<20} {:<15} {:<12} {}", 
                platform,
                device.name,
                device_type,
                status,
                device.id
            );
        }
    }
}

fn print_device_info(device: &Device) {
    use colored::*;
    
    println!("{}", "Device Details".bold());
    println!("{}", "=".repeat(40));
    println!("{}: {}", "ID".bold(), device.id);
    println!("{}: {}", "Name".bold(), device.name);
    println!("{}: {}", "Platform".bold(), device.platform_name());
    println!("{}: {}", "Type".bold(), device.type_name());
    println!("{}: {}", "Status".bold(), device.status_name());
    
    if let Some(ref os) = device.os_version {
        println!("{}: {}", "OS Version".bold(), os);
    }
    if let Some(ref model) = device.model {
        println!("{}: {}", "Model".bold(), model);
    }
    if let Some(ref udid) = device.udid {
        println!("{}: {}", "UDID".bold(), udid);
    }
    
    if !device.details.is_empty() {
        println!("\n{}", "Additional Details".bold());
        for (key, value) in &device.details {
            println!("  {}: {}", key, value);
        }
    }
}
