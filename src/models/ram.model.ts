export interface PhysicalMemoryArray {
    location?: string;
    use?: string;
    errorCorrectionType?: string;
    maximumCapacity?: string;
    errorInformationHandle?: string;
    numberOfDevices?: number;
}

export interface MemoryDevice {
    arrayHandle?: string;
    errorInformationHandle?: string;
    totalWidth?: string;
    dataWidth?: string;
    size?: string;
    formFactor?: string;
    set?: string;
    locator?: string;
    bankLocator?: string;
    type?: string;
    typeDetail?: string;
    speed?: string;
    manufacturer?: string;
    serialNumber?: string;
    assetTag?: string;
    partNumber?: string;
    rank?: string;
    configuredMemorySpeed?: string;
    minimumVoltage?: string;
    maximumVoltage?: string;
    configuredVoltage?: string;
    memoryTechnology?: string;
    memoryOperatingModeCapability?: string;
    firmwareVersion?: string;
    moduleManufacturerId?: string;
    moduleProductId?: string;
    memorySubsystemControllerManufacturerId?: string;
    memorySubsystemControllerProductId?: string;
    nonVolatileSize?: string;
    volatileSize?: string;
    cacheSize?: string;
    logicalSize?: string;
}

export interface RamInfo {
    smbiosVersion?: string;
    dmidecodeVersion?: string;
    arrayInfo?: PhysicalMemoryArray;
    devices: MemoryDevice[];
}