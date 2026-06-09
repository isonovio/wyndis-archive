<script lang="ts">
    import { type Newspiece } from "$lib/types/newspiece";
    import LinkExternal from "$lib/components/snippets/LinkExternal.svelte";
    import LinkPlayers from "$lib/components/snippets/LinkPlayers.svelte";

    export let newspiece: Newspiece;
</script>

<div class="pt-1 flex justify-between gap-4">
    <div class="shrink-0 font-semibold text-base text-sky-700">
        <div class="leading-none">
            {#each newspiece.title.match(/\w+|[^\w]+/g) as token}
                <span class:player={newspiece.related.players.some((p) => p.nickname === token)}>{token} </span>
            {/each}
        </div>
        <div class="leading-none">
            <LinkPlayers players={newspiece.related.players} />
        </div>
    </div>
    <div class="shrink flex flex-wrap gap-x-2 justify-end text-xs">
        {#each newspiece.links as link}
            <LinkExternal {link} />
        {/each}
    </div>
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    .player {
        @apply font-sc;
    }
</style>
