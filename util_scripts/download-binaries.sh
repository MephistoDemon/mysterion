#!/bin/bash

SCRIPT_DIR=`dirname $0`

[ "$GITHUB_API_TOKEN" ] || { echo "Error: Please define GITHUB_API_TOKEN variable." >&2; exit 1; }


BIN_DIR=$1
if [ -z "$BIN_DIR" ]; then
    BIN_DIR=bin
fi
mkdir -p $BIN_DIR



OPENVPN_VERSION=v2.4.4-1 #standalone build version
OPENVPN_BINARY=$BIN_DIR/openvpn_osx

if [ ! -f $OPENVPN_BINARY ] || [ ! -z "$FORCE_DOWNLOAD" ]; then
    $SCRIPT_DIR/git-asset-dl.sh MysteriumNetwork standalone-openvpn $OPENVPN_VERSION openvpn_osx
    mv openvpn_osx $OPENVPN_BINARY
    chmod +x $OPENVPN_BINARY
else
    echo $OPENVPN_BINARY" exists and download not forced..."
fi
$OPENVPN_BINARY --version

MYSTERIUM_CLIENT_BINARY=$BIN_DIR/mysterium_client

if [ ! -f $MYSTERIUM_CLIENT_BINARY ] || [ ! -z "$FORCE_DOWNLOAD" ]; then
    $SCRIPT_DIR/git-branch-dl.sh MysteriumNetwork build-artifacts mysterium_osx mysterium_client_osx
    mv mysterium_client_osx $MYSTERIUM_CLIENT_BINARY
    chmod +x $MYSTERIUM_CLIENT_BINARY
else
    echo $MYSTERIUM_CLIENT_BINARY" exists and download not forced..."
fi
