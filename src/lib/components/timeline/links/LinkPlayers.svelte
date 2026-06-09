<script lang="ts">
    import { type Player } from "$lib/types/player";

    interface Props {
        players: Player[];
    }
    let { players }: Props = $props();

    const ps = $derived(players.filter((p) => p.tags.includes("ninja")));
</script>

<div class="flex gap-1.5">
    {#each ps as player}
        <a href={`/player/${player.slug}`} class="z-10 text-xs font-normal text-gray-500 hover:text-gray-200 font-sc">
            {player.nickname}
        </a>
    {/each}
</div>
