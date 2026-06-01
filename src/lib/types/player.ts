import { Temporal } from "$lib/utils/temporal";

type PlayerRaw = {
    slug: string;
    nickname: string;
    name?: string;
    birthday?: string;
    nationality: string;
    tags?: string[];
};

const playersBlob = import.meta.glob<PlayerRaw>("$data/**/players/*.json", {
    eager: true,
});

const playersRaw = Object.values(playersBlob) satisfies PlayerRaw[];

export type PlayerTag = "twin" | "ninja";

export type Player = {
    slug: string;
    nickname: string;
    name?: string;
    birthday?: Temporal.PlainDate;
    nationality: string;
    tags: PlayerTag[];
};

const playerFromRaw = (raw: PlayerRaw): Player => {
    return {
        ...raw,
        birthday: raw.birthday
            ? Temporal.PlainDate.from(raw.birthday)
            : undefined,
        tags:
            raw.tags?.map((tag) => tag as PlayerTag satisfies PlayerTag) || [],
    };
};

export const allPlayers: ReadonlyMap<string, Player> = new Map(
    playersRaw.map((raw) => [raw.slug, playerFromRaw(raw)]),
);

export const playerCompare = (a: Player, b: Player) => {
    return a.slug.localeCompare(b.slug);
};
