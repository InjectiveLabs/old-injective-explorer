# Cosmos Explorer

Graphical interface to explore validators, fullnodes, and blocks for Cosmos Hub testnets.

## Backend Requirement

The Explorer is entirely stateless and currently relies on a high-throughput Cosmos Full Node to connect to. The Explorer requires both the Tendermint RPC and the Cosmos LCD REST endpoints to be available publicly through TLS-secured subdomains. The convention is `https://rpc.fullnode.com` and `https://lcd.fullnode.com`.

To change the backend, edit the file `./src/store/modules/blockchain.js`. On the lines 5 and 6, change the `technofractal.com` part of the URL to your full node's domain name. 

```
rpc: "https://rpc.technofractal.com",
lcd: "https://lcd.technofractal.com",
```

And change the line `27` too:

```
const client = RpcClient("wss://rpc.technofractal.com:443")
```

**WARNING:** Every user the Explorer opens two websockets to full node in question, and will continue to spam your full node with AJAX requests until they close the page. We need a better backend solution for the Explorer! Please help if you can.

## Build

```bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn serve
```

## Deploy

```
# build for production with minification
yarn build

# then serve the `./dist` folder with the web server of your choice
```

