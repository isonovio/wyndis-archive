<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    import { allEntries, groupEntryByDate } from "$lib/types/timeline";
    import { type EntryFilter, applyFilter, filterFromParams } from "$lib/types/timeline-filter";

    import Match from "./entries/Match.svelte";
    import Newspiece from "./entries/Newspiece.svelte";
    import Filter from "./filters/Filter.svelte";

    interface Props {
        prefilter?: EntryFilter;
    }
    let { prefilter }: Props = $props();

    const prefilteredTimeline = $derived(prefilter ? applyFilter(allEntries, prefilter) : allEntries);
    const params = $derived(browser ? page.url.searchParams : new URLSearchParams());
    const paramsFilter = $derived(filterFromParams(params));
    const filteredTimeline = $derived(applyFilter(prefilteredTimeline, paramsFilter));
    const sortedTimeline = $derived(groupEntryByDate(filteredTimeline));

    function refreshParams(): void {
        goto(`?${params.toString()}`, { noScroll: true, keepFocus: true });
    }

    const recordCount = $derived(filteredTimeline.length);
    const matchCount = $derived(filteredTimeline.filter((record) => record.genre == "match").length);
    const newspieceCount = $derived(filteredTimeline.filter((record) => record.genre == "newspiece").length);
</script>

<div class="h-full w-7xl mx-auto flex gap-4">
    <Filter {params} timeline={prefilteredTimeline} onUpdate={refreshParams} />

    <div class="h-full overflow-y-auto pt-6 pl-6 flex-1 flex flex-col gap-4">
        {#if recordCount === 0}
            <div class="text-5xl text-yellow-900 font-sc font-bold">History has not witnessed anything yet.</div>
        {:else}
            {#if matchCount > 0}
                {matchCount} matches.
            {/if}
            {#if newspieceCount > 0}
                {newspieceCount} newspieces.
            {/if}
            {#each sortedTimeline as dailyTimeline}
                <div class="relative border-t-2 border-l-2">
                    <div class="absolute -top-5.5 -left-6 p-2 bg-white font-bold text-base text-yellow-900">
                        {dailyTimeline.date.toString()}
                    </div>
                    <div class="pl-12 py-6 flex flex-col gap-3">
                        {#each dailyTimeline.entries as entry}
                            <div class="relative">
                                {#if entry.genre == "newspiece"}
                                    <Newspiece newspiece={entry} />
                                {:else if entry.genre == "match"}
                                    <Match match={entry} />
                                {:else}
                                    {entry}
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
