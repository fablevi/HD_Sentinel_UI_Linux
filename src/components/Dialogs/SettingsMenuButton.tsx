import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Gio from "@gtkx/gi/gio";
import * as Adw$ from "@gtkx/gi/adw";
import * as $Gtk from "@gtkx/gi/gtk"
import { RefObject, useRef } from "react";
import { useTranslation } from "../Languages/useTranslation.js";

type SettingsMenuButtonProps = {
    noClearCacheSettingsAvailable?: boolean
    onOpenSettings: () => void;
    onOpenAbout?: () => void;
    onSelectOpenFolder?: () => void;
    onClearCache?: () => void;
    adwWindow: RefObject<Adw$.ApplicationWindow | null>
};

export default function SettingsMenuButton({
    noClearCacheSettingsAvailable = false,
    onOpenSettings,
    onOpenAbout,
    onSelectOpenFolder,
    onClearCache,
    adwWindow
}: SettingsMenuButtonProps) {
    const { TEXT } = useTranslation();
    const popoverRef = useRef<Gtk$.Popover | null>(null);

    const handleAction = (callback?: () => void) => {
        popoverRef.current?.popdown();
        if (callback) callback();
    };

    return (
        <Gtk.GtkMenuButton
            iconName="menu_new-symbolic"
            focusable={false}
            onRealize={(self) => {
                if (!adwWindow) return;
                console.log("Window is ready")
                const app = adwWindow.current?.getApplication();
                if (!app) return;
                console.log("App is ready: ", app)

                const registerAppAction = (name: string, callback?: () => void) => {
                    if (!callback) return;
                    try {
                        console.log(name)
                        const action = new Gio.SimpleAction({ name });
                        action.on("activate", () => callback());
                        app.addAction(action);
                    } catch (e) {

                    }
                };

                registerAppAction("open-folder", onSelectOpenFolder);
                registerAppAction("clear-cache", onClearCache);
                registerAppAction("open-settings", onOpenSettings);
                registerAppAction("open-about", onOpenAbout);

                const menu = new Gio.Menu();
                if (onSelectOpenFolder) menu.append(TEXT.common.openFolder, "app.open-folder");
                if (!noClearCacheSettingsAvailable && onClearCache) menu.append(TEXT.common.clearCache, "app.clear-cache");
                if (!onOpenSettings) menu.append(TEXT.settings.title, "app.open-settings");
                if (onOpenAbout) menu.append(TEXT.about.title, "app.open-about");

                app.setMenubar(menu);
                console.log("Menubar:", app.getMenubar());
                console.log("Menu items:", menu.getNItems());
            }}
            popover={
                <Gtk.GtkPopover ref={popoverRef} autohide={true}>
                    <Gtk.GtkBox orientation={Gtk$.Orientation.VERTICAL}>
                        <Gtk.GtkButton
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onSelectOpenFolder)}
                        >
                            <Gtk.GtkBox halign={Gtk$.Align.START}>
                                <Gtk.GtkLabel label={TEXT.common.openFolder} />
                            </Gtk.GtkBox>
                        </Gtk.GtkButton>
                        {!noClearCacheSettingsAvailable && <Gtk.GtkButton
                            cssClasses={["flat", "error"]}
                            focusable={false}
                            onClicked={() => handleAction(onClearCache)}
                        >
                            <Gtk.GtkBox halign={Gtk$.Align.START}>
                                <Gtk.GtkLabel label={TEXT.common.clearCache} />
                            </Gtk.GtkBox>
                        </Gtk.GtkButton>}
                        <Gtk.GtkButton
                            label={TEXT.settings.title}
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onOpenSettings)}
                        >
                            <Gtk.GtkBox halign={Gtk$.Align.START}>
                                <Gtk.GtkLabel label={TEXT.settings.title} />
                            </Gtk.GtkBox>
                        </Gtk.GtkButton>
                        <Gtk.GtkButton
                            label={TEXT.about.title}
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onOpenAbout)}
                        >
                            <Gtk.GtkBox halign={Gtk$.Align.START}>
                                <Gtk.GtkLabel label={TEXT.about.title} />
                            </Gtk.GtkBox>
                        </Gtk.GtkButton>
                    </Gtk.GtkBox>
                </Gtk.GtkPopover>
            }
        />
    );
}