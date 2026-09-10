import { useEffect, useState } from "react";
import { localConfigStore, Measure } from "../../hooks/useLocalConfig.js";
import { HDSentinelRoot, PhysicalDiskInformation } from "../../models/hdsentinel.model.js";

type MeasureCollectorProps = {
    hdSentinelDump: HDSentinelRoot | undefined;
    selectedDisk: PhysicalDiskInformation | undefined;
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

export default function MeasureCollector({ hdSentinelDump, selectedDisk }: MeasureCollectorProps) {
    const [, setHistory] = useState<DiskHistoryEntry[]>([]);

    useEffect(() => {
        if (!selectedDisk) return;
        const serial = selectedDisk.Hard_Disk_Summary.Hard_Disk_Serial_Number;
        const currentMeasures: Measure = localConfigStore.getMeasure();
        setHistory(currentMeasures[serial] || []);
    }, [selectedDisk]);

    useEffect(() => {
        if (!hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information) return;

        localConfigStore.ensureFiles();

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

        if (selectedDisk) {
            const activeSerial = selectedDisk.Hard_Disk_Summary.Hard_Disk_Serial_Number;
            setHistory(currentMeasures[activeSerial] || []);
        }
    }, [hdSentinelDump, selectedDisk]);

    return null;
}