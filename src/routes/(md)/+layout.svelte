<script lang="ts">
    let { children } = $props();
</script>

<article class="w-3xl mx-auto h-full overflow-y-auto py-10">
    {@render children()}
</article>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    :global article {
        h1 {
            @apply mt-4 mb-4;
            @apply text-4xl uppercase font-black;
        }
        h2 {
            @apply mt-6 mb-2;
            @apply text-2xl uppercase font-bold;
        }

        ul {
            li::before {
                content: "✦";
                @apply pr-1;
            }
        }

        p {
            @apply mb-2;
        }

        a {
            @apply border-b-2;
        }
        a:hover {
            @apply opacity-50;
        }
    }
</style>
