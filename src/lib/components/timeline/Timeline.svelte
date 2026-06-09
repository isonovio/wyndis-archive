<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { Temporal } from "$lib/utils/temporal";

    import { entriesGroupSortByDate, allEntries } from "$lib/types/timeline";
    import { Genre, compare as genreCompare, display as genreDisplay } from "$lib/types/timeline-genre";
    import {
        filterEntries,
        filterFromParams,
        paramsFilterHasGenre,
        paramsFilterHasPlayer,
        paramsFilterHasFromDate,
        paramsFilterHasToDate,
        type EntryFilter,
    } from "$lib/types/timeline-filter";
    import { playerCompare, type Player } from "$lib/types/player";

    import Match from "./Match.svelte";
    import Newspiece from "./Newspiece.svelte";

    interface Props {
        prefilter?: EntryFilter;
    }
    let { prefilter }: Props = $props();

    const prefilteredTimeline = $derived(prefilter ? filterEntries(allEntries, prefilter) : allEntries);
    const params = $derived(browser ? page.url.searchParams : new URLSearchParams());
    const paramsFilter = $derived(filterFromParams(params));
    const filteredTimeline = $derived(filterEntries(prefilteredTimeline, paramsFilter));
    const sortedTimeline = $derived(entriesGroupSortByDate(filteredTimeline));

    const filterCandidates = $derived(
        (() => {
            const genreCandidates: [Genre, Boolean][] = (() => {
                return [
                    ...new Set(
                        prefilteredTimeline.map((i) => {
                            return i.genre;
                        }),
                    ),
                ]
                    .toSorted(genreCompare)
                    .map((g) => {
                        return [g, paramsFilterHasGenre(params, g)] as [Genre, Boolean];
                    });
            })();

            const playerCandidates: [Player, Boolean][] = (() => {
                return [
                    ...new Set(
                        prefilteredTimeline
                            .map((i) => {
                                return i.related.players;
                            })
                            .flat(),
                    ),
                ]
                    .toSorted(playerCompare)
                    .map((p) => {
                        return [p, paramsFilterHasPlayer(params, p.slug)] as [Player, Boolean];
                    });
            })();

            return { genres: genreCandidates, players: playerCandidates };
        })(),
    );

    function refreshParams(): void {
        goto(`?${params.toString()}`, { noScroll: true, keepFocus: true });
    }
    function toggleGenre(genre: Genre, prev: Boolean): void {
        if (prev) {
            params.delete("genre", genre);
        } else {
            params.append("genre", genre);
        }
        refreshParams();
    }
    function togglePlayer(player: string, prev: Boolean): void {
        if (prev) {
            params.delete("player", player);
        } else {
            params.append("player", player);
        }
        refreshParams();
    }
    let dateInputError = $state("");
    let fromDateInput = $derived(params.get("from") || "");
    let toDateInput = $derived(params.get("to") || "");
    function submitDateFilter(e: Event): void {
        e.preventDefault();

        dateInputError = "";
        if (fromDateInput != "") {
            try {
                Temporal.PlainDate.from(fromDateInput);
            } catch {
                dateInputError += `${fromDateInput} is not a valid date. `;
            }
        }
        if (toDateInput != "") {
            try {
                Temporal.PlainDate.from(toDateInput);
            } catch {
                dateInputError += `${toDateInput} is not a valid date. `;
            }
        }
        if (dateInputError != "") {
            return;
        }

        if (fromDateInput != "") {
            params.set("from", fromDateInput);
        } else {
            params.delete("from");
        }
        if (toDateInput != "") {
            params.set("to", toDateInput);
        } else {
            params.delete("to");
        }
        refreshParams();
    }
    function clearFilter(): void {
        params.delete("genre");
        params.delete("player");
        params.delete("from");
        params.delete("to");
        refreshParams();
    }
    const hasFilter = $derived(params.size > 0);
</script>

<div class="w-7xl mx-auto flex gap-4">
    <div class="sticky top-0 max-h-screen pt-10 flex flex-col gap-4">
        <div class="flex justify-between">
            <div class="text-xl font-bold">Filters</div>
            {#if hasFilter}
                <button class="cursor-pointer text-base pt-1/2 hover:text-gray-400" onclick={() => clearFilter()}>[Clear]</button>
            {/if}
        </div>
        <div class="relative mt-3 ml-6 border rounded-lg pt-1.5 p-0.5 text-nowrap">
            <div class="absolute -top-4 -left-4 bg-white px-2 text-base font-semibold">Date</div>
            <form onsubmit={submitDateFilter}>
                <div class="mt-1 mx-2">
                    <label for="from" class="inline-block w-10 border-l-4 border-white pl-1 leading-none text-sm" class:filter-on={paramsFilterHasFromDate(params)}>from: </label>
                    <input id="from" placeholder="yyyy-mm-dd" bind:value={fromDateInput} class="inline-block w-20 border-b border-dashed px-1 leading-none text-sm" />
                </div>
                <div class="mb-1 mx-2">
                    <label for="to" class="inline-block w-10 border-l-4 border-white pl-1 leading-none text-sm" class:filter-on={paramsFilterHasToDate(params)}>to: </label>
                    <input id="to" placeholder="yyyy-mm-dd" bind:value={toDateInput} class="inline-block w-20 border-b border-dashed px-1 leading-none text-sm" />
                </div>
                {#if dateInputError != ""}
                    <div class="text-red-500">
                        {dateInputError}
                    </div>
                {/if}
                <button class="absolute -top-2.5 right-2 cursor-pointer bg-white px-1 hover:text-gray-400 text-sm">[Confirm]</button>
            </form>
        </div>
        {#if filterCandidates.genres.length > 1}
            <div class="relative mt-3 ml-6 border rounded-lg pt-1.5 p-0.5 text-nowrap">
                <div class="absolute -top-4 -left-4 bg-white px-2 text-base font-semibold">Genres</div>
                {#each filterCandidates.genres as [genre, toggle]}
                    <button class="filter" class:filter-on={toggle} onclick={() => toggleGenre(genre, toggle)}>{genreDisplay(genre)}</button>
                {/each}
            </div>
        {/if}
        {#if filterCandidates.players.length > 1}
            <div class="relative mt-3 ml-6 border rounded-lg pt-1.5 p-0.5 text-nowrap">
                <div class="absolute -top-4 -left-4 bg-white px-2 text-base font-semibold">Players</div>
                {#each filterCandidates.players as [player, toggle]}
                    <button class="filter" class:filter-on={toggle} onclick={() => togglePlayer(player.slug, toggle)}>{player.nickname}</button>
                {/each}
            </div>
        {/if}
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

<style lang="postcss">
    @reference "$lib/styles/global.css";

    button.filter {
        @apply block cursor-pointer m-2 border-x-4 border-white leading-none px-1;
        @apply hover:text-gray-400 hover:border-gray-600 hover:font-semibold hover:font-sc;
        @apply text-sm;
    }
    button.filter-on {
        @apply border-black font-semibold font-sc;
        @apply hover:border-gray-200 hover:font-normal hover:font-no-sc;
    }
    label.filter-on {
        @apply border-black font-semibold font-sc;
    }
</style>
