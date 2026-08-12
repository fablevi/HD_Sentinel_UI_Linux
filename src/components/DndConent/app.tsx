import React, {useState, useEffect} from "react";
import {GtkBox, GtkLabel, GtkLinkButton, GtkDropTarget, GtkButton} from "@gtkx/jsx/gtk";
import {AdwApplicationWindow, AdwHeaderBar, AdwToolbarView, AdwStyleManager} from "@gtkx/jsx/adw";
import {File} from "@gtkx/gi/gio";
import * as Adw$ from "@gtkx/gi/adw";
import * as Gtk from "@gtkx/gi/gtk";
import * as Gdk from "@gtkx/gi/gdk";
import * as GObject from "@gtkx/gi/gobject";

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {quit} from "@gtkx/react";
import {Runner} from "../ScriptRunnerComponents/Runner.js";
import HDSentinelIcons from "../icons/IconPack.js";
import SettingsDialog from "../Settings/SettingsDialog.js";
import {localConfigStore} from "../../hooks/useLocalConfig.js";

export const App = () => {
    const windowWidth = 600; //960;
    const windowHeight = 450; //540;

    const [settingsDialogVisibility, setSettingsDialogVisibility] = useState<boolean>(false);

    const [_isHDSentinelExecutableIsAvailable, _setIsHDSentinelExecutableIsAvailable] = useState<"loading" | "notfound" | "available">("loading");
    const [reloadHDSentinellSearch, setReloadHDSentinellSearch] = useState<boolean>(false);
    const [dropError, setDropError] = useState<string | null>(null);

    const [isAppDark, setIsAppDark] = useState<boolean>(() =>
        Adw$.StyleManager.getDefault().getDark()
    );

    const targetDir = path.join(os.homedir(), ".cache", "hdsentinel", "exec");
    const executablePath = path.join(targetDir, "HDSentinel");

    useEffect(() => {
        if (fs.existsSync(executablePath)) {
            _setIsHDSentinelExecutableIsAvailable("available");
        } else {
            _setIsHDSentinelExecutableIsAvailable("notfound");
        }
    }, [reloadHDSentinellSearch]);

    useEffect(() => {
        console.log(localConfigStore.settings);
        console.log("Load default settings!");
        _loadDefaultSettings();
    }, []);

    useEffect(() => {
        const styleManager = Adw$.StyleManager.getDefault();

        const signalId = styleManager.connect("notify::dark", () => {
            setIsAppDark(styleManager.getDark());
        });

        return () => {
            styleManager.disconnect(signalId);
        };
    }, []);

    const _loadDefaultSettings  = () => {
        Adw$.StyleManager.getDefault().setColorScheme(localConfigStore.settings.scheme);
    }

    const handleClose = () => {
        setTimeout(() => {
            quit();
        }, 200);
        return undefined;
    };

    function closeSettignsDialog() {
        setSettingsDialogVisibility(false)
    }

    function _reloadHDSentinelSearch() {
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
                fs.mkdirSync(targetDir, {recursive: true});
            }

            fs.copyFileSync(filePath, executablePath);
            fs.chmodSync(executablePath, 0o755);
            console.log("✓ Sikeres fájlmásolás ide:", executablePath);

            _reloadHDSentinelSearch();
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
            <AdwApplicationWindow title={"HD Sentinel"} widthRequest={windowWidth} heightRequest={windowHeight}
                                  onCloseRequest={handleClose}>

                <AdwToolbarView topBar={
                    <AdwHeaderBar end={
                        <GtkButton
                            iconName="settings-configure-symbolic"
                            onClicked={() => {
                                setSettingsDialogVisibility(true)
                            }}
                        />
                    }/>
                }
                                controllers={[
                                    <GtkDropTarget
                                        key="drop-target"
                                        actions={Gdk.DragAction.COPY}
                                        types={[GObject.typeFromName("GFile")]}
                                        preload={true}
                                        onDrop={(...args: any[]) => handleDrop(...args)}
                                    />
                                ]}>

                    {settingsDialogVisibility && (
                        <SettingsDialog
                            visibility={settingsDialogVisibility}
                            contentWidth={windowWidth}
                            onCloseFn={closeSettignsDialog}
                        />
                    )}

                    <GtkBox
                        orientation={Gtk.Orientation.VERTICAL}
                        spacing={10}
                        valign={Gtk.Align.CENTER}
                        halign={Gtk.Align.CENTER}
                        hexpand={true}
                        vexpand={true}

                    >
                        <GtkLabel
                            label="Error: HDSentinel not found!"
                            cssClasses={["error", "title-2"]}
                        />

                        {dropError && (
                            <GtkLabel label={dropError} cssClasses={["error"]}/>
                        )}

                        <GtkLinkButton
                            label={"Download HD Sentinel from the link below, extract it, and drop it here."}
                            uri={"https://www.hdsentinel.com/hdslin/hdsentinel-020c-x64.zip"}
                        />

                        <GtkBox marginBottom={10} marginTop={10} marginStart={10} marginEnd={10}
                                valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
                            <HDSentinelIcons name={isAppDark ? "white-file" : "black-file"} pixelSize={128}/>
                        </GtkBox>

                    </GtkBox>
                </AdwToolbarView>
            </AdwApplicationWindow>
        );
    }

    return (
        <Runner/>
    )
};