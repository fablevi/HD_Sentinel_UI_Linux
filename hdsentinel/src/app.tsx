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
import fs from "fs";
import { parseXmlToJson } from "./helper/XMLtoJSON.js";
import { HDSentinelRoot } from "./models/hdsentinel.model.js";
import MainComponent from "./components/MainComponent.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const proc = (globalThis as any).process;

/**
 * NOTE:
 * This file expects a wrapper script to be packaged inside the AppImage (e.g. AppDir/exec/hdsentinel-wrapper.sh).
 * The wrapper runs as root (via pkexec) and creates a control file in the user's XDG_RUNTIME_DIR.
 * The GUI deletes that control file on exit; the wrapper notices and exits cleanly.
 *
 * Wrapper example (exec/hdsentinel-wrapper.sh):
 * #!/bin/sh
 * HDS_BIN="$1"
 * RUNTIME_DIR="$2"
 * CTRL_FILE="${RUNTIME_DIR}/hdsentinel-ctrl"
 * mkdir -p "${RUNTIME_DIR}"
 * touch "${CTRL_FILE}"
 * trap 'rm -f "${CTRL_FILE}"; exit 0' INT TERM EXIT
 * while [ -e "${CTRL_FILE}" ]; do
 *   if "${HDS_BIN}" -xml -dump; then :; else sleep 1; fi
 *   echo "---HDS_DUMP_END---"
 *   sleep 1
 * done
 * rm -f "${CTRL_FILE}"
 * exit 0
 */

