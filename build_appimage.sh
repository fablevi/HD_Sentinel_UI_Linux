#!/bin/bash

# Hibák esetén azonnal álljon le a szkript
set -e

npm run build

echo "=== 1. AppDir struktúra takarítása és létrehozása ==="
rm -rf AppDir
mkdir -p AppDir/usr/bin
mkdir -p AppDir/exec

echo "=== 2. Fájlok átmásolása (dist és wrapper script) ==="
# Bemásoljuk a buildelt dist mappát
cp -r dist AppDir/

# Bemásoljuk a hdsentinel-wrapper.sh szkriptet az exec mappába
cp -a exec/hdsentinel-wrapper.sh AppDir/exec/hdsentinel-wrapper.sh

# Kifejezett futtatási jog megadása a wrapper scriptre
chmod 755 AppDir/exec/hdsentinel-wrapper.sh
chmod +x AppDir/exec/hdsentinel-wrapper.sh

echo "=== 3. AppRun indítószkript létrehozása ==="
cat << 'EOF' > AppDir/AppRun
#!/bin/bash
HERE="$(dirname "$(readlink -f "${0}")")"

export PATH="/usr/bin:/usr/local/bin:${PATH}"
export LD_LIBRARY_PATH="${HERE}/usr/lib:${HERE}/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH}"

if [ "$EUID" -eq 0 ]; then
    export XDG_RUNTIME_DIR=/run/user/$(logname -i 2>/dev/null || id -u ${SUDO_USER:-root})
fi

# Munkakönyvtár átállítása az AppImage gyökerére
cd "${HERE}"

# Továbbítjuk az összes argumentumot a Node felé ($@)
exec node "${HERE}/dist/bundle.js" "$@"
EOF

chmod 755 AppDir/AppRun

echo "=== 4. Kötelező metaadatok (Desktop fájl és ikon hivatkozás) ==="
cat << 'EOF' > AppDir/hd-sentinel.desktop
[Desktop Entry]
Type=Application
Name=HDSentinelUI
Exec=AppRun
Icon=hd-sentinel
Categories=Utility;System;
Comment=Hard Disk Sentinel UI with React & GTK4
Terminal=false
EOF

if [ -f "sata_default_rounded.png" ]; then
    echo "Ikonként a sata_default_rounded.png használva."
    cp -a sata_default_rounded.png AppDir/hd-sentinel.png
elif [ -f "sata_default.png" ]; then
    echo "Ikonként a sata_default.png használva."
    cp -a sata_default.png AppDir/hd-sentinel.png
else
    echo "HIBA: Egyik ikon sem található a gyökérkönyvtárban!"
    exit 1
fi

echo "=== 5. AppImage készítő eszköz ellenőrzése / letöltése ==="
if [ ! -f "appimagetool-x86_64.AppImage" ]; then
    echo "appimagetool nem található, letöltés..."
    wget -q --show-progress https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
    chmod +x appimagetool-x86_64.AppImage
fi

echo "=== 6. Csomagolás az appimagetool segítségével ==="
export ARCH=x86_64
./appimagetool-x86_64.AppImage AppDir HDSentinelUI-x86_64.AppImage

echo "=== 7. Fájlok rendszerezése ==="
mkdir -p built_files
mv HDSentinelUI-x86_64.AppImage built_files/

echo "=== KÉSZ! ==="
ls -l built_files/