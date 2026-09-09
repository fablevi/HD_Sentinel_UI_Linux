import React from "react";
import * as Adw from "@gtkx/jsx/adw";
import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import { useTranslation } from "../Languages/useTranslation.js";

type ClearCacheDialogProps = {
    visible: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export default function ClearCacheDialog({
    visible,
    onConfirm,
    onClose,
}: ClearCacheDialogProps) {
    const { TEXT } = useTranslation();

    if (!visible) return null;

    return (
        <Adw.AdwDialog visible={visible}>
            <Adw.AdwToolbarView
                topBar={
                    <Adw.AdwHeaderBar
                    showStartTitleButtons={false}
                        showEndTitleButtons={false}
                        titleWidget={
                            <Adw.AdwWindowTitle title={TEXT.clearCacheDialog.title} />
                        }
                    />
                }
            >
                <Gtk.GtkBox
                    orientation={Gtk$.Orientation.VERTICAL}
                    spacing={16}
                    marginTop={16}
                    marginBottom={16}
                    marginStart={16}
                    marginEnd={16}
                    widthRequest={150}
                >
                    <Gtk.GtkLabel label={TEXT.clearCacheDialog.body} wrap={true} />

                    <Gtk.GtkBox
                        orientation={Gtk$.Orientation.HORIZONTAL}
                        spacing={12}
                        homogeneous={true}
                    >
                        <Gtk.GtkButton
                            label={TEXT.common.cancel}
                            onClicked={() => onClose()}
                        />
                        <Gtk.GtkButton
                            label={TEXT.common.delete}
                            cssClasses={["destructive-action"]}
                            onClicked={() => onConfirm()}
                        />
                    </Gtk.GtkBox>
                </Gtk.GtkBox>
            </Adw.AdwToolbarView>
        </Adw.AdwDialog>
    );
}