import React from "react";
import { PhysicalDiskInformation } from "../../../../models/hdsentinel.model.js";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gi from "@gtkx/gi/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw from "@gtkx/jsx/adw";
import { progressBarStyleDefault } from "../../../css/ProgressBarStyle.js";
import ActionRow from "../../Components/ActionRow.js";
import { useTranslation } from "../../../Languages/useTranslation.js";

type NotRemoveableDriveViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
};

type TempUnit = "celsius" | "fahrenheit";

export const getTemperatureValue = (rawString: string | undefined, unit: TempUnit): string => {
    if (!rawString) return "0";
    const matches = rawString.match(/\d+/g);
    if (!matches) return "0";
    return unit === "celsius" ? (matches[0] ?? "0") : (matches[1] ?? "0");
};

export default function NotRemoveableDriveView({ selected_Physical_Disk_Information }: NotRemoveableDriveViewProps) {

    const { TEXT } = useTranslation();

    const gtkBoxMargin = 20;

    return (
        <Gtk.GtkBox hexpand={true} orientation={Gtk$.Orientation.VERTICAL} marginStart={gtkBoxMargin} marginEnd={gtkBoxMargin}>
            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkBox orientation={Gtk$.Orientation.HORIZONTAL} valign={Gtk$.Align.CENTER}>
                        <Gtk.GtkLabel label={TEXT.disk.performance} xalign={0} marginBottom={5} marginStart={15} marginTop={5} marginEnd={5} widthRequest={100} />
                        <Gtk.GtkProgressBar
                            text={selected_Physical_Disk_Information?.Hard_Disk_Summary.Performance}
                            showText={true}
                            cssClasses={[progressBarStyleDefault]}
                            fraction={(parseFloat((selected_Physical_Disk_Information?.Hard_Disk_Summary.Performance || "0%").replace("%", "")) || 0) / 100}
                        />
                    </Gtk.GtkBox>
                </Adw.AdwActionRow>
                <Adw.AdwActionRow>
                    <Gtk.GtkBox orientation={Gtk$.Orientation.HORIZONTAL} valign={Gtk$.Align.CENTER}>
                        <Gtk.GtkLabel label={TEXT.disk.health} xalign={0} marginBottom={5} marginStart={15} marginTop={5} marginEnd={5} widthRequest={100} />
                        <Gtk.GtkProgressBar
                            text={selected_Physical_Disk_Information?.Hard_Disk_Summary.Health}
                            showText={true}
                            cssClasses={[progressBarStyleDefault]}
                            fraction={(parseFloat((selected_Physical_Disk_Information?.Hard_Disk_Summary.Health || "0%").replace("%", "")) || 0) / 100}
                        />
                    </Gtk.GtkBox>
                </Adw.AdwActionRow>
            </Adw.AdwPreferencesGroup>

            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <ActionRow
                    subtitle={TEXT.disk.currentTemp}
                    title={`${getTemperatureValue(selected_Physical_Disk_Information?.Hard_Disk_Summary.Current_Temperature, "celsius")} °C`}
                />
                <ActionRow
                    subtitle={TEXT.disk.maxTemp}
                    title={`${getTemperatureValue(selected_Physical_Disk_Information?.Hard_Disk_Summary.Maximum_temperature_during_entire_lifespan, "celsius")} °C`}
                />
            </Adw.AdwPreferencesGroup>

            <Gtk.GtkLabel 
                label={TEXT.disk.description} 
                cssClasses={["subtitle", "dim-label"]}
                xalign={0}
                marginBottom={10}
                marginStart={10}
            />

            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkLabel
                        label={selected_Physical_Disk_Information?.Hard_Disk_Summary.Description || TEXT.disk.noData}
                        wrap={true}
                        selectable={true}
                        xalign={0}
                        cssClasses={["dim-label"]}
                        marginBottom={10}
                        marginEnd={10}
                        marginStart={10}
                        marginTop={10}
                        widthChars={25}       
                        maxWidthChars={25}     
                        naturalWrapMode={Gtk$.NaturalWrapMode.WORD}
                    />
                </Adw.AdwActionRow>
                <Adw.AdwActionRow>
                   <Gtk.GtkLabel
                        label={selected_Physical_Disk_Information?.Hard_Disk_Summary.Tip || ""}
                        wrap={true}
                        selectable={true}
                        xalign={0}
                        cssClasses={["dim-label"]}
                        marginBottom={10}
                        marginEnd={10}
                        marginStart={10}
                        marginTop={10}
                        widthChars={25}       
                        maxWidthChars={25}     
                        naturalWrapMode={Gtk$.NaturalWrapMode.WORD}
                    />
                </Adw.AdwActionRow>
            </Adw.AdwPreferencesGroup>
        </Gtk.GtkBox>
    );
}