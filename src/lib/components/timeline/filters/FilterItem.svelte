<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        active: boolean;
        onclick: () => void;
        children: Snippet;
    }
    let { active, onclick, children }: Props = $props();
</script>

<button class="filter" class:filter-on={active} {onclick}>
    {@render children()}
</button>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    button.filter {
        & {
            @apply block cursor-pointer m-2 border-x-4 border-white leading-none px-1 text-sm;
        }
        &:hover {
            @apply border-green-700 text-green-700 font-semibold font-sc;
        }
    }
    button.filter-on {
        & {
            @apply border-green-700 text-green-700 font-semibold font-sc;
        }
        &:hover {
            @apply border-gray-200 text-gray-400 font-normal font-no-sc;
        }
    }
</style>
