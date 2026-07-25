import { useState, useEffect } from "react";
import { AdwApplicationWindow, AdwHeaderBar, AdwToolbarView, AdwStatusPage } from "@gtkx/jsx/adw";
import { quit } from "@gtkx/react";

// @ts-ignore
import { exec as execCb, execFileSync } from "child_process";
// @ts-ignore
import { promisify } from "util";
// @ts-ignore
import path from "path";
// @ts-ignore
import { fileURLToPath } from "url";

const exec = promisify(execCb);

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const proc = (globalThis as any).process;

if (proc?.argv?.includes("--run-hdsentinel")) {
    try {
        const appDir = proc.env.APPDIR;
        const binaryPath = appDir
            ? path.join(appDir, "exec/HDSentinel")
            : path.resolve(dirname, "../exec/HDSentinel");

        const output = execFileSync(binaryPath, ["-xml", "-dump"], { encoding: "utf-8" });
        proc.stdout.write(output);
        proc.exit(0);
    } catch (e: any) {
        proc.stderr.write(e.message || "Hiba a futtatás során");
        proc.exit(1);
    }
}

export const App = () => {
    const [returnedString, setReturnedString] = useState<string>("Betöltés...");
    const [openMainWindow, setOpenMainWindow] = useState<"idle" | "open" | "error">("idle");

    async function callTerminalCommand() {
        const currentAppImage = proc?.env?.APPIMAGE;

        let command: string;
        const display = proc?.env?.DISPLAY || ":0";
        const xauth = proc?.env?.XAUTHORITY || "";
        const runtimeDir = proc?.env?.XDG_RUNTIME_DIR || "";
        const ldLibrary = proc?.env?.LD_LIBRARY_PATH || "";
        const envPass = `env LD_LIBRARY_PATH="${ldLibrary}" DISPLAY="${display}" XAUTHORITY="${xauth}" XDG_RUNTIME_DIR="${runtimeDir}"`;

        if (currentAppImage) {
            command = `pkexec ${envPass} "${currentAppImage}" --run-hdsentinel`;
        } else {
            const binaryPath = path.resolve(dirname, "../exec/HDSentinel");
            command = `pkexec ${envPass} "${binaryPath}" -xml -dump`;
        }

        console.log(`[GTKX] Futtatott parancs: ${command}`);

        const { stdout, stderr } = await exec(command);

        if (stderr && !stdout) {
            throw new Error(stderr.trim());
        }

        return stdout;
    }

    useEffect(() => {
       callTerminalCommand()
            .then((stdout) => {
                setReturnedString(stdout.trim() || "Sikeres futás (nincs kimenet)");
                setOpenMainWindow("open");
            })
            .catch((err) => {
                console.error("[GTKX Hiba caught]:", err);
                setReturnedString(`Hiba: ${err.message || err}`);
                setOpenMainWindow("error");
            });
    }, []);

    if (openMainWindow === "idle") {
        return null;
    }

    if (openMainWindow === "open") {
        return (
            <AdwApplicationWindow title="HD Sentinel" widthRequest={360} heightRequest={294} onCloseRequest={quit}>
                <AdwToolbarView topBar={<AdwHeaderBar />}>
                    <AdwStatusPage iconName="object-select-symbolic" title="Sikeres betöltés" description={returnedString} />
                </AdwToolbarView>
            </AdwApplicationWindow>
        );
    }

    return (
        <AdwApplicationWindow title="Hiba" widthRequest={360} heightRequest={294} onCloseRequest={quit}>
            <AdwToolbarView topBar={<AdwHeaderBar />}>
                <AdwStatusPage iconName="dialog-error-symbolic" title="Hitelesítési / Futtatási hiba" description={returnedString} />
            </AdwToolbarView>
        </AdwApplicationWindow>
    );
};

export default App;