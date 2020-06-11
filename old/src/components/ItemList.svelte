
<script>
	import Icon from 'svelte-awesome';
	import { sort, sortUp, sortDown } from 'svelte-awesome/icons';

    export let headers;
    export let items;
    export let selectedIdx;
    export let item;
    export let refreshData;
    export let blankItem;
    
    async function headerSort(e){
		let data = e.target.getAttribute("data");
		let header = headers.find((h)=>{
			return h.name == data;
		});
		if (header){
			let maxOrder = Math.max( ...(headers.map((h)=>{return h.order})));

			header.order = maxOrder + 1;
			if (header.sort=="") header.sort = "up";
			else if (header.sort=="up") header.sort = "down";
			else if (header.sort=="down") header.sort = "";
		}
		console.log(headers);
		headers = headers;
		await refreshData();
    }

	function click(e){
		selectedIdx = e.currentTarget.getAttribute('idx');
		if (selectedIdx >= 0) item = items[selectedIdx];
		else item = { ...blankItem };	//clone the blank item;
	}

</script>
<table class='table is-bordered is-striped is-fullwidth'>
    <thead>
        {#each headers as header}
            <th class="th-title" data={header.name} on:click|stopPropagation|preventDefault={headerSort}>
                {header.name}
                {#if header.sort == "up"}
                    <Icon data={sortUp}/>
                {:else if header.sort == "down"}
                    <Icon data={sortDown}/>
                {:else}
                    <Icon data={sort}/>
                {/if}
            </th>
        {/each}
    </thead>
    <tbody>
        {#each items as item, idx}
            <tr on:click={click} idx={idx} class={idx == selectedIdx ? 'is-selected' : ''}>
                {#each headers as header}
                    <td>{ item[header.name] }</td>
                {/each}
            </tr>
        {/each}

        <tr on:click={click} idx=-1 class={-1 == selectedIdx ? 'is-selected' : ''}>
            {#each headers as header}
                <td>&nbsp;</td>
            {/each}
        </tr>

    </tbody>
</table>
<style>
	/*disable double to select, as click on title will toggle sort, of user click to quick, it will select the title*/
	.th-title {
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>