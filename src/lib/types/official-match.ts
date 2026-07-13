import { Temporal } from "$lib/utils/temporal";
import { type ExternalLink } from "./externlink";
import { type Lineup, type LineupRaw, lineupFromRaw } from "./official-lineup";
import {
    type Omap,
    type OmapRaw,
    omapFromRaw,
    sumOmapResults,
} from "./official-map";
import { type EntryBase } from "./timeline";
import { type Related } from "./related";
import { type Oevent } from "./official-event";
import { type Obracket } from "./official-bracket";
import { Outcome, outcomeFromResults } from "./official-outcome";
import { Genre } from "./timeline-genre";

export type OmatchRaw = {
    id: number;
    name?: string;
    date: string;
    lineups: {
        team1: LineupRaw;
        team2: LineupRaw;
    };
    links?: ExternalLink[];
    maps: OmapRaw[];
    news?: OmatchNewspieceRaw[];
    note?: string;
};

type OmatchNewspieceRaw = {
    title: string;
    links?: ExternalLink[];
};

export type OmatchTag = "esea" | "impact" | "lan";

export function displayOmatchTag(tag: OmatchTag): string {
    switch (tag) {
        case "esea":
            return "ESEA";
        case "impact":
            return "Impact";
        case "lan":
            return "LAN";
    }
}

export interface Omatch extends EntryBase {
    genre: Genre.MATCH;
    related: Related;
    date: Temporal.PlainDate;

    id: number;
    name: string;
    lineups: [Lineup, Lineup];
    links: ExternalLink[];
    results: [number, number];
    outcomes: [Outcome, Outcome];
    tags: Set<OmatchTag>;
    maps: Omap[];
    news: OmatchNewspiece[];
    note?: string;

    event: Oevent;
    brackets: Obracket[];
}

export type OmatchNewspiece = {
    title: string;
    links: ExternalLink[];
};

export type OmatchContext = {
    event: Oevent;
    brackets: Obracket[];
    tags: Set<OmatchTag>;
    lineupShorthands: ReadonlyMap<string, Lineup>;
};

export function omatchFromRaw(raw: OmatchRaw, ctx: OmatchContext): Omatch {
    const lineups: [Lineup, Lineup] = [
        lineupFromRaw(raw.lineups.team1, ctx.lineupShorthands),
        lineupFromRaw(raw.lineups.team2, ctx.lineupShorthands),
    ];

    const name = raw.name ?? `Match ${raw.id}`;

    const related: Related = {
        players: [
            ...lineups[0].players,
            ...lineups[1].players,
            ...(lineups[0].coach ? [lineups[0].coach] : []),
            ...(lineups[1].coach ? [lineups[1].coach] : []),
        ],
        teams: lineups.filter((l) => l.team !== undefined).map((l) => l.team!),
        events: [ctx.event],
    };

    const maps = raw.maps.map(omapFromRaw).toSorted((a, b) => a.id - b.id);
    const results = sumOmapResults(maps);
    const outcomes = outcomeFromResults(results);

    return {
        genre: Genre.MATCH,
        related,
        date: Temporal.PlainDate.from(raw.date),

        id: raw.id,
        name,
        lineups,
        links: raw.links ?? [],
        results,
        outcomes,
        tags: ctx.tags,
        maps,
        news: raw.news?.map(omatchNewspieceFromRaw) ?? [],
        note: raw.note,

        event: ctx.event,
        brackets: ctx.brackets,
    };
}

function omatchNewspieceFromRaw(raw: OmatchNewspieceRaw): OmatchNewspiece {
    return {
        title: raw.title,
        links: raw.links ?? [],
    };
}

export function compareOmatch(a: Omatch, b: Omatch): number {
    const dateCmp = Temporal.PlainDate.compare(a.date, b.date);
    if (dateCmp !== 0) return dateCmp;

    const eventCmp = a.event.slug.localeCompare(b.event.slug);
    if (eventCmp !== 0) return eventCmp;
    for (let i = 0; i < Math.min(a.brackets.length, b.brackets.length); i++) {
        const bracketCmp = a.brackets[i].slug.localeCompare(b.brackets[i].slug);
        if (bracketCmp !== 0) return bracketCmp;
    }
    return a.id - b.id;
}
