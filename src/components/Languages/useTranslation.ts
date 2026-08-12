import { useState, useEffect } from "react";
import { languageType, uiTextType } from "./language.model.js";
import { hu } from "./lang/hu.js";
import { en } from "./lang/en.js";
import {localConfigStore} from "../../hooks/useLocalConfig.js";

const translations: Record<languageType, uiTextType> = {
    hu,
    en
};

export function useTranslation(): { TEXT: uiTextType; currentLang: languageType } {
    const [currentLang, setCurrentLang] = useState<languageType>(
        () => (localConfigStore.getSettings().language as languageType) || "en"
    );

    useEffect(() => {
        const handleConfigChange = (evt: any) => {
            if (evt.type === "settings" || evt.type === "reload") {
                const newLang = (localConfigStore.getSettings().language as languageType) || "en";
                setCurrentLang(newLang);
            }
        };

        localConfigStore.on("change", handleConfigChange);

        return () => {
            localConfigStore.off("change", handleConfigChange);
        };
    }, []);

    const TEXT = translations[currentLang] || translations.en;

    return { TEXT, currentLang };
}