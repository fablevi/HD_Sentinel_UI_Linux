import * as Adw from "@gtkx/jsx/adw";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw$ from "@gtkx/gi/adw";
import * as Gio$ from "@gtkx/gi/gio";

import React, { useEffect, useState } from "react";
import { localConfigStore } from "../../hooks/useLocalConfig.js";
import { LANGUAGE_OPTIONS } from "../Languages/language.model.js";
import { useTranslation } from "../Languages/useTranslation.js";

type SettingsDialogType = {
    visibility: boolean;
    contentWidth: number;
    onCloseFn: () => void;
    onImportSuccess?: () => void;
};

export default function SettingsDialog({ visibility, contentWidth, onCloseFn, onImportSuccess }: SettingsDialogType) {

    const { TEXT } = useTranslation();

    const [appScheme, setAppScheme] = useState<Adw$.ColorScheme>(() =>
        Adw$.StyleManager.getDefault().getColorScheme()
    );

    const [refreshInterval, setRefreshInterval] = useState<string>(() =>
        String(localConfigStore.getSettings().refreshInterval || 5)
    );

    useEffect(() => {
        const styleManager = Adw$.StyleManager.getDefault();

        const signalId = styleManager.connect("notify::color-scheme", () => {
            setAppScheme(styleManager.getColorScheme());
        });

        return () => {
            styleManager.disconnect(signalId);
        };
    }, []);

    const handleIntervalChange = (text: string) => {
        setRefreshInterval(text);
        const parsed = parseInt(text, 10);

        if (!isNaN(parsed) && parsed > 0) {
            localConfigStore.setSettings({
                ...localConfigStore.settings,
                refreshInterval: parsed
            });
        }
    };

    const handleExport = async () => {
        try {
            const dialog = Gtk$.FileDialog.new();
            dialog.setTitle(TEXT.settings.exportHistory);
            dialog.setInitialName("hdsentinel_history.json");

            const file = await dialog.save(null, null);

            if (file) {
                const historyData = localConfigStore.getHistory();
                const jsonString = JSON.stringify(historyData, null, 2);
                const bytes = new TextEncoder().encode(jsonString);

                file.replaceContents(
                    Array.from(bytes),
                    null,
                    false,
                    Gio$.FileCreateFlags.NONE,
                    null
                );
            }
        } catch {}
    };

    const handleImport = async () => {
        try {
            const dialog = Gtk$.FileDialog.new();
            dialog.setTitle(TEXT.settings.importHistory);

            const filter = Gtk$.FileFilter.new();
            filter.setName("JSON (*.json)");
            filter.addPattern("*.json");

            const gtype = (filter as any).gType 
                || (filter as any).constructor?.$gtype 
                || (Gtk$.FileFilter as any).$gtype;

            if (gtype) {
                const filters = Gio$.ListStore.new(gtype);
                filters.append(filter);
                dialog.setFilters(filters);
            }

            const file = await dialog.open(null, null);

            if (file) {
                const res = file.loadContents(null);
                const contents = Array.isArray(res) ? res[1] : res;

                if (contents) {
                    const jsonString = new TextDecoder().decode(new Uint8Array(contents));
                    const importedData = JSON.parse(jsonString);

                    // 1. Mentjük az új történetet a store-ba
                    localConfigStore.saveHistory(importedData);

                    // 2. Meghívjuk a külső kikérdező callbacket 1x
                    if (typeof onImportSuccess === "function") {
                        onImportSuccess();
                    }
                }
            }
        } catch (err) {
            console.error("Import error:", err);
        }
    };

    return (
        <Adw.AdwDialog
            visible={visibility}
            contentWidth={contentWidth}
            contentHeight={480}
            onClosed={() => onCloseFn()}
        >
            <Adw.AdwToolbarView
                topBar={
                    <Adw.AdwHeaderBar
                        titleWidget={
                            <Adw.AdwWindowTitle title={TEXT.settings.title} />
                        }
                    />
                }
            >
                <Gtk.GtkScrolledWindow
                    hscrollbarPolicy={Gtk$.PolicyType.NEVER}
                    vscrollbarPolicy={Gtk$.PolicyType.AUTOMATIC}
                    vexpand={true}
                >
                    <Gtk.GtkBox
                        orientation={Gtk$.Orientation.VERTICAL}
                        widthRequest={80}
                        spacing={3}
                        marginBottom={12}
                        marginTop={12}
                        marginEnd={12}
                        marginStart={12}
                    >
                        <Adw.AdwPreferencesGroup
                            marginStart={20}
                            marginEnd={20}
                            marginTop={20}
                            title={TEXT.settings.styleGroupTitle}
                        >
                            <Adw.AdwComboRow
                                title={TEXT.settings.appSchemeStyle}
                                model={Gtk$.StringList.new(Object.keys(Adw$.ColorScheme).filter(
                                    (key) => isNaN(Number(key))
                                ))}
                                selected={appScheme}
                                onNotifySelected={(value) => {
                                    Adw$.StyleManager.getDefault().setColorScheme(value || 0);
                                    localConfigStore.setSettings({ ...localConfigStore.settings, scheme: value || 0 });
                                }}
                            />
                        </Adw.AdwPreferencesGroup>

                        <Adw.AdwPreferencesGroup
                            marginStart={20}
                            marginEnd={20}
                            marginTop={20}
                            title={TEXT.settings.languagesGroupTitle}
                        >
                            <Adw.AdwComboRow
                                title={TEXT.settings.language}
                                model={Gtk$.StringList.new(LANGUAGE_OPTIONS)}
                                selected={LANGUAGE_OPTIONS.indexOf(localConfigStore.getSettings().language || "en")}
                                onNotifySelected={(selectedIndex) => {
                                    const selectedLang = LANGUAGE_OPTIONS[selectedIndex ?? 0] || "en";
                                    localConfigStore.setSettings({
                                        ...localConfigStore.settings,
                                        language: selectedLang
                                    });
                                }}
                            />
                        </Adw.AdwPreferencesGroup>

                        <Adw.AdwPreferencesGroup
                            marginStart={20}
                            marginEnd={20}
                            marginTop={20}
                            title={TEXT.settings.cache}
                        >
                            <Adw.AdwActionRow>
                                <Gtk.GtkCenterBox
                                    orientation={Gtk$.Orientation.HORIZONTAL}
                                    startWidget={
                                        <Adw.AdwActionRow
                                            title={TEXT.settings.refreshIntervalTitle}
                                            subtitle={TEXT.settings.refreshIntervalSubtitle}
                                        />
                                    }
                                    endWidget={
                                        <Gtk.GtkEntry
                                            text={refreshInterval}
                                            maxWidthChars={5}
                                            widthRequest={100}
                                            onChanged={(self) => handleIntervalChange(self.getText())}
                                        />
                                    }
                                />
                            </Adw.AdwActionRow>
                        </Adw.AdwPreferencesGroup>

                        <Adw.AdwPreferencesGroup
                            marginStart={20}
                            marginEnd={20}
                            marginTop={20}
                            title={TEXT.settings.dataManagementTitle}
                        >
                            <Adw.AdwActionRow
                                title={TEXT.settings.exportHistory}
                                subtitle={TEXT.settings.exportHistorySubtitle}
                            >
                                <Gtk.GtkButton
                                    label="Export"
                                    valign={Gtk$.Align.CENTER}
                                    onClicked={handleExport}
                                />
                            </Adw.AdwActionRow>
                            
                            <Adw.AdwActionRow
                                title={TEXT.settings.importHistory}
                                subtitle={TEXT.settings.importHistorySubtitle}
                            >
                                <Gtk.GtkButton
                                    label="Import"
                                    valign={Gtk$.Align.CENTER}
                                    onClicked={handleImport}
                                />
                            </Adw.AdwActionRow>
                        </Adw.AdwPreferencesGroup>
                    </Gtk.GtkBox>
                </Gtk.GtkScrolledWindow>
            </Adw.AdwToolbarView>
        </Adw.AdwDialog>
    );
}