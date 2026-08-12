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
};