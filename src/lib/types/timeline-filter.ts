import { Temporal } from "$lib/utils/temporal";
import { type Entry } from "./timeline";
import { Genre } from "./timeline-genre";
import { type OmatchTag } from "./official-match";

export interface EntryFilter {
    filter(e: Entry): boolean;
}

export class AndFilter implements EntryFilter {
    constructor(private filters: EntryFilter[]) {}

    filter(e: Entry): boolean {
        return this.filters.length > 0
            ? this.filters.every((filter) => filter.filter(e))
            : true;
    }
}

export class OrFilter implements EntryFilter {
    constructor(private filters: EntryFilter[]) {}

    filter(e: Entry): boolean {
        return this.filters.length > 0
            ? this.filters.some((filter) => filter.filter(e))
            : true;
    }
}

export class NotFilter implements EntryFilter {
    constructor(private notfilter: EntryFilter) {}

    filter(e: Entry): boolean {
        return !this.notfilter.filter(e);
    }
}

export class DateFromFilter implements EntryFilter {
    constructor(private fromdate: Temporal.PlainDate) {}

    filter(e: Entry): boolean {
        return Temporal.PlainDate.compare(e.date, this.fromdate) >= 0;
    }
}

export class DateToFilter implements EntryFilter {
    constructor(private todate: Temporal.PlainDate) {}

    filter(e: Entry): boolean {
        return Temporal.PlainDate.compare(e.date, this.todate) <= 0;
    }
}

export class GenreFilter implements EntryFilter {
    constructor(private genre: Genre) {}

    filter(e: Entry): boolean {
        return e.genre === this.genre;
    }
}

export class RelatedSlugFilter implements EntryFilter {
    constructor(
        private key: "players" | "teams" | "events",
        private slug: string,
    ) {}

    filter(e: Entry): boolean {
        return e.related[this.key].some((item) => item.slug === this.slug);
    }
}

export class OmatchTagFilter implements EntryFilter {
    constructor(private tag: OmatchTag) {}

    filter(e: Entry): boolean {
        return e.genre === Genre.MATCH && e.tags.has(this.tag);
    }
}

export class YearFilter implements EntryFilter {
    constructor(private year: number) {}

    filter(e: Entry): boolean {
        return e.date.year === this.year;
    }
}

export function applyFilter(entries: Entry[], filter: EntryFilter): Entry[] {
    return entries.filter((entry) => filter.filter(entry));
}

const FILTER_PARAMS = [
    "from",
    "to",
    "year",
    "year-not",
    "genre",
    "genre-not",
    "match-tag",
    "match-tag-not",
    "team",
    "team-not",
    "player",
    "player-not",
    "event",
    "oevent-not",
] as const;

export function hasFilter(params: URLSearchParams): boolean {
    return FILTER_PARAMS.some((key) => params.has(key));
}

export function clearFilter(params: URLSearchParams): void {
    for (const key of FILTER_PARAMS) {
        params.delete(key);
    }
}

export function filterFromParams(params: URLSearchParams): EntryFilter {
    function buildGroup(
        key: string,
        factory: (raw: string) => EntryFilter,
    ): [EntryFilter, EntryFilter[]] {
        const yes = params.getAll(key).map(factory);
        const no = params
            .getAll(`${key}-not`)
            .map((v) => new NotFilter(factory(v)));
        return [new OrFilter(yes), no];
    }

    const from = params.get("from");
    const fromDateFilter = from
        ? new DateFromFilter(Temporal.PlainDate.from(from))
        : undefined;
    const to = params.get("to");
    const toDateFilter = to
        ? new DateToFilter(Temporal.PlainDate.from(to))
        : undefined;

    const [yearFilter, notYears] = buildGroup(
        "year",
        (y) => new YearFilter(Number(y)),
    );
    const [genreFilter, notGenres] = buildGroup(
        "genre",
        (g) => new GenreFilter(g as Genre),
    );
    const [matchTagFilter, notMatchTags] = buildGroup(
        "match-tag",
        (tag) => new OmatchTagFilter(tag as OmatchTag),
    );
    const [teamFilter, notTeams] = buildGroup(
        "team",
        (slug) => new RelatedSlugFilter("teams", slug),
    );
    const [playerFilter, notPlayers] = buildGroup(
        "player",
        (slug) => new RelatedSlugFilter("players", slug),
    );
    const [oeventFilter, notOevents] = buildGroup(
        "event",
        (slug) => new RelatedSlugFilter("events", slug),
    );

    const filters = [
        fromDateFilter,
        toDateFilter,
        yearFilter,
        ...notYears,
        genreFilter,
        ...notGenres,
        matchTagFilter,
        ...notMatchTags,
        teamFilter,
        ...notTeams,
        playerFilter,
        ...notPlayers,
        oeventFilter,
        ...notOevents,
    ].filter((f): f is EntryFilter => f !== undefined);

    return new AndFilter(filters);
}

export type FilterState = "disregard" | "include" | "exclude";

export function queryParamKey(
    params: URLSearchParams,
    key: string,
    value: string,
): FilterState {
    if (params.getAll(key).includes(value)) return "include";
    if (params.getAll(`${key}-not`).includes(value)) return "exclude";
    return "disregard";
}

export function setParamKey(
    params: URLSearchParams,
    key: string,
    value: string,
    state: FilterState,
): void {
    params.delete(key, value);
    params.delete(`${key}-not`, value);
    if (state === "include") params.append(key, value);
    else if (state === "exclude") params.append(`${key}-not`, value);
}

export function queryDateParam(
    params: URLSearchParams,
    key: "from" | "to",
): boolean {
    return params.get(key) !== null;
}
