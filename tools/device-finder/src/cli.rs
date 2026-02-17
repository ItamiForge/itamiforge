use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "device-finder")]
#[command(version = "0.1.0")]
#[command(about = "Cross-platform device discovery for developers", long_about = None)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Command,
}

#[derive(Subcommand)]
pub enum Command {
    List(ListOpts),
    Find(FindOpts),
    Info(InfoOpts),
    Tui,
}

#[derive(clap::Args)]
#[command(group = clap::ArgGroup::new("platform").multiple(false))]
pub struct ListOpts {
    #[arg(short, long, help = "Filter by platform (ios, android, web)")]
    pub platform: Option<String>,
    
    #[arg(short, long, help = "Output as JSON")]
    pub json: bool,
    
    #[arg(short, long, help = "Show verbose output with details")]
    pub verbose: bool,
}

#[derive(clap::Args)]
pub struct FindOpts {
    #[arg(help = "Search query (device name, id, or model)")]
    pub query: String,
}

#[derive(clap::Args)]
pub struct InfoOpts {
    #[arg(help = "Device ID or name")]
    pub id: String,
    
    #[arg(short, long, help = "Output as JSON")]
    pub json: bool,
}
