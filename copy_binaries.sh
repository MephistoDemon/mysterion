#!/bin/bash

if [ ! -f .env ]; then
    printf "\e[0;31m%s\e[0m\n" "Environment file must be set!"
    exit 1
fi
source .env

mkdir -p ./bin \
    && cp ${MYSTERIUM_CLIENT_BIN} ./bin/ \
    && cp -r ${MYSTERIUM_CLIENT_CONFIG} ./bin/config
