import { Temporal } from "$lib/utils/temporal";
import { type Entry } from "./timeline";
import { Genre } from "./timeline-genre";

export interface EntryFilter {
    filter(e: Entry): boolean;
}

export const filterEntries = (
    entries: Entry[],
    filters: EntryFilter,
): Entry[] => {
    return entries.filter((entry) => filters.filter(entry));
};

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

export class PlayerFilter implements EntryFilter {
    constructor(private playerSlug: string) {}

    filter(e: Entry): boolean {
        return e.related.players.some(
            (player) => player.slug === this.playerSlug,
        );
    }
}

export class TeamFilter implements EntryFilter {
    constructor(private teamSlug: string) {}

    filter(e: Entry): boolean {
        return e.related.teams.some((team) => team.slug === this.teamSlug);
    }
}

export const filterFromParams = (params: URLSearchParams): EntryFilter => {
    const genres = params
        .getAll("genre")
        .map((g) => g as Genre)
        .map((genre) => new GenreFilter(genre));
    const genreFilter = new OrFilter(genres);
    const players = params
        .getAll("player")
        .map((p) => p as string)
        .map((playerSlug) => new PlayerFilter(playerSlug));
    const playerFilter = new OrFilter(players);
    const teams = params
        .getAll("team")
        .map((t) => t as string)
        .map((teamSlug) => new TeamFilter(teamSlug));
    const teamFilter = new OrFilter(teams);
    const from = params.get("from");
    const fromDateFilter = from
        ? new DateFromFilter(Temporal.PlainDate.from(from))
        : undefined;
    const to = params.get("to");
    const toDateFilter = to
        ? new DateToFilter(Temporal.PlainDate.from(to))
        : undefined;
    const filters = [
        genreFilter,
        playerFilter,
        teamFilter,
        fromDateFilter,
        toDateFilter,
    ].filter((f) => f !== undefined);
    return new AndFilter(filters);
};

export const paramsFilterHasGenre = (
    params: URLSearchParams,
    genre: Genre,
): boolean => {
    return params.getAll("genre").includes(genre);
};

export const paramsFilterHasPlayer = (
    params: URLSearchParams,
    playerSlug: string,
): boolean => {
    return params.getAll("player").includes(playerSlug);
};

export const paramsFilterHasTeam = (
    params: URLSearchParams,
    teamSlug: string,
): boolean => {
    return params.getAll("team").includes(teamSlug);
};

export const paramsFilterHasFromDate = (params: URLSearchParams): boolean => {
    return params.get("from") !== null;
};

export const paramsFilterHasToDate = (params: URLSearchParams): boolean => {
    return params.get("to") !== null;
};
