import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Gdk$ from "@gtkx/gi/gdk";
import * as Adw from "@gtkx/jsx/adw";
import * as Adw$ from "@gtkx/gi/adw";
import * as GLib$ from "@gtkx/gi/glib";
import { useRef, useEffect, useState } from "react";
import { PartitionDetails } from "../../../../models/hdsentinel.model.js";
import { useTranslation } from "../../../Languages/useTranslation.js";
import ActionRow from "../../Components/ActionRow.js";

type DiskViewType = {
    selected_Partition_Information: PartitionDetails | undefined;
};

export default function DiskView({ selected_Partition_Information }: DiskViewType) {
    const { TEXT } = useTranslation();
    const overlayRef = useRef<Adw$.ToastOverlay | null>(null);
    const drawingAreaRef = useRef<Gtk$.DrawingArea | null>(null);
    const [animProgress, setAnimProgress] = useState<number>(0);
    const gtkBoxMargin = 20;

    const parsePercent = (percentStr: string | undefined): number => {
        if (!percentStr) return 0;
        const cleaned = percentStr.replace(/[^0-9.]/g, "");
        return parseFloat(cleaned) || 0;
    };

    const formatSpaceText = (spaceStr: string | undefined): string => {
        if (!spaceStr) return "";
        return spaceStr.replace(/,/g, " ");
    };

    const parseFileSystem = (fs: string | number | undefined): string => {
        if (!fs) return "";
        const fsStr = fs.toString().trim();
        if (/^\d+$/.test(fsStr)) {
            const num = parseInt(fsStr, 10);
            if (num === 2435016766 || num === 61267) return "ext4/ext3";
            if (num === 1698912358) return "Btrfs";
            if (num === 1395634258) return "NTFS";
            if (num === 61878) return "FAT32";
            return `Type: ${fsStr}`;
        }
        return fsStr;
    };

    const copyToClipboard = (text: string | undefined) => {
        if (!text) return;

        const display = Gdk$.Display.getDefault();
        const clipboard = display?.getClipboard();

        const encoder = new TextEncoder();
        const byteArray = Array.from(encoder.encode(text));

        const bytes = GLib$.Bytes.new(byteArray);
        const provider = Gdk$.ContentProvider.newForBytes("text/plain;charset=utf-8", bytes);

        clipboard?.setContent(provider);

        if (overlayRef.current) {
            const toast = Adw$.Toast.new(TEXT.common.copied);
            toast.setTimeout(2);
            overlayRef.current.addToast(toast);
        }
    };

    const freePercentNum = parsePercent(selected_Partition_Information?.Free_Space_Percent);
    const usedPercentNum = Math.max(0, Math.min(100, 100 - freePercentNum));
    const formattedTotalSpace = formatSpaceText(selected_Partition_Information?.Total_Space);
    const formattedFreeSpace = formatSpaceText(selected_Partition_Information?.Free_Space);
    const cleanedFileSystem = parseFileSystem(selected_Partition_Information?.FileSystem);

    useEffect(() => {
        if (!selected_Partition_Information || !drawingAreaRef.current) return;

        const widget = drawingAreaRef.current;
        setAnimProgress(0);

        const target = Adw$.CallbackAnimationTarget.new((value: number) => {
            setAnimProgress(value);
            widget.queueDraw();
        });

        const anim = Adw$.TimedAnimation.new(widget, 0, 1, 800, target);
        anim.setEasing(Adw$.Easing.EASE_OUT_CUBIC);
        anim.play();
    }, [selected_Partition_Information]);

    const drawPieChart = (_area: any, cr: any, width: number, height: number) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 6;

        const currentUsedPercent = usedPercentNum * animProgress;
        const usedAngle = (currentUsedPercent / 100) * 2 * Math.PI;

        cr.setLineWidth(2);

        if (usedPercentNum > 85) {
            cr.setSourceRgb(0.9, 0.2, 0.2); 
        } else {
            cr.setSourceRgb(0.2, 0.5, 0.9); 
        }
        cr.moveTo(centerX, centerY);
        cr.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + usedAngle);
        cr.closePath();
        cr.fill();

        cr.setSourceRgb(0.7, 0.7, 0.7);
        cr.moveTo(centerX, centerY);
        cr.arc(centerX, centerY, radius, -Math.PI / 2 + usedAngle, (3 * Math.PI) / 2);
        cr.closePath();
        cr.fill();

        cr.setSourceRgb(0.2, 0.2, 0.2);
        cr.moveTo(centerX, centerY);
        cr.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        cr.closePath();
        cr.fill();
    };

    return (
        <Gtk.GtkScrolledWindow
            widthRequest={100}
            hscrollbarPolicy={Gtk$.PolicyType.NEVER}
            vscrollbarPolicy={Gtk$.PolicyType.AUTOMATIC}
            vexpand={true}
        >
            <Adw.AdwToastOverlay ref={overlayRef} hexpand={true} vexpand={true}>
                <Gtk.GtkBox hexpand={true} orientation={Gtk$.Orientation.VERTICAL} marginStart={gtkBoxMargin} marginEnd={gtkBoxMargin}>
                    {selected_Partition_Information && (
                        <Gtk.GtkBox 
                            orientation={Gtk$.Orientation.VERTICAL} 
                            halign={Gtk$.Align.CENTER} 
                            valign={Gtk$.Align.CENTER}
                            marginTop={50}
                            marginBottom={30}
                        >
                            <Gtk.GtkDrawingArea
                                ref={drawingAreaRef}
                                contentWidth={196}
                                contentHeight={196}
                                drawFunc={drawPieChart}
                            />
                        </Gtk.GtkBox>
                    )}

                    {selected_Partition_Information && (
                        <Adw.AdwPreferencesGroup title={TEXT.partition.totalSpace} hexpand={true} marginBottom={gtkBoxMargin}>
                            <ActionRow 
                                subtitle={TEXT.partition.totalSpace} 
                                title={formattedTotalSpace} 
                                onClick={() => copyToClipboard(formattedTotalSpace)}
                            />
                            <ActionRow 
                                subtitle={TEXT.partition.freeSpace} 
                                title={`${formattedFreeSpace} (${freePercentNum}%)`} 
                                onClick={() => copyToClipboard(formattedFreeSpace)}
                            />
                        </Adw.AdwPreferencesGroup>
                    )}

                    <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                        <ActionRow
                            subtitle={TEXT.partition.drive}
                            title={selected_Partition_Information?.Drive || ""}
                            onClick={() => copyToClipboard(selected_Partition_Information?.Drive)}
                        />
                        <ActionRow
                            subtitle={TEXT.partition.fileSystem}
                            title={cleanedFileSystem}
                        />
                        <ActionRow
                            subtitle={TEXT.partition.filesCount}
                            title={selected_Partition_Information?.Files.toString() || ""}
                        />
                        <ActionRow
                            subtitle={TEXT.partition.blockSize}
                            title={selected_Partition_Information?.BlockSize.toString() || ""}
                        />
                        <ActionRow
                            subtitle={TEXT.disk.hardDiskDevice}
                            title={selected_Partition_Information?.Disk || ""}
                        />
                    </Adw.AdwPreferencesGroup>
                </Gtk.GtkBox>
            </Adw.AdwToastOverlay>
        </Gtk.GtkScrolledWindow>
    );
}