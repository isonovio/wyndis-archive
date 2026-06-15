<script lang="ts">
    import "$lib/styles/global.css";
    import favicon from "$lib/assets/favicon.svg";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col h-screen">
    <Header />

    <main class="flex-1 min-h-0">
        {@render children()}
    </main>

    <Footer />
</div>
