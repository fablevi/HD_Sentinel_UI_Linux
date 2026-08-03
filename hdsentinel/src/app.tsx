import React, { useState, useEffect } from "react";
import { GtkBox, GtkLabel, GtkLinkButton, GtkDropTarget } from "@gtkx/jsx/gtk";
import { AdwApplicationWindow, AdwHeaderBar, AdwToolbarView } from "@gtkx/jsx/adw";
import { File } from "@gtkx/gi/gio";
import * as Gtk from "@gtkx/gi/gtk";
import * as Gdk from "@gtkx/gi/gdk";
import * as GObject from "@gtkx/gi/gobject";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { quit } from "@gtkx/react";
import {Runner} from "./Runner.js";

export const App = () => {
    const windowWidth = 960;
    const windowHeight = 540;

    const [_isHDSentinelExecutableIsAvailable, _setIsHDSentinelExecutableIsAvailable] = useState<"loading" | "notfound" | "available">("loading");
    const [reloadHDSentinellSearch, setReloadHDSentinellSearch] = useState<boolean>(false);
    const [dropError, setDropError] = useState<string | null>(null);

    const targetDir = path.join(os.homedir(), ".cache", "hdsentinel", "exec");
    const executablePath = path.join(targetDir, "HDSentinel");

    useEffect(() => {
        if (fs.existsSync(executablePath)) {
            _setIsHDSentinelExecutableIsAvailable("available");
        } else {
            _setIsHDSentinelExecutableIsAvailable("notfound");
        }
    }, [reloadHDSentinellSearch]);

    const handleClose = () => {
        setTimeout(() => {
            quit();
        }, 200);
        return undefined;
    };

    function _reloadHDSentinellSearch() {
        setReloadHDSentinellSearch((prev) => !prev);
    }

    const handleDrop = (...args: any[]) => {
        try {
            console.log("=== DROP EVENT TRIGGERED ===");
            setDropError(null);

            let fileObj: any = null;
            const gvalue = args[0]; // Arg [0] a Gdk.Value / GValue

            // Próbáljuk kibontani az értéket a Value objektumból
            if (gvalue) {
                if (typeof gvalue.getGObject === "function") {
                    fileObj = gvalue.getGObject();
                } else if (typeof gvalue.getObject === "function") {
                    fileObj = gvalue.getObject();
                } else if (typeof gvalue.getBoxed === "function") {
                    fileObj = gvalue.getBoxed();
                } else if (typeof gvalue.getValue === "function") {
                    fileObj = gvalue.getValue();
                } else if (gvalue.value) {
                    fileObj = gvalue.value;
                }
            }

            console.log("-> Value-ból kibontott fileObj:", fileObj);
            console.log("-> fileObj metódusai:", fileObj ? Object.keys(Object.getPrototypeOf(fileObj)) : "null");

            let filePath: string | null = null;

            if (fileObj) {
                if (typeof fileObj.getPath === "function") {
                    filePath = fileObj.getPath();
                } else if (typeof fileObj.get_path === "function") {
                    filePath = fileObj.get_path();
                } else if (typeof fileObj === "string") {
                    filePath = fileObj;
                }
            }

            console.log("-> Felismert elérési út (filePath):", filePath);

            if (!filePath) {
                console.warn("X Nem sikerült kibontani a fájl elérési útját!");
                setDropError("A bedobott elem nem érvényes fájl!");
                return false;
            }

            const fileName = path.basename(filePath);
            console.log("-> Fájlnév:", fileName);

            if (fileName !== "HDSentinel") {
                console.warn(`X Hibás fájlnév! Várt: "HDSentinel", kapott: "${fileName}"`);
                setDropError(`Hibás fájl! A fájl neve "HDSentinel" kell legyen (a kapott fájl: "${fileName}").`);
                return false;
            }

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            fs.copyFileSync(filePath, executablePath);
            fs.chmodSync(executablePath, 0o755);
            console.log("✓ Sikeres fájlmásolás ide:", executablePath);

            _reloadHDSentinellSearch();
            return true;
        } catch (err) {
            console.error("X Hiba a fájl feldolgozásakor:", err);
            setDropError("Sikertelen fájlmásolás!");
            return false;
        }
    };

    if (_isHDSentinelExecutableIsAvailable === "loading") {
        return null;
    }

    if (_isHDSentinelExecutableIsAvailable === "notfound") {
        return (
            <AdwApplicationWindow title={"HD Sentinel"} widthRequest={windowWidth} heightRequest={windowHeight} onCloseRequest={handleClose}>
                <AdwToolbarView topBar={<AdwHeaderBar />}>
                    <GtkBox
                        orientation={Gtk.Orientation.VERTICAL}
                        spacing={10}
                        valign={Gtk.Align.CENTER}
                        halign={Gtk.Align.CENTER}
                        hexpand={true}
                        vexpand={true}
                        controllers={[
                            <GtkDropTarget
                                key="drop-target"
                                actions={Gdk.DragAction.COPY}
                                types={[GObject.typeFromName("GFile")]}
                                preload={true}
                                onDrop={(...args: any[]) => handleDrop(...args)}
                            />
                        ]}
                    >
                        <GtkLabel
                            label="Hiba: A HDSentinel executable nem található!"
                            cssClasses={["error", "title-2"]}
                        />
                        <GtkLabel
                            label="Húzd ide a fájlt vagy helyezd el a ~/.cache/hdsentinel/exec/ mappában."
                            cssClasses={["dim-label"]}
                        />

                        {dropError && (
                            <GtkLabel label={dropError} cssClasses={["error"]} />
                        )}

                        <GtkLinkButton
                            label={"HDSentinel letöltése (Linux x64)"}
                            uri={"https://www.hdsentinel.com/hdslin/hdsentinel-020c-x64.zip"}
                        />
                    </GtkBox>
                </AdwToolbarView>
            </AdwApplicationWindow>
        );
    }

    return (
        <Runner/>
    )

    /*return (
        <AdwApplicationWindow title={"HD Sentinel"} widthRequest={windowWidth} heightRequest={windowHeight} onCloseRequest={handleClose}>
            <AdwToolbarView topBar={<AdwHeaderBar />}>
                <GtkBox orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
                    <GtkLabel label="HDSentinel megtalálva!" cssClasses={["success"]} />
                </GtkBox>
            </AdwToolbarView>
        </AdwApplicationWindow>
    );*/
};