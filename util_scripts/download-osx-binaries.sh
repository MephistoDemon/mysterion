#!/bin/bash

set -e

SCRIPT_DIR=`dirname $0`


BIN_DIR=$1
if [ -z "$BIN_DIR" ]; then
    BIN_DIR=bin
fi
mkdir -p $BIN_DIR


# openvpn

OPENVPN_VERSION=2.4.6-2 #standalone build version
OPENVPN_BINARY=$BIN_DIR/openvpn

if [ ! -f "$OPENVPN_BINARY" ] || [ ! -z "$FORCE_DOWNLOAD" ]; then
    $SCRIPT_DIR/git-asset-dl.sh MysteriumNetwork standalone-openvpn $OPENVPN_VERSION openvpn_osx64
    mv openvpn_osx64 $OPENVPN_BINARY
    chmod +x $OPENVPN_BINARY
else
    echo $OPENVPN_BINARY" exists and download not forced..."
fi

# mysterium-client

MYSTERIUM_CLIENT_BINARY=$BIN_DIR/mysterium_client

if [ ! -f "$MYSTERIUM_CLIENT_BINARY" ] || [ ! -z "$FORCE_DOWNLOAD" ]; then
    MYSTERIUM_CLIENT_PACKAGE=mysterium_client_darwin_amd64.tar.gz
    $SCRIPT_DIR/git-branch-dl.sh MysteriumNetwork build-artifacts mysterium-node $MYSTERIUM_CLIENT_PACKAGE
    tar -xf $MYSTERIUM_CLIENT_PACKAGE -C $BIN_DIR --strip 1 && rm -rf $MYSTERIUM_CLIENT_PACKAGE
    chmod +x $MYSTERIUM_CLIENT_BINARY
else
    echo $MYSTERIUM_CLIENT_BINARY" exists and download not forced..."
fi
