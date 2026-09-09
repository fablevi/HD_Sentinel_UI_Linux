import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import { useRef } from "react";

type SettingsMenuButtonProps = {
    onOpenSettings: () => void;
    onOpenAbout?: () => void;
    onSelectOne?: () => void;
    onSelectTwo?: () => void;
};

export default function SettingsMenuButton({
    onOpenSettings,
    onOpenAbout,
    onSelectOne,
    onSelectTwo,
}: SettingsMenuButtonProps) {
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
                    <Gtk.GtkBox orientation={Gtk$.Orientation.VERTICAL} spacing={6} marginTop={6} marginBottom={6} marginStart={6} marginEnd={6}>
                        <Gtk.GtkButton
                            label="1"
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onSelectOne)}
                        />
                        <Gtk.GtkButton
                            label="2"
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onSelectTwo)}
                        />
                        <Gtk.GtkButton
                            label="Settings"
                            cssClasses={["flat"]}
                            focusable={false}
                            onClicked={() => handleAction(onOpenSettings)}
                        />
                        <Gtk.GtkButton
                            label="About"
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