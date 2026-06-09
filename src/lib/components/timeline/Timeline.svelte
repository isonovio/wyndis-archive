<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    import { entriesGroupSortByDate, allEntries } from "$lib/types/timeline";
    import { filterEntries, filterFromParams, type EntryFilter } from "$lib/types/timeline-filter";

    import Match from "./entries/Match.svelte";
    import Newspiece from "./entries/Newspiece.svelte";
    import Filter from "./filters/Filter.svelte";

    interface Props {
        prefilter?: EntryFilter;
    }
    let { prefilter }: Props = $props();

    const prefilteredTimeline = $derived(prefilter ? filterEntries(allEntries, prefilter) : allEntries);
    const params = $derived(browser ? page.url.searchParams : new URLSearchParams());
    const paramsFilter = $derived(filterFromParams(params));
    const filteredTimeline = $derived(filterEntries(prefilteredTimeline, paramsFilter));
    const sortedTimeline = $derived(entriesGroupSortByDate(filteredTimeline));

    function refreshParams(): void {
        goto(`?${params.toString()}`, { noScroll: true, keepFocus: true });
    }
</script>

<div class="w-7xl mx-auto flex gap-4">
    <div class="sticky top-0 max-h-screen overflow-y-auto py-10 flex flex-col gap-4">
        <Filter {params} timeline={prefilteredTimeline} onUpdate={refreshParams} />
    </div>

    <div class="pt-6 pl-6 flex-1 flex flex-col gap-4">
        {#if sortedTimeline.length === 0}
            <div class="text-5xl text-yellow-900 font-sc font-bold">History has not witnessed anything yet.</div>
        {:else}
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
