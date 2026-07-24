import { useState, useEffect } from "react";
import { AdwApplicationWindow, AdwHeaderBar, quit, AdwToolbarView, AdwStatusPage } from "@gtkx/react";// @ts-ignore
import { exec, execFileSync } from "child_process";
// @ts-ignore
import path from "path";
// @ts-ignore
import { fileURLToPath } from "url";
import { ToolbarStyle } from "@gtkx/ffi/adw";

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
    const [returnedString, setReturnedString] = useState<String>("Betöltés...");

    function _callTerminalCommand() {
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
            // Dev környezetben is átadjuk a -xml -dump opciókat
            command = `pkexec ${envPass} "${binaryPath}" -xml -dump`;
        }

        setReturnedString("Hitelesítés szükséges...");
        console.log(`[GTKX] Futtatott parancs: ${command}`);

        exec(command, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.error(`[GTKX Hiba]: ${error.message}`);
                setReturnedString(`Hiba: ${error.message}`);
                return;
            }
            if (stderr) {
                console.warn(`[GTKX Stderr]: ${stderr}`);
                if (!stdout) {
                    setReturnedString(`Hiba: ${stderr.trim()}`);
                    return;
                }
            }

            console.log(`[GTKX Kimenet]: ${stdout}`);
            setReturnedString(stdout.trim() || "Sikeres futás (nincs kimenet)");
        });
    }

    useEffect(() => {
        //callTerminalCommand();
    }, []);

    return (
        <AdwApplicationWindow
            title="Tasks"
            widthRequest={360}
            heightRequest={294}
            onClose={() => quit()}
        >
            <AdwHeaderBar></AdwHeaderBar>
           

        </AdwApplicationWindow>
    );
};

export default App;

/*
 <AdwToolbarView topBarStyle={1}>
                <AdwStatusPage
                    iconName="checkbox-checked-symbolic"
                    title="No Tasks Yet"
                    description="Your tasks will show up here."
                /></AdwToolbarView>


 <GtkApplicationWindow title="HD Sentinel UI" defaultWidth={500} defaultHeight={400} onClose={quit}>
            
        </GtkApplicationWindow>
*/