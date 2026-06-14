import { Temporal } from "$lib/utils/temporal";
import { type ExternalLink } from "./externlink";

type PlayerRaw = {
    slug: string;
    nickname: string;
    name?: string;
    birthday?: string;
    nationality: string;
    tags?: string[];
    links?: ExternalLink[];
};

const playerBlob = import.meta.glob<PlayerRaw>("$data/**/players/*.json", {
    eager: true,
});

const playersRaw = Object.values(playerBlob) satisfies PlayerRaw[];

type PlayerTag = "twin" | "ninja" | "impact" | "coach";

export type Player = {
    slug: string;
    nickname: string;
    name?: string;
    birthday?: Temporal.PlainDate;
    nationality: string;
    tags: PlayerTag[];
    links: ExternalLink[];
};

function playerFromRaw(raw: PlayerRaw): Player {
    return {
        ...raw,
        birthday: raw.birthday
            ? Temporal.PlainDate.from(raw.birthday)
            : undefined,
        tags:
            raw.tags?.map((tag) => tag as PlayerTag satisfies PlayerTag) || [],
        links: raw.links || [],
    };
}

export const allPlayers: ReadonlyMap<string, Player> = new Map(
    playersRaw.map((raw) => [raw.slug, playerFromRaw(raw)]),
);

export function comparePlayer(a: Player, b: Player): number {
    return a.slug.localeCompare(b.slug);
}
