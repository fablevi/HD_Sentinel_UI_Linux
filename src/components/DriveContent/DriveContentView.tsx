import { GtkBox } from "@gtkx/jsx/gtk";
import { Orientation } from "@gtkx/gi/gtk";
import { PartitionDetails, PhysicalDiskInformation } from "../../models/hdsentinel.model.js";
import RemoveableDriveView from "./Disc/Removeable/RemoveableDriveView.js";
import { MemoryDevice } from "../../models/ram.model.js";
import RamDriveView from "./Disc/Ram/RamDriveView.js";
import TabulatedView from "./Disc/NotRemovable/TabulatedView.js";
import DiskView from "./Disc/Disks/DiskView.js";
import { DiskHistoryEntry } from "../MainComponent.js";

type DriveContentViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
    selected_Partition_Information: PartitionDetails | undefined;
    selected_RamInfo_by_Device: MemoryDevice | undefined;
    load_Drive_Window_Type: "Disk" | "Partition" | "Ram";
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isSidebarOpen: boolean) => void;
    selectedDiskHistory: DiskHistoryEntry[];
    setSelectedDiskHistory: (sdh: DiskHistoryEntry[])=>void
}

export default function DriveContentView({
    selected_Physical_Disk_Information,
    selected_Partition_Information,
    selected_RamInfo_by_Device,
    load_Drive_Window_Type,
    isSidebarOpen,
    setIsSidebarOpen,
    selectedDiskHistory,
    setSelectedDiskHistory
}: DriveContentViewProps) {

    return (
        <GtkBox
            orientation={Orientation.VERTICAL}
            hexpand={true}
            vexpand={true}>
            {load_Drive_Window_Type === "Disk" ?
                selected_Physical_Disk_Information?.SCSI_Information?.Removable === "Supported [1]" ?
                    <RemoveableDriveView selected_Physical_Disk_Information={selected_Physical_Disk_Information} />
                    :
                    <TabulatedView selected_Physical_Disk_Information={selected_Physical_Disk_Information} 
                    selectedDiskHistory={selectedDiskHistory}
                   />
                :
            load_Drive_Window_Type === "Partition" ? 
                <DiskView selected_Partition_Information={selected_Partition_Information}/> 
                :
            load_Drive_Window_Type === "Ram" ?
                <RamDriveView selected_RamInfo_by_Device={selected_RamInfo_by_Device} /> :null
            }
        </GtkBox>
    )
}