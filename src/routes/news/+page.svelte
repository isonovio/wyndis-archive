<script lang="ts">
    import { Genre } from "$lib/types/timeline-genre";
    import { GenreFilter } from "$lib/types/timeline-filter";
    import Timeline from "$lib/components/timeline/Timeline.svelte";

    const prefilter = new GenreFilter(Genre.NEWSPIECE);
</script>

<svelte:head>
    <title>News | Wyndis Archive</title>
</svelte:head>

<Timeline {prefilter} />
