<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { Genre, compareGenre, displayGenre } from "$lib/types/timeline-genre";
    import { queryGenreFilter, type FilterState } from "$lib/types/timeline-filter";
    import FilterBox from "./FilterBox.svelte";
    import CandidatesBox from "./CandidatesBox.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    function cycleGenre(genre: Genre): void {
        const state = queryGenreFilter(params, genre);
        if (state === "none") {
            params.append("genre", genre);
        } else if (state === "yes") {
            params.delete("genre", genre);
            params.append("genre-not", genre);
        } else {
            params.delete("genre-not", genre);
        }
        onUpdate();
    }

    const candidates = $derived([...new Set(timeline.map((i) => i.genre))].toSorted(compareGenre));
    function getState(genre: Genre): FilterState {
        return queryGenreFilter(params, genre);
    }
    function getHandler(genre: Genre): () => void {
        return () => cycleGenre(genre);
    }
</script>

{#if candidates.length > 1}
    <FilterBox label="Genres">
        <CandidatesBox {candidates} {getState} {getHandler} display={displayGenre} compact={false} />
    </FilterBox>
{/if}
