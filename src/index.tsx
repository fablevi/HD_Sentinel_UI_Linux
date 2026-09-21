import { createRoot } from "@gtkx/react";
import { AdwApplication } from "@gtkx/jsx/adw";
import {localConfigStore, useLocalConfig} from "./hooks/useLocalConfig.js";
import { App } from "./components/DndConent/app.js";
import { useEffect, useState } from "react";
import * as $Adw from "@gtkx/gi/adw"
import * as $Gtk from "@gtkx/gi/gtk"

const Init = () => {
    useLocalConfig();

    const [resetApp, setResetApp] = useState<boolean>(true);

    useEffect(()=>{
        if(!resetApp) setResetApp(true)
    },[resetApp])

    useEffect(()=>{
        console.log("Gtk major version: ", $Gtk.MAJOR_VERSION)
        console.log("Gtk minor version: ", $Gtk.MINOR_VERSION)
        console.log("Gtk micro version: ", $Gtk.MICRO_VERSION)
        console.log("Adwaita version: ", $Adw.VERSION_S)
    },[])

    if (resetApp) return <App setResetApp={setResetApp}/>;
};

createRoot().render(
    <AdwApplication>
        <Init />
    </AdwApplication>
);
