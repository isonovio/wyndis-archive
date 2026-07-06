<script lang="ts">
    import { RelatedSlugFilter, OrFilter } from "$lib/types/timeline-filter";
    import Timeline from "$lib/components/timeline/Timeline.svelte";

    const prefilter = new OrFilter([new RelatedSlugFilter("players", "nayomy"), new RelatedSlugFilter("players", "qiyarah")]);
</script>

<svelte:head>
    <title>The Twins | Wyndis Archive</title>
</svelte:head>

<Timeline {prefilter} />
