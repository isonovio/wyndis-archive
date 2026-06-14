import { Temporal } from "$lib/utils/temporal";
import { type Entry } from "./timeline";
import { Genre } from "./timeline-genre";

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

export function applyFilter(entries: Entry[], filter: EntryFilter): Entry[] {
    return entries.filter((entry) => filter.filter(entry));
}

export function filterFromParams(params: URLSearchParams): EntryFilter {
    const genres = params
        .getAll("genre")
        .map((genre) => new GenreFilter(genre as Genre));
    const genreFilter = new OrFilter(genres);
    const notGenres = params
        .getAll("genre-not")
        .map((genre) => new NotFilter(new GenreFilter(genre as Genre)));
    const players = params
        .getAll("player")
        .map((slug) => new PlayerFilter(slug));
    const playerFilter = new OrFilter(players);
    const notPlayers = params
        .getAll("player-not")
        .map((slug) => new NotFilter(new PlayerFilter(slug)));
    const teams = params.getAll("team").map((slug) => new TeamFilter(slug));
    const teamFilter = new OrFilter(teams);
    const notTeams = params
        .getAll("team-not")
        .map((slug) => new NotFilter(new TeamFilter(slug)));
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
        ...notGenres,
        playerFilter,
        ...notPlayers,
        teamFilter,
        ...notTeams,
        fromDateFilter,
        toDateFilter,
    ].filter((f) => f !== undefined);
    return new AndFilter(filters);
}

export type FilterState = "none" | "yes" | "no";

export function queryGenreFilter(
    params: URLSearchParams,
    genre: Genre,
): FilterState {
    if (params.getAll("genre").includes(genre)) return "yes";
    if (params.getAll("genre-not").includes(genre)) return "no";
    return "none";
}

export function queryPlayerFilter(
    params: URLSearchParams,
    playerSlug: string,
): FilterState {
    if (params.getAll("player").includes(playerSlug)) return "yes";
    if (params.getAll("player-not").includes(playerSlug)) return "no";
    return "none";
}

export function queryTeamFilter(
    params: URLSearchParams,
    teamSlug: string,
): FilterState {
    if (params.getAll("team").includes(teamSlug)) return "yes";
    if (params.getAll("team-not").includes(teamSlug)) return "no";
    return "none";
}

export function queryDateFilter(
    params: URLSearchParams,
    key: "from" | "to",
): boolean {
    return params.get(key) !== null;
}
