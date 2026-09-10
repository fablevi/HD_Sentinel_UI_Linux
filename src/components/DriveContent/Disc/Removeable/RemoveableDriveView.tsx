import { PhysicalDiskInformation } from "../../../../models/hdsentinel.model.js";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gi from "@gtkx/gi/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw from "@gtkx/jsx/adw";
import { useEffect } from "react";
import { useTranslation } from "../../../Languages/useTranslation.js";
import { progressBarStyleDefault } from "../../../css/ProgressBarStyle.js";
import ActionRow from "../../Components/ActionRow.js";



type NotRemoveableDriveViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
}

export default function RemoveableDriveView({ selected_Physical_Disk_Information }: NotRemoveableDriveViewProps) {

    const { TEXT } = useTranslation();

    const gtkBoxMargin = 20;

    return (<>
        <Gtk.GtkBox hexpand={true} orientation={Gtk$.Orientation.VERTICAL} marginStart={gtkBoxMargin} marginEnd={gtkBoxMargin}>
            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <ActionRow subtitle={TEXT.disk.hardDiskModelId} title={selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID || ""} />
                <ActionRow subtitle={TEXT.disk.firmwareRevision} title={selected_Physical_Disk_Information?.Hard_Disk_Summary.Firmware_Revision || ""} />
                <ActionRow subtitle={TEXT.disk.hardDiskSerialNumber} title={selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Serial_Number || ""} />
                <ActionRow subtitle={TEXT.disk.totalSize} title={selected_Physical_Disk_Information?.Hard_Disk_Summary.Total_Size || ""} />
            </Adw.AdwPreferencesGroup>
            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <ActionRow subtitle={TEXT.disk.totalSectors} title={selected_Physical_Disk_Information?.Properties?.Total_Sectors?.toString() || ""} />
                <ActionRow subtitle={TEXT.disk.unformattedCapacity} title={selected_Physical_Disk_Information?.Properties?.Unformatted_Capacity?.toString() || ""} />
            </Adw.AdwPreferencesGroup>
        </Gtk.GtkBox>
    </>)
}