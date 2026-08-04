import {GtkBox, GtkButton, GtkLabel, GtkScrolledWindow, GtkSeparator} from "@gtkx/jsx/gtk";
import {HDSentinelRoot, PartitionDetails, PhysicalDiskInformation} from "../models/hdsentinel.model.js";
import {Orientation, Align, PolicyType} from "@gtkx/gi/gtk";
import HDSentinelIcons from "./icons/HDSentinel.IconPack.js";
import {MemoryDevice, RamInfo} from "../models/ram.model.js";

type ScrollSideBarProps = {
    hdSentinelDump: HDSentinelRoot | undefined;
    ramData: RamInfo | undefined;
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
    set_Selected_Physical_Disk_Information: (selected_Physical_Disk_Information: PhysicalDiskInformation) => void;
    selected_Partition_Information: PartitionDetails | undefined;
    set_Selected_Partition_Information: (set_Selected_Partition_Information: PartitionDetails) => void
    selected_RamInfo_by_Device:MemoryDevice | undefined;
    set_Selected_RamInfo_by_Device: (selected_RamInfo_by_Device: MemoryDevice) => void;
    load_Drive_Window_Type: "Disk" | "Partition" | "Ram";
    set_Load_Drive_Window_Type: (load_Drive_Window_Type: "Disk" | "Partition" | "Ram") => void;

}

export default function ScrollSideBar({
                                          hdSentinelDump,
                                          ramData,
                                          selected_Physical_Disk_Information,
                                          set_Selected_Physical_Disk_Information,
                                          selected_Partition_Information,
                                          set_Selected_Partition_Information,
                                          selected_RamInfo_by_Device,
                                          set_Selected_RamInfo_by_Device,
                                          load_Drive_Window_Type,
                                          set_Load_Drive_Window_Type
                                      }: ScrollSideBarProps) {

    const iconSize = 64

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
                {hdSentinelDump?.Hard_Disk_Sentinel.Physical_Disk_Information.map((pdi: PhysicalDiskInformation, index: number) => {
                    const isChosen: boolean =(load_Drive_Window_Type === "Disk") && (selected_Physical_Disk_Information?.Hard_Disk_Summary.Hard_Disk_Model_ID === pdi.Hard_Disk_Summary.Hard_Disk_Model_ID);

                    return <GtkButton
                        key={index}
                        cssClasses={isChosen ? ["suggested-action"] : []}
                        onClicked={() => {
                            set_Load_Drive_Window_Type("Disk");
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
                                <GtkLabel label={_formatMBToGB(pdi.Hard_Disk_Summary.Total_Size) + " GB"}
                                          halign={Align.START} cssClasses={["caption"]}/>
                            </GtkBox>
                        </GtkBox>
                    </GtkButton>;
                })}

                <GtkSeparator marginTop={12} marginBottom={12}/>

                {hdSentinelDump?.Hard_Disk_Sentinel.Partition_Information.Partition.map((partition: PartitionDetails, index: number) =>{
                    const isChosen: boolean =(load_Drive_Window_Type === "Partition") && (selected_Partition_Information?.Drive === partition.Drive);

                    return <GtkButton
                        key={index}
                        cssClasses={isChosen ? ["suggested-action"] : []}
                        onClicked={() => {
                            set_Load_Drive_Window_Type("Partition");
                            set_Selected_Partition_Information(partition);
                        }}
                    >
                        <GtkBox orientation={Orientation.HORIZONTAL} spacing={8}>
                            <HDSentinelIcons name={"sata-default"} pixelSize={iconSize}/>
                            <GtkBox orientation={Orientation.VERTICAL} valign={Align.CENTER}>
                                <GtkLabel label={partition?.Disk} halign={Align.START}/>
                            </GtkBox>
                        </GtkBox>
                    </GtkButton>;
                })}

                <GtkSeparator marginTop={12} marginBottom={12}/>

                {ramData?.devices.map((device, index)=>{
                    const isChosen: boolean =(load_Drive_Window_Type === "Ram") && (selected_RamInfo_by_Device === device);

                    return <GtkButton
                        key={index}
                        cssClasses={isChosen ? ["suggested-action"] : []}
                        onClicked={() => {
                            set_Load_Drive_Window_Type("Ram");
                            set_Selected_RamInfo_by_Device(device);
                        }}
                    >
                        <GtkBox orientation={Orientation.HORIZONTAL} spacing={8}>
                            <HDSentinelIcons name={"ram-default"} pixelSize={iconSize}/>
                            <GtkBox orientation={Orientation.VERTICAL} valign={Align.CENTER}>
                                <GtkLabel label={device.bankLocator} halign={Align.START}/>
                            </GtkBox>
                        </GtkBox>
                    </GtkButton>;
                })}

            </GtkBox>
        </GtkScrolledWindow>
    )
}