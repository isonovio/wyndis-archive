<script lang="ts">
    import { type Omatch } from "$lib/types/official-match";
    import LinkExternal from "$lib/components/timeline/links/LinkExternal.svelte";
    import LinkRewatch from "$lib/components/timeline/links/LinkRewatch.svelte";
    import LinkPlayers from "$lib/components/timeline/links/LinkPlayers.svelte";
    import Text from "../Text.svelte";

    interface Props {
        match: Omatch;
    }
    let { match }: Props = $props();
</script>

<div class="relative">
    <div class="absolute -top-3 left-6 z-20 grid grid-cols-[193px_60px_200px] font-medium text-base">
        <div class="relative inline-block ml-auto pl-2 bg-white text-nowrap text-right team-name team-{match.outcomes[0]}">
            {match.lineups[0].teamname}
            <div class="absolute -bottom-2 right-0">
                <LinkPlayers players={match.lineups[0].players} />
            </div>
        </div>
        <div class="inline-block bg-white text-center font-bold font-mono">
            <span class="team-score team-{match.outcomes[0]}">{match.results[0]}</span><span>-</span><span class="team-score team-{match.outcomes[1]}">{match.results[1]}</span>
        </div>
        <div class="relative inline-block mr-auto pr-2 bg-white team-name team-{match.outcomes[1]}">
            {match.lineups[1].teamname}
            <div class="absolute -bottom-2 left-0">
                <LinkPlayers players={match.lineups[1].players} />
            </div>
        </div>
    </div>
    <div class="absolute -top-2.5 right-0 bg-white px-2 flex gap-1.5 text-sm">
        <div class="relative text-lime-600">
            {match.name}
            <div class="absolute -bottom-2.5 right-0 flex gap-1.5 justify-end text-nowrap text-xs">
                {#each match.links as link}
                    <LinkExternal {link} />
                {/each}
            </div>
        </div>
        {#each match.brackets.filter((b) => !b.isTransparent).toReversed() as bracket}
            <div>&lt;</div>
            <div class="relative text-yellow-600">
                {bracket.name}
                <div class="absolute -bottom-2.5 right-0 flex gap-1.5 justify-end text-nowrap text-xs">
                    {#each bracket.links as link}
                        <LinkExternal {link} />
                    {/each}
                </div>
            </div>
        {/each}
        <div>&lt;</div>
        <div class="relative text-amber-600">
            {match.event.name}
            <div class="absolute -bottom-2.5 right-0 flex gap-1.5 justify-end text-nowrap text-xs">
                {#each match.event.links as link}
                    <LinkExternal {link} />
                {/each}
            </div>
        </div>
    </div>

    <div class="mt-2 pt-4 pb-1 pl-4 border-t border-l border-lime-700 text-xs">
        <div>
            {#each match.maps as map}
                <div class="pt-0.5 flex justify-between border-b border-dashed border-gray-400">
                    <div class="text-nowrap">
                        <span class="inline-block w-4 text-lime-950 font-light">
                            {map.id}
                        </span>
                        <span class="inline-block w-8 text-lime-950 font-medium">
                            {map.map}
                        </span>
                        <span class="inline-block w-36 text-right team-name team-{map.outcomes[0]}">
                            {match.lineups[0].teamname}
                        </span>
                        <span class="inline-block w-6 text-right font-bold font-mono team-score team-{map.outcomes[0]}">
                            {map.results[0]}
                        </span>
                        <span class="inline-block font-bold font-mono">:</span>
                        <span class="inline-block w-6 font-bold font-mono team-score team-{map.outcomes[1]}">
                            {map.results[1]}
                        </span>
                        <span class="inline-block w-36 team-name team-{map.outcomes[1]}">
                            {match.lineups[1].teamname}
                        </span>
                    </div>
                    <div class="flex justify-center items-end flex-wrap gap-x-4">
                        {#if map.note}
                            <div class="text-gray-500">{map.note}</div>
                        {/if}
                        {#each map.links as link}
                            <LinkExternal {link} />
                        {/each}
                        {#each map.rewatches as rewatch}
                            <LinkRewatch {rewatch} />
                        {/each}
                    </div>
                </div>
            {/each}
            {#each match.news as newspiece}
                <div class="pt-0.5 flex justify-between border-b border-dashed border-gray-400">
                    <div class="text-sky-700 text-sm">
                        <Text text={newspiece.title}></Text>
                    </div>
                    <div class="flex justify-center items-end flex-wrap gap-x-4">
                        {#each newspiece.links as link}
                            <LinkExternal {link} />
                        {/each}
                    </div>
                </div>
            {/each}
            {#if match.note}
                <div class="pt-1 text-gray-500 text-xs">
                    {match.note}
                </div>
            {/if}
        </div>
    </div>
</div>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    .team-win.team-score {
        @apply text-green-600;
    }
    .team-win.team-name {
        @apply text-green-700 font-semibold;
    }
    .team-lose.team-score {
        @apply text-red-600;
    }
    .team-lose.team-name {
        @apply text-red-400 font-light;
    }
    .team-draw {
        @apply text-gray-600;
    }
</style>
