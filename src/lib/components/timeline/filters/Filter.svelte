<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import { Genre, compareGenre, displayGenre } from "$lib/types/timeline-genre";
    import { type Omatch, type OmatchTag, displayOmatchTag } from "$lib/types/official-match";
    import { compareTeam } from "$lib/types/team";
    import { comparePlayer } from "$lib/types/player";
    import { compareOevent } from "$lib/types/official-event";
    import { hasFilter, clearFilter } from "$lib/types/timeline-filter";
    import DateFilterBox from "./DateFilterBox.svelte";
    import CycleFilterBox from "./CycleFilterBox.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const isFiltered = $derived(hasFilter(params));

    function clear() {
        clearFilter(params);
        onUpdate();
    }
</script>

<div class="h-full w-48 pt-10">
    <div class="h-full w-48 hover:w-max overflow-y-scroll z-20 relative bg-white flex flex-col gap-4">
        <div class="flex justify-between">
            <div class="text-xl font-bold">Filters</div>
            {#if isFiltered}
                <button class="cursor-pointer text-base pt-1/2 hover:text-gray-400" onclick={clear}>[Clear]</button>
            {/if}
        </div>
        <DateFilterBox {params} {onUpdate} />
        <CycleFilterBox
            label="Year"
            {params}
            {timeline}
            {onUpdate}
            paramKey="year"
            getCandidates={(tl) => [...new Set(tl.map((i) => i.date.year))].toSorted((a, b) => b - a)}
            toParamValue={String}
            display={String}
        />
        <CycleFilterBox
            label="Genre"
            {params}
            {timeline}
            {onUpdate}
            paramKey="genre"
            getCandidates={(tl) => [...new Set(tl.map((i) => i.genre))].toSorted(compareGenre)}
            toParamValue={(genre) => genre}
            display={displayGenre}
            compact={false}
        />
        <CycleFilterBox
            label="Match Type"
            {params}
            {timeline}
            {onUpdate}
            paramKey="match-tag"
            getCandidates={(tl) => [...new Set(tl.filter((i): i is Omatch => i.genre === Genre.MATCH).flatMap((i) => [...i.tags]))].toSorted()}
            toParamValue={(tag) => tag}
            display={displayOmatchTag}
            compact={false}
        />
        <CycleFilterBox
            label="Team"
            {params}
            {timeline}
            {onUpdate}
            paramKey="team"
            getCandidates={(tl) => [...new Set(tl.flatMap((i) => i.related.teams))].toSorted(compareTeam)}
            toParamValue={(team) => team.slug}
            display={(team) => team.name}
        />
        <CycleFilterBox
            label="Player"
            {params}
            {timeline}
            {onUpdate}
            paramKey="player"
            getCandidates={(tl) => [...new Set(tl.flatMap((i) => i.related.players))].toSorted(comparePlayer)}
            toParamValue={(player) => player.slug}
            display={(player) => player.nickname}
        />
        <CycleFilterBox
            label="Event"
            {params}
            {timeline}
            {onUpdate}
            paramKey="event"
            getCandidates={(tl) => [...new Set(tl.flatMap((i) => i.related.events))].toSorted(compareOevent)}
            toParamValue={(event) => event.slug}
            display={(event) => event.name}
        />
    </div>
</div>
