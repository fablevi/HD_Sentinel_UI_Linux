import { RamInfo, PhysicalMemoryArray, MemoryDevice } from "../models/ram.model.js";

export const parseDmidecodeRam = (rawOutput: string): RamInfo => {
    const ramInfo: RamInfo = {
        devices: []
    };

    if (!rawOutput || typeof rawOutput !== "string") {
        return ramInfo;
    }

    const dmiVerMatch = rawOutput.match(/#\s*dmidecode\s*(.+)/i);
    if (dmiVerMatch) ramInfo.dmidecodeVersion = dmiVerMatch[1].trim();

    const smbiosVerMatch = rawOutput.match(/SMBIOS\s*(.+?)\s*present/i);
    if (smbiosVerMatch) ramInfo.smbiosVersion = smbiosVerMatch[1].trim();

    const getValue = (block: string, pattern: RegExp): string | undefined => {
        const match = block.match(pattern);
        return match ? match[1].trim() : undefined;
    };

    const blocks = rawOutput.split(/\n\s*\n/);

    for (const block of blocks) {
        if (block.includes("DMI type 16") || block.includes("Physical Memory Array")) {
            const numDevsStr = getValue(block, /Number Of Devices:\s*(.+)/i);

            const arrayData: PhysicalMemoryArray = {
                location: getValue(block, /Location:\s*(.+)/i),
                use: getValue(block, /Use:\s*(.+)/i),
                errorCorrectionType: getValue(block, /Error Correction Type:\s*(.+)/i),
                maximumCapacity: getValue(block, /Maximum Capacity:\s*(.+)/i),
                errorInformationHandle: getValue(block, /Error Information Handle:\s*(.+)/i),
                numberOfDevices: numDevsStr ? parseInt(numDevsStr, 10) : undefined
            };

            ramInfo.arrayInfo = arrayData;
        }

        if (block.includes("DMI type 17") || block.includes("Memory Device")) {
            const deviceData: MemoryDevice = {
                arrayHandle: getValue(block, /Array Handle:\s*(.+)/i),
                errorInformationHandle: getValue(block, /Error Information Handle:\s*(.+)/i),
                totalWidth: getValue(block, /Total Width:\s*(.+)/i),
                dataWidth: getValue(block, /Data Width:\s*(.+)/i),
                size: getValue(block, /Size:\s*(.+)/i),
                formFactor: getValue(block, /Form Factor:\s*(.+)/i),
                set: getValue(block, /Set:\s*(.+)/i),
                locator: getValue(block, /Locator:\s*(.+)/i),
                bankLocator: getValue(block, /Bank Locator:\s*(.+)/i),
                type: getValue(block, /Type:\s*(.+)/i),
                typeDetail: getValue(block, /Type Detail:\s*(.+)/i),
                speed: getValue(block, /Speed:\s*(.+)/i),
                manufacturer: getValue(block, /Manufacturer:\s*(.+)/i),
                serialNumber: getValue(block, /Serial Number:\s*(.+)/i),
                assetTag: getValue(block, /Asset Tag:\s*(.+)/i),
                partNumber: getValue(block, /Part Number:\s*(.+)/i),
                rank: getValue(block, /Rank:\s*(.+)/i),
                configuredMemorySpeed: getValue(block, /Configured Memory Speed:\s*(.+)/i),
                minimumVoltage: getValue(block, /Minimum Voltage:\s*(.+)/i),
                maximumVoltage: getValue(block, /Maximum Voltage:\s*(.+)/i),
                configuredVoltage: getValue(block, /Configured Voltage:\s*(.+)/i),
                memoryTechnology: getValue(block, /Memory Technology:\s*(.+)/i),
                memoryOperatingModeCapability: getValue(block, /Memory Operating Mode Capability:\s*(.+)/i),
                firmwareVersion: getValue(block, /Firmware Version:\s*(.+)/i),
                moduleManufacturerId: getValue(block, /Module Manufacturer ID:\s*(.+)/i),
                moduleProductId: getValue(block, /Module Product ID:\s*(.+)/i),
                memorySubsystemControllerManufacturerId: getValue(block, /Memory Subsystem Controller Manufacturer ID:\s*(.+)/i),
                memorySubsystemControllerProductId: getValue(block, /Memory Subsystem Controller Product ID:\s*(.+)/i),
                nonVolatileSize: getValue(block, /Non-Volatile Size:\s*(.+)/i),
                volatileSize: getValue(block, /Volatile Size:\s*(.+)/i),
                cacheSize: getValue(block, /Cache Size:\s*(.+)/i),
                logicalSize: getValue(block, /Logical Size:\s*(.+)/i)
            };

            ramInfo.devices.push(deviceData);
        }
    }

    return ramInfo;
};