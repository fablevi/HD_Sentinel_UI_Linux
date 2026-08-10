import { createRoot } from "@gtkx/react";
import { AdwApplication } from "@gtkx/jsx/adw";
import { App } from "./components/DndConent/app.js";

createRoot().render(
    <AdwApplication>
        <App />
    </AdwApplication>
);
