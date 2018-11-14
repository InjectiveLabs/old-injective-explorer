# Tendermint Explorer

Blockchain and transaction explorer for Tendermint. Supports JSON transactions and UTF-8.
Based on Cosmos Explorer.

## Screenshot

If a block has transactions that are JSON objects, Tendermint Explorer will render all tx fields automatically. 

![Block Details in Tendermint Explorer](https://res.cloudinary.com/thedapper/image/upload/v1542154947/Screen_Shot_2018-11-14_at_2.21.59_AM.png)
## Requirements

Tendermint Explorer is stateless and relies on a high-throughput Tendermint full node to connect to. 
Explorer requires Tendermint RPC endpoints to be available publicly through TLS-secured subdomains. 
The convention is `https://rpc.fullnode.com`.

To change the backend, edit the file `./src/store/modules/blockchain.js`. 
On the lines 5, change the `localhost:26657` part of the URL to your full node's domain name. 

```
rpc: "http://localhost:26657"
```

And change the line `27` too:

```
const client = RpcClient("ws://localhost:26657")
```

**WARNING:** Every user that visits the Explorer opens two websockets to the default full node. 
The user will continue to spam your full node with AJAX requests until they close the page. 
We need a better backend solution for the Explorer! Please help if you can.

## Build

```sh
# Install dependencies
yarn

# Serve with hot reload at localhost:8080
yarn serve
```

## Deploy

```sh
# Build for production with minification
yarn build

# Then serve the `./dist` folder with the web server of your choice
```
