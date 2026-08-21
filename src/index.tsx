import { createRoot } from "@gtkx/react";
import { AdwApplication } from "@gtkx/jsx/adw";
import {localConfigStore, useLocalConfig} from "./hooks/useLocalConfig.js";
import { App } from "./components/DndConent/app.js";
import { useEffect, useState } from "react";

const Init = () => {
    useLocalConfig();

    const [resetApp, setResetApp] = useState<boolean>(true);

    useEffect(()=>{
        if(!resetApp) setResetApp(true)
    },[resetApp])

    if (resetApp) return <App setResetApp={setResetApp}/>;
};

createRoot().render(
    <AdwApplication>
        <Init />
    </AdwApplication>
);
