import {  AdwOverlaySplitView, AdwToolbarView, AdwHeaderBar } from "@gtkx/jsx/adw";
import  * as Gtk from "@gtkx/jsx/gtk"
import {HDSentinelRoot, PartitionDetails, PhysicalDiskInformation} from "../models/hdsentinel.model.js";
import {ReactNode, useEffect, useState} from "react";
import ScrollSideBar from "./SideBar/ScrollSideBar.js";
import DriveContentView from "./DriveContent/DriveContentView.js";
import {MemoryDevice, RamInfo} from "../models/ram.model.js";

type MainComponentProps = {
    hdSentinelDump: HDSentinelRoot | undefined
    ramData: RamInfo | undefined;
    setTitleString: (titleString: string) => void
    isSidebarOpen: boolean;
    setIsSidebarOpen:(isSidebarOpen:boolean)=>void;
    settingsButton: ReactNode
}

export default function MainComponent({ hdSentinelDump, setTitleString, ramData, isSidebarOpen, setIsSidebarOpen, settingsButton }:MainComponentProps){

    const [selected_Physical_Disk_Information, set_Selected_Physical_Disk_Information] = useState<PhysicalDiskInformation | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information[0]);
    const [selected_Partition_Information, set_Selected_Partition_Information] = useState<PartitionDetails | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Partition_Information.Partition[0]);
    const [selected_RamInfo_by_Device, set_Selected_RamInfo_by_Device] = useState<MemoryDevice | undefined>(ramData?.devices[0]);
    const [load_Drive_Window_Type, set_Load_Drive_Window_Type] = useState<"Disk"|"Partition"|"Ram">("Disk")

    useEffect(() => {
        if (load_Drive_Window_Type === "Disk"){
            setTitleString(selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID || "");
        }else if (load_Drive_Window_Type === "Partition"){
            setTitleString(selected_Partition_Information?.Disk || "");
        } else if (load_Drive_Window_Type === "Ram"){
            setTitleString(selected_RamInfo_by_Device?.bankLocator || "");
        }
    }, [selected_Physical_Disk_Information, selected_Partition_Information, selected_RamInfo_by_Device, load_Drive_Window_Type]);

    return (
        <AdwOverlaySplitView
            showSidebar={isSidebarOpen}
            sidebar={
                <AdwToolbarView topBar={
                    <AdwHeaderBar showTitle={isSidebarOpen}
                                  end={isSidebarOpen ? [
                                      <Gtk.GtkButton
                                          iconName="go-previous-symbolic"
                                          onClicked={() => setIsSidebarOpen(!isSidebarOpen)}
                                      />
                                  ]: []}
                    />
                }>
                    <ScrollSideBar
                        hdSentinelDump={hdSentinelDump}
                        ramData={ramData}
                        selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                        set_Selected_Physical_Disk_Information={set_Selected_Physical_Disk_Information}
                        selected_Partition_Information={selected_Partition_Information}
                        set_Selected_Partition_Information={set_Selected_Partition_Information}
                        selected_RamInfo_by_Device={selected_RamInfo_by_Device}
                        set_Selected_RamInfo_by_Device={set_Selected_RamInfo_by_Device}
                        load_Drive_Window_Type={load_Drive_Window_Type}
                        set_Load_Drive_Window_Type={set_Load_Drive_Window_Type}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </AdwToolbarView>
            }
            content={
            <AdwToolbarView topBar={<AdwHeaderBar showTitle={!isSidebarOpen}
                                                  start={!isSidebarOpen ? [
                                                      <Gtk.GtkButton
                                                          iconName="go-next-symbolic"
                                                          onClicked={() => setIsSidebarOpen(!isSidebarOpen)}
                                                      />
                                                  ]: []}
                                                  end={settingsButton}
            />}>
                <DriveContentView
                    selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                    selected_Partition_Information={selected_Partition_Information}
                    load_Drive_Window_Type={load_Drive_Window_Type}
                    selected_RamInfo_by_Device={selected_RamInfo_by_Device}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </AdwToolbarView>
            }
        />
    )
}