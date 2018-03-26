#!/usr/bin/env bash

cat >./travis-build-number.json <<EOF
{
  "travisBuildNumber": "$TRAVIS_JOB_NUMBER"
}
EOF