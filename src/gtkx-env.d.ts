/// <reference types="@gtkx/cli/env" />
/// <reference path="../node_modules/.gtkx/env.d.ts" />

declare namespace NodeJS {
    interface ProcessEnv {
        APP_VERSION?: string;
    }
}