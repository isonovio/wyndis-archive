import { type Player, allPlayers } from "./player";
import { type Team, allTeams } from "./team";
import { allRosters } from "./roster";

export type LineupRaw = {
    name?: string;
    team?: string;
    roster?: string;
    players?: string[];
    coach?: string;
    shorthand?: string;
};

export type Lineup = {
    teamname: string;
    team?: Team;
    players: Player[];
    coach?: Player;
};

export type LineupShorthand = {
    shorthand: string;
    lineup: LineupRaw;
};

// precedence: shorthand > name = players > team > roster
export function lineupFromRaw(
    raw: LineupRaw,
    shorthands: ReadonlyMap<string, Lineup> = new Map(),
): Lineup {
    if (raw.shorthand) {
        return shorthands.get(raw.shorthand)!;
    }

    let teamname: string | undefined = undefined;
    let team: Team | undefined = undefined;
    let players: Player[] | undefined = undefined;
    let coach: Player | undefined = undefined;
    if (raw.roster) {
        const r = allRosters.get(raw.roster)!;
        team = r.team;
        teamname = r.team.name;
        players = r.players;
        coach = r.coach;
    }
    if (raw.players) {
        players = raw.players.map((id) => allPlayers.get(id)!);
    }
    if (raw.coach) {
        coach = allPlayers.get(raw.coach)!;
    }
    if (raw.team) {
        team = allTeams.get(raw.team)!;
        teamname = team.name;
    }
    if (raw.name) {
        teamname = raw.name;
    }
    return {
        teamname: teamname!,
        team: team,
        players: players ?? [],
        coach: coach,
    };
}

export function processLineupShorthand(raw: LineupShorthand): [string, Lineup] {
    return [raw.shorthand, lineupFromRaw(raw.lineup)];
}
