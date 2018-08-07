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
