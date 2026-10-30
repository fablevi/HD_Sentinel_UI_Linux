import * as Gtk from "@gtkx/jsx/gtk";
import * as Gio from "@gtkx/jsx/gio";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Gio$ from "@gtkx/gi/gio";
import * as Adw$ from "@gtkx/gi/adw";
import { RefObject } from "react";
import { useTranslation } from "../Languages/useTranslation.js";

type SettingsMenuButtonProps = {
    noClearCacheSettingsAvailable?: boolean;
    onOpenSettings?: () => void;
    onOpenAbout?: () => void;
    onSelectOpenFolder?: () => void;
    onClearCache?: () => void;
    adwWindow: RefObject<Adw$.ApplicationWindow | null>;
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

    // Dinamikusan összeállítjuk a menü szakaszait a props alapján
    const menuSections: any[] = [];

    const primarySection: any[] = [];
    if (onSelectOpenFolder) {
        primarySection.push({ label: TEXT.common.openFolder, action: "app.open-folder" });
    }
    if (!noClearCacheSettingsAvailable && onClearCache) {
        primarySection.push({ label: TEXT.common.clearCache, action: "app.clear-cache" });
    }
    if (primarySection.length > 0) {
        menuSections.push({ section: primarySection });
    }

    const secondarySection: any[] = [];
    if (onOpenSettings) {
        secondarySection.push({ label: TEXT.settings.title, action: "app.open-settings" });
    }
    if (onOpenAbout) {
        secondarySection.push({ label: TEXT.about.title, action: "app.open-about" });
    }
    if (secondarySection.length > 0) {
        menuSections.push({ section: secondarySection });
    }

    return (
        <Gtk.GtkMenuButton
            primary
            iconName="open-menu-symbolic"
            focusable={false}
            onRealize={() => {
                if (!adwWindow) return;
                const app = adwWindow.current?.getApplication();
                if (!app) return;

                const registerAppAction = (name: string, callback?: () => void, accel?: string) => {
                    if (!callback) return;
                    try {
                        const actionName = `app.${name}`;
                        const action = new Gio$.SimpleAction({ name });
                        action.on("activate", () => callback());
                        app.addAction(action);

                        if (accel) {
                            app.setAccelsForAction(actionName, [accel]);
                        }
                    } catch (e) {
                        // ignore
                    }
                };

                registerAppAction("open-folder", onSelectOpenFolder, "<Control>f");
                registerAppAction("clear-cache", onClearCache);
                registerAppAction("open-settings", onOpenSettings, "<Control>comma");
                registerAppAction("open-about", onOpenAbout);
            }}
            menuModel={
                <Gio.GMenu items={menuSections} />
            }
        />
    );
}