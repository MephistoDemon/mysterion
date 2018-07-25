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
OPENVPN_BINARY=$BIN_DIR/openvpn.exe

if [ ! -f "$OPENVPN_BINARY" ] || [ ! -z "$FORCE_DOWNLOAD" ]; then
    $SCRIPT_DIR/git-asset-dl.sh MysteriumNetwork standalone-openvpn $OPENVPN_VERSION openvpn_win64.exe
    mv openvpn_win64.exe $OPENVPN_BINARY
else
    echo $OPENVPN_BINARY" exists and download not forced..."
fi

# mysterium-client

MYSTERIUM_CLIENT_BINARY=$BIN_DIR/mysterium_client.exe

if [ ! -f "$MYSTERIUM_CLIENT_BINARY" ] || [ ! -z "$FORCE_DOWNLOAD" ]; then
    MYSTERIUM_CLIENT_PACKAGE=mysterium_client_windows_amd64.zip
    $SCRIPT_DIR/git-branch-dl.sh MysteriumNetwork build-artifacts mysterium-node $MYSTERIUM_CLIENT_PACKAGE
    unzip -od "bin" $MYSTERIUM_CLIENT_PACKAGE && rm $MYSTERIUM_CLIENT_PACKAGE
    # TODO: remove after MYST-648 is fixed
    mv $BIN_DIR/mysterium_client $MYSTERIUM_CLIENT_BINARY
else
    echo $MYSTERIUM_CLIENT_BINARY" exists and download not forced..."
fi

# tap-windows

TAP_WINDOWS_BINARY=$BIN_DIR/tap-windows.exe

if [ ! -f "$TAP_WINDOWS_BINARY" ] || [ ! -z "$FORCE_DOWNLOAD" ]; then
    wget https://swupdate.openvpn.org/community/releases/tap-windows-9.21.2.exe
    mv tap-windows-9.21.2.exe $TAP_WINDOWS_BINARY
else
    echo $TAP_WINDOWS_BINARY" exists and download not forced..."
fi


# service manager

SERVICE_MANAGER_BINARY=$BIN_DIR/servicemanager.exe

if [ ! -f "$SERVICE_MANAGER_BINARY" ] || [ ! -z "$FORCE_DOWNLOAD" ]; then
    util_scripts/git-branch-dl.sh MysteriumNetwork build-artifacts service-manager servicemanager.exe
    mv servicemanager.exe $SERVICE_MANAGER_BINARY
else
    echo $SERVICE_MANAGER_BINARY" exists and download not forced..."
fi
