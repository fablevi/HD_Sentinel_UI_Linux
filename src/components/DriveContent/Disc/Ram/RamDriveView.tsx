import {MemoryDevice} from "../../../../models/ram.model.js";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw from "@gtkx/jsx/adw";
import ActionRow from "../../Components/ActionRow.js";
import {useTranslation} from "../../../Languages/useTranslation.js";
import {uiTextType} from "../../../Languages/language.model.js";


type RamDriveViewProps = {
    selected_RamInfo_by_Device: MemoryDevice | undefined;
}

export default function RamDriveView({selected_RamInfo_by_Device}:RamDriveViewProps){

    const { TEXT } = useTranslation();

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
                        <ActionRow title={selected_RamInfo_by_Device?.size || ""} subtitle={TEXT.ram.size+ ": "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.type || ""} subtitle={TEXT.ram.type+ ": "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.speed || ""} subtitle={TEXT.ram.speed + ": "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.memoryTechnology || ""} subtitle={TEXT.ram.memoryTechnology + ": "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.formFactor || ""} subtitle={TEXT.ram.formFactor + ": "}/>
                    </Adw.AdwPreferencesGroup>
                </Gtk.GtkBox>
                <Gtk.GtkBox marginTop={gtkBoxMargin / 4} marginBottom={gtkBoxMargin / 4}/>
                <Gtk.GtkBox hexpand={true} marginStart={gtkBoxMargin} marginEnd={gtkBoxMargin}>
                    <Adw.AdwPreferencesGroup  hexpand={true} marginBottom={gtkBoxMargin}>
                        <ActionRow title={selected_RamInfo_by_Device?.partNumber || ""} subtitle={TEXT.ram.partNumber + ": "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.configuredMemorySpeed || ""} subtitle={TEXT.ram.configuredMemorySpeed + ": "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.minimumVoltage || ""} subtitle={TEXT.ram.minimumVoltage + ": "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.maximumVoltage || ""} subtitle={TEXT.ram.maximumVoltage + ": "}/>
                        <ActionRow title={selected_RamInfo_by_Device?.configuredVoltage || ""} subtitle={TEXT.ram.configuredMemorySpeed + ": "}/>
                    </Adw.AdwPreferencesGroup>
                </Gtk.GtkBox>
            </Gtk.GtkBox>
        </Gtk.GtkScrolledWindow>
    </>)
}