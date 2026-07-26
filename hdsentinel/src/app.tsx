import { useState, useEffect } from "react";
import { AdwApplicationWindow, AdwHeaderBar, AdwToolbarView, AdwStatusPage } from "@gtkx/jsx/adw";
import { quit } from "@gtkx/react";

// @ts-ignore
import { spawn } from "child_process";
// @ts-ignore
import path from "path";
// @ts-ignore
import { fileURLToPath } from "url";
import * as console from "node:console";
import { parseXmlToJson } from "./helper/XMLtoJSON.js";
import { HDSentinelRoot } from "./models/hdsentinel.model.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const proc = (globalThis as any).process;

// --- 1. CLI ÁG (AppImage / Loop) ---
if (proc?.argv?.includes("--run-hdsentinel-loop")) {
    const appDir = proc.env.APPDIR;
    const binaryPath = appDir
        ? path.join(appDir, "exec/HDSentinel")
        : path.resolve(dirname, "../exec/HDSentinel");

    const runLoop = async () => {
        while (true) {
            try {
                const { execFileSync } = await import("child_process");
                const output = execFileSync(binaryPath, ["-xml", "-dump"], { encoding: "utf-8" });
                proc.stdout.write("---HDS_DUMP_START---\n" + output + "\n---HDS_DUMP_END---\n");
            } catch (e: any) {
                proc.stderr.write(e.message || "Hiba");
            }
            await new Promise((res) => setTimeout(res, 1000));
        }
    };
    runLoop();
}

// --- 2. REACT APPLIKÁCIÓ ---
export const App = () => {
    const [hdSentinelDump, setHdSentinelDump] = useState<HDSentinelRoot>();
    const [openMainWindow, setOpenMainWindow] = useState<"idle" | "open" | "error">("idle");

    useEffect(() => {
        const currentAppImage = proc?.env?.APPIMAGE;

        const display = proc?.env?.DISPLAY || ":0";
        const xauth = proc?.env?.XAUTHORITY || "";
        const runtimeDir = proc?.env?.XDG_RUNTIME_DIR || "";
        const ldLibrary = proc?.env?.LD_LIBRARY_PATH || "";
        const envPass = `env LD_LIBRARY_PATH="${ldLibrary}" DISPLAY="${display}" XAUTHORITY="${xauth}" XDG_RUNTIME_DIR="${runtimeDir}"`;

        let childProc: any = null;

        const startStream = () => {
            const args = currentAppImage
                ? ["sh", "-c", `${envPass} "${currentAppImage}" --run-hdsentinel-loop`]
                : ["sh", "-c", `${envPass} sh -c 'while true; do "${path.resolve(dirname, "../exec/HDSentinel")}" -xml -dump; echo "---HDS_DUMP_END---"; sleep 1; done'`];

            // `detached: true` -> Saját Process Group-ot kap, így a teljes fát le tudjuk lőni!
            childProc = spawn("pkexec", args, { detached: true });

            console.log("[GTKX] pkexec elindítva, jelszóra vár...");

            let buffer = "";

            childProc.stdout.on("data", (chunk: Buffer) => {
                buffer += chunk.toString("utf-8");

                if (buffer.includes("---HDS_DUMP_END---")) {
                    const parts = buffer.split("---HDS_DUMP_END---");
                    const lastXml = parts[parts.length - 2].replace("---HDS_DUMP_START---", "").trim();
                    buffer = parts[parts.length - 1];

                    if (lastXml) {
                        try {
                            const jsonData = parseXmlToJson(lastXml);
                            setHdSentinelDump(jsonData);
                            setOpenMainWindow("open");
                        } catch (err) {
                            console.error("[GTKX Parsing Hiba]:", err);
                        }
                    }
                }
            });

            childProc.stderr.on("data", (data: Buffer) => {
                console.error(`[GTKX Stderr]: ${data.toString()}`);
            });

            // Ha a felhasználó Mégse/Cancel-t nyom vagy nem írja be a jelszót
            childProc.on("exit", (code: number) => {
                if (code !== 0) {
                    console.warn(`[GTKX] pkexec kilépett vagy megszakítva (kód: ${code})`);
                    setOpenMainWindow("error");
                }
            });

            childProc.on("error", (err: any) => {
                console.error("[GTKX Process Hiba]:", err);
                setOpenMainWindow("error");
            });
        };

        startStream();

        // Tiszta leállítás / Unmount
        return () => {
            if (childProc && childProc.pid) {
                try {
                    // A negatív PID (-childProc.pid) a teljes Process Group-ot megöli (pkexec + sh + hdsentinel)!
                    proc.kill(-childProc.pid, "SIGKILL");
                } catch (e) {
                    // Már leállt folyamat esetén
                }
            }
        };
    }, []);

    useEffect(() => {
        if (hdSentinelDump) {
            const diskName = hdSentinelDump?.Hard_Disk_Sentinel?.Physical_Disk_Information_Disk?.[0]?.Hard_Disk_Summary?.Hard_Disk_Device;
            const temp = hdSentinelDump?.Hard_Disk_Sentinel?.Physical_Disk_Information_Disk?.[0]?.Hard_Disk_Summary?.Current_Temperature;
            console.log(`[GTKX Poll Stream] Disk: ${diskName} | Temp: ${temp} °C`);
        }
    }, [hdSentinelDump]);

    if (openMainWindow === "idle") {
        return null;
    }

    if (openMainWindow === "open") {
        return (
            <AdwApplicationWindow title="HD Sentinel" widthRequest={360} heightRequest={294} onCloseRequest={quit}>
                <AdwToolbarView topBar={<AdwHeaderBar />}>
                    <AdwStatusPage iconName="object-select-symbolic" title="Sikeres betöltés" />
                </AdwToolbarView>
            </AdwApplicationWindow>
        );
    }

    return (
        <AdwApplicationWindow title="Hiba" widthRequest={360} heightRequest={294} onCloseRequest={quit}>
            <AdwToolbarView topBar={<AdwHeaderBar />}>
                <AdwStatusPage iconName="dialog-error-symbolic" title="Hitelesítési / Futtatási hiba" />
            </AdwToolbarView>
        </AdwApplicationWindow>
    );
};

export default App;