<script lang="ts">
    import { allPlayers } from "$lib/types/player";
    import { allTeams } from "$lib/types/team";

    export let text: string;
</script>

<div>
    {#each text.match(/[\w$-]+|[^\w^$^-]+/g) as token}
        {#if token.startsWith("$")}
            {#if allPlayers.get(token.slice(1))}
                <span class="proper">{allPlayers.get(token.slice(1))?.nickname}</span>
            {:else if allTeams.get(token.slice(1))}
                <span class="proper">{allTeams.get(token.slice(1))?.name}</span>
            {:else}
                {token}
            {/if}
        {:else}
            {token}
        {/if}
    {/each}
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    .proper {
        @apply font-sc;
    }
</style>
