import { createRoot } from "@gtkx/react";
import { AdwApplication } from "@gtkx/jsx/adw";
import {localConfigStore, useLocalConfig} from "./hooks/useLocalConfig.js";
import { App } from "./components/DndConent/app.js";

const Init = () => {
    useLocalConfig();
    return <App />;
};

createRoot().render(
    <AdwApplication>
        <Init />
    </AdwApplication>
);
