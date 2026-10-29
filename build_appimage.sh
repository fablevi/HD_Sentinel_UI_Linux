#!/bin/bash

# Exit script immediately on errors
set -e

npm run build

echo "=== 1. Cleaning and creating AppDir structure ==="
rm -rf AppDir
mkdir -p AppDir/usr/bin
mkdir -p AppDir/exec

echo "=== 2. Copying files (dist and wrapper script) ==="
# Copy the built dist folder
cp -r dist AppDir/

# Copy the hdsentinel-wrapper.sh script into the exec folder
cp -a exec/hdsentinel-wrapper.sh AppDir/exec/hdsentinel-wrapper.sh

# Grant explicit execution permissions to the wrapper script
chmod 755 AppDir/exec/hdsentinel-wrapper.sh
chmod +x AppDir/exec/hdsentinel-wrapper.sh

echo "=== 3. Creating AppRun startup script ==="
cat << 'EOF' > AppDir/AppRun
#!/bin/bash
HERE="$(dirname "$(readlink -f "${0}")")"

export PATH="/usr/bin:/usr/local/bin:${PATH}"
export LD_LIBRARY_PATH="${HERE}/usr/lib:${HERE}/usr/lib/x86_64-linux-gnu:${LD_LIBRARY_PATH}"

if [ "$EUID" -eq 0 ]; then
    export XDG_RUNTIME_DIR=/run/user/$(logname -i 2>/dev/null || id -u ${SUDO_USER:-root})
fi

# Change working directory to the root of the AppImage
cd "${HERE}"

# Forward all arguments to Node ($@)
exec node "${HERE}/dist/bundle.js" "$@"
EOF

chmod 755 AppDir/AppRun

echo "=== 4. Mandatory metadata (Desktop file and icon reference) ==="
cat << 'EOF' > AppDir/hd-sentinel.desktop
[Desktop Entry]
Type=Application
Name=HDSentinel
Exec=AppRun
Icon=hd-sentinel
Categories=Utility;System;
Comment=Hardware checking utility
Terminal=false
EOF

if [ -f "sata_default_rounded.png" ]; then
    echo "Using sata_default_rounded.png as icon."
    cp -a sata_default_rounded.png AppDir/hd-sentinel.png
elif [ -f "sata_default.png" ]; then
    echo "Using sata_default.png as icon."
    cp -a sata_default.png AppDir/hd-sentinel.png
else
    echo "ERROR: Neither icon can be found in the root directory!"
    exit 1
fi

echo "=== 5. Checking / downloading AppImage creator tool ==="
if [ ! -f "appimagetool-x86_64.AppImage" ]; then
    echo "appimagetool not found, downloading..."
    wget -q --show-progress https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
    chmod +x appimagetool-x86_64.AppImage
fi

echo "=== 6. Packaging using appimagetool ==="
export ARCH=x86_64
./appimagetool-x86_64.AppImage AppDir HDSentinelUI-x86_64.AppImage
#./appimagetool-x86_64.AppImage -u "gh-releases-zsync|GITHUB_USER|GITHUB_REPO|latest|HDSentinelUI-x86_64.AppImage.zsync" AppDir HDSentinelUI-x86_64.AppImage

echo "=== 7. Organizing files ==="
mkdir -p built_files
mv HDSentinelUI-x86_64.AppImage built_files/
mv HDSentinelUI-x86_64.AppImage.zsync built_files/

echo "=== DONE! ==="
ls -l built_files/