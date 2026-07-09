<script lang="ts">
    import { page } from "$app/state";

    const currentPath = $derived(page.url.pathname);

    const navs: [string, string][] = [
        ["/", "Wyndis Archive"],
        ["/officials/", "Officials"],
        ["/news/", "News"],
    ];
</script>

<header class="px-8 py-3 flex justify-between">
    <nav class="flex gap-8">
        {#each navs as [route, title]}
            <a
                href={route}
                class="border-b-2 text-nowrap text-2xl font-sc text-amber-700 hover:text-amber-500 hover:border-amber-500"
                class:border-white={route !== currentPath}
                class:font-medium={route !== "/"}
                class:font-bold={route === "/"}>{title}</a
            >
        {/each}
    </nav>

    <nav></nav>
</header>
