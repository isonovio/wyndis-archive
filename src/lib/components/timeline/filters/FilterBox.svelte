<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        label: string;
        children: Snippet;
    }
    let { label, children }: Props = $props();
</script>

<div class="relative mt-3 ml-6">
    <div class="absolute -top-4 -left-4 bg-white px-2 text-base font-semibold">
        {label}
    </div>
    <div class="border rounded-lg pt-3 pb-3 pl-2 pr-2 text-nowrap group">
        {@render children()}
    </div>
</div>
