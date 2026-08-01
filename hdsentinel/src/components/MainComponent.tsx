import {  AdwOverlaySplitView, AdwToolbarView, AdwHeaderBar } from "@gtkx/jsx/adw";
import {HDSentinelRoot, PhysicalDiskInformation} from "../models/hdsentinel.model.js";
import {  useState} from "react";
import ScrollSideBar from "./ScrollSideBar.js";
import DriveContentView from "./DriveContent/DriveContentView.js";

type MainComponentProps = {
    hdSentinelDump: HDSentinelRoot | undefined
}

export default function MainComponent({ hdSentinelDump }:MainComponentProps){

    const [selected_Physical_Disk_Information, set_Selected_Physical_Disk_Information] = useState<PhysicalDiskInformation | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information[0]);

    return <>
        <AdwOverlaySplitView
            sidebar={
                <ScrollSideBar
                    hdSentinelDump={hdSentinelDump}
                    selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                    set_Selected_Physical_Disk_Information={set_Selected_Physical_Disk_Information}
                />
            }
            content={
                    <AdwToolbarView topBar={<AdwHeaderBar/>}>
                        <DriveContentView
                            selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                        />
                    </AdwToolbarView>
            }
        />
    </>
}