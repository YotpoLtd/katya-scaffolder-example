#!/bin/bash
is_there_fdescribe=$(grep -r fdescribe ./tests)
if [[ -z "$is_there_fdescribe" ]]; then
  echo 'GOOD - there is no fdescribe in tests'
else
  echo 'BAD - there is fdescribe in tests: ' $is_there_fdescribe
  exit 1
fi

is_there_fit=$(grep -r "fit(" ./tests)
if [[ -z "$is_there_fit" ]]; then
  echo 'GOOD - there is no fit() in tests'
else
  echo 'BAD - there is fit() in tests: ' $is_there_fit
  exit 1
fi
