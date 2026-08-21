import { PhysicalDiskInformation } from "../../../../models/hdsentinel.model.js";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";



type NotRemoveableDriveViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
}

export default function RemoveableDriveView({selected_Physical_Disk_Information}:NotRemoveableDriveViewProps){
    return (<>
        <Gtk.GtkCenterBox>
            
        </Gtk.GtkCenterBox>
    </>)
}