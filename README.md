# Mysterion - decentralized VPN built on blockchain

Mysterion is desktop application to access Mysterion Network - decentralized VPN built on blockchain.

- Homepage https://mysterium.network/
- [Whitepaper](https://mysterium.network/whitepaper.pdf)
- [Stable](https://github.com/MysteriumNetwork/mysterion/releases/latest) release

## Build Setup

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

## Contributing

For instruction on how to contribute to this project, please read [CONTRIBUTING.md](./CONTRIBUTING.md).

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[142eea4](https://github.com/SimulatedGREG/electron-vue/tree/142eea44aa50fdead91a469daedfcff04308c3fc) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

# License

This project is licensed under the terms of the GNU General Public License v3.0 (see [details](./LICENSE)).

