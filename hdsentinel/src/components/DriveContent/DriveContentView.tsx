import { GtkBox } from "@gtkx/jsx/gtk";
import { Orientation } from "@gtkx/gi/gtk";
import {PhysicalDiskInformation} from "../../models/hdsentinel.model.js";
import NotRemoveableDriveView from "./NotRemoveableDriveView.js";
import RemoveableDriveView from "./RemoveableDriveView.js";

type DriveContentViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
}

export default function DriveContentView({selected_Physical_Disk_Information}:DriveContentViewProps){

    return (
        <GtkBox
            orientation={Orientation.VERTICAL}
            hexpand={true}
            vexpand={true}>
            {selected_Physical_Disk_Information?.SCSI_Information?.Removable === "Supported [1]"?
                <NotRemoveableDriveView selected_Physical_Disk_Information={selected_Physical_Disk_Information}/>
                :
                <RemoveableDriveView selected_Physical_Disk_Information={selected_Physical_Disk_Information}/>
            }
        </GtkBox>
    )
}