import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import { useRef } from "react";
import { useTranslation } from "../Languages/useTranslation.js";

type SettingsMenuButtonProps = {
    noClearCacheSettingsAvailable?: boolean
    onOpenSettings: () => void;
    onOpenAbout?: () => void;
    onSelectOpenFolder?: () => void;
    onClearCache?: () => void;
};

export default function SettingsMenuButton({
    noClearCacheSettingsAvailable= false,
    onOpenSettings,
    onOpenAbout,
    onSelectOpenFolder,
    onClearCache,
}: SettingsMenuButtonProps) {
    const { TEXT } = useTranslation();
    const popoverRef = useRef<Gtk$.Popover | null>(null);

    const handleAction = (callback?: () => void) => {
        popoverRef.current?.popdown();
        if (callback) callback();
    };

    return (
        <Gtk.GtkMenuButton
            iconName="settings-configure-symbolic"
            focusable={false}
            popover={
                <Gtk.GtkPopover ref={popoverRef} autohide={true}>
                    <Gtk.GtkBox orientation={Gtk$.Orientation.VERTICAL}>
                        <Gtk.GtkButton
                            label={TEXT.common.openFolder}
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onSelectOpenFolder)}
                        />
                        {!noClearCacheSettingsAvailable && <Gtk.GtkButton
                            label={TEXT.common.clearCache}
                            cssClasses={["flat", "error"]}
                            focusable={false}
                            onClicked={() => handleAction(onClearCache)}
                        />}
                        <Gtk.GtkButton
                            label={TEXT.settings.title}
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onOpenSettings)}
                        />
                        <Gtk.GtkButton
                            label={TEXT.about.title}
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onOpenAbout)}
                        />
                    </Gtk.GtkBox>
                </Gtk.GtkPopover>
            }
        />
    );
}