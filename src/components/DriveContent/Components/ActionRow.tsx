import * as Gtk from "@gtkx/jsx/gtk";
import * as Gtk$ from "@gtkx/gi/gtk";
import * as Adw from "@gtkx/jsx/adw";

type ActionRowProps = {
    title: string;
    subtitle: string;
    flip?: boolean;
    onClick?: () => void;
};

export default function ActionRow({ title, subtitle, flip = false, onClick }: ActionRowProps) {
    return (
        <Adw.AdwActionRow 
            activatable={!!onClick} 
            onActivated={() => onClick?.()}
        >
            <Gtk.GtkBox orientation={Gtk$.Orientation.VERTICAL} valign={Gtk$.Align.CENTER}>
                {flip ? (
                    <>
                        <Gtk.GtkLabel label={title} xalign={0} marginBottom={10} marginStart={10} marginEnd={10} />
                        <Gtk.GtkLabel label={subtitle} cssClasses={["subtitle", "dim-label"]} xalign={0} marginBottom={5} marginTop={10} marginStart={10} marginEnd={10} />
                    </>
                ) : (
                    <>
                        <Gtk.GtkLabel label={subtitle} cssClasses={["subtitle", "dim-label"]} xalign={0} marginBottom={5} marginTop={10} marginStart={10} marginEnd={10} />
                        <Gtk.GtkLabel label={title} xalign={0} marginBottom={10} marginStart={10} marginEnd={10} />
                    </>
                )}
            </Gtk.GtkBox>
        </Adw.AdwActionRow>
    );
}