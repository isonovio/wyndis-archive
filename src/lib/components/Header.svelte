<header>
    <nav>
        <a href="/" class="home"> Ninjas Archive </a>
        <a href="/officials"> Officials </a>
        <a href="/news"> News </a>
    </nav>

    <nav></nav>
</header>

<style lang="postcss">
    @reference "$lib/styles/global.css";

    header {
        @apply px-4 py-3;
        @apply flex justify-between;
    }

    nav {
        @apply flex gap-8;
    }

    a {
        @apply text-nowrap text-2xl font-medium font-sc text-prim-500;
    }

    a.home {
        @apply font-bold;
    }
</style>
