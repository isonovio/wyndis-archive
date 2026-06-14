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
    <div class="border rounded-lg overflow-x-scroll pt-1.5 p-0.5 text-nowrap">
        {@render children()}
    </div>
</div>
