<script lang="ts">
    import { Temporal } from "$lib/utils/temporal";
    import FilterBox from "./FilterBox.svelte";
    import { queryDateFilter } from "$lib/types/timeline-filter";

    interface Props {
        params: URLSearchParams;
        onUpdate: () => void;
    }
    let { params, onUpdate }: Props = $props();

    let dateInput: { from: string; to: string } = $derived({
        from: params.get("from") || "",
        to: params.get("to") || "",
    });
    let dateInputError = $state("");

    $effect(() => {
        dateInput = {
            from: params.get("from") || "",
            to: params.get("to") || "",
        };
    });

    function clearDateFilter(e: MouseEvent, key: "from" | "to"): void {
        e.preventDefault();
        params.delete(key);
        dateInputError = "";
        onUpdate();
    }

    function submitDateFilter(e: Event): void {
        e.preventDefault();

        dateInputError = "";
        for (const key of ["from", "to"] as const) {
            if (dateInput[key] != "") {
                try {
                    Temporal.PlainDate.from(dateInput[key]);
                } catch {
                    dateInputError += `${dateInput[key]} is not a valid date. `;
                }
            }
        }
        if (dateInputError != "") {
            return;
        }

        for (const key of ["from", "to"] as const) {
            if (dateInput[key] != "") {
                params.set(key, dateInput[key]);
            } else {
                params.delete(key);
            }
        }

        onUpdate();
    }
</script>

<FilterBox label="Date">
    <form onsubmit={submitDateFilter} class="py-1 px-2">
        {#each ["from", "to"] as const as key}
            <div>
                <label for={key} class="inline-block w-11 leading-none text-sm">
                    {#if queryDateFilter(params, key)}
                        <button type="button" onclick={(e) => clearDateFilter(e, key)}>
                            <span class="border-l-4 pl-1 border-black font-semibold font-sc cursor-pointer hover:border-gray-400 hover:text-gray-400 hover:font-no-sc">{key}:</span>
                        </button>
                    {:else}
                        <span class="border-l-4 pl-1 border-white">{key}:</span>
                    {/if}
                </label>
                <input id={key} placeholder="yyyy-mm-dd" bind:value={dateInput[key]} class="inline-block w-24 border-b border-dashed px-1 leading-none text-sm" />
            </div>
        {/each}
        {#if dateInputError != ""}
            <div class="pl-1 pt-2 whitespace-normal text-red-500 text-sm">
                {dateInputError}
            </div>
        {/if}
        <button class="absolute -top-2.5 right-2 cursor-pointer bg-white px-1 hover:text-gray-400 text-sm">[Confirm]</button>
    </form>
</FilterBox>
