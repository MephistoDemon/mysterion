# Mysterion - decentralized VPN built on blockchain

Mysterion is desktop application to access Mysterion Network - decentralized VPN built on blockchain.

- Homepage https://mysterium.network/
- [Whitepaper](https://mysterium.network/whitepaper.pdf)
- [Stable](https://github.com/MysteriumNetwork/mysterion/releases/latest) release

#### Build Setup

```bash
# install dependencies
You need to specify GITHUB_API_TOKEN for the first run, as it will download
required binaries: mysterium_client and openvpn. This token can be generated at:
https://github.com/settings/tokens, it requires "repo" scope
GITHUB_API_TOKEN=<yourtoken> yarn install

# serve with hot reload at localhost:9080
yarn dev

# build electron application for production
yarn build


# run all continuous integration checks (linter, Flow checker, tests):
yarn ci

#build from osx to linux
docker run --rm -ti   --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_')   --env ELECTRON_CACHE="/root/.cache/electron"   --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder"   -v ${PWD}:/project   -v ${PWD##*/}-node-modules:/project/node_modules   -v ~/.cache/electron:/root/.cache/electron   -v ~/.cache/electron-builder:/root/.cache/electron-builder   electronuserland/builder:wine
yarn && yarn build

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

