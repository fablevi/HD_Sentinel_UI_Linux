import { PhysicalDiskInformation } from "../../models/hdsentinel.model.js";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gi from "@gtkx/gi/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw from "@gtkx/jsx/adw";
import { progressBarStyleDefault } from "../css/ProgressBarStyle.js";
import ActionRow from "./Components/ActionRow.js";


type NotRemoveableDriveViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
}

type TempUnit = "celsius" | "fahrenheit";

export const getTemperatureValue = (rawString: string | undefined, unit: TempUnit): string => {
    if (!rawString) return "0";

    // Kiszedi az összes számsort a szövegből (pl: ["37", "99"])
    const matches = rawString.match(/\d+/g);
    if (!matches) return "0";

    return unit === "celsius" ? (matches[0] ?? "0") : (matches[1] ?? "0");
};

export default function RemoveableDriveView({ selected_Physical_Disk_Information }: NotRemoveableDriveViewProps) {

    const gtkBoxMargin = 20;

    return (
        <Gtk.GtkBox hexpand={true} orientation={Gtk$.Orientation.VERTICAL} marginStart={gtkBoxMargin} marginEnd={gtkBoxMargin}>
            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkBox orientation={Gtk$.Orientation.HORIZONTAL} valign={Gtk$.Align.CENTER}>
                        <Gtk.GtkLabel label={"Performance: "} xalign={0} marginBottom={5} marginStart={15} marginTop={5} marginEnd={5} widthRequest={100} />
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
                        <Gtk.GtkLabel label={"Health: "} xalign={0} marginBottom={5} marginStart={15} marginTop={5} marginEnd={5} widthRequest={100} />
                        <Gtk.GtkProgressBar
                            text={selected_Physical_Disk_Information?.Hard_Disk_Summary.Health}
                            showText={true}
                            cssClasses={[progressBarStyleDefault]}
                            fraction={(parseFloat((selected_Physical_Disk_Information?.Hard_Disk_Summary.Health || "0%").replace("%", "")) || 0) / 100}
                        />
                    </Gtk.GtkBox>
                </Adw.AdwActionRow>
                <ActionRow
                    subtitle="Current Temperature"
                    title={`${getTemperatureValue(selected_Physical_Disk_Information?.Hard_Disk_Summary.Current_Temperature, "celsius")} °C`}
                />
                <ActionRow
                    subtitle="Maximum temperature during entire lifespan"
                    title={`${getTemperatureValue(selected_Physical_Disk_Information?.Hard_Disk_Summary.Maximum_temperature_during_entire_lifespan, "celsius")} °C`}
                />
            </Adw.AdwPreferencesGroup>
            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkLabel
                        label={selected_Physical_Disk_Information?.Hard_Disk_Summary.Description || ""}
                        wrap={true}
                        selectable={true}
                        xalign={0} // Balra igazítás
                        cssClasses={["dim-label"]} // Letiltott/szürkített megjelenéshez
                    />
                </Adw.AdwActionRow>
                <Adw.AdwActionRow>
                    <Gtk.GtkEntry
                    marginBottom={10}
                    marginEnd={10}
                    marginStart={10}
                    marginTop={10}
                        text={selected_Physical_Disk_Information?.Hard_Disk_Summary.Tip}
                        editable={false} 
                        sensitive={false} 
                        widthRequest={200}
                    />
                </Adw.AdwActionRow>
            </Adw.AdwPreferencesGroup>


        </Gtk.GtkBox>
    )
}