#!/usr/bin/env bash

cat >./build-number.json <<EOF
{
  "buildNumber": "$TRAVIS_JOB_NUMBER"
}
EOF
