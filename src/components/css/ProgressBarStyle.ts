import { css } from "@gtkx/css";

export const progressBarStyleDefault = css`
    max-width: 500px;
    min-width: 270px;
    margin-top: 10px;
    margin-bottom: 15px;
    margin-left: 10px;
    margin-right: 10px;

    trough, progress {
        min-height: 10px;
        border-radius: 6px;
    }
`;