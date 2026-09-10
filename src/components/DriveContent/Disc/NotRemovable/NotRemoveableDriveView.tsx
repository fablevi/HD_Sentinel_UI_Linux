import React, { useCallback } from "react";
import { PhysicalDiskInformation } from "../../../../models/hdsentinel.model.js";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw from "@gtkx/jsx/adw";
import { progressBarStyleDefault } from "../../../css/ProgressBarStyle.js";
import ActionRow from "../../Components/ActionRow.js";
import { useTranslation } from "../../../Languages/useTranslation.js";
import { DiskHistoryEntry } from "../../../MainComponent.js";

type NotRemoveableDriveViewProps = {
    selected_Physical_Disk_Information: PhysicalDiskInformation | undefined;
    selectedDiskHistory: DiskHistoryEntry[];
};

type TempUnit = "celsius" | "fahrenheit";

export const getTemperatureValue = (rawString: string | undefined, unit: TempUnit): string => {
    if (!rawString) return "0";
    const matches = rawString.match(/\d+/g);
    if (!matches) return "0";
    return unit === "celsius" ? (matches[0] ?? "0") : (matches[1] ?? "0");
};

export default function NotRemoveableDriveView({ 
    selected_Physical_Disk_Information, 
    selectedDiskHistory 
}: NotRemoveableDriveViewProps) {

    const { TEXT } = useTranslation();
    const gtkBoxMargin = 20;

    const allHistoryTemps = (selectedDiskHistory || []).map(d => d.temperature);
    const historyMaxTemp = allHistoryTemps.length > 0 ? Math.max(...allHistoryTemps) : 0;

    const onStatusGraphRef = useCallback((area: Gtk$.DrawingArea | null) => {
        if (!area) return;

        area.setDrawFunc((_area: any, cr: any, width: number, height: number) => {
            cr.setSourceRgba(0, 0, 0, 0);
            cr.paint();

            const data = (selectedDiskHistory || []).slice(-20);

            if (!data || data.length < 2) {
                cr.setSourceRgba(0.5, 0.5, 0.5, 0.5);
                cr.selectFontFace("Sans", 0, 0);
                cr.setFontSize(12);
                cr.moveTo(width / 2 - 50, height / 2);
                cr.showText(TEXT.disk.noData);
                return;
            }

            const paddingLeft = 45;
            const paddingRight = 20;
            const paddingTop = 30;
            const paddingBottom = 35;

            const graphWidth = width - paddingLeft - paddingRight;
            const graphHeight = height - paddingTop - paddingBottom;
            
            const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * graphWidth;
            const getY = (val: number) => height - paddingBottom - (val / 100) * graphHeight;

            cr.selectFontFace("Sans", 0, 0);
            cr.setFontSize(9);
            for (let i = 0; i <= 4; i++) {
                const ratio = i / 4;
                const y = height - paddingBottom - (graphHeight * ratio);
                const val = Math.round(ratio * 100);

                cr.setLineWidth(1);
                cr.setSourceRgba(0.5, 0.5, 0.5, 0.15);
                cr.moveTo(paddingLeft, y);
                cr.lineTo(width - paddingRight, y);
                cr.stroke();

                cr.setSourceRgba(0.6, 0.6, 0.6, 0.8);
                cr.moveTo(10, y + 3);
                cr.showText(`${val}%`);
            }

            const startTimeStr = new Date(data[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTimeStr = new Date(data[data.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            cr.setSourceRgba(0.6, 0.6, 0.6, 0.8);
            cr.moveTo(paddingLeft, height - 8);
            cr.showText(startTimeStr);
            cr.moveTo(width - paddingRight - 35, height - 8);
            cr.showText(endTimeStr);

            const drawLine = (getValue: (d: DiskHistoryEntry) => number, r: number, g: number, b: number) => {
                cr.setLineWidth(2);
                cr.setSourceRgb(r, g, b);
                data.forEach((pt, i) => {
                    const x = getX(i);
                    const y = getY(getValue(pt));
                    if (i === 0) cr.moveTo(x, y);
                    else cr.lineTo(x, y);
                });
                cr.stroke();

                data.forEach((pt, i) => {
                    const x = getX(i);
                    const y = getY(getValue(pt));
                    cr.arc(x, y, 2.5, 0, 2 * Math.PI);
                    cr.fill();
                });
            };

            drawLine(d => d.performance, 0.2, 0.5, 0.9);
            drawLine(d => d.health, 0.2, 0.7, 0.3);

            const legendX = width - paddingRight - 170;
            const drawLegendItem = (x: number, label: string, r: number, g: number, b: number) => {
                cr.setSourceRgb(r, g, b);
                cr.rectangle(x, 15 - 8, 10, 10);
                cr.fill();
                cr.setSourceRgba(0.8, 0.8, 0.8, 0.9);
                cr.setFontSize(10);
                cr.moveTo(x + 14, 15);
                cr.showText(label);
            };

            drawLegendItem(legendX, TEXT.disk.legendCondition, 0.2, 0.7, 0.3);
            drawLegendItem(legendX + 85, TEXT.disk.legendPerformance, 0.2, 0.5, 0.9);
        });
        
        area.queueDraw();
    }, [selectedDiskHistory, TEXT]);

    const onTempGraphRef = useCallback((area: Gtk$.DrawingArea | null) => {
        if (!area) return;

        area.setDrawFunc((_area: any, cr: any, width: number, height: number) => {
            cr.setSourceRgba(0, 0, 0, 0);
            cr.paint();

            const data = (selectedDiskHistory || []).slice(-20);

            if (!data || data.length < 2) {
                cr.setSourceRgba(0.5, 0.5, 0.5, 0.5);
                cr.selectFontFace("Sans", 0, 0);
                cr.setFontSize(12);
                cr.moveTo(width / 2 - 50, height / 2);
                cr.showText(TEXT.disk.noData);
                return;
            }

            const paddingLeft = 45;
            const paddingRight = 20;
            const paddingTop = 30;
            const paddingBottom = 35;

            const graphWidth = width - paddingLeft - paddingRight;
            const graphHeight = height - paddingTop - paddingBottom;

            const temps = data.map(d => d.temperature);
            
            const maxTemp = Math.max(historyMaxTemp + 5, 50);
            const minTemp = Math.max(Math.min(...temps) - 5, 0);

            const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * graphWidth;
            const getY = (val: number) => height - paddingBottom - ((val - minTemp) / (maxTemp - minTemp || 1)) * graphHeight;

            cr.selectFontFace("Sans", 0, 0);
            cr.setFontSize(9);
            for (let i = 0; i <= 4; i++) {
                const ratio = i / 4;
                const y = height - paddingBottom - (graphHeight * ratio);
                const val = Math.round(minTemp + (maxTemp - minTemp) * ratio);

                cr.setLineWidth(1);
                cr.setSourceRgba(0.5, 0.5, 0.5, 0.15);
                cr.moveTo(paddingLeft, y);
                cr.lineTo(width - paddingRight, y);
                cr.stroke();

                cr.setSourceRgba(0.6, 0.6, 0.6, 0.8);
                cr.moveTo(10, y + 3);
                cr.showText(`${val} °C`);
            }

            const startTimeStr = new Date(data[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTimeStr = new Date(data[data.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            cr.setSourceRgba(0.6, 0.6, 0.6, 0.8);
            cr.moveTo(paddingLeft, height - 8);
            cr.showText(startTimeStr);
            cr.moveTo(width - paddingRight - 35, height - 8);
            cr.showText(endTimeStr);

            if (historyMaxTemp > 0) {
                const maxTempY = getY(historyMaxTemp);
                cr.setLineWidth(1);
                cr.setSourceRgba(0.9, 0.2, 0.2, 0.6);
                cr.setDash([4, 4], 0);
                cr.moveTo(paddingLeft, maxTempY);
                cr.lineTo(width - paddingRight, maxTempY);
                cr.stroke();
                cr.setDash([], 0);

                cr.moveTo(paddingLeft + 5, maxTempY - 4);
                cr.showText(`${TEXT.disk.measuredMaxTemp}: ${historyMaxTemp} °C`);
            }

            cr.setLineWidth(2);
            cr.setSourceRgb(0.9, 0.2, 0.2);
            data.forEach((pt, i) => {
                const x = getX(i);
                const y = getY(pt.temperature);
                if (i === 0) cr.moveTo(x, y);
                else cr.lineTo(x, y);
            });
            cr.stroke();

            data.forEach((pt, i) => {
                const x = getX(i);
                const y = getY(pt.temperature);
                cr.arc(x, y, 2.5, 0, 2 * Math.PI);
                cr.fill();
            });

            const legendX = width - paddingRight - 90;
            cr.setSourceRgb(0.9, 0.2, 0.2);
            cr.rectangle(legendX, 15 - 8, 10, 10);
            cr.fill();
            cr.setSourceRgba(0.8, 0.8, 0.8, 0.9);
            cr.setFontSize(10);
            cr.moveTo(legendX + 14, 15);
            cr.showText(TEXT.disk.legendTemp);
        });
        
        area.queueDraw();
    }, [selectedDiskHistory, historyMaxTemp, TEXT]);

    return (
        <Gtk.GtkBox hexpand={true} orientation={Gtk$.Orientation.VERTICAL} marginStart={gtkBoxMargin} marginEnd={gtkBoxMargin}>
            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkBox orientation={Gtk$.Orientation.HORIZONTAL} valign={Gtk$.Align.CENTER}>
                        <Gtk.GtkLabel label={TEXT.disk.performance} xalign={0} marginBottom={5} marginStart={15} marginTop={5} marginEnd={5} widthRequest={100} />
                        <Gtk.GtkProgressBar
                            text={selected_Physical_Disk_Information?.Hard_Disk_Summary.Performance}
                            showText={true}
                            cssClasses={[progressBarStyleDefault]}
                            fraction={(parseFloat((selected_Physical_Disk_Information?.Hard_Disk_Summary.Performance || "0%").replace("%", "")) || 0) / 100}
                        />
                    </Gtk.GtkBox>
                </Adw.AdwActionRow>
                <Adw.AdwActionRow>
                    <Gtk.GtkBox orientation={Gtk$.Orientation.HORIZONTAL} valign={Gtk$.Align.CENTER}>
                        <Gtk.GtkLabel label={TEXT.disk.health} xalign={0} marginBottom={5} marginStart={15} marginTop={5} marginEnd={5} widthRequest={100} />
                        <Gtk.GtkProgressBar
                            text={selected_Physical_Disk_Information?.Hard_Disk_Summary.Health}
                            showText={true}
                            cssClasses={[progressBarStyleDefault]}
                            fraction={(parseFloat((selected_Physical_Disk_Information?.Hard_Disk_Summary.Health || "0%").replace("%", "")) || 0) / 100}
                        />
                    </Gtk.GtkBox>
                </Adw.AdwActionRow>
            </Adw.AdwPreferencesGroup>

            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <ActionRow
                    subtitle={TEXT.disk.currentTemp}
                    title={`${getTemperatureValue(selected_Physical_Disk_Information?.Hard_Disk_Summary.Current_Temperature, "celsius")} °C`}
                />
                <ActionRow
                    subtitle={TEXT.disk.maxTemp}
                    title={`${historyMaxTemp} °C`}
                />
            </Adw.AdwPreferencesGroup>

            {/* 1. Kondíció & Teljesítmény grafikon */}
            <Gtk.GtkLabel 
                label={TEXT.disk.statusHistoryTitle} 
                cssClasses={["subtitle", "dim-label"]}
                xalign={0}
                marginBottom={10}
                marginStart={10}
            />

            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkDrawingArea
                        ref={onStatusGraphRef}
                        heightRequest={180}
                        hexpand={true}
                    />
                </Adw.AdwActionRow>
            </Adw.AdwPreferencesGroup>

            {/* 2. Hőmérséklet grafikon */}
            <Gtk.GtkLabel 
                label={TEXT.disk.tempHistoryTitle} 
                cssClasses={["subtitle", "dim-label"]}
                xalign={0}
                marginBottom={10}
                marginStart={10}
            />

            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkDrawingArea
                        ref={onTempGraphRef}
                        heightRequest={180}
                        hexpand={true}
                    />
                </Adw.AdwActionRow>
            </Adw.AdwPreferencesGroup>

            {/* Mérési adatok táblázata */}
            <Gtk.GtkLabel 
                label={TEXT.disk.dataTableTitle} 
                cssClasses={["subtitle", "dim-label"]}
                xalign={0}
                marginBottom={10}
                marginStart={10}
            />

            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkBox 
                        orientation={Gtk$.Orientation.HORIZONTAL} 
                        hexpand={true}
                        marginBottom={10}
                        marginEnd={10}
                        marginStart={10}
                        marginTop={10}>
                        <Gtk.GtkLabel label={TEXT.disk.time} hexpand={true} xalign={0} cssClasses={["bold"]} />
                        <Gtk.GtkLabel label={TEXT.disk.temp} widthRequest={80} xalign={0.5} cssClasses={["bold"]} />
                        <Gtk.GtkLabel label={TEXT.disk.legendCondition} widthRequest={80} xalign={0.5} cssClasses={["bold"]} />
                        <Gtk.GtkLabel label={TEXT.disk.legendPerformance} widthRequest={90} xalign={0.5} cssClasses={["bold"]} />
                    </Gtk.GtkBox>
                </Adw.AdwActionRow>

                {selectedDiskHistory && selectedDiskHistory.length > 0 ? (
                    selectedDiskHistory.slice(-5).reverse().map((entry, idx) => {
                        const dateStr = new Date(entry.timestamp).toLocaleTimeString();
                        return (
                            <Adw.AdwActionRow key={idx}>
                                <Gtk.GtkBox 
                                    orientation={Gtk$.Orientation.HORIZONTAL} 
                                    hexpand={true}
                                    marginBottom={10}
                                    marginEnd={10}
                                    marginStart={10}
                                    marginTop={10}>
                                    <Gtk.GtkLabel label={dateStr} hexpand={true} xalign={0} cssClasses={["dim-label"]} />
                                    <Gtk.GtkLabel label={`${entry.temperature} °C`} widthRequest={80} xalign={0.5} />
                                    <Gtk.GtkLabel label={`${entry.health}%`} widthRequest={80} xalign={0.5} />
                                    <Gtk.GtkLabel label={`${entry.performance}%`} widthRequest={90} xalign={0.5} />
                                </Gtk.GtkBox>
                            </Adw.AdwActionRow>
                        );
                    })
                ) : (
                    <Adw.AdwActionRow>
                        <Gtk.GtkLabel label={TEXT.disk.noData} cssClasses={["dim-label"]} marginStart={10} />
                    </Adw.AdwActionRow>
                )}
            </Adw.AdwPreferencesGroup>

            <Gtk.GtkLabel 
                label={TEXT.disk.description} 
                cssClasses={["subtitle", "dim-label"]}
                xalign={0}
                marginBottom={10}
                marginStart={10}
            />

            <Adw.AdwPreferencesGroup hexpand={true} marginBottom={gtkBoxMargin}>
                <Adw.AdwActionRow>
                    <Gtk.GtkLabel
                        label={selected_Physical_Disk_Information?.Hard_Disk_Summary.Description || TEXT.disk.noData}
                        wrap={true}
                        selectable={true}
                        xalign={0}
                        cssClasses={["dim-label"]}
                        marginBottom={10}
                        marginEnd={10}
                        marginStart={10}
                        marginTop={10}
                        widthChars={25}       
                        maxWidthChars={25}     
                        naturalWrapMode={Gtk$.NaturalWrapMode.WORD}
                    />
                </Adw.AdwActionRow>
                {selected_Physical_Disk_Information?.Hard_Disk_Summary.Tip && (
                    <Adw.AdwActionRow>
                        <Gtk.GtkLabel
                            label={selected_Physical_Disk_Information.Hard_Disk_Summary.Tip}
                            wrap={true}
                            selectable={true}
                            xalign={0}
                            cssClasses={["dim-label"]}
                            marginBottom={10}
                            marginEnd={10}
                            marginStart={10}
                            marginTop={10}
                            widthChars={25}       
                            maxWidthChars={25}     
                            naturalWrapMode={Gtk$.NaturalWrapMode.WORD}
                        />
                    </Adw.AdwActionRow>
                )}
            </Adw.AdwPreferencesGroup>
        </Gtk.GtkBox>
    );
}