import {
    type Daterange,
    type DaterangeRaw,
    daterangeFromRaw,
} from "./daterange";
import { type Player, allPlayers } from "./player";
import { allTeams, type Team } from "./team";

type RosterRaw = {
    slug: string;
    team: string;
    players: string[];
    coach?: string;
    duration?: DaterangeRaw;
};

const rosterBlob = import.meta.glob<RosterRaw>("$data/**/rosters/*.json", {
    eager: true,
});

const rostersRaw = Object.values(rosterBlob) satisfies RosterRaw[];

export type Roster = {
    slug: string;
    team: Team;
    players: Player[];
    coach?: Player;
    duration?: Daterange;
};

export const allRosters: ReadonlyMap<string, Roster> = Object.values(rostersRaw)
    .map((v) => {
        return {
            ...v,
            team: allTeams.get(v.team)!,
            players: v.players.map((slug) => allPlayers.get(slug)!),
            coach: v.coach ? allPlayers.get(v.coach) : undefined,
            duration: v.duration ? daterangeFromRaw(v.duration) : undefined,
        };
    })
    .reduce((map, roster) => {
        map.set(roster.slug, roster);
        return map;
    }, new Map<string, Roster>());
