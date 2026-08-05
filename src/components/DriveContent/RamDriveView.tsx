import {MemoryDevice} from "../../models/ram.model.js";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw from "@gtkx/jsx/adw";
import ActionRow from "./Components/ActionRow.js";


type RamDriveViewProps = {
    selected_RamInfo_by_Device: MemoryDevice | undefined;
}

export default function RamDriveView({selected_RamInfo_by_Device}:RamDriveViewProps){

    const gtkBoxMargin = 20;

    return (<>
        <Gtk.GtkScrolledWindow
            widthRequest={220}
            hscrollbarPolicy={Gtk$.PolicyType.NEVER}
            vscrollbarPolicy={Gtk$.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <Gtk.GtkBox orientation={Gtk$.Orientation.VERTICAL}>
                <Gtk.GtkBox hexpand={true} marginStart={gtkBoxMargin} marginEnd={gtkBoxMargin}>
                    <Adw.AdwPreferencesGroup  hexpand={true}>
                        <ActionRow title={selected_RamInfo_by_Device?.size || ""} subtitle={"Size:"}/>
                        <ActionRow title={selected_RamInfo_by_Device?.type || ""} subtitle={"Type:"}/>
                        <ActionRow title={selected_RamInfo_by_Device?.speed || ""} subtitle={"Speed:"}/>
                        <ActionRow title={selected_RamInfo_by_Device?.memoryTechnology || ""} subtitle={"Memory Technology: "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.formFactor || ""} subtitle={"Form Factor:"}/>
                    </Adw.AdwPreferencesGroup>
                </Gtk.GtkBox>
                <Gtk.GtkBox marginTop={gtkBoxMargin / 4} marginBottom={gtkBoxMargin / 4}/>
                <Gtk.GtkBox hexpand={true} marginStart={gtkBoxMargin} marginEnd={gtkBoxMargin}>
                    <Adw.AdwPreferencesGroup  hexpand={true} marginBottom={gtkBoxMargin}>
                        <ActionRow title={selected_RamInfo_by_Device?.partNumber || ""} subtitle={"Part Number:"}/>
                        <ActionRow title={selected_RamInfo_by_Device?.configuredMemorySpeed || ""} subtitle={"Configured Memory Speed:"}/>
                        <ActionRow title={selected_RamInfo_by_Device?.minimumVoltage || ""} subtitle={"Minimum Voltage:"}/>
                        <ActionRow title={selected_RamInfo_by_Device?.maximumVoltage || ""} subtitle={"Maximum Voltage:"}/>
                        <ActionRow title={selected_RamInfo_by_Device?.configuredVoltage || ""} subtitle={"Configured Voltage: "}/>
                    </Adw.AdwPreferencesGroup>
                </Gtk.GtkBox>
            </Gtk.GtkBox>
        </Gtk.GtkScrolledWindow>
    </>)
}