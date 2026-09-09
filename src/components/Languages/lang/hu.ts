import { uiTextType } from "../language.model.js";

export const hu: uiTextType = {
    settings: {
        title: "Beállítások",
        styleGroupTitle: "Stílus",
        appSchemeStyle: "Alkalmazás témája",
        languagesGroupTitle: "Nyelvek",
        language: "Nyelv"
    },
    about: {
        title: "Névjegy",
        comments: "A Hard Disk Sentinel modern Linux GTK4/Adwaita grafikus felhasználói felülete."
    },
    common: {
        close: "Bezárás",
        save: "Mentés",
        cancel: "Mégse",
        copied: "Vágólapra másolva!",
        openFolder: "Adatmappa megnyitása",
        clearCache: "Cache törlése",
        confirm: "Megerősítés",
        delete: "Törlés"
    },
    clearCacheDialog: {
        title: "Cache törlése?",
        body: "Biztosan törölni szeretnéd a gyorsítótárazott adatokat? A letöltött HDSentinel bináris is eltávolításra kerül."
    },
    ram: {
        size: "Méret",
        type: "Típus",
        speed: "Sebesség",
        memoryTechnology: "Memória technológia",
        formFactor: "Formátum (Form Factor)",
        partNumber: "Cikkszám:",
        configuredMemorySpeed: "Beállított sebesség",
        minimumVoltage: "Minimális feszültség",
        maximumVoltage: "Maximális feszültség",
        configuredVoltage: "Beállított feszültség"
    },
    disk: {
        tabDriveInfo: "Meghajtó infó",
        tabSmart: "S.M.A.R.T.",
        performance: "Teljesítmény:",
        health: "Kondíció:",
        currentTemp: "Jelenlegi hőmérséklet",
        maxTemp: "Maximális hőmérséklet az élettartam során",
        description: "Leírás",
        noData: "Nincs elérhető adat.",
        smartTitle: "S.M.A.R.T. Attribútumok",
        smartCount: "Összesen {count} attribútum található",
        noSmartTitle: "Nem érhető el S.M.A.R.T. adat",
        noSmartDescription: "Ez a meghajtó nem támogatja a S.M.A.R.T. funkciókat, vagy az adatok nem olvashatók ki.",
        value: "Érték",
        threshold: "Küszöb",
        summaryTitle: "Merevlemez áttekintés",
        propertiesTitle: "Tulajdonságok",
        scsiTitle: "SCSI információk",
        hardDiskNumber: "Merevlemez száma",
        hardDiskDevice: "Ezköz elérési út",
        interface: "Csatolófelület",
        hardDiskModelId: "Modell azonosító",
        firmwareRevision: "Firmware verzió",
        hardDiskSerialNumber: "Sorozatszám",
        totalSize: "Teljes kapacitás",
        vendorInformation: "Gyártói információ",
        status: "Állapot",
        version: "Verzió",
        deviceType: "Ezköz típusa",
        asc: "ASC kód",
        ascq: "ASCQ kód",
        bytesPerSector: "SzA/szektor (Bytes/Sector)",
        totalSectors: "Összes szektor",
        unformattedCapacity: "Formázatlan kapacitás",
        removable: "Cserélhető adathordozó",
        failurePrediction: "Meghibásodás-előrejelzés"
    },
    notFound: {
        errorTitle: "Hiba: A HDSentinel nem található!",
        downloadLink: "Töltsd le a HD Sentinelt az alábbi linkről, csomagold ki, majd húzd ide a fájlt.",
        invalidFile: "A bedobott elem nem érvényes fájl!",
        wrongFileName: 'Hibás fájl! A fájl neve "HDSentinel" kell legyen.',
        copyFailed: "Sikertelen fájlmásolás!"
    },
    runner: {
        errorTitle: "Sikertelen azonosítás",
        errorDescription: "Kattints az alábbi gombra az újrahitelesítéshez!",
        reauthenticate: "Újrahitelesítés"
    },
    partition: {
        title: "Partíciók",
        drive: "Meghajtó / Csatolási pont (clikk másoláshoz)",
        totalSpace: "Teljes tárhely",
        freeSpace: "Szabad tárhely",
        freeSpacePercent: "Szabad tárhely (%)",
        fileSystem: "Fájlrendszer",
        blockSize: "Blokkméret",
        filesCount: "Fájlok száma",
        noPartitions: "Nem találhatók partíciók."
    },
};