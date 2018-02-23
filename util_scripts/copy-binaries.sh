#!/bin/bash

ERROR_COLOR="\e[0;31m%s\e[0m\n"

if [ ! -f .env ]; then
    printf $ERROR_COLOR "Environment file must be set!"
    exit 1
fi
source .env

if [ -z $MYSTERIUM_CLIENT_BIN ]; then
    printf $ERROR_COLOR "MYSTERIUM_CLIENT_BIN value in .env must be set!"
    exit 1
fi

if [ -z $MYSTERIUM_CLIENT_CONFIG ]; then
    printf $ERROR_COLOR "MYSTERIUM_CLIENT_CONFIG value in .env must be set!"
    exit 1
fi

mkdir -p ./bin \
    && cp ${MYSTERIUM_CLIENT_BIN} ./bin/ \
    && cp -r ${MYSTERIUM_CLIENT_CONFIG} ./bin/
