import { XMLParser } from "fast-xml-parser";

export const normalizeXmlDisks = (xml: string): string => {
    return xml.replace(
        /<(\/?)Physical_Disk_Information_Disk_\d+([^>]*)>/g,
        "<$1Physical_Disk_Information_Disk$2>"
    );
};

export const parseXmlToJson = (xml: string) => {
    const normalizedXml = normalizeXmlDisks(xml);

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        isArray: (name) => {
            const arrayTags = [
                "Physical_Disk_Information_Disk",
                "Attribute",
                "Partition"
            ];
            return arrayTags.includes(name);
        }
    });

    return parser.parse(normalizedXml);
};