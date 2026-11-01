import * as Adw from "@gtkx/jsx/adw";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Gdk from "@gtkx/gi/gdk";
import { useTranslation } from "../Languages/useTranslation.js";
import path from "node:path";
import fs from "node:fs";

import pkg from "../../../package.json" with { type: "json" };
// @ts-ignore
import { applicationId } from "virtual:gtkx-config";

try {
    const display = Gdk.Display.getDefault();
    if (display) {
        const iconTheme = Gtk$.IconTheme.getForDisplay(display);
        
        const execPath = process.argv[1] ? path.resolve(process.argv[1]) : process.cwd();
        const bundleDir = path.dirname(execPath);

        const possiblePaths = [
            path.resolve(bundleDir, "public", "assets"),
            path.resolve(bundleDir, "assets"),
            path.resolve(process.cwd(), "public", "assets"),
            path.resolve(process.cwd(), "dist", "assets"),
            path.resolve(process.cwd(), "src", "assets")
        ];

        //console.log("[AboutDialog] --- Checking icon search paths ---");
        for (const p of possiblePaths) {
            const hicolorPath = path.join(p, "hicolor");
            const exists = fs.existsSync(hicolorPath);
            //console.log(`[AboutDialog] Checking: ${hicolorPath} -> Exists: ${exists}`);
            if (exists) {
                iconTheme.addSearchPath(p);
                //console.log(`[AboutDialog] -> Successfully added search path: ${p}`);
                break;
            }
        }
    }
} catch (e) {
    console.error("Icon theme search path registration error:", e);
}

type AboutDialogProps = {
    visible?: boolean;
    onClose: () => void;
};

export default function AboutDialog({ visible = true, onClose }: AboutDialogProps) {
    const { TEXT } = useTranslation();

    if (!visible) return null;

    const appVersion = pkg.version;

    return (
        <Adw.AdwAboutDialog
            visible={visible}
            onClosed={onClose}
            applicationName="HD Sentinel UI Linux"
            applicationIcon={applicationId}
            version={appVersion}
            developerName="fablevi"
            website="https://www.hdsentinel.com/"
            supportUrl="https://github.com/fablevi/HD_Sentinel_UI_Linux"
            issueUrl="https://github.com/fablevi/HD_Sentinel_UI_Linux/issues"
            copyright="© 2026 fablevi"
            developers={["fablevi"]}
            licenseType={Gtk$.License.APACHE_2_0}
            comments={TEXT.about.comments || "A Linux UI for Hard Disk Sentinel built with GTKX and React."}
        />
    );
}