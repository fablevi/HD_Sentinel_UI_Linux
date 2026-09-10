import { AdwOverlaySplitView, AdwToolbarView, AdwHeaderBar } from "@gtkx/jsx/adw";
import * as Gtk from "@gtkx/jsx/gtk";
import { HDSentinelRoot, PartitionDetails, PhysicalDiskInformation } from "../models/hdsentinel.model.js";
import { ReactNode, useEffect, useState } from "react";
import ScrollSideBar from "./SideBar/ScrollSideBar.js";
import DriveContentView from "./DriveContent/DriveContentView.js";
import { MemoryDevice, RamInfo } from "../models/ram.model.js";
import { localConfigStore, Measure } from "../hooks/useLocalConfig.js";

type MainComponentProps = {
    hdSentinelDump: HDSentinelRoot | undefined;
    ramData: RamInfo | undefined;
    setTitleString: (titleString: string) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isSidebarOpen: boolean) => void;
    settingsButton: ReactNode;
    currentWidth: number;
    selectedDiskHistory: DiskHistoryEntry[];
    setSelectedDiskHistory: (sdh: DiskHistoryEntry[])=>void
};

export type DiskHistoryEntry = {
    timestamp: string;
    temperature: number;
    health: number;
    performance: number;
};

const parseNumber = (val: string | undefined): number => {
    if (!val) return 0;
    const match = val.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

export default function MainComponent({ 
    hdSentinelDump, 
    setTitleString, 
    ramData, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    settingsButton,
    currentWidth,
    selectedDiskHistory,
    setSelectedDiskHistory
}: MainComponentProps) {

    const [selected_Physical_Disk_Information, set_Selected_Physical_Disk_Information] = useState<PhysicalDiskInformation | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information[0]);
    const [selected_Partition_Information, set_Selected_Partition_Information] = useState<PartitionDetails | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Partition_Information.Partition[0]);
    const [selected_RamInfo_by_Device, set_Selected_RamInfo_by_Device] = useState<MemoryDevice | undefined>(ramData?.devices[0]);
    const [load_Drive_Window_Type, set_Load_Drive_Window_Type] = useState<"Disk" | "Partition" | "Ram">("Disk");


    //useEffect(()=>{console.log(selectedDiskHistory)},[selectedDiskHistory])

    const isSmallWindow = currentWidth < 700;

    useEffect(() => {
        if (!selected_Physical_Disk_Information) return;

        const serial = selected_Physical_Disk_Information.Hard_Disk_Summary.Hard_Disk_Serial_Number;
        const currentMeasures: Measure = localConfigStore.getMeasure();
        
        setSelectedDiskHistory(currentMeasures[serial] || []);
    }, [selected_Physical_Disk_Information]);

    useEffect(() => {
        if (!hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information) return;

        const intervalSec = localConfigStore.getSettings().refreshInterval || 5;
        const intervalMs = intervalSec * 1000;

        const timer = setInterval(() => {
            const now = new Date().toISOString();
            const currentMeasures: Measure = { ...localConfigStore.getMeasure() };

            hdSentinelDump.Hard_Disk_Sentinel.Physical_Disk_Information.forEach((disk) => {
                const serial = disk.Hard_Disk_Summary.Hard_Disk_Serial_Number;
                if (!serial) return;

                const entry: DiskHistoryEntry = {
                    timestamp: now,
                    temperature: parseNumber(disk.Hard_Disk_Summary.Current_Temperature),
                    health: parseNumber(disk.Hard_Disk_Summary.Health),
                    performance: parseNumber(disk.Hard_Disk_Summary.Performance)
                };

                const existingEntries: DiskHistoryEntry[] = currentMeasures[serial] || [];
                currentMeasures[serial] = [...existingEntries, entry];
            });

            localConfigStore.setMeasure(currentMeasures);

            if (selected_Physical_Disk_Information) {
                const activeSerial = selected_Physical_Disk_Information.Hard_Disk_Summary.Hard_Disk_Serial_Number;
                setSelectedDiskHistory(currentMeasures[activeSerial] || []);
            }
        }, intervalMs);

        return () => clearInterval(timer);
    }, [hdSentinelDump, selected_Physical_Disk_Information]);

    useEffect(() => {
        if (load_Drive_Window_Type === "Disk") {
            setTitleString(selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID || "");
        } else if (load_Drive_Window_Type === "Partition") {
            setTitleString(selected_Partition_Information?.Disk || "");
        } else if (load_Drive_Window_Type === "Ram") {
            setTitleString(selected_RamInfo_by_Device?.bankLocator || "");
        }
        setIsSidebarOpen(false);
    }, [selected_Physical_Disk_Information, selected_Partition_Information, selected_RamInfo_by_Device, load_Drive_Window_Type]);

    return (
        <AdwOverlaySplitView
            showSidebar={isSmallWindow ? isSidebarOpen : true}
            collapsed={isSmallWindow}
            pinSidebar={!isSmallWindow}
            enableHideGesture={isSmallWindow}
            enableShowGesture={isSmallWindow}
            onNotifyShowSidebar={(value) => {
                if (isSmallWindow && value !== null && value !== isSidebarOpen) {
                    setIsSidebarOpen(value);
                }
            }}
            sidebar={
                <AdwToolbarView topBar={
                    <AdwHeaderBar 
                        showTitle={isSmallWindow ? isSidebarOpen : false}
                        end={isSmallWindow && isSidebarOpen ? [
                            <Gtk.GtkButton
                                key="close-sidebar-btn"
                                iconName="go-previous-symbolic"
                                onClicked={() => setIsSidebarOpen(false)}
                            />
                        ] : []}
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
                <AdwToolbarView topBar={
                    <AdwHeaderBar 
                        showTitle={isSmallWindow ? !isSidebarOpen : true}
                        start={isSmallWindow && !isSidebarOpen ? [
                            <Gtk.GtkButton
                                key="open-sidebar-btn"
                                iconName="go-next-symbolic"
                                onClicked={() => setIsSidebarOpen(true)}
                            />
                        ] : []}
                        end={settingsButton}
                    />
                }>
                    <DriveContentView
                        selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                        selected_Partition_Information={selected_Partition_Information}
                        load_Drive_Window_Type={load_Drive_Window_Type}
                        selected_RamInfo_by_Device={selected_RamInfo_by_Device}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        selectedDiskHistory={selectedDiskHistory}
                        setSelectedDiskHistory={setSelectedDiskHistory}
                    />
                </AdwToolbarView>
            }
        />
    );
}