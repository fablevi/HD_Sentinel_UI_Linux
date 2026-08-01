import { PhysicalDiskInformation } from "../../models/hdsentinel.model.js";
import { GtkCenterBox, GtkLabel } from  "@gtkx/jsx/gtk";


type NotRemoveableDriveViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
}

export default function NotRemoveableDriveView({selected_Physical_Disk_Information}:NotRemoveableDriveViewProps){
    return (<>
        <GtkCenterBox>
        </GtkCenterBox>
    </>)
}