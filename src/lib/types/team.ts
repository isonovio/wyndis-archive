export type Team = {
    slug: string;
    name: string;
};

const teamsBlob = import.meta.glob<Team>("$data/twins/teams/*.json", {
    eager: true,
});

const teamsRaw = Object.values(teamsBlob) satisfies Team[];

export const allTeams: ReadonlyMap<string, Team> = new Map(
    teamsRaw.map((team) => [team.slug, team]),
);

export function compareTeam(a: Team, b: Team): number {
    return a.slug.localeCompare(b.slug);
}
