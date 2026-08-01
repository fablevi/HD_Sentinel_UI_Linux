import { GtkBox, GtkButton, GtkLabel, GtkScrolledWindow } from "@gtkx/jsx/gtk";
import { HDSentinelRoot, PhysicalDiskInformation} from "../models/hdsentinel.model.js";
import { Orientation, Align, PolicyType } from "@gtkx/gi/gtk";
import HDSentinelIcons from "./icons/HDSentinel.IconPack.js";

type ScrollSideBarProps = {
    hdSentinelDump: HDSentinelRoot | undefined;
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
    set_Selected_Physical_Disk_Information: (selected_Physical_Disk_Information: PhysicalDiskInformation) => void;
}

export default function ScrollSideBar({ hdSentinelDump, selected_Physical_Disk_Information,set_Selected_Physical_Disk_Information }:ScrollSideBarProps){

    function _formatMBToGB(mbString: string | undefined): string {
        if (!mbString) return "";
        const mbValue = parseFloat(mbString);
        if (isNaN(mbValue)) return mbString;
        const gbValue = (mbValue / 1024).toFixed(1);
        return `${gbValue}`;
    }

    return (
        <GtkScrolledWindow
            widthRequest={220}
            hscrollbarPolicy={PolicyType.NEVER}
            vscrollbarPolicy={PolicyType.AUTOMATIC}
            vexpand={true}
        >
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
                    const iconSize = 64
                    const isChosen :boolean = selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID === pdi.Hard_Disk_Summary.Hard_Disk_Model_ID;

                    return <GtkButton
                        key={index}
                        cssClasses={isChosen ? ["suggested-action"] : []}
                        onClicked={()=>{
                            set_Selected_Physical_Disk_Information(pdi);
                        }}
                    >
                        <GtkBox orientation={Orientation.HORIZONTAL} spacing={8}>
                            {pdi?.SCSI_Information?.Removable === "Supported [1]" ?
                                <HDSentinelIcons name={"usb-default"} pixelSize={iconSize}/>
                                :
                                <HDSentinelIcons name={"linux-default"} pixelSize={iconSize}/>
                            }
                            <GtkBox orientation={Orientation.VERTICAL} valign={Align.CENTER}>
                                <GtkLabel label={pdi.Hard_Disk_Summary.Hard_Disk_Device} halign={Align.START}/>
                                <GtkLabel label={_formatMBToGB(pdi.Hard_Disk_Summary.Total_Size) + " GB"} halign={Align.START} cssClasses={["caption"]}/>
                            </GtkBox>
                        </GtkBox>
                    </GtkButton>;
                })}
            </GtkBox>
        </GtkScrolledWindow>
    )
}