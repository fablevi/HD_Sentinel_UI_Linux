import * as Adw from "@gtkx/jsx/adw";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw$ from "@gtkx/gi/adw";

import React, { useEffect, useState } from "react";
import {localConfigStore} from "../../hooks/useLocalConfig.js";
import {LANGUAGE_OPTIONS, languageType} from "../Languages/language.model.js";
import {useTranslation} from "../Languages/useTranslation.js";

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

    useEffect(() => {
        const styleManager = Adw$.StyleManager.getDefault();

        const signalId = styleManager.connect("notify::color-scheme", () => {
            setAppScheme(styleManager.getColorScheme());
        });

        return () => {
            styleManager.disconnect(signalId);
        };
    }, []);

    return (
        <Adw.AdwDialog
            visible={visibility}
            contentWidth={contentWidth}
            contentHeight={300}
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
                                model={Gtk$.StringList.new( Object.keys(Adw$.ColorScheme).filter(
                                    (key) => isNaN(Number(key))
                                ))}
                                selected={appScheme}
                                onNotifySelected={(value, self) => {
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
                                onNotifySelected={(selectedIndex, self) => {
                                    const selectedLang = LANGUAGE_OPTIONS[selectedIndex ?? 0] || "en";
                                    localConfigStore.setSettings({
                                        ...localConfigStore.settings,
                                        language: selectedLang
                                    });
                                }}
                            />
                        </Adw.AdwPreferencesGroup>
                    </Gtk.GtkBox>

                </Gtk.GtkScrolledWindow>
            </Adw.AdwToolbarView>
        </Adw.AdwDialog>
    );
}