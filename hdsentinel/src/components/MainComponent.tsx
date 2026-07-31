import { AdwStatusPage, AdwOverlaySplitView, AdwToolbarView, AdwHeaderBar, AdwApplicationWindow } from "@gtkx/jsx/adw";
import { GtkBox, GtkButton, GtkImage, GtkLabel } from "@gtkx/jsx/gtk";
import {HDSentinelRoot, PhysicalDiskInformation} from "../models/hdsentinel.model.js";
import { Orientation } from "@gtkx/gi/gtk";
import {useEffect, useMemo, useState} from "react";

import { Texture } from "@gtkx/gi/gdk";
import { File } from "@gtkx/gi/gio";
import { Bytes } from "@gtkx/gi/glib";

import LINUX_SYSTEM_DEFAULT_ICON from "../assets/png/linux_system_default.png";

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import * as console from "node:console";

type MainComponentProps = {
    hdSentinelDump: HDSentinelRoot | undefined
}

export default function MainComponent({ hdSentinelDump }:MainComponentProps){

    const [selected_Physical_Disk_Information, set_Selected_Physical_Disk_Information] = useState<PhysicalDiskInformation | undefined>(hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information[0]);

    const defaultIconTexture = useMemo(()=>{
        try{
            const iconPath = fs.existsSync(LINUX_SYSTEM_DEFAULT_ICON)
                ? LINUX_SYSTEM_DEFAULT_ICON
                : path.resolve(process.cwd(), LINUX_SYSTEM_DEFAULT_ICON.replace(/^\//, ""));

            console.log("iconPath: ",iconPath)

            const file = File.newForPath(iconPath);
            return Texture.newFromFile(file);
        }catch (error){
            console.log(error)
        }
    }, [])



    return <>
        <AdwOverlaySplitView
            sidebar={
                <GtkBox
                    orientation={Orientation.VERTICAL}
                    widthRequest={200}
                    spacing={3}
                    marginBottom={12}
                    marginTop={12}
                    marginEnd={12}
                    marginStart={12}
                >
                    {hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information.map((pdi:PhysicalDiskInformation, index:number )=> {

                        const isChosen :boolean = selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID === pdi.Hard_Disk_Summary.Hard_Disk_Model_ID;

                        return <GtkButton
                            key={index}
                            //label={pdi.Hard_Disk_Summary.Hard_Disk_Device}
                            cssClasses={isChosen ? ["suggested-action"] : []}
                            onClicked={()=>{
                                set_Selected_Physical_Disk_Information(pdi);
                            }}
                        >
                            <GtkBox orientation={Orientation.HORIZONTAL} spacing={8}>
                                <GtkLabel label={pdi.Hard_Disk_Summary.Hard_Disk_Device} />
                            </GtkBox>
                        </GtkButton>;
                    })}
                </GtkBox>
            }
            content={
                    <AdwToolbarView topBar={<AdwHeaderBar/>}>
                        <GtkBox
                            orientation={Orientation.VERTICAL}
                            hexpand={true}
                            vexpand={true}
                        >
                            <GtkImage
                                paintable={defaultIconTexture}
                                pixelSize={128}
                            />
                        </GtkBox>
                    </AdwToolbarView>
            }
        />
    </>
}

//                            <GtkImage paintable={img}/>