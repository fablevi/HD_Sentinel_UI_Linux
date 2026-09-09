import { uiTextType } from "../language.model.js";

export const en: uiTextType = {
    settings: {
        title: "Settings",
        styleGroupTitle: "Style",
        appSchemeStyle: "App scheme style",
        languagesGroupTitle: "Languages",
        language: "Language"
    },
    common: {
        close: "Close",
        save: "Save",
        cancel: "Cancel",
        copied: "Copied to clipboard!"
    },
    ram: {
        size: "Size",
        type: "Type",
        speed: "Speed",
        memoryTechnology: "Memory Technology",
        formFactor: "Form Factor",
        partNumber: "Part Number",
        configuredMemorySpeed: "Configured Memory Speed",
        minimumVoltage: "Minimum Voltage",
        maximumVoltage: "Maximum Voltage",
        configuredVoltage: "Configured Voltage"
    },
    disk: {
        tabDriveInfo: "Drive Info",
        tabSmart: "S.M.A.R.T.",
        performance: "Performance:",
        health: "Health:",
        currentTemp: "Current Temperature",
        maxTemp: "Maximum temperature during entire lifespan",
        description: "Description",
        noData: "No data available.",
        smartTitle: "S.M.A.R.T. Attributes",
        smartCount: "Total {count} attributes found",
        noSmartTitle: "S.M.A.R.T. Data Not Available",
        noSmartDescription: "This drive does not support S.M.A.R.T. features or the data cannot be retrieved.",
        value: "Value",
        threshold: "Threshold",
        summaryTitle: "Hard Disk Summary",
        propertiesTitle: "Properties",
        scsiTitle: "SCSI Information",
        hardDiskNumber: "Hard Disk Number",
        hardDiskDevice: "Hard Disk Device",
        interface: "Interface",
        hardDiskModelId: "Hard Disk Model ID",
        firmwareRevision: "Firmware Revision",
        hardDiskSerialNumber: "Hard Disk Serial Number",
        totalSize: "Total Size",
        vendorInformation: "Vendor Information",
        status: "Status",
        version: "Version",
        deviceType: "Device Type",
        asc: "ASC",
        ascq: "ASCQ",
        bytesPerSector: "Bytes Per Sector",
        totalSectors: "Total Sectors",
        unformattedCapacity: "Unformatted Capacity",
        removable: "Removable",
        failurePrediction: "Failure Prediction"
    },
    notFound: {
        errorTitle: "Error: HDSentinel not found!",
        downloadLink: "Download HD Sentinel from the link below, extract it, and drop it here.",
        invalidFile: "The dropped item is not a valid file!",
        wrongFileName: 'Invalid file! The file name must be "HDSentinel".',
        copyFailed: "Failed to copy file!"
    },
    runner: {
        errorTitle: "User not authenticated",
        errorDescription: "Click the button below to reauthenticate!",
        reauthenticate: "Reauthenticate"
    },
    partition: {
        title: "Partitions",
        drive: "Drive / Mount Point (click to copy)",
        totalSpace: "Total Space",
        freeSpace: "Free Space",
        freeSpacePercent: "Free Space (%)",
        fileSystem: "File System",
        blockSize: "Block Size",
        filesCount: "Total Files",
        noPartitions: "No partitions found."
    },
};