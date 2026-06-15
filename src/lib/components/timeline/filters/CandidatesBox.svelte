<script lang="ts" generics="Candidate">
    import type { FilterState } from "$lib/types/timeline-filter";

    interface Props {
        candidates: Candidate[];
        getState: (c: Candidate) => FilterState;
        getHandler: (c: Candidate) => () => void;
        display: (c: Candidate) => string;
        compact?: boolean;
    }

    let { candidates, getState, getHandler, display, compact = true }: Props = $props();
</script>

<div class="flex flex-col items-start gap-2">
    <div class:hidden={!compact} class="absolute -top-3 right-2 bg-white px-1 text-gray-700">
        {candidates.length} options
    </div>
    {#each candidates as candidate}
        {@const state = getState(candidate)}
        <button class="filter" class:hidden={compact} class:filter-yes={state === "yes"} class:filter-no={state === "no"} onclick={getHandler(candidate)}>
            {display(candidate)}
        </button>
    {/each}
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    button.filter {
        & {
            @apply group-hover:block cursor-pointer border-x-4 border-white leading-none px-1 text-sm;
        }
        &:hover {
            @apply border-green-700 text-green-700 font-semibold font-sc;
        }
    }
    button.filter-yes {
        & {
            @apply block border-green-700 text-green-700 font-semibold font-sc;
        }
        &:hover {
            @apply border-red-600 text-red-600 font-semibold font-sc line-through;
        }
    }
    button.filter-no {
        & {
            @apply block border-red-600 text-red-600 font-semibold font-sc line-through;
        }
        &:hover {
            @apply border-gray-200 text-gray-400 font-normal font-no-sc no-underline;
        }
    }
</style>
