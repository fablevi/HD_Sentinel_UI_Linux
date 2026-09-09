import React, { useState, useEffect } from "react";
import { GtkBox, GtkLabel, GtkLinkButton, GtkDropTarget, GtkButton } from "@gtkx/jsx/gtk";
import { AdwApplicationWindow, AdwHeaderBar, AdwToolbarView, AdwStyleManager } from "@gtkx/jsx/adw";
import { File } from "@gtkx/gi/gio";
import * as Adw$ from "@gtkx/gi/adw";
import * as Gtk from "@gtkx/gi/gtk";
import * as Gdk from "@gtkx/gi/gdk";
import * as GObject from "@gtkx/gi/gobject";

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { quit } from "@gtkx/react";
import { Runner } from "../ScriptRunnerComponents/Runner.js";
import HDSentinelIcons from "../icons/IconPack.js";
import SettingsDialog from "../Settings/SettingsDialog.js";
import { localConfigStore } from "../../hooks/useLocalConfig.js";
import { useTranslation } from "../Languages/useTranslation.js";
import SettingsMenuButton from "../Settings/SettingsMenuButton.js";
import AboutDialog from "../Dialogs/AboutDialog.js";
import { openCacheFolder } from "../../helper/openFolder.js";
import { clearCacheFolder } from "../../helper/clearCache.js";
import ClearCacheDialog from "../Dialogs/ClearCacheDialog.js";

type AppProps = {
    setResetApp: (reset: boolean) => void
}

export const App = ({ setResetApp }: AppProps) => {
    const { TEXT } = useTranslation();

    const windowWidth = 200;
    const windowHeight = 540;
    const defaultWidth = 600;
    const defaultHeight = 600;

    const [settingsDialogVisibility, setSettingsDialogVisibility] = useState<boolean>(false);
    const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

    const [isClearCacheDialogOpen, setIsClearCacheDialogOpen] = useState<boolean>(false);

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

    const _loadDefaultSettings = () => {
        Adw$.StyleManager.getDefault().setColorScheme(localConfigStore.settings.scheme);
    };

    const handleClose = () => {
        setTimeout(() => {
            quit();
        }, 200);
        return undefined;
    };

    function closeSettignsDialog() {
        setSettingsDialogVisibility(false);
    }

    function _reloadHDSentinelSearch() {
        setReloadHDSentinellSearch((prev) => !prev);
    }

    const handleDrop = (...args: any[]) => {
        try {
            console.log("=== DROP EVENT TRIGGERED ===");
            setDropError(null);

            let fileObj: any = null;
            const gvalue = args[0];

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

            if (!filePath) {
                console.warn("X Nem sikerült kibontani a fájl elérési útját!");
                setDropError(TEXT.notFound.invalidFile);
                return false;
            }

            const fileName = path.basename(filePath);

            if (fileName !== "HDSentinel") {
                console.warn(`X Hibás fájlnév! Várt: "HDSentinel", kapott: "${fileName}"`);
                setDropError(TEXT.notFound.wrongFileName);
                return false;
            }

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            fs.copyFileSync(filePath, executablePath);
            fs.chmodSync(executablePath, 0o755);

            _reloadHDSentinelSearch();
            return true;
        } catch (err) {
            console.error("X Hiba a fájl feldolgozásakor:", err);
            setDropError(TEXT.notFound.copyFailed);
            return false;
        }
    };

    const handleClearCacheConfirm = () => {
        setIsClearCacheDialogOpen(false);
        clearCacheFolder();
        _reloadHDSentinelSearch();
    };

    if (_isHDSentinelExecutableIsAvailable === "loading") {
        return null;
    }

    if (_isHDSentinelExecutableIsAvailable === "notfound") {
        return (
            <AdwApplicationWindow
                title={"HD Sentinel"}
                widthRequest={windowWidth}
                heightRequest={windowHeight}
                defaultWidth={defaultWidth}
                defaultHeight={defaultHeight}
                onCloseRequest={handleClose}
            >
                <AdwToolbarView
                    topBar={
                        <AdwHeaderBar
                            end={
                                <SettingsMenuButton
                                    noClearCacheSettingsAvailable={true}
                                    onOpenSettings={() => setSettingsDialogVisibility(true)}
                                    onOpenAbout={() => { setIsAboutOpen(true); }}
                                    onClearCache={() => {
                                       setIsClearCacheDialogOpen(true)
                                    }}
                                    onSelectOpenFolder={() => {
                                        openCacheFolder()
                                    }}
                                />
                            }
                        />
                    }
                    controllers={[
                        <GtkDropTarget
                            key="drop-target"
                            actions={Gdk.DragAction.COPY}
                            types={[GObject.typeFromName("GFile")]}
                            preload={true}
                            onDrop={(...args: any[]) => handleDrop(...args)}
                        />,
                    ]}
                >
                    {settingsDialogVisibility && (
                        <SettingsDialog
                            visibility={settingsDialogVisibility}
                            contentWidth={windowWidth}
                            onCloseFn={closeSettignsDialog}
                        />
                    )}



                    <ClearCacheDialog
                        visible={isClearCacheDialogOpen}
                        onConfirm={handleClearCacheConfirm}
                        onClose={() => setIsClearCacheDialogOpen(false)}
                    />

                    {isAboutOpen && (
                        <AboutDialog
                            visible={isAboutOpen}
                            onClose={() => setIsAboutOpen(false)}
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
                            label={TEXT.notFound.errorTitle}
                            cssClasses={["error", "title-2"]}
                        />

                        {dropError && (
                            <GtkLabel label={dropError} cssClasses={["error"]} />
                        )}

                        <GtkLinkButton
                            label={TEXT.notFound.downloadLink}
                            uri={"https://www.hdsentinel.com/hdslin/hdsentinel-020c-x64.zip"}
                        />

                        <GtkBox
                            marginBottom={10}
                            marginTop={10}
                            marginStart={10}
                            marginEnd={10}
                            valign={Gtk.Align.CENTER}
                            halign={Gtk.Align.CENTER}
                        >
                            <HDSentinelIcons
                                name={isAppDark ? "white-file" : "black-file"}
                                pixelSize={128}
                            />
                        </GtkBox>
                    </GtkBox>
                </AdwToolbarView>
            </AdwApplicationWindow>
        );
    }

    return <Runner
        setResetApp={setResetApp}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        defaultWidth={defaultWidth}
        defaultHeight={defaultHeight} 
        isClearCacheDialogOpen={isClearCacheDialogOpen}    
        setIsClearCacheDialogOpen={setIsClearCacheDialogOpen}
        handleClearCacheConfirm={handleClearCacheConfirm}
    />;
};