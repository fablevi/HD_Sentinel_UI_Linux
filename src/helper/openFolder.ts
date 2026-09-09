import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { exec } from "node:child_process";

export function openCacheFolder(subDir: string = ""): void {
    try {
        const targetDir = path.join(os.homedir(), ".cache", "hdsentinel", subDir);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        exec(`xdg-open "${targetDir}"`);
    } catch (err) {
        console.error("[GTKX] Hiba a mappa megnyitásakor:", err);
    }
}