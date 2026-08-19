import { defineConfig } from "@gtkx/config";

export default defineConfig({
    libraries: ["Gtk-4.0", "Adw-1"],
    applicationId: "com.hdsentinel.app",
    deploy: {
        summary: "HD Sentinel monitorozó alkalmazás",
        categories: ["System", "Utility"],
        flatpak: {
            finishArgs: [
                "--filesystem=host",
            ]
        }
    },
    server: {
        watch: {
        ignored: [
            '**/flatpak-build-dir/**',
            '**/.flatpak-builder/**',
            '**/repo/**',
            '**/*.flatpak',
        ],
        },
  },
} as any);