import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export function clearCacheFolder(): boolean {
    try {
        const targetDir = path.join(os.homedir(), ".cache", "hdsentinel");

        if (fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, { recursive: true, force: true });
            console.log("[GTKX] Cache sikeresen törölve:", targetDir);
        }
        return true;
    } catch (err) {
        console.error("[GTKX] Hiba a cache törlésekor:", err);
        return false;
    }
}