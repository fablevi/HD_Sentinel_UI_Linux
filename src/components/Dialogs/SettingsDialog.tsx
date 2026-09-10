import * as Adw from "@gtkx/jsx/adw";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw$ from "@gtkx/gi/adw";

import React, { useEffect, useState } from "react";
import { localConfigStore } from "../../hooks/useLocalConfig.js";
import { LANGUAGE_OPTIONS } from "../Languages/language.model.js";
import { useTranslation } from "../Languages/useTranslation.js";

type SettingsDialogType = {
    visibility: boolean;
    contentWidth: number;
    onCloseFn: () => void;
};

export default function SettingsDialog({ visibility, contentWidth, onCloseFn }: SettingsDialogType) {

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

    return (
        <Adw.AdwDialog
            visible={visibility}
            contentWidth={contentWidth}
            contentHeight={360}
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
                    </Gtk.GtkBox>
                </Gtk.GtkScrolledWindow>
            </Adw.AdwToolbarView>
        </Adw.AdwDialog>
    );
}