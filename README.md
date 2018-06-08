# Mysterion - decentralized VPN built on blockchain

Mysterion is desktop application to access Mysterion Network - decentralized VPN built on blockchain.

- Homepage https://mysterium.network/
- [Whitepaper](https://mysterium.network/whitepaper.pdf)
- [Stable](https://github.com/MysteriumNetwork/mysterion/releases/latest) release

#### Build Setup

##### Note that currently, the only supported development environment is OSX, Windows and linux are work in progress.

Grab the latest `mysterium_client` binary for OSX from https://github.com/MysteriumNetwork/node/releases and put it into your project's `bin` directory (make sure to rename it to `mysterium_client`)

Install `openvpn` from https://openvpn.net/ or for OSX with homebrew run `brew install openvpn`

Once `openvpn` is installed you need to symlink it to your project's directory:

##### Note: If installed via brew you can get the installation path using `brew info openvpn`, the binary should be in `<install dir>/sbin/openvpn`

```bash
ln -s <path to openvpn binary> <full path to project dir>/bin/openvpn
```

Download `update-resolv-conf` and `GeoLite2-Country.mmdb` from https://github.com/MysteriumNetwork/node/tree/master/bin/client_package/config and paste it into your project's `bin/config` directory.

Install `yarn` from https://yarnpkg.com/lang/en/docs/install/

Once you're all set, cd into your project's root directory.

#### Development

Install dependencies
```bash
yarn install
```

Run with hot reload
```bash
yarn dev
```

Run all continuous integration checks (linter, Flow checker, tests):
```bash
yarn ci
```

Build for production

```bash
yarn build
```

Build from OSX to linux
```bash
docker run --rm -ti   --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_')   --env ELECTRON_CACHE="/root/.cache/electron"   --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder"   -v ${PWD}:/project   -v ${PWD##*/}-node-modules:/project/node_modules   -v ~/.cache/electron:/root/.cache/electron   -v ~/.cache/electron-builder:/root/.cache/electron-builder   electronuserland/builder:wine
yarn && yarn build
```

#### Maintenance

To update dependencies:

```bash
yarn upgrade
```

This will update packages according to version constrains in *package.json*.
To update version constraints, edit version constrain in *package.json* and then upgrade yarn:

```bash
vim package.json
yarn upgrade
```

To update Flow type signatures of dependencies, run:

```bash
yarn flow-typed install
```

#### Testing

To run all tests:
```bash
yarn unit
```

If you want to run selected tests multiple times, you can start `karma` server in background:

```bash
yarn unit:start-server
yarn unit:run --grep="loading screen"
```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[142eea4](https://github.com/SimulatedGREG/electron-vue/tree/142eea44aa50fdead91a469daedfcff04308c3fc) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

# License

This project is licensed under the terms of the GNU General Public License v3.0 (see [details](./LICENSE)).

