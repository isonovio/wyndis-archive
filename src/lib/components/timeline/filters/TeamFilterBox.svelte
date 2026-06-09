<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { teamCompare, type Team } from "$lib/types/team";
    import { paramsFilterHasTeam } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import FilterItem from "./FilterItem.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const candidates = $derived([...new Set(timeline.flatMap((i) => i.related.teams))].toSorted(teamCompare));

    function toggleTeam(teamSlug: string): void {
        if (paramsFilterHasTeam(params, teamSlug)) {
            params.delete("team", teamSlug);
        } else {
            params.append("team", teamSlug);
        }
        onUpdate();
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Teams">
        {#each candidates as team}
            <FilterItem active={paramsFilterHasTeam(params, team.slug)} onclick={() => toggleTeam(team.slug)}>
                {team.name}
            </FilterItem>
        {/each}
    </FilterBox>
{/if}
