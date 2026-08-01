import {  AdwOverlaySplitView, AdwToolbarView, AdwHeaderBar } from "@gtkx/jsx/adw";
import {HDSentinelRoot, PhysicalDiskInformation} from "../models/hdsentinel.model.js";
import {useEffect, useState} from "react";
import ScrollSideBar from "./ScrollSideBar.js";
import DriveContentView from "./DriveContent/DriveContentView.js";

type MainComponentProps = {
    hdSentinelDump: HDSentinelRoot | undefined
    setTitleString: (titleString: string) => void
}

export default function MainComponent({ hdSentinelDump, setTitleString }:MainComponentProps){

    const [selected_Physical_Disk_Information, set_Selected_Physical_Disk_Information] = useState<PhysicalDiskInformation | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information[0]);

    useEffect(() => {
        setTitleString(selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID || "");
    }, [selected_Physical_Disk_Information]);

    return (
        <AdwOverlaySplitView
            sidebar={
                <AdwToolbarView topBar={<AdwHeaderBar showTitle={true}/>}>
                    <ScrollSideBar
                        hdSentinelDump={hdSentinelDump}
                        selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                        set_Selected_Physical_Disk_Information={set_Selected_Physical_Disk_Information}
                    />
                </AdwToolbarView>
            }
            content={
            <AdwToolbarView topBar={<AdwHeaderBar />}>
                <DriveContentView
                    selected_Physical_Disk_Information={selected_Physical_Disk_Information}
                />
            </AdwToolbarView>
            }
        />
    )
}