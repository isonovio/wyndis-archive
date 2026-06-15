<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { comparePlayer } from "$lib/types/player";
    import { queryPlayerFilter } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import CandidatesBox from "./CandidatesBox.svelte";
    import type { FilterState } from "$lib/types/timeline-filter";
    import { type Player } from "$lib/types/player";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    function cyclePlayer(playerSlug: string): void {
        const state = queryPlayerFilter(params, playerSlug);
        if (state === "none") {
            params.append("player", playerSlug);
        } else if (state === "yes") {
            params.delete("player", playerSlug);
            params.append("player-not", playerSlug);
        } else {
            params.delete("player-not", playerSlug);
        }
        onUpdate();
    }

    const candidates = $derived([...new Set(timeline.flatMap((i) => i.related.players))].toSorted(comparePlayer));
    function getState(player: Player): FilterState {
        return queryPlayerFilter(params, player.slug);
    }
    function getHandler(player: Player): () => void {
        return () => cyclePlayer(player.slug);
    }
    function display(player: Player): string {
        return player.nickname;
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Players">
        <CandidatesBox {candidates} {getState} {getHandler} {display} />
    </FilterBox>
{/if}
