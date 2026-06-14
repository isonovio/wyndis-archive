<script lang="ts">
    import { page } from "$app/state";

    const currentPath = $derived(page.url.pathname);

    const navs: [string, string][] = [
        ["/officials/", "Officials"],
        ["/news/", "News"],
        ["/twins/", "The Twins"],
    ];
</script>

<header class="px-8 py-3 flex justify-between">
    <nav class="flex gap-8">
        <a href="/" class="home"> Ninjas Archive </a>
        {#each navs as [route, title]}
            {#if currentPath === route}
                <a href={route} class="border-b-2">{title}</a>
            {:else}
                <a href={route}>{title}</a>
            {/if}
        {/each}
    </nav>

    <nav></nav>
</header>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    a {
        @apply text-nowrap text-2xl font-medium font-sc text-prim-500;
        @apply hover:border-b-2 hover:text-prim-300;
    }

    a.home {
        @apply font-bold;
    }
</style>
