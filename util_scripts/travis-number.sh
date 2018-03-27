#!/usr/bin/env bash

cat >./travis-build-number.json <<EOF
{
  "buildNumber": "$TRAVIS_JOB_NUMBER"
}
EOF
