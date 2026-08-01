import React, { useMemo } from "react";
import { GtkImage } from "@gtkx/jsx/gtk";
import { Texture } from "@gtkx/gi/gdk";
import { File } from "@gtkx/gi/gio";
import fs from "node:fs";
import path from "node:path";

import lanDefault from "../../assets/png/lan_default-0.png";
import lanOffline from "../../assets/png/lan_offline-0.png";
import linuxBad from "../../assets/png/linux_system_bad.png";
import linuxDefault from "../../assets/png/linux_system_default.png";
import linuxGood from "../../assets/png/linux_system_good.png";
import linuxWarning from "../../assets/png/linux_system_warning.png";
import sataBad from "../../assets/png/sata_bad-0.png";
import sataDefault from "../../assets/png/sata_default-0.png";
import sataGood from "../../assets/png/sata_good-0.png";
import sataWarning from "../../assets/png/sata_warning-0.png";
import usbBad from "../../assets/png/usb_bad-0.png";
import usbDefault from "../../assets/png/usb_default-0.png";
import usbGood from "../../assets/png/usb_good-0.png";
import usbStick from "../../assets/png/usb_stick-0.png";
import usbWarning from "../../assets/png/usb_warning-0.png";

const ASSETS_MAP = {
    "lan-default": lanDefault,
    "lan-offline": lanOffline,
    "linux-bad": linuxBad,
    "linux-default": linuxDefault,
    "linux-good": linuxGood,
    "linux-warning": linuxWarning,
    "sata-bad": sataBad,
    "sata-default": sataDefault,
    "sata-good": sataGood,
    "sata-warning": sataWarning,
    "usb-bad": usbBad,
    "usb-default": usbDefault,
    "usb-good": usbGood,
    "usb-stick": usbStick,
    "usb-warning": usbWarning,
} as const;

export type IconName = keyof typeof ASSETS_MAP;

interface HDSentinelIconsProps {
    name: IconName;
    pixelSize?: number;
}

function loadTexture(rawPath: string): Texture | undefined {
    try {
        const iconPath = fs.existsSync(rawPath)
            ? rawPath
            : path.resolve(process.cwd(), rawPath.replace(/^\//, ""));

        const file = File.newForPath(iconPath);
        return Texture.newFromFile(file);
    } catch (error) {
        console.error(`Error (${rawPath}) while image loading... :`, error);
        return undefined;
    }
}

export default function HDSentinelIcons({ name, pixelSize = 128 }: HDSentinelIconsProps) {
    const textures = useMemo(() => {
        const cache: Partial<Record<IconName, Texture>> = {};

        for (const [key, rawPath] of Object.entries(ASSETS_MAP)) {
            const texture = loadTexture(rawPath);
            if (texture) {
                cache[key as IconName] = texture;
            }
        }

        return cache;
    }, []);

    const activeTexture = textures[name];

    if (!activeTexture) {
        return null;
    }

    return (
        <GtkImage
            paintable={activeTexture}
            pixelSize={pixelSize}
        />
    );
}