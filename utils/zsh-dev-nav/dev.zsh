# goto - project navigation powered by devnav
DEVNAV_BIN="${DEVNAV_BIN:-$(command -v devnav)}"

if [[ -z "$DEVNAV_BIN" ]]; then
  _goto_warn="devnav CLI not found. Install it and rerun this script."
else
  _goto_eval="$("$DEVNAV_BIN" complete --shell=zsh 2>/dev/null)"
fi

goto() {
  if [[ $# -eq 0 ]]; then
    echo "Usage: goto <namespace>/<project>" >&2
    return 1
  fi

  if [[ -z "$DEVNAV_BIN" ]]; then
    echo "devnav CLI is not installed." >&2
    return 1
  fi

  local path
  path="$("$DEVNAV_BIN" resolve "$1")" || return 1
  cd "$path"
}

if [[ -n "$_goto_eval" ]]; then
  eval "$_goto_eval"
fi
