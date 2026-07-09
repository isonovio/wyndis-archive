import { Temporal } from "$lib/utils/temporal";
import { type EntryBase } from "./timeline";
import { type Related, type RelatedRaw, relatedFromRaw } from "./related";
import { type ExternalLink } from "./externlink";
import { Genre } from "./timeline-genre";

type NewspieceRaw = {
    slug: string;
    title: string;
    date: string;
    related: RelatedRaw;
    links: ExternalLink[];
};

const newspiecesRaw = import.meta.glob<NewspieceRaw>("$data/twins/news/*.json", {
    eager: true,
});

export interface Newspiece extends EntryBase {
    genre: Genre.NEWSPIECE;
    related: Related;
    date: Temporal.PlainDate;

    slug: string;
    title: string;
    links: ExternalLink[];
}

export const allNewspieces: Newspiece[] = Object.values(newspiecesRaw).map(
    (v) => {
        return {
            ...v,
            genre: Genre.NEWSPIECE,
            date: Temporal.PlainDate.from(v.date),
            related: relatedFromRaw(v.related),
        };
    },
);

export function compareNewspiece(a: Newspiece, b: Newspiece): number {
    const dateCmp = Temporal.PlainDate.compare(a.date, b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.slug.localeCompare(b.slug);
}
