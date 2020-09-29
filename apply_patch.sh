#!/usr/bin/env bash

BASEDIR="$(dirname "$(readlink -f "$0")")"
readonly BASEDIR
patch "$BASEDIR"/node_modules/@types/matter-js/index.d.ts < ./index.d.ts.patch