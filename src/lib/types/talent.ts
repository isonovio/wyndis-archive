import { Temporal } from "$lib/utils/temporal";
import { type ExternalLink } from "./externlink";

type TalentRaw = {
    slug: string;
    nickname: string;
    name?: string;
    birthday?: string;
    nationality?: string;
    links?: ExternalLink[];
};

const talentsBlob = import.meta.glob<TalentRaw>("$data/**/talents/*.json", {
    eager: true,
});

const talentsRaw = Object.values(talentsBlob) satisfies TalentRaw[];

export type TalentTag = "ninja";

export type Talent = {
    slug: string;
    nickname: string;
    name?: string;
    birthday?: Temporal.PlainDate;
    nationality?: string;
    links: ExternalLink[];
};

function talentFromRaw(raw: TalentRaw): Talent {
    return {
        ...raw,
        birthday: raw.birthday
            ? Temporal.PlainDate.from(raw.birthday)
            : undefined,
        links: raw.links ?? [],
    };
}

export const allTalents: ReadonlyMap<string, Talent> = new Map(
    talentsRaw.map((talent) => [talent.slug, talentFromRaw(talent)]),
);
