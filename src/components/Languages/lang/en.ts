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
        cancel: "Cancel"
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
        threshold: "Threshold"
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
    }
};