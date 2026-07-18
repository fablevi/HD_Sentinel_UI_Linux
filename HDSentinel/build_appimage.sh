#!/bin/bash

# Hibák esetén azonnal álljon le a szkript
set -e

echo "=== 1. AppDir struktúra takarítása és létrehozása ==="
rm -rf AppDir
mkdir -p AppDir/usr/bin

echo "=== 2. Fájlok átmásolása (dist és node bináris) ==="
# Bemásoljuk a buildelt dist mappádat (bundle.js, gtkx.node)
cp -r dist AppDir/

# Bemásoljuk a Fedorádon lévő, működő node binárist
cp $(which node) AppDir/usr/bin/

echo "=== 3. AppRun indítószkript létrehozása ==="
cat << 'EOF' > AppDir/AppRun
#!/bin/bash
HERE="$(dirname "$(readlink -f "${0}")")"
export PATH="${HERE}/usr/bin:${PATH}"
export LD_LIBRARY_PATH="${HERE}/usr/lib:${HERE}/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH}"
export NODE_ENV=production
export GTK_THEME=Adwaita:dark

# Wayland/X11 kijelző és jogosultság átmentése, ha emelt (root) joggal futna
if [ "$EUID" -eq 0 ]; then
    export XDG_RUNTIME_DIR=/run/user/$(logname -i 2>/dev/null || id -u ${SUDO_USER:-root})
fi

# Elindítjuk a becsomagolt node-ot a bundle.js-sel
exec "${HERE}/usr/bin/node" "${HERE}/dist/bundle.js" "$@"
EOF

# Futtathatóvá tesszük az indítót
chmod +x AppDir/AppRun

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

# Üres placeholder ikon, hogy az appimagetool ne dobjon hibát
touch AppDir/hd-sentinel.png

echo "=== 5. AppImage készítő eszköz ellenőrzése / letöltése ==="
if [ ! -f "appimagetool-x86_64.AppImage" ]; then
    echo "appimagetool nem található, letöltés..."
    wget -q --show-progress https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage
    chmod +x appimagetool-x86_64.AppImage
fi

echo "=== 6. Csomagolás az appimagetool segítségével ==="
ARCH=x86_64 ./appimagetool-x86_64.AppImage AppDir

echo "=== 7. Fájlok rendszerezése ==="
# Létrehozzuk a kért célmappát
mkdir -p built_files

# Csak és kizárólag a legenerált HDSentinel AppImage-et mozgatjuk át
mv HD_Sentinel_UI-x86_64.AppImage built_files/

echo "=== KÉSZ! Az eszköz a helyén maradt, az appod pedig átkerült a helyére: ==="
ls -l built_files/