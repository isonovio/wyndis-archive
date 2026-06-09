<script lang="ts">
    import { type Entry } from "$lib/types/timeline";
    import DateFilterBox from "./DateFilterBox.svelte";
    import GenreFilterBox from "./GenreFilterBox.svelte";
    import PlayerFilterBox from "./PlayerFilterBox.svelte";
    import TeamFilterBox from "./TeamFilterBox.svelte";

    interface Props {
        params: URLSearchParams;
        timeline: Entry[];
        onUpdate: () => void;
    }
    let { params, timeline, onUpdate }: Props = $props();

    const hasFilter = $derived(params.size > 0);

    function clearFilter(): void {
        params.delete("genre");
        params.delete("player");
        params.delete("team");
        params.delete("from");
        params.delete("to");
        onUpdate();
    }
</script>

<div class="flex justify-between">
    <div class="text-xl font-bold">Filters</div>
    {#if hasFilter}
        <button class="cursor-pointer text-base pt-1/2 hover:text-gray-400" onclick={() => clearFilter()}>[Clear]</button>
    {/if}
</div>
<DateFilterBox {params} {onUpdate} />
<GenreFilterBox {params} {timeline} {onUpdate} />
<TeamFilterBox {params} {timeline} {onUpdate} />
<PlayerFilterBox {params} {timeline} {onUpdate} />
