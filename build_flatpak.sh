flatpak-builder --force-clean flatpak-build-dir com.hdsentinel.app.yml
flatpak-builder --export-only --repo=repo flatpak-build-dir com.hdsentinel.app.yml
flatpak build-bundle repo com.hdsentinel.app.flatpak com.hdsentinel.app