#!/bin/sh
# hdsentinel-wrapper.sh
# Arg1: path to HDSentinel binary
# Arg2: runtime dir for control file

HDS_BIN="${1:-$HOME/.cache/hdsentinel/exec/HDSentinel}"
RUNTIME_DIR="$2"
CTRL_FILE="${RUNTIME_DIR}/hdsentinel-ctrl"

mkdir -p "${RUNTIME_DIR}"
touch "${CTRL_FILE}"

cleanup() {
    rm -f "${CTRL_FILE}"
    exit 0
}

trap 'cleanup' INT TERM EXIT HUP

# === 1. EGYSZERI MEMÓRIA DUMP ===
if command -v dmidecode >/dev/null 2>&1; then
    echo "---RAM_DUMP_START---"
    dmidecode --type memory 2>/dev/null
    echo "---RAM_DUMP_END---"
fi

# === 2. HDSENTINEL CIKLUS ===
while [ -f "${CTRL_FILE}" ]; do
    if [ -x "${HDS_BIN}" ]; then
        OUTPUT=$("${HDS_BIN}" -xml -dump 2>/dev/null)
        echo "---HDS_DUMP_START---"
        echo "${OUTPUT}"
        echo "---HDS_DUMP_END---"
    fi

    # 1 másodperces várakozás 0.1 másodperces szeletekre bontva,
    # hogy a fájl törlésére azonnal (100ms-on belül) reagáljon és kilépjen
    i=0
    while [ $i -lt 10 ]; do
        if [ ! -f "${CTRL_FILE}" ]; then
            cleanup
        fi
        sleep 0.1
        i=$((i + 1))
    done
done

cleanup