import { Temporal } from "$lib/utils/temporal";
import { type ExternalLink } from "./externlink";
import { type LineupRaw, type Lineup, lineupFromRaw } from "./official-lineup";
import {
    type MatchMapRaw,
    type MatchMap,
    matchMapFromRaw,
    sumMapResults,
} from "./official-map";
import { type EntryBase } from "./timeline";
import { type Related } from "./related";
import { type CSEvent } from "./official-event";
import { type Bracket } from "./official-bracket";
import { type Outcome, outcomesFromResults } from "./official-outcome";
import { Genre } from "./timeline-genre";

export type MatchRaw = {
    id: number;
    date: string;
    lineups: {
        team1: LineupRaw;
        team2: LineupRaw;
    };
    links?: ExternalLink[];
    maps: MatchMapRaw[];
    note?: string;
};

export interface Match extends EntryBase {
    genre: Genre.MATCH;
    related: Related;
    date: Temporal.PlainDate;

    id: number;
    name: string;
    lineups: [Lineup, Lineup];
    links: ExternalLink[];
    results: [number, number];
    outcomes: [Outcome, Outcome];
    maps: MatchMap[];
    note?: string;

    event: CSEvent;
    brackets: Bracket[];
}

export type MatchContext = {
    event: CSEvent;
    brackets: Bracket[];
    lineupShorthands: ReadonlyMap<string, Lineup>;
};

export const matchFromRaw = (raw: MatchRaw, ctx: MatchContext): Match => {
    const lineups: [Lineup, Lineup] = [
        lineupFromRaw(raw.lineups.team1, ctx.lineupShorthands),
        lineupFromRaw(raw.lineups.team2, ctx.lineupShorthands),
    ];

    const name =
        ctx.brackets.length > 0 && ctx.brackets.at(-1)?.isTransparent
            ? ctx.brackets.at(-1)!.name
            : `M${raw.id}`;

    const related: Related = {
        players: [...lineups[0].players, ...lineups[1].players],
        teams: lineups
            .filter((lineup) => lineup.team !== undefined)
            .map((lineup) => lineup.team!),
        events: [ctx.event],
    };

    const maps = raw.maps
        .map((map) => matchMapFromRaw(map))
        .toSorted((a, b) => a.id - b.id);
    const results = sumMapResults(maps);
    const outcomes = outcomesFromResults(results);

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
        maps,
        note: raw.note,

        event: ctx.event,
        brackets: ctx.brackets,
    };
};

export const matchCompare = (a: Match, b: Match) => {
    const dateCmp = Temporal.PlainDate.compare(a.date, b.date);
    if (dateCmp !== 0) return dateCmp;
    const slugs = [];

    const eventCmp = a.event.slug.localeCompare(b.event.slug);
    if (eventCmp !== 0) return eventCmp;
    for (let i = 0; i < Math.min(a.brackets.length, b.brackets.length); i++) {
        const bracketCmp = a.brackets[i].slug.localeCompare(b.brackets[i].slug);
        if (bracketCmp !== 0) return bracketCmp;
    }
    return a.id - b.id;
};
