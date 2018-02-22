# Decentralized VPN built on blockchain

VPN desktop UI (OSX, Windows, Linux) for Mysterium Network

- Homepage https://mysterium.network/
- [Whitepaper](https://mysterium.network/whitepaper.pdf)

# mysterion

> mysterium client desktop interface application

#### Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

#build from osx to linux
docker run --rm -ti   --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_')   --env ELECTRON_CACHE="/root/.cache/electron"   --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder"   -v ${PWD}:/project   -v ${PWD##*/}-node-modules:/project/node_modules   -v ~/.cache/electron:/root/.cache/electron   -v ~/.cache/electron-builder:/root/.cache/electron-builder   electronuserland/builder:wine
yarn && yarn build

```

#### Testing

To run all tests:
```bash
npm run unit
```

If you want to run selected tests multiple times, you can start `karma` server in background:

```bash
npm run unit:start-server
npm run unit:run -- --grep="loading screen"
```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[142eea4](https://github.com/SimulatedGREG/electron-vue/tree/142eea44aa50fdead91a469daedfcff04308c3fc) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
