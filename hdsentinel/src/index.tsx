import { createRoot } from "@gtkx/react";
import { AdwApplication } from "@gtkx/jsx/adw";
import { App } from "./app.js";

createRoot().render(
    <AdwApplication>
        <App />
    </AdwApplication>
);
