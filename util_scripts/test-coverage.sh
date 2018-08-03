#!/bin/bash

# Checks whether unit tests coverage is above minimum
COVERATE_LIMIT=54

coverage_double=`TEST_COVERAGE=true yarn unit | grep "Statements" | grep -Eo " [0-9]+\.[0-9]+"`
coverage_integer=`printf %.0f $coverage_double`

if (( $coverage_integer < $COVERATE_LIMIT )); then
  echo "Tests coverage should be at least $COVERATE_LIMIT%, but it's currently $coverage_integer%"
  exit 1
fi
echo "Tests coverage passed: $coverage_integer"