if (proc?.argv?.includes("--run-hdsentinel-loop")) {
    // Backwards compatibility: if the AppImage itself is invoked with --run-hdsentinel-loop,
    // the bundle will run the loop directly (used in some dev flows). Keep original behavior.
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

export const App = () => {
    const windowWidth = 960;
    const windowHeight = 540;
    const [hdSentinelDump, setHdSentinelDump] = useState<HDSentinelRoot>();
    const [openMainWindow, setOpenMainWindow] = useState<"idle" | "open" | "error">("idle");

    // compute runtime dir and control file path once
    const runtimeDir = proc?.env?.XDG_RUNTIME_DIR || `/run/user/${proc.getuid ? proc.getuid() : "1000"}`;
    const ctrlFile = path.join(runtimeDir, "hdsentinel-ctrl");

    // handleClose: remove control file (wrapper will exit) then quit GUI
    const handleClose = () => {
        try {
            if (fs.existsSync(ctrlFile)) {
                fs.unlinkSync(ctrlFile);
                console.log("[GTKX] ctrl file removed by GUI:", ctrlFile);
            }
        } catch (e) {
            console.error("[GTKX] Failed to remove ctrl file:", e);
        }

        // small delay to allow wrapper to exit cleanly and flush stdout
        setTimeout(() => {
            quit();
        }, 200);

        return undefined;
    };

    useEffect(() => {
        const currentAppImage = proc?.env?.APPIMAGE;

        const display = proc?.env?.DISPLAY || ":0";
        const xauth = proc?.env?.XAUTHORITY || "";
        const ldLibrary = proc?.env?.LD_LIBRARY_PATH || "";

        // wrapper script path inside the AppImage (adjust if you place it elsewhere)
        const wrapperPath = currentAppImage
            ? path.resolve(dirname, "../exec/hdsentinel-wrapper.sh")
            : path.resolve(dirname, "../exec/hdsentinel-wrapper.sh");
        const hdsBinary = currentAppImage
            ? path.resolve(dirname, "../exec/HDSentinel")
            : path.resolve(dirname, "../exec/HDSentinel");

        let childProc: any = null;

        const startStream = () => {
            // Build command to run wrapper with HDS binary and runtime dir
            // We use sh -c so pkexec executes the wrapper script correctly
            const wrapperCmd = `${wrapperPath} "${hdsBinary}" "${runtimeDir}"`;

            const envObj = {
                ...proc.env,
                LD_LIBRARY_PATH: ldLibrary,
                DISPLAY: display,
                XAUTHORITY: xauth,
                XDG_RUNTIME_DIR: runtimeDir,
            };

            // Spawn pkexec to run the wrapper as root. We capture stdout/stderr but ignore stdin.
            childProc = spawn("pkexec", ["sh", "-c", wrapperCmd], {
                detached: true,
                stdio: ["ignore", "pipe", "pipe"],
                env: envObj,
            });

            // unref so the child doesn't keep the parent alive if possible
            try {
                childProc.unref();
            } catch (e) {
                // ignore if unref not available
            }

            try {
                console.log(`[GTKX] spawned pkexec pid=${childProc.pid} ppid=${proc.pid}`);
            } catch (e) {}

            let buffer = "";

            // ensure encoding
            try {
                childProc.stdout.setEncoding("utf8");
            } catch (e) {}

            childProc.stdout.on("data", (chunk: Buffer | string) => {
                buffer += chunk.toString();

                if (buffer.includes("---HDS_DUMP_END---")) {
                    const parts = buffer.split("---HDS_DUMP_END---");
                    const lastXml = (parts[parts.length - 2] || "").replace("---HDS_DUMP_START---", "").trim();
                    buffer = parts[parts.length - 1] || "";

                    if (lastXml) {
                        try {
                            const jsonData = parseXmlToJson(lastXml);
                            console.log(jsonData)
                            setHdSentinelDump(jsonData);
                            setOpenMainWindow("open");
                        } catch (err) {
                            console.error("[GTKX Parsing Error]:", err);
                        }
                    }
                }
            });

            childProc.stderr.on("data", (data: Buffer) => {
                console.error(`[GTKX Stderr]: ${data.toString()}`);
            });

            childProc.on("exit", (code: number, signal: string) => {
                console.warn(`[GTKX] pkexec/wrapper exited pid=${childProc?.pid} code=${code} signal=${signal}`);
                // If wrapper exited unexpectedly, show error window
                if (code !== 0) {
                    setOpenMainWindow("error");
                }
            });

            childProc.on("error", (err: any) => {
                console.error("[GTKX Process Error]:", err);
                setOpenMainWindow("error");
            });
        };

        // Start the wrapper stream
        startStream();

        // cleanup function: remove control file (wrapper will exit) and remove process-level handlers
        const cleanup = () => {
            try {
                if (fs.existsSync(ctrlFile)) {
                    fs.unlinkSync(ctrlFile);
                    console.log("[GTKX] ctrl file removed in cleanup:", ctrlFile);
                }
            } catch (e) {
                console.error("[GTKX] cleanup failed to remove ctrl file:", e);
            }
        };

        // process-level handlers to ensure cleanup on signals or uncaught exceptions
        const onExit = () => cleanup();
        const onSig = (sig: any) => {
            cleanup();
            // re-raise default behavior if possible
            try {
                proc.kill(proc.pid, sig);
            } catch (e) {}
        };

        proc.on("exit", onExit);
        proc.on("SIGINT", onSig);
        proc.on("SIGTERM", onSig);
        proc.on("uncaughtException", (err: any) => {
            console.error("[GTKX Uncaught Exception]:", err);
            cleanup();
        });

        // React cleanup: run when component unmounts
        return () => {
            cleanup();
            try {
                proc.off("exit", onExit);
                proc.off("SIGINT", onSig);
                proc.off("SIGTERM", onSig);
            } catch (e) {}
        };
    }, []); // run once

    useEffect(() => {
        if (hdSentinelDump) {
            console.log(`HDSentinel poll heartbeat...`);
        }
    }, [hdSentinelDump]);

    if (openMainWindow === "idle") {
        return null;
    }

    if (openMainWindow === "open") {
        return (
            <AdwApplicationWindow title="HD Sentinel" widthRequest={windowWidth} heightRequest={windowHeight} onCloseRequest={handleClose}>
                <MainComponent
                    hdSentinelDump={hdSentinelDump}
                />
            </AdwApplicationWindow>
        );
    }

    return (
        <AdwApplicationWindow title="Hiba" widthRequest={windowWidth} heightRequest={windowHeight} onCloseRequest={handleClose}>
            <AdwToolbarView topBar={<AdwHeaderBar />}>
                <AdwStatusPage iconName="dialog-error-symbolic" title="Hitelesítési / Futtatási hiba" />
            </AdwToolbarView>
        </AdwApplicationWindow>
    );
};

/*
<AdwToolbarView topBar={<AdwHeaderBar />}>
                    <MainComponent
                        hdSentinelDump={hdSentinelDump}
                    />
                </AdwToolbarView>
 */
