#!/bin/sh
# hdsentinel-wrapper.sh
# Arg1: path to HDSentinel binary
# Arg2: runtime dir for control file

HDS_BIN="$1"
RUNTIME_DIR="$2"
CTRL_FILE="${RUNTIME_DIR}/hdsentinel-ctrl"

mkdir -p "${RUNTIME_DIR}"
touch "${CTRL_FILE}"

trap 'rm -f "${CTRL_FILE}"; exit 0' INT TERM EXIT

while [ -e "${CTRL_FILE}" ]; do
  if "${HDS_BIN}" -xml -dump; then
    :
  else
    sleep 1
  fi
  echo "---HDS_DUMP_END---"
  sleep 10
done

rm -f "${CTRL_FILE}"
exit 0
