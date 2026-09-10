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
import ramDefault from "../../assets/png/ram-default.png";
import blackFile from "../../assets/png/file_black.png"
import whiteFile from "../../assets/png/file_white.png"

import runnerIcon from "../../assets/sata_default_rounded.png"

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
    "ram-default": ramDefault,
    "black-file": blackFile,
    "white-file": whiteFile,
    "runner-icon": runnerIcon
} as const;

export type IconName = keyof typeof ASSETS_MAP;

interface HDSentinelIconsProps {
    name: IconName;
    pixelSize?: number;
}

const textureCache = new Map<string, Texture>();

function resolveAssetPath(rawPath: string): string {
    let cleanRawPath = decodeURIComponent(rawPath);

    if (fs.existsSync(cleanRawPath)) {
        return cleanRawPath;
    }

    const fileName = path.basename(cleanRawPath);
    const execPath = process.argv[1] ? path.resolve(process.argv[1]) : process.cwd();
    const bundleDir = path.dirname(execPath);

    const candidates = [
        path.join(bundleDir, "assets", fileName),
        path.join(bundleDir, fileName),
        path.join(process.cwd(), "dist", "assets", fileName),
        path.join(process.cwd(), "src", "assets", "png", fileName),
        path.join(process.cwd(), "assets", "png", fileName),
        path.join(process.cwd(), cleanRawPath.replace(/^\//, "")),
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return cleanRawPath;
}

function loadTexture(rawPath: string): Texture | undefined {
    if (textureCache.has(rawPath)) {
        return textureCache.get(rawPath);
    }

    try {
        const finalPath = resolveAssetPath(rawPath);

        if (!fs.existsSync(finalPath)) {
            console.error(`[HDSentinelIcons] Image file not found: ${finalPath} (raw: ${rawPath})`);
            return undefined;
        }

        const file = File.newForPath(finalPath);
        const texture = Texture.newFromFile(file);

        if (texture) {
            textureCache.set(rawPath, texture);
        }

        return texture;
    } catch (error) {
        console.error(`Error (${rawPath}) while image loading... :`, error);
        return undefined;
    }
}

export default function HDSentinelIcons({ name, pixelSize = 128 }: HDSentinelIconsProps) {
    const rawPath = ASSETS_MAP[name];

    const activeTexture = useMemo(() => {
        if (!rawPath) return undefined;
        return loadTexture(rawPath);
    }, [rawPath]);

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