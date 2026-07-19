#!/bin/bash

npm run build

# Hibák esetén azonnal álljon le a szkript
set -e

echo "=== 1. AppDir struktúra takarítása és létrehozása ==="
rm -rf AppDir
mkdir -p AppDir/usr/bin
mkdir -p AppDir/exec

echo "=== 2. Fájlok átmásolása (dist és exec jogosultság-megőrzéssel) ==="
# Bemásoljuk a buildelt dist mappát
cp -r dist AppDir/

# A -a (archive) kapcsoló gondoskodik róla, hogy a fájlrendszer attribútumok és jogok megmaradjanak
cp -a exec/HDSentinel AppDir/exec/HDSentinel

# Biztonsági kényszerítés: az AppDir-en belül a binárisnak legyen futtatási joga
chmod 755 AppDir/exec/HDSentinel
chmod +x AppDir/exec/HDSentinel

echo "=== 3. AppRun indítószkript létrehozása ==="
cat << 'EOF' > AppDir/AppRun
#!/bin/bash
HERE="$(dirname "$(readlink -f "${0}")")"

export PATH="/usr/bin:/usr/local/bin:${PATH}"
export LD_LIBRARY_PATH="${HERE}/usr/lib:${HERE}/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH}"
export NODE_ENV=production
export GTK_THEME=Adwaita:dark

if [ "$EUID" -eq 0 ]; then
    export XDG_RUNTIME_DIR=/run/user/$(logname -i 2>/dev/null || id -u ${SUDO_USER:-root})
fi

# Továbbítjuk az összes argumentumot a Node felé ($@) - Ez kell a --run-hdsentinel kapcsolónak!
exec node "${HERE}/dist/bundle.js" "$@"
EOF

chmod 755 AppDir/AppRun

echo "=== 4. Kötelező metaadatok (Desktop fájl és ikon) létrehozása ==="
cat << 'EOF' > AppDir/hd-sentinel.desktop
[Desktop Entry]
Type=Application
Name=HD Sentinel UI
Exec=AppRun
Icon=hd-sentinel
Categories=Utility;System;
Comment=Hard Disk Sentinel UI with React & GTK4
Terminal=false
EOF

touch AppDir/hd-sentinel.png

echo "=== 5. AppImage készítő eszköz ellenőrzése / letöltése ==="
if [ ! -f "appimagetool-x86_64.AppImage" ]; then
    echo "appimagetool nem található, letöltés..."
    wget -q --show-progress https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
    chmod +x appimagetool-x86_64.AppImage
fi

echo "=== 6. Csomagolás az appimagetool segítségével ==="
# Kényszerítjük az ARCH-ot
export ARCH=x86_64
./appimagetool-x86_64.AppImage AppDir

echo "=== 7. Fájlok rendszerezése ==="
mkdir -p built_files
mv HD_Sentinel_UI-x86_64.AppImage built_files/

echo "=== KÉSZ! ==="
ls -l built_files/