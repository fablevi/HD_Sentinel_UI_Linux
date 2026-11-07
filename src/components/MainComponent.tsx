import { AdwOverlaySplitView, AdwToolbarView, AdwHeaderBar } from "@gtkx/jsx/adw";
import * as Gtk from "@gtkx/jsx/gtk";
import { HDSentinelRoot, PartitionDetails, PhysicalDiskInformation } from "../models/hdsentinel.model.js";
import { ReactNode, useEffect, useRef, useState } from "react";
import ScrollSideBar from "./SideBar/ScrollSideBar.js";
import DriveContentView from "./DriveContent/DriveContentView.js";
import { MemoryDevice, RamInfo } from "../models/ram.model.js";
import { localConfigStore, Measure, useLocalConfig } from "../hooks/useLocalConfig.js";

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

    // Load the settings so we can watch for refreshInterval changes
    const { settings } = useLocalConfig();

    const [selected_Physical_Disk_Information, set_Selected_Physical_Disk_Information] = useState<PhysicalDiskInformation | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information[0]);
    const [selected_Partition_Information, set_Selected_Partition_Information] = useState<PartitionDetails | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Partition_Information.Partition[0]);
    const [selected_RamInfo_by_Device, set_Selected_RamInfo_by_Device] = useState<MemoryDevice | undefined>(ramData?.devices[0]);
    const [load_Drive_Window_Type, set_Load_Drive_Window_Type] = useState<"Disk" | "Partition" | "Ram">("Disk");

    const isSmallWindow = currentWidth < 700;

    const hdSentinelDumpRef = useRef(hdSentinelDump);
    useEffect(() => {
        hdSentinelDumpRef.current = hdSentinelDump;
    }, [hdSentinelDump]);

    const selectedDiskRef = useRef(selected_Physical_Disk_Information);
    useEffect(() => {
        selectedDiskRef.current = selected_Physical_Disk_Information;
    }, [selected_Physical_Disk_Information]);

    const setSelectedDiskHistoryRef = useRef(setSelectedDiskHistory);
    useEffect(() => {
        setSelectedDiskHistoryRef.current = setSelectedDiskHistory;
    }, [setSelectedDiskHistory]);

    useEffect(() => {
        if (!selected_Physical_Disk_Information) return;

        const serial = selected_Physical_Disk_Information.Hard_Disk_Summary.Hard_Disk_Serial_Number;
        const currentMeasures: Measure = localConfigStore.getMeasure();
        
        setSelectedDiskHistory(currentMeasures[serial] || []);
    }, [selected_Physical_Disk_Information]);

    useEffect(() => {
        const intervalSettings = settings.refreshInterval;
        let intervalMs = 1000;

        if (intervalSettings === 2) {
            intervalMs = 500;   // Quick
        } else if (intervalSettings === 1) {
            intervalMs = 1000;  // Medium
        } else if (intervalSettings === 0) {
            intervalMs = 2000;  // Slow
        }
        console.log("[Timer] Active refresh interval ms:", intervalMs);

        const timer = setInterval(() => {
            const dump = hdSentinelDumpRef.current;
            if (!dump?.Hard_Disk_Sentinel.Physical_Disk_Information) return;

            const now = new Date().toISOString();
            const currentMeasures: Measure = { ...localConfigStore.getMeasure() };

            dump.Hard_Disk_Sentinel.Physical_Disk_Information.forEach((disk) => {
                const serial = disk.Hard_Disk_Summary.Hard_Disk_Serial_Number;
                if (!serial) return;

                const entry: DiskHistoryEntry = {
                    timestamp: now,
                    temperature: parseNumber(disk.Hard_Disk_Summary.Current_Temperature),
                    health: parseNumber(disk.Hard_Disk_Summary.Health),
                    performance: parseNumber(disk.Hard_Disk_Summary.Performance)
                };

                const existingEntries: DiskHistoryEntry[] = currentMeasures[serial] || [];
                // Every measurement is added, there is no FIFO removal!
                currentMeasures[serial] = [...existingEntries, entry];
            });

            localConfigStore.setMeasure(currentMeasures);

            const activeDisk = selectedDiskRef.current;
            if (activeDisk) {
                const activeSerial = activeDisk.Hard_Disk_Summary.Hard_Disk_Serial_Number;
                setSelectedDiskHistoryRef.current(currentMeasures[activeSerial] || []);
            }
        }, intervalMs);

        return () => clearInterval(timer);
    }, [settings.refreshInterval]); // <--- If the user changes it in the settings, the timer restarts immediately with the new speed!

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
        >
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
        </AdwOverlaySplitView>
    );
}