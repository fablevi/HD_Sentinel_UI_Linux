import { GtkBox } from "@gtkx/jsx/gtk";
import { Orientation } from "@gtkx/gi/gtk";
import {PhysicalDiskInformation} from "../../models/hdsentinel.model.js";

type DriveContentViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
}

export default function DriveContentView({}:DriveContentViewProps){
    return (
        <GtkBox
            orientation={Orientation.VERTICAL}
            hexpand={true}
            vexpand={true}>

        </GtkBox>
    )
}