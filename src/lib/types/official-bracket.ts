import {
    type DateRangeRaw,
    type DateRange,
    dateRangeFromRaw,
} from "./daterange";
import type { ExternalLink } from "./externlink";
import {
    type LineupShorthandRaw,
    type Lineup,
    lineupShorthandFromRaw,
} from "./official-lineup";
import {
    type MatchRaw,
    type Match,
    matchFromRaw,
    type MatchContext,
} from "./official-match";
import { type CSEvent } from "./official-event";

export type BracketRaw = {
    slug: string;
    name: string;
    duration?: DateRangeRaw;
    links?: ExternalLink[];
    participants?: LineupShorthandRaw[];
    brackets?: BracketRaw[];
    matches?: MatchRaw[];
    note?: string;
    tags?: BracketTag[];
};

type BracketTag = "transparent" | "lan";

export type Bracket = {
    slug: string;
    name: string;
    duration?: DateRange;
    links: ExternalLink[];
    note?: string;
    event: CSEvent;
    parents: Bracket[];
    isTransparent: boolean;
};

export const processRawBracket = (
    raw: BracketRaw,
    ctx: MatchContext,
): [Bracket, Match[]] => {
    const linksFromParent =
        ctx.brackets.length > 0 && ctx.brackets.at(-1)!.isTransparent
            ? ctx.brackets.at(-1)!.links
            : [];
    const linksFromSelf = raw.links ?? [];
    const links = [...linksFromParent, ...linksFromSelf];

    const bracket: Bracket = {
        slug: raw.slug,
        name: raw.name,
        duration: raw.duration ? dateRangeFromRaw(raw.duration) : undefined,
        links,
        note: raw.note,
        event: ctx.event,
        parents: ctx.brackets,
        isTransparent: raw.tags ? raw.tags.includes("transparent") : false,
    };

    const newCtx: MatchContext = {
        event: ctx.event,
        brackets: [...ctx.brackets, bracket],
        lineupShorthands: new Map<string, Lineup>([
            ...ctx.lineupShorthands,
            ...(raw.participants ?? []).map(lineupShorthandFromRaw),
        ]),
    };

    if (raw.brackets && raw.matches) {
        throw new Error("Cannot have both brackets and matches");
    }
    if (raw.brackets) {
        const matches = raw.brackets
            .map((b) => processRawBracket(b, newCtx))
            .map(([child, ms]) => ms)
            .flat();
        return [bracket, matches];
    } else if (raw.matches) {
        const matches = raw.matches.map((m) => matchFromRaw(m, newCtx));
        return [bracket, matches];
    } else {
        return [bracket, []];
    }
};
