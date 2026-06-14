<script lang="ts">
    import { type Newspiece } from "$lib/types/newspiece";
    import LinkExternal from "$lib/components/timeline/links/LinkExternal.svelte";
    import LinkPlayers from "$lib/components/timeline/links/LinkPlayers.svelte";
    import Text from "../Text.svelte";

    export let newspiece: Newspiece;
</script>

<div class="pt-1 flex justify-between gap-4">
    <div class="font-semibold text-base text-sky-700">
        <div class="leading-none">
            <Text text={newspiece.title}></Text>
            <!-- {#each newspiece.title.match(/\w+|[^\w]+/g) as token}
                <span class:player={newspiece.related.players.some((p) => p.nickname === token)}>{token} </span>
            {/each} -->
        </div>
        <div class="leading-none">
            <LinkPlayers players={newspiece.related.players} />
        </div>
    </div>
    <div class="flex flex-wrap gap-x-2 justify-end text-xs">
        {#each newspiece.links as link}
            <LinkExternal {link} />
        {/each}
    </div>
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    /*.player {
        @apply font-sc;
    }*/
</style>
