type TeamRaw = {
    slug: string;
    name: string;
};

const teamsBlob = import.meta.glob<TeamRaw>("$data/**/teams/*.json", {
    eager: true,
});

const teamsRaw = Object.values(teamsBlob) satisfies TeamRaw[];

export type Team = {
    slug: string;
    name: string;
};

const teamFromRaw = (raw: TeamRaw): Team => {
    return { ...raw };
};

export const allTeams: ReadonlyMap<string, Team> = new Map(
    teamsRaw.map((team) => [team.slug, teamFromRaw(team)]),
);

export const teamCompare = (a: Team, b: Team) => {
    return a.slug.localeCompare(b.slug);
};
