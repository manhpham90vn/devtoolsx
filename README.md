# DevToolsX

A collection of developer tools built with Tauri + React.

## Features

- **Diff Viewer** - Compare two texts side by side with syntax highlighting
- **JSON Formatter** - Format, minify, and validate JSON
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **URL Encoder/Decoder** - Encode and decode URL components
- **Timestamp Converter** - Convert between Unix timestamps and human-readable dates

## Download

Download the latest release from [GitHub Releases](https://github.com/manhpham90vn/devtoolsx/releases):

- **Linux**: `.deb`, `.rpm`, `.AppImage`
- **macOS**: `.dmg`
- **Windows**: `.msi`, `.exe`

## Run Local Dev

### Prerequisites

- Ubuntu 24.04

```shell
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

- Rust

```shell
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

- Node.js 24

```shell
nvm install 24
```

### Run

- Install dependencies

```shell
npm install
```

- Run

```shell
npm run tauri dev
```
