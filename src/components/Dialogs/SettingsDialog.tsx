import * as Adw from "@gtkx/jsx/adw";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw$ from "@gtkx/gi/adw";
import * as Gio$ from "@gtkx/gi/gio";

import React, { useEffect, useMemo, useState } from "react";
import { localConfigStore } from "../../hooks/useLocalConfig.js";
import { LANGUAGE_LABELS, LANGUAGE_OPTIONS } from "../Languages/language.model.js";
import { useTranslation } from "../Languages/useTranslation.js";
import { adwButton } from "../css/ProgressBarStyle.js";

type SettingsDialogType = {
    visibility: boolean;
    contentWidth: number;
    onCloseFn: () => void;
    onImportSuccess?: () => void;
    onClearCache?: () => void;
};

export default function SettingsDialog({ visibility, contentWidth, onCloseFn, onImportSuccess, onClearCache }: SettingsDialogType) {

    const { TEXT } = useTranslation();

    const [appScheme, setAppScheme] = useState<Adw$.ColorScheme>(() =>
        Adw$.StyleManager.getDefault().getColorScheme()
    );

    const [refreshInterval, setRefreshInterval] = useState<string>(() =>
        String(localConfigStore.getSettings().refreshInterval)
    );

    const languageModel = useMemo(
        () => Gtk$.StringList.new(LANGUAGE_OPTIONS.map((lang) => LANGUAGE_LABELS[lang])),
        []
    );

    const SCHEME_OPTIONS = useMemo(() => [
        { label: TEXT.default, value: Adw$.ColorScheme.DEFAULT },     // Index 0 -> Default
        { label: TEXT.light, value: Adw$.ColorScheme.FORCE_LIGHT }, // Index 1 -> Force Light
        { label: TEXT.dark, value: Adw$.ColorScheme.FORCE_DARK }   // Index 2 -> Force Dark
    ], [TEXT]);

    const schemeModel = useMemo(() => {
        return Gtk$.StringList.new(SCHEME_OPTIONS.map(opt => opt.label));
    }, [SCHEME_OPTIONS]);

    const getSchemeIndex = (scheme: Adw$.ColorScheme) => {
        const found = SCHEME_OPTIONS.findIndex(opt => opt.value === scheme);
        return found !== -1 ? found : 0;
    };

    const intervalModel = useMemo(
        () => Gtk$.StringList.new([TEXT.slow, TEXT.medium, TEXT.quick]),
        [TEXT]
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

    const handleIntervalChange = (value: number | null) => {
        setRefreshInterval(value?.toString() || "0");

        localConfigStore.setSettings({
            ...localConfigStore.settings,
            refreshInterval: value || 0
        });
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
        } catch { }
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

                    localConfigStore.saveHistory(importedData);

                    if (typeof onImportSuccess === "function") {
                        onImportSuccess();
                    }
                }
            }
        } catch (err) {
            console.error("Import error:", err);
        }
    };

    const terminalCommandAddOrRemove = () => {

    }

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
                                title={TEXT.settings.language}
                                model={languageModel}
                                selected={LANGUAGE_OPTIONS.indexOf(localConfigStore.getSettings().language || "en")}
                                onNotifySelected={(selectedIndex) => {
                                    const selectedLang = LANGUAGE_OPTIONS[selectedIndex ?? 0] || "en";
                                    localConfigStore.setSettings({
                                        ...localConfigStore.settings,
                                        language: selectedLang
                                    });
                                }}
                            />
                            <Adw.AdwComboRow
                                title={TEXT.settings.appSchemeStyle}
                                model={schemeModel}
                                selected={getSchemeIndex(appScheme)}
                                onNotifySelected={(selectedIndex) => {
                                    const index = selectedIndex ?? 0;
                                    const targetScheme = SCHEME_OPTIONS[index].value;

                                    Adw$.StyleManager.getDefault().setColorScheme(targetScheme);
                                    localConfigStore.setSettings({ ...localConfigStore.settings, scheme: targetScheme });
                                }}
                            />
                        </Adw.AdwPreferencesGroup>

                        <Adw.AdwPreferencesGroup
                            marginStart={20}
                            marginEnd={20}
                            marginTop={20}
                            title={TEXT.settings.cache}
                        >
                            <Adw.AdwComboRow
                                title={TEXT.settings.refreshIntervalTitle}
                                subtitle={TEXT.settings.refreshIntervalSubtitle}
                                model={intervalModel}
                                selected={parseInt(refreshInterval)}
                                onNotifySelected={handleIntervalChange}
                            />
                            {onClearCache &&
                                <Gtk.GtkButton
                                    marginTop={10}
                                    onClicked={onClearCache}
                                    cssClasses={["error", adwButton]}
                                    label={TEXT.common.clearCache}

                                />}
                        </Adw.AdwPreferencesGroup>
                        <Adw.AdwPreferencesGroup
                            marginStart={20}
                            marginEnd={20}
                            marginTop={20}
                            title={TEXT.settings.dataManagementTitle}
                        >
                            <Gtk.GtkBox
                                orientation={Gtk$.Orientation.HORIZONTAL}
                                spacing={10}
                                hexpand={true}
                                marginStart={0}
                                marginEnd={0}
                                marginBottom={12}
                            >
                                <Gtk.GtkButton
                                    label="Export"
                                    cssClasses={[ adwButton]}
                                    valign={Gtk$.Align.CENTER}
                                    hexpand={true}
                                    onClicked={handleExport}
                                />
                                <Gtk.GtkButton
                                    label="Import"
                                    cssClasses={[ adwButton]}
                                    valign={Gtk$.Align.CENTER}
                                    hexpand={true}
                                    onClicked={handleImport}
                                />
                            </Gtk.GtkBox>
                        </Adw.AdwPreferencesGroup>
                    </Gtk.GtkBox>
                </Gtk.GtkScrolledWindow>
            </Adw.AdwToolbarView>
        </Adw.AdwDialog>
    );
}

/*
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
                                        <Gtk.GtkBox
                                            orientation={Gtk$.Orientation.HORIZONTAL}
                                            //valign={Gtk$.AlignCenter}
                                            cssClasses={["linked"]}
                                        >
                                            <Gtk.GtkToggleButton
                                                label="0"
                                                active={refreshInterval === "0"}
                                                onToggled={(self) => {
                                                    if (self.getActive()) handleIntervalChange("0");
                                                }}
                                            />
                                            <Gtk.GtkToggleButton
                                                label="1"
                                                active={refreshInterval === "1"}
                                                onToggled={(self) => {
                                                    if (self.getActive()) handleIntervalChange("1");
                                                }}
                                            />
                                            <Gtk.GtkToggleButton
                                                label="2"
                                                active={refreshInterval === "2"}
                                                onToggled={(self) => {
                                                    if (self.getActive()) handleIntervalChange("2");
                                                }}
                                            />
                                        </Gtk.GtkBox>
                                    }
                                />
                            </Adw.AdwActionRow>
<Gtk.GtkEntry
                                            text={refreshInterval}
                                            maxWidthChars={5}
                                            widthRequest={100}
                                            onChanged={(self) => handleIntervalChange(self.getText())}
                                        />
 <Adw.AdwPreferencesGroup>
                            <Adw.AdwActionRow
                            marginStart={20}
                            marginEnd={20}
                            marginTop={20}
                            title={TEXT.settings.cache}
                            >

                            </Adw.AdwActionRow>
                        </Adw.AdwPreferencesGroup>
*/