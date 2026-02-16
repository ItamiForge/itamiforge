#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_LINE="source \"$SCRIPT_DIR/dev.zsh\""
ZSHRC="$HOME/.zshrc"

if grep -qF "$SOURCE_LINE" "$ZSHRC" 2>/dev/null; then
  echo "Already installed"
  exit 0
fi

printf "\n# dev\n%s\n" "$SOURCE_LINE" >> "$ZSHRC"

echo "Installed. Run: source ~/.zshrc"
