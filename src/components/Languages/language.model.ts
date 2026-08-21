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