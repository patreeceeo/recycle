#!/bin/sh

os_flags() {
  if [ "$(uname)" = "Linux" ];then
    echo "--linker legacy"
  fi
}

find . -name "*.roc" | entr -r roc dev src/DevServer.roc $(os_flags)
