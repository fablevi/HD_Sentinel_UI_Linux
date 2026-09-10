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

// Segédfüggvény a szöveges értékek számmá alakítására (pl. "37 °C" -> 37, "99 %" -> 99)
const parseNumber = (val: string | undefined): number => {
    if (!val) return 0;
    const match = val.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

export default function MeasureCollector({ hdSentinelDump, selectedDisk }: MeasureCollectorProps) {
    const [history, setHistory] = useState<DiskHistoryEntry[]>([]);

    // 1. Első betöltéskor és a kijelölt lemez változásakor kinyerjük az eddigi adatokat a store-ból
    useEffect(() => {
        if (!selectedDisk) return;
        const serial = selectedDisk.Hard_Disk_Summary.Hard_Disk_Serial_Number;
        const currentMeasures: Measure = localConfigStore.getMeasure();
        
        const diskData = currentMeasures[serial] || [];
        setHistory(diskData);
    }, [selectedDisk]);

    // 2. Beállított időközönként elmentjük a háttértárak aktuális adatait
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
                // Hozzáfűzzük az új értéket
                currentMeasures[serial] = [...existingEntries, entry];
            });

            // Mentés a store-ba (és a fájlba)
            localConfigStore.setMeasure(currentMeasures);

            // Frissítjük a jelenleg kiválasztott lemez helyi állapotát is
            if (selectedDisk) {
                const activeSerial = selectedDisk.Hard_Disk_Summary.Hard_Disk_Serial_Number;
                setHistory(currentMeasures[activeSerial] || []);
            }
        }, intervalMs);

        return () => clearInterval(timer);
    }, [hdSentinelDump, selectedDisk]);

    return null; // Ez egy háttérben futó adatkezelő komponens, nem jelenít meg GUI-t
}