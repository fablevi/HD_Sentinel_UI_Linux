import React, { useState } from "react";
import { PhysicalDiskInformation } from "../../../../models/hdsentinel.model.js";

import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";

import NotRemoveableDriveView from "./NotRemoveableDriveView.js";
import SMARTView from "./SMARTView.js";
import { useTranslation } from "../../../Languages/useTranslation.js";

type TabulatedViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
};

export default function TabulatedView({ selected_Physical_Disk_Information }: TabulatedViewProps) {
    const { TEXT } = useTranslation();
    const [activeTab, setActiveTab] = useState<"drive_info" | "smart_info">("drive_info");

    return (
        <Gtk.GtkBox orientation={Gtk$.Orientation.VERTICAL} spacing={12} hexpand={true} vexpand={true}>

            <Gtk.GtkBox
                orientation={Gtk$.Orientation.HORIZONTAL}
                spacing={8}
                marginTop={10}
                marginStart={15}
                marginEnd={15}
            >
                <Gtk.GtkButton
                    label={TEXT.disk.tabDriveInfo}
                    iconName="drive-harddisk-symbolic"
                    cssClasses={activeTab === "drive_info" ? ["suggested-action"] : ["flat"]}
                    onClicked={() => setActiveTab("drive_info")}
                    widthRequest={150}
                />

                <Gtk.GtkButton
                    label={TEXT.disk.tabSmart}
                    iconName="utilities-system-monitor-symbolic"
                    cssClasses={activeTab === "smart_info" ? ["suggested-action"] : ["flat"]}
                    onClicked={() => setActiveTab("smart_info")}
                    widthRequest={150}
                />
            </Gtk.GtkBox>

            <Gtk.GtkSeparator orientation={Gtk$.Orientation.HORIZONTAL} />
            <Gtk.GtkScrolledWindow
                widthRequest={100}
                hscrollbarPolicy={Gtk$.PolicyType.NEVER}
                vscrollbarPolicy={Gtk$.PolicyType.AUTOMATIC}
                vexpand={true}
            >
                <Gtk.GtkBox hexpand={true} vexpand={true} marginStart={10} marginEnd={10}>
                    {activeTab === "drive_info" && (
                        <NotRemoveableDriveView
                            selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                        />
                    )}

                    {activeTab === "smart_info" && (
                        <SMARTView
                            selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                        />
                    )}
                </Gtk.GtkBox>
            </Gtk.GtkScrolledWindow>

        </Gtk.GtkBox>
    );
}