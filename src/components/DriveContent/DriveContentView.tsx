import { GtkBox } from "@gtkx/jsx/gtk";
import { Orientation } from "@gtkx/gi/gtk";
import {PartitionDetails, PhysicalDiskInformation} from "../../models/hdsentinel.model.js";
import NotRemoveableDriveView from "./NotRemoveableDriveView.js";
import RemoveableDriveView from "./RemoveableDriveView.js";

type DriveContentViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
    selected_Partition_Information: PartitionDetails | undefined;
    load_Drive_Window_Type: "Disk" | "Partition" | "Ram";
}

export default function DriveContentView({selected_Physical_Disk_Information, selected_Partition_Information, load_Drive_Window_Type}:DriveContentViewProps){

    return (
        <GtkBox
            orientation={Orientation.VERTICAL}
            hexpand={true}
            vexpand={true}>
            {load_Drive_Window_Type === "Disk" ?
                selected_Physical_Disk_Information?.SCSI_Information?.Removable === "Supported [1]"?
                    <NotRemoveableDriveView selected_Physical_Disk_Information={selected_Physical_Disk_Information}/>
                    :
                    <RemoveableDriveView selected_Physical_Disk_Information={selected_Physical_Disk_Information}/>
                :
                load_Drive_Window_Type === "Partition" ? <></> :
                    load_Drive_Window_Type === "Ram" ? <></> : <></>
             }
        </GtkBox>
    )
}

/* {selected_Physical_Disk_Information?.SCSI_Information?.Removable === "Supported [1]"?
                <NotRemoveableDriveView selected_Physical_Disk_Information={selected_Physical_Disk_Information}/>
                :
                <RemoveableDriveView selected_Physical_Disk_Information={selected_Physical_Disk_Information}/>
            }

*/
