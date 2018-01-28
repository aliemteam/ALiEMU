#!/usr/bin/env bash

type -t codemod >/dev/null || {
    echo "codemod command not installed on system"; exit 1;
}

codemod -m -d ./wp-content --extensions php \
    "create_function\(\s*'(.*?)', '(.+?)'\s*\)" \
    "function (\1) { \2 }"

