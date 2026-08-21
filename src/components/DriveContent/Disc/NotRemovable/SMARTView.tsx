import React from "react";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw from "@gtkx/jsx/adw";
import { PhysicalDiskInformation } from "../../../../models/hdsentinel.model.js";
import { useTranslation } from "../../../Languages/useTranslation.js";

type SMARTViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
};

export default function SMARTView({ selected_Physical_Disk_Information }: SMARTViewProps) {
    const { TEXT } = useTranslation();

    const smartAttributes = selected_Physical_Disk_Information?.["S.M.A.R.T."]?.Attribute || [];

    if (smartAttributes.length === 0) {
        return (
            <Gtk.GtkBox hexpand={true} vexpand={true} halign={Gtk$.Align.CENTER} valign={Gtk$.Align.CENTER}>
                <Adw.AdwStatusPage
                    iconName="dialog-warning-symbolic"
                    title={TEXT.disk.noSmartTitle}
                    description={TEXT.disk.noSmartDescription}
                />
            </Gtk.GtkBox>
        );
    }

    return (
        <Gtk.GtkScrolledWindow hexpand={true} vexpand={true}>
            <Gtk.GtkBox 
                orientation={Gtk$.Orientation.VERTICAL} 
                spacing={12} 
                marginTop={12} 
                marginBottom={12} 
                marginStart={16} 
                marginEnd={16}
            >
                <Adw.AdwPreferencesGroup 
                    title={TEXT.disk.smartTitle} 
                    description={TEXT.disk.smartCount.replace("{count}", smartAttributes.length.toString())}
                >
                    {smartAttributes.map((attr, index) => {
                        const subtitleText = attr.Threshold 
                            ? `${TEXT.disk.value}: ${attr.Value} (${TEXT.disk.threshold}: ${attr.Threshold})`
                            : `${TEXT.disk.value}: ${attr.Value}`;

                        return (
                            <Adw.AdwActionRow
                                key={`${attr.Name}-${index}`}
                                title={attr.Name}
                                subtitle={subtitleText}
                            />
                        );
                    })}
                </Adw.AdwPreferencesGroup>
            </Gtk.GtkBox>
        </Gtk.GtkScrolledWindow>
    );
}