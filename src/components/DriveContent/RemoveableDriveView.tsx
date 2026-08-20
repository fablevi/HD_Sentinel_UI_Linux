import {PhysicalDiskInformation} from "../../models/hdsentinel.model.js";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gi from "@gtkx/gi/gtk";


type NotRemoveableDriveViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
}

export default function RemoveableDriveView( {selected_Physical_Disk_Information}:NotRemoveableDriveViewProps){
    return (<>
        <Gtk.GtkCenterBox
            startWidget={<Gtk.GtkLabel label={selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID} halign={Gi.Align.START}/>}
            centerWidget={<Gtk.GtkProgressBar/>}
        />
        <Gtk.GtkBox>
            <Gtk.GtkLabel label={"asd: "+selected_Physical_Disk_Information?.Hard_Disk_Summary.Current_Temperature}/>
        </Gtk.GtkBox>
        <Gtk.GtkBox>
            <Gtk.GtkLabel label={"asd: "+selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID}/>
        </Gtk.GtkBox>
    </>)
}