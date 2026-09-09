# HD Sentinel UI Linux

A native GTK4 / libadwaita desktop front-end for the [Hard Disk Sentinel Linux](https://www.hdsentinel.com/hd_sentinel_linux.php) console tool. Built with TypeScript and React-style components using [GTKX](https://gtkx.dev), it renders as a fully native Linux application - no webview involved.

The app displays disk health, S.M.A.R.T. attributes, temperatures and RAM module information in real time, using the official Hard Disk Sentinel binary as its data backend.

## Features

- Disk overview with performance and health progress bars
- Current temperature and maximum temperature over the entire disk lifespan
- S.M.A.R.T. attribute table with values and thresholds
- Separate handling and icons for SATA, NVMe and removable USB drives
- Partition listing per drive
- RAM module details (size, type, speed, form factor, voltages) via `dmidecode`
- Live refresh of sensor data (approximately every second)
- Light / dark / system color scheme
- English and Hungarian UI languages

## How It Works

1. On first launch the app looks for the official `HDSentinel` binary at `~/.cache/hdsentinel/exec/HDSentinel`.
2. If it is not found, a setup window appears where you can drag and drop the extracted `HDSentinel` binary (a download link is provided in-app).
3. Once available, the app starts a privileged helper script through `pkexec` that dumps RAM information once (`dmidecode --type memory`) and repeatedly runs `HDSentinel -xml -dump`, about once per second.
4. The XML output is parsed to JSON and rendered by the UI.

## Installation

Download the latest AppImage from the [GitHub Releases page](https://github.com/fablevi/HD_Sentinel_UI_Linux/releases):

```bash
chmod +x HDSentinelUI-x86_64.AppImage
./HDSentinelUI-x86_64.AppImage
```

### First Run Setup

1. Download Hard Disk Sentinel for Linux console from the official website (the app shows a direct download link).
2. Extract the archive and drag the `HDSentinel` file onto the application window.
3. The file is copied to `~/.cache/hdsentinel/exec/HDSentinel` and marked executable.
4. Monitoring runs with elevated privileges - enter your password when the `pkexec` prompt appears.

## Requirements

- x86_64 Linux distribution
- GTK4 and libadwaita runtime libraries (installed by default on GNOME systems)
- `pkexec` (PolicyKit) for privilege elevation
- Node.js on the host system (used to run the bundled JavaScript)
- `dmidecode` (optional, needed for RAM information)

## Configuration

Settings are stored as JSON:

| File | Purpose |
| --- | --- |
| `~/.cache/hdsentinel/config/settings.json` | Color scheme and language |
| `~/.cache/hdsentinel/config/measure.json` | Measurement data cache |
| `~/.cache/hdsentinel/exec/HDSentinel` | Your copy of the HDSentinel binary |

## Development

### Prerequisites

- Node.js and npm (or pnpm)

### Getting Started

```bash
git clone https://github.com/fablevi/HD_Sentinel_UI_Linux.git
cd HD_Sentinel_UI_Linux
npm install
npm run dev        # start in development mode
npm run typecheck  # codegen + TypeScript check
```

### Building the AppImage

```bash
npm run script     # runs build_appimage.sh
```

The script builds the project, assembles an AppDir, and packages it into:

```
built_files/HDSentinelUI-x86_64.AppImage
```
