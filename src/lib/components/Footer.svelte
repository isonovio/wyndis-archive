<script lang="ts">
    const currentYear = new Date().getFullYear();

    const navs: [string, string][] = [
        ["/why/", "Why"],
        ["https://github.com/isonovio/ninjas-archive", "Source Code"],
        ["/license/", "License"],
        ["/credits/", "Credits"],
    ];
</script>

<footer class="border-t border-gray-200 px-20 pb-8 pt-4 flex justify-between">
    <div class="flex gap-10">
        <div>Ninjas Archive © {currentYear}</div>
        <div>Crafted by WYND with ♥︎</div>
    </div>
    <nav class="flex gap-10">
        {#each navs as [route, title]}
            <a href={route} class="hover:border-b hover:text-gray-500">
                {title}
            </a>
        {/each}
    </nav>
</footer>
