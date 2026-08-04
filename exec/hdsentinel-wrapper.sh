#!/bin/sh
# hdsentinel-wrapper.sh
# Arg1: path to HDSentinel binary
# Arg2: runtime dir for control file

HDS_BIN="${1:-$HOME/.cache/hdsentinel/exec/HDSentinel}"
RUNTIME_DIR="$2"
CTRL_FILE="${RUNTIME_DIR}/hdsentinel-ctrl"

mkdir -p "${RUNTIME_DIR}"
touch "${CTRL_FILE}"

trap 'rm -f "${CTRL_FILE}"; exit 0' INT TERM EXIT

# === 1. EGYSZERI MEMÓRIA DUMP (ROOT JOGGAL) ===
# Mivel a wrapper már rootként fut, a dmidecode simán futtatható sudo nélkül
if command -v dmidecode >/dev/null 2>&1; then
    echo "---RAM_DUMP_START---"
    dmidecode --type memory
    echo "---RAM_DUMP_END---"
fi

# === 2. HDSENTINEL CIKLUS ===
while [ -e "${CTRL_FILE}" ]; do
  if "${HDS_BIN}" -xml -dump; then
    :
  else
    sleep 1
  fi
  echo "---HDS_DUMP_END---"
  sleep 1
done

rm -f "${CTRL_FILE}"
exit 0