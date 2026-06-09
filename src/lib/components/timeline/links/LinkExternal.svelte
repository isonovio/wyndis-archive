<script lang="ts">
    import LinkExternalSVG from "$lib/assets/link-external.svelte";
    import { type ExternalLink } from "$lib/types/externlink";

    export let link: ExternalLink;
</script>

<a href={link.url} class="inline-block font-light text-yellow-800 hover:text-yellow-400">
    {link.name}<LinkExternalSVG />
</a>
