import * as Gtk from "@gtkx/ffi/gtk";
import { GtkApplicationWindow, GtkBox, GtkButton, GtkLabel, quit } from "@gtkx/react";
import { useState } from "react";
// @ts-ignore
import { exec, execFileSync } from "child_process";
// @ts-ignore
import path from "path";
// @ts-ignore
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const proc = (globalThis as any).process;

// --- ROOT MÓD KEZELÉSE ---
// Ha az appot a root indította újra a speciális kapcsolóval, akkor csak lefut a HDSentinel és kilép
if (proc?.argv?.includes("--run-hdsentinel")) {
    try {
        const appDir = proc.env.APPDIR;
        const binaryPath = appDir 
            ? path.join(appDir, "exec/HDSentinel") 
            : path.resolve(dirname, "../exec/HDSentinel");

        // Meghívjuk a HDSentinel-t és a kimenetét kiírjuk a stdout-ra
        const output = execFileSync(binaryPath, { encoding: "utf-8" });
        proc.stdout.write(output);
        proc.exit(0);
    } catch (e: any) {
        proc.stderr.write(e.message || "Hiba a futtatás során");
        proc.exit(1);
    }
}

export const App = () => {
    const [returnedString, setReturnedString] = useState<String>("No data");

    function callTerminalCommand() {
        const currentAppImage = proc?.env?.APPIMAGE;

        let command: string;
        const display = proc?.env?.DISPLAY || ":0";
        const xauth = proc?.env?.XAUTHORITY || "";
        const runtimeDir = proc?.env?.XDG_RUNTIME_DIR || "";
        const ldLibrary = proc?.env?.LD_LIBRARY_PATH || "";
        const envPass = `env LD_LIBRARY_PATH="${ldLibrary}" DISPLAY="${display}" XAUTHORITY="${xauth}" XDG_RUNTIME_DIR="${runtimeDir}"`;

        if (currentAppImage) {
            // APPIMAGE KÖRNYEZET: Magát az AppImage fájlt hívjuk meg rootként a kapcsolóval!
            command = `pkexec ${envPass} "${currentAppImage}" --run-hdsentinel`;
        } else {
            // DEV KÖRNYEZET (npm run dev): A sima helyi binárist hívjuk meg
            const binaryPath = path.resolve(dirname, "../exec/HDSentinel");
            command = `pkexec ${envPass} "${binaryPath}"`;
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

    return (
        <GtkApplicationWindow title="My App" defaultWidth={400} defaultHeight={300} onClose={quit}>
            <GtkBox
                orientation={Gtk.Orientation.VERTICAL}
                spacing={20}
                marginTop={40}
                marginBottom={40}
                marginStart={40}
                marginEnd={40}
                valign={Gtk.Align.CENTER}
                halign={Gtk.Align.CENTER}
            >
                <GtkLabel label={`${returnedString}`} cssClasses={["title-2"]} />
                <GtkButton
                    label="Call"
                    onClicked={() => callTerminalCommand()}
                    cssClasses={["suggested-action", "pill"]}
                />
            </GtkBox>
        </GtkApplicationWindow>
    );
};

export default App;