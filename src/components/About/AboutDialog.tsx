import * as Adw from "@gtkx/jsx/adw";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Pango$ from "@gtkx/gi/pango";
import React from "react";
// @ts-ignore
import { exec } from "child_process";
import { useTranslation } from "../Languages/useTranslation.js";

type AboutDialogProps = {
    visible: boolean;
    contentWidth?: number;
    onClose: () => void;
};

export default function AboutDialog({ visible, contentWidth = 440, onClose }: AboutDialogProps) {
    const { TEXT } = useTranslation();

    if (!visible) return null;

    const appVersion = process.env.APP_VERSION || "1.0.0";

    const openUrl = (url: string) => {
        try {
            exec(`xdg-open "${url}"`);
        } catch (e) {
            console.error("Failed to open URL:", e);
        }
    };

    const LinkRow = ({ title, url }: { title: string; url: string }) => (
        <Adw.AdwActionRow
            activatable={true}
            onActivated={() => openUrl(url)}
        >
            <Gtk.GtkBox
                orientation={Gtk$.Orientation.VERTICAL}
                valign={Gtk$.Align.CENTER}
                hexpand={true}
                
            >
                <Gtk.GtkLabel
                    label={title}
                    xalign={0}
                    marginTop={6}
                    marginStart={10}
                    marginEnd={10}
                />
                <Gtk.GtkLabel
                    label={url}
                    cssClasses={["subtitle", "dim-label"]}
                    xalign={0}
                    marginTop={2}
                    marginBottom={6}
                    marginStart={10}
                    marginEnd={10}
                />
            </Gtk.GtkBox>
        </Adw.AdwActionRow>
    );

    return (
        <Adw.AdwDialog
            visible={visible}
            contentWidth={contentWidth}
            contentHeight={480}
            onClosed={onClose}
        >
            <Adw.AdwToolbarView
                topBar={
                    <Adw.AdwHeaderBar
                        titleWidget={
                            <Adw.AdwWindowTitle title={TEXT.about.title} />
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
                        spacing={12}
                        marginTop={16}
                        marginBottom={16}
                        marginStart={16}
                        marginEnd={16}
                    >
                        {/* Ikon és alkalmazás név */}
                        <Gtk.GtkBox
                            orientation={Gtk$.Orientation.VERTICAL}
                            spacing={6}
                            halign={Gtk$.Align.CENTER}
                        >
                            <Gtk.GtkImage
                                iconName="drive-harddisk-symbolic"
                                pixelSize={64}
                            />
                            <Gtk.GtkLabel
                                label="HD Sentinel UI Linux"
                                cssClasses={["title-1"]}
                            />
                            <Gtk.GtkLabel
                                label={`v${appVersion}`}
                                cssClasses={["dim-label", "caption"]}
                            />
                        </Gtk.GtkBox>

                        {/* Részletek és megnyitható linkek egymás mellett */}
                        <Adw.AdwPreferencesGroup>
                            {/* Leírás */}
                            <Adw.AdwActionRow
                                title={TEXT.about.comments}
                            />

                            {/* Hivatalos weboldal */}
                            <LinkRow
                                title="Official Website (Hard Disk Sentinel)"
                                url="https://www.hdsentinel.com/"
                            />

                            {/* GitHub Forráskód */}
                            <LinkRow
                                title="Project Source Code (GitHub)"
                                url="https://github.com/fablevi/HD_Sentinel_UI_Linux"
                            />

                            {/* Letöltések és kiadások */}
                            <LinkRow
                                title="App Downloads & Releases"
                                url="https://github.com/fablevi/HD_Sentinel_UI_Linux/releases/tag/Pre"
                            />

                            {/* Fejlesztő profilja */}
                            <LinkRow
                                title="UI Developer Profile (fablevi)"
                                url="https://github.com/fablevi"
                            />

                            {/* Licenc információ */}
                            <Adw.AdwActionRow
                                title="License"
                                subtitle="Apache-2.0 (© 2026 fablevi)"
                            />
                        </Adw.AdwPreferencesGroup>
                    </Gtk.GtkBox>
                </Gtk.GtkScrolledWindow>
            </Adw.AdwToolbarView>
        </Adw.AdwDialog>
    );
}