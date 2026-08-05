import React, {useState, useEffect, useRef} from "react";
import {AdwApplicationWindow, AdwHeaderBar, AdwToolbarView, AdwStatusPage} from "@gtkx/jsx/adw";
import {quit} from "@gtkx/react";

// @ts-ignore
import {spawn} from "child_process";
// @ts-ignore
import path from "path";
// @ts-ignore
import {fileURLToPath} from "url";
import * as console from "node:console";
import fs from "fs";
import os from "os";
import {parseXmlToJson} from "./helper/XMLtoJSON.js";
import {HDSentinelRoot} from "./models/hdsentinel.model.js";
import MainComponent from "./components/MainComponent.js";
import {RamInfo} from "./models/ram.model.js";
import {parseDmidecodeRam} from "./helper/parseDmidecode.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const proc = (globalThis as any).process;

// Felhasználó cache mappái
const userExecDir = path.join(os.homedir(), ".cache", "hdsentinel", "exec");
const userHdsBinary = path.join(userExecDir, "HDSentinel");
const userWrapperScript = path.join(userExecDir, "hdsentinel-wrapper.sh");

if (proc?.argv?.includes("--run-hdsentinel-loop")) {
    const runLoop = async () => {
        while (true) {
            try {
                const {execFileSync} = await import("child_process");
                const output = execFileSync(userHdsBinary, ["-xml", "-dump"], {encoding: "utf-8"});
                proc.stdout.write("---HDS_DUMP_START---\n" + output + "\n---HDS_DUMP_END---\n");
            } catch (e: any) {
                proc.stderr.write(e.message || "Hiba");
            }
            await new Promise((res) => setTimeout(res, 1000));
        }
    };
    runLoop();
}

export const Runner = () => {
    const windowWidth = 400; //960;
    const windowHeight = 300; //540;

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);


    const [hdSentinelDump, setHdSentinelDump] = useState<HDSentinelRoot>();
    const [ramData, setRamData] = useState<RamInfo | undefined>();
    const [openMainWindow, setOpenMainWindow] = useState<"idle" | "open" | "error">("idle");
    const [titleString, setTitleString] = useState<string>("");

    const runtimeDir = proc?.env?.XDG_RUNTIME_DIR || `/run/user/${proc.getuid ? proc.getuid() : "1000"}`;
    const ctrlFile = path.join(runtimeDir, "hdsentinel-ctrl");

    const handleClose = () => {
        try {
            if (fs.existsSync(ctrlFile)) {
                fs.unlinkSync(ctrlFile);
                console.log("[GTKX] ctrl file rsetRamDataemoved by GUI:", ctrlFile);
            }
        } catch (e) {
            console.error("[GTKX] Failed to remove ctrl file:", e);
        }

        setTimeout(() => {
            quit();
        }, 200);

        return undefined;
    };

    useEffect(() => {
        const display = proc?.env?.DISPLAY || ":0";
        const xauth = proc?.env?.XAUTHORITY || "";
        const ldLibrary = proc?.env?.LD_LIBRARY_PATH || "";

        // AppImage-en belüli wrapper útvonala
        const bundleWrapperPath = path.resolve(dirname, "../exec/hdsentinel-wrapper.sh");

        // Gondoskodunk róla, hogy a wrapper kimásolódjon a ~/.cache/hdsentinel/exec/ mappába
        try {
            if (!fs.existsSync(userExecDir)) {
                fs.mkdirSync(userExecDir, {recursive: true});
            }
            if (fs.existsSync(bundleWrapperPath)) {
                fs.copyFileSync(bundleWrapperPath, userWrapperScript);
                fs.chmodSync(userWrapperScript, 0o755);
            }
        } catch (e) {
            console.error("[GTKX] Failed to sync wrapper script to user cache:", e);
        }

        let childProc: any = null;

        const startStream = () => {
            // A pkexec közvetlenül a felhasználó cache mappájában lévő wrapper scriptet futtatja!
            childProc = spawn("pkexec", ["/bin/sh", userWrapperScript, userHdsBinary, runtimeDir], {
                detached: true,
                stdio: ["ignore", "pipe", "pipe"],
                env: {
                    ...proc.env,
                    LD_LIBRARY_PATH: ldLibrary,
                    DISPLAY: display,
                    XAUTHORITY: xauth,
                    XDG_RUNTIME_DIR: runtimeDir,
                },
            });

            try {
                childProc.unref();
            } catch (e) {
            }

            try {
                console.log(`[GTKX] spawned pkexec pid=${childProc.pid} ppid=${proc.pid}`);
            } catch (e) {
            }

            let buffer = "";

            try {
                childProc.stdout.setEncoding("utf8");
            } catch (e) {
            }

            childProc.stdout.on("data", (chunk: Buffer | string) => {
                buffer += chunk.toString();

                // 1. RAM DMI-decode elcsípése (A wrapper indításakor egyszer fut le)
                if (buffer.includes("---RAM_DUMP_END---")) {
                    const parts = buffer.split("---RAM_DUMP_END---");
                    const ramBlock = (parts[0] || "").replace("---RAM_DUMP_START---", "").trim();
                    buffer = parts[1] || "";

                    if (ramBlock) {
                        console.log("[GTKX] RAM DMI Data received");
                        const parsedRamData = parseDmidecodeRam(ramBlock);
                        setRamData(parsedRamData);
                    }
                }

                // 2. HDSentinel XML dump elcsípése (Folyamatos ciklus)
                if (buffer.includes("---HDS_DUMP_END---")) {
                    const parts = buffer.split("---HDS_DUMP_END---");
                    const lastXml = (parts[parts.length - 2] || "").replace("---HDS_DUMP_START---", "").trim();
                    buffer = parts[parts.length - 1] || "";

                    if (lastXml) {
                        try {
                            const jsonData = parseXmlToJson(lastXml);
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
                if (code !== 0) {
                    setOpenMainWindow("error");
                }
            });

            childProc.on("error", (err: any) => {
                console.error("[GTKX Process Error]:", err);
                setOpenMainWindow("error");
            });
        };

        startStream();

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

        const onExit = () => cleanup();
        const onSig = (sig: any) => {
            cleanup();
            try {
                proc.kill(proc.pid, sig);
            } catch (e) {
            }
        };

        proc.on("exit", onExit);
        proc.on("SIGINT", onSig);
        proc.on("SIGTERM", onSig);
        proc.on("uncaughtException", (err: any) => {
            console.error("[GTKX Uncaught Exception]:", err);
            cleanup();
        });

        return () => {
            cleanup();
            try {
                proc.off("exit", onExit);
                proc.off("SIGINT", onSig);
                proc.off("SIGTERM", onSig);
            } catch (e) {
            }
        };
    }, []);

    if (openMainWindow === "idle") {
        return null;
    }

    if (openMainWindow === "open") {
        return (
            <AdwApplicationWindow title={titleString || "HD Sentinel"} widthRequest={windowWidth}
                                  heightRequest={windowHeight} onCloseRequest={handleClose}
            >
                <MainComponent
                    hdSentinelDump={hdSentinelDump}
                    ramData={ramData}
                    setTitleString={setTitleString}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </AdwApplicationWindow>
        );
    }

    return (
        <AdwApplicationWindow title={"HD Sentinel"} widthRequest={windowWidth} heightRequest={windowHeight}
                              onCloseRequest={handleClose}>
            <AdwToolbarView topBar={<AdwHeaderBar/>}>
                <AdwStatusPage iconName="dialog-error-symbolic" title="User not authenticated"
                               description={`Close the program and reauthenticate`}/>
            </AdwToolbarView>
        </AdwApplicationWindow>
    );
};