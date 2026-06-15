<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { compareTeam, type Team } from "$lib/types/team";
    import { queryTeamFilter, type FilterState } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import CandidatesBox from "./CandidatesBox.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    function cycleTeam(teamSlug: string): void {
        const state = queryTeamFilter(params, teamSlug);
        if (state === "none") {
            params.append("team", teamSlug);
        } else if (state === "yes") {
            params.delete("team", teamSlug);
            params.append("team-not", teamSlug);
        } else {
            params.delete("team-not", teamSlug);
        }
        onUpdate();
    }

    const candidates = $derived([...new Set(timeline.flatMap((i) => i.related.teams))].toSorted(compareTeam));
    function getState(team: Team): FilterState {
        return queryTeamFilter(params, team.slug);
    }
    function getHandler(team: Team): () => void {
        return () => cycleTeam(team.slug);
    }
    function display(team: Team): string {
        return team.name;
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Teams">
        <CandidatesBox {candidates} {getState} {getHandler} {display} />
    </FilterBox>
{/if}
