import React, {useState, useEffect, useRef} from "react";
import {AdwApplicationWindow, AdwHeaderBar, AdwToolbarView, AdwStatusPage} from "@gtkx/jsx/adw";
import {GtkButton} from "@gtkx/jsx/gtk";
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
import {parseXmlToJson} from "../../helper/XMLtoJSON.js";
import {HDSentinelRoot} from "../../models/hdsentinel.model.js";
import MainComponent from "../MainComponent.js";
import {RamInfo} from "../../models/ram.model.js";
import {parseDmidecodeRam} from "../../helper/parseDmidecode.js";
import SettingsDialog from "../Settings/SettingsDialog.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const proc = (globalThis as any).process;

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
    const windowWidth = 600;
    const windowHeight = 450;

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [hdSentinelDump, setHdSentinelDump] = useState<HDSentinelRoot>();
    const [ramData, setRamData] = useState<RamInfo | undefined>();
    const [openMainWindow, setOpenMainWindow] = useState<"idle" | "open" | "error">("idle");
    const [titleString, setTitleString] = useState<string>("");

    const runtimeDir = proc?.env?.XDG_RUNTIME_DIR || `/run/user/${proc.getuid ? proc.getuid() : "1000"}`;
    const ctrlFile = path.join(runtimeDir, "hdsentinel-ctrl");

    const [settingsDialogVisibility, setSettingsDialogVisibility] = useState<boolean>(false);

    const childProcRef = useRef<any>(null);

    function closeSettignsDialog() {
        setSettingsDialogVisibility(false);
    }

    const killChildProcess = () => {
        try {
            if (fs.existsSync(ctrlFile)) {
                fs.unlinkSync(ctrlFile);
                console.log("[GTKX] ctrl file removed for process termination:", ctrlFile);
            }
        } catch (e) {
            console.error("[GTKX] Failed to remove ctrl file:", e);
        }

        const isFlatpak = fs.existsSync("/.flatpak-info");
        if (isFlatpak) {
            try {
                console.log("[GTKX] Sending pkill to host via flatpak-spawn...");
                spawn("flatpak-spawn", ["--host", "pkill", "-f", "hdsentinel-wrapper.sh"]);
            } catch (e) {
                console.error("[GTKX] Failed to send pkill via flatpak-spawn:", e);
            }
        }

        if (childProcRef.current) {
            try {
                console.log("[GTKX] Terminating local child process...");
                childProcRef.current.kill("SIGTERM");
                childProcRef.current = null;
            } catch (e) {
                console.error("[GTKX] Failed to terminate local child process:", e);
            }
        }
    };

    const handleClose = () => {
        killChildProcess();

        setTimeout(() => {
            try {
                quit();
            } catch (e) {
                if (proc?.exit) proc.exit(0);
            }
        }, 150);

        return undefined;
    };

    useEffect(() => {
        const display = proc?.env?.DISPLAY || ":0";
        const xauth = proc?.env?.XAUTHORITY || "";
        const ldLibrary = proc?.env?.LD_LIBRARY_PATH || "";

        const appDir = proc?.env?.APPDIR;
        
        let bundleWrapperPath = path.resolve(dirname, "../../../exec/hdsentinel-wrapper.sh");
        let bundleHdsPath = path.resolve(dirname, "../../../exec/HDSentinel");

        if (appDir) {
            bundleWrapperPath = path.join(appDir, "usr", "bin", "exec", "hdsentinel-wrapper.sh");
            if (!fs.existsSync(bundleWrapperPath)) {
                bundleWrapperPath = path.join(appDir, "exec", "hdsentinel-wrapper.sh");
            }

            bundleHdsPath = path.join(appDir, "usr", "bin", "exec", "HDSentinel");
            if (!fs.existsSync(bundleHdsPath)) {
                bundleHdsPath = path.join(appDir, "exec", "HDSentinel");
            }
        }

        const setupFilesAndStart = async () => {
            try {
                if (!fs.existsSync(userExecDir)) {
                    fs.mkdirSync(userExecDir, {recursive: true});
                }

                // 1. Megpróbáljuk felmásolni a helyi csomagból
                if (fs.existsSync(bundleWrapperPath)) {
                    fs.copyFileSync(bundleWrapperPath, userWrapperScript);
                    fs.chmodSync(userWrapperScript, 0o755);
                    console.log("[GTKX] Wrapper script synced from bundle to:", userWrapperScript);
                } 
                // 2. Ha helyileg nem található meg (pl. Flatpak miatt), letöltjük GitHub-ról
                else if (!fs.existsSync(userWrapperScript)) {
                    console.warn("[GTKX] Wrapper not found locally. Downloading from GitHub...");
                    const rawUrl = "https://raw.githubusercontent.com/fablevi/HD_Sentinel_UI_Linux/main/exec/hdsentinel-wrapper.sh";
                    const res = await fetch(rawUrl);
                    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
                    const text = await res.text();
                    fs.writeFileSync(userWrapperScript, text, {encoding: "utf8"});
                    fs.chmodSync(userWrapperScript, 0o755);
                    console.log("[GTKX] Wrapper script downloaded from GitHub!");
                }

                // HDSentinel bináris másolása (ha elérhető a csomagban)
                if (fs.existsSync(bundleHdsPath) && !fs.existsSync(userHdsBinary)) {
                    fs.copyFileSync(bundleHdsPath, userHdsBinary);
                    fs.chmodSync(userHdsBinary, 0o755);
                }
            } catch (e) {
                console.error("[GTKX] File setup / download error:", e);
            }

            startStream();
        };

        const startStream = () => {
            if (!fs.existsSync(userWrapperScript)) {
                console.error("[GTKX ERROR] Cannot spawn: wrapper script missing from cache:", userWrapperScript);
                setOpenMainWindow("error");
                return;
            }

            const isFlatpak = fs.existsSync("/.flatpak-info");
            const scriptArgs = ["/bin/sh", userWrapperScript, userHdsBinary, runtimeDir];

            let command = "pkexec";
            let spawnArgs = scriptArgs;

            if (isFlatpak) {
                command = "flatpak-spawn";
                spawnArgs = ["--host", "--directory=/", "pkexec", ...scriptArgs];
            }

            console.log(`[GTKX] Spawning via ${command} (isFlatpak: ${isFlatpak})...`);

            const childProc = spawn(command, spawnArgs, {
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

            childProcRef.current = childProc;

            try {
                childProc.unref();
            } catch (e) {}

            let buffer = "";

            try {
                childProc.stdout.setEncoding("utf8");
            } catch (e) {}

            childProc.stdout.on("data", (chunk: Buffer | string) => {
                buffer += chunk.toString();

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
                console.warn(`[GTKX] process exited pid=${childProc?.pid} code=${code} signal=${signal}`);
                if (code !== 0) {
                    setOpenMainWindow("error");
                }
            });

            childProc.on("error", (err: any) => {
                console.error("[GTKX Process Error]:", err);
                setOpenMainWindow("error");
            });
        };

        setupFilesAndStart();

        const cleanup = () => {
            killChildProcess();
        };

        const onExit = () => cleanup();
        const onSig = (sig: any) => {
            cleanup();
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

        return () => {
            cleanup();
            try {
                proc.off("exit", onExit);
                proc.off("SIGINT", onSig);
                proc.off("SIGTERM", onSig);
            } catch (e) {}
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
                {settingsDialogVisibility && (
                    <SettingsDialog
                        visibility={settingsDialogVisibility}
                        contentWidth={windowWidth}
                        onCloseFn={closeSettignsDialog}
                    />
                )}
                <MainComponent
                    hdSentinelDump={hdSentinelDump}
                    ramData={ramData}
                    setTitleString={setTitleString}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    settingsButton={
                        <GtkButton
                            iconName="settings-configure-symbolic"
                            onClicked={() => {
                                setSettingsDialogVisibility(true);
                            }}
                        />
                    }
                />
            </AdwApplicationWindow>
        );
    }

    return (
        <AdwApplicationWindow title={"HD Sentinel"} widthRequest={windowWidth} heightRequest={windowHeight}
                              onCloseRequest={handleClose}>
            <AdwToolbarView topBar={<AdwHeaderBar end={
                <GtkButton
                    iconName="settings-configure-symbolic"
                    onClicked={() => {
                        setSettingsDialogVisibility(true);
                    }}
                />
            }/>}>
                {settingsDialogVisibility && (
                    <SettingsDialog
                        visibility={settingsDialogVisibility}
                        contentWidth={windowWidth}
                        onCloseFn={closeSettignsDialog}
                    />
                )}
                <AdwStatusPage iconName="dialog-error-symbolic" title="User not authenticated"
                               description={`Close the program and reauthenticate`}/>
            </AdwToolbarView>
        </AdwApplicationWindow>
    );
};