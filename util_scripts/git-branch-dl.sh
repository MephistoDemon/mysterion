#!/usr/bin/env bash

CWD="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

# Check dependencies.
set -e
type curl grep sed tr >&2
xargs=$(which gxargs || which xargs)

# Validate settings.
[ -f ~/.secrets ] && source ~/.secrets
[ "$GITHUB_API_TOKEN" ] || { echo "Error: Please define GITHUB_API_TOKEN variable." >&2; exit 1; }
[ $# -ne 4 ] && { echo "Usage: $0 [owner] [repo] [branch] [name]"; exit 1; }
[ "$TRACE" ] && set -x
read owner repo branch name <<<$@

# Define variables.
GH_API="https://api.github.com"
GH_REPO="$GH_API/repos/$owner/$repo"
GH_CONTENTS="$GH_REPO/contents?ref=$branch"
AUTH="Authorization: token $GITHUB_API_TOKEN"
WGET_ARGS="--content-disposition --auth-no-challenge --no-cookie"
CURL_ARGS="-LJ# --output $name"

# Validate token.
curl -o /dev/null -sH "$AUTH" $GH_REPO || { echo "Error: Invalid repo, token or network issue!";  exit 1; }

# Read branch tags.
response=$(curl -sH "$AUTH" $GH_CONTENTS)
# Get ID of the asset based on given name.
eval $(echo "$response" | grep -A 3 "name.:.\+$name" | grep -w sha | tr : = | tr -cd '[[:alnum:]]=')
#id=$(echo "$response" | jq --arg name "$name" '.assets[] | select(.name == $name).id') # If jq is installed, this can be used instead.
[ "$sha" ] || { echo "Error: Failed to get git blob, response: $response"; exit 1; }

blob_url="$GH_REPO/git/blobs/$sha"
# Download asset file.
echo "Downloading asset..." >&2
curl $CURL_ARGS \
    -H 'Accept: application/vnd.github.v3.raw' \
    -H "Authorization: token $GITHUB_API_TOKEN"  \
    "$blob_url"
echo "$0 done." >&2