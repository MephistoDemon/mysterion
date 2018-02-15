#!/bin/bash
sudo launchctl unload /Library/LaunchDaemons/network.mysterium.mysteriumclient
sudo rm -rf /Library/LaunchDaemons/network.mysterium.mysteriumclient
sudo killall mysterium_client
