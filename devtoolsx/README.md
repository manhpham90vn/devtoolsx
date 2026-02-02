# DevToolsX

## Prerequisites

### Ubuntu Dependencies

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

### Rust

```shell
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

### Node.js (via nvm)

```shell
nvm install 24
```

## Local Development

1. Install dependencies

```shell
npm install
```

2. Run development server

```shell
npm run tauri dev
```
