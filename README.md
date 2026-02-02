# DevToolsX

DevToolsX is a browser extension that allows you to debug and analyze web applications.

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
