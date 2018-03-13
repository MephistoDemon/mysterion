#!/bin/bash
sudo launchctl unload /Library/LaunchDaemons/network.mysterium.mysteriumclient.plist
sudo rm -rf /Library/LaunchDaemons/network.mysterium.mysteriumclient.plist
sudo killall mysterium_client
