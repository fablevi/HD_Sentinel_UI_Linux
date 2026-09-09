export type languageType = "en" | "hu";
export const LANGUAGE_OPTIONS: languageType[] = ["en", "hu"];

export type uiTextType = {
    settings: {
        title: string;
        styleGroupTitle: string;
        appSchemeStyle: string;
        languagesGroupTitle: string;
        language: string;
    };
    common: {
        close: string;
        save: string;
        cancel: string;
    };
    ram: {
        size: string;
        type: string;
        speed: string;
        memoryTechnology: string;
        formFactor: string;
        partNumber: string;
        configuredMemorySpeed: string;
        minimumVoltage: string;
        maximumVoltage: string;
        configuredVoltage: string;
    };
    disk: {
        tabDriveInfo: string;
        tabSmart: string;
        performance: string;
        health: string;
        currentTemp: string;
        maxTemp: string;
        description: string;
        noData: string;
        smartTitle: string;
        smartCount: string;
        noSmartTitle: string;
        noSmartDescription: string;
        value: string;
        threshold: string;
        summaryTitle: string;
        propertiesTitle: string;
        scsiTitle: string;
        hardDiskNumber: string;
        hardDiskDevice: string;
        interface: string;
        hardDiskModelId: string;
        firmwareRevision: string;
        hardDiskSerialNumber: string;
        totalSize: string;
        vendorInformation: string;
        status: string;
        version: string;
        deviceType: string;
        asc: string;
        ascq: string;
        bytesPerSector: string;
        totalSectors: string;
        unformattedCapacity: string;
        removable: string;
        failurePrediction: string;
    };
    notFound: {
        errorTitle: string;
        downloadLink: string;
        invalidFile: string;
        wrongFileName: string;
        copyFailed: string;
    };
    runner: {
        errorTitle: string;
        errorDescription: string;
        reauthenticate: string;
    };
};