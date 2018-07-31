#!/bin/bash

# Checks whether all source files have valid license header

DIRS='src test'
IGNORE_PATH="test/unit/coverage/"
COPYRIGHT="Copyright (C) \d\{4\} The \"MysteriumNetwork/mysterion\" Authors."

# Colorful output

SUCCESS_COLOR='\033[0;32m' # green
FAILURE_COLOR="\033[0;31m" # red
DEFAULT_COLOR="\033[0m"

print_success () {
    echo -e $SUCCESS_COLOR$1$DEFAULT_COLOR
}

print_error () {
    echo -e $FAILURE_COLOR$1$DEFAULT_COLOR
}


# Checking for license

all_files=`find $DIRS -name '*.js' -or -name '*.vue' | grep -v $IGNORE_PATH`

bad_files=""
for file in $all_files; do
    if ! grep -q "$COPYRIGHT" $file
    then
        bad_files+="- $file\n"
    fi
done

if [ ! -z "$bad_files" ]; then
    print_error "Some files are missing a valid copyright:"
    printf -- "$bad_files"
    exit 1
fi

print_success "All files have copyright headers."
