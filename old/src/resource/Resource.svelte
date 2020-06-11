<script>
	import { onMount, afterUpdate, tick } from 'svelte';
	import Paginator from '../components/Paginator.svelte';
	import ItemList from '../components/ItemList.svelte';
	import ItemForm from '../components/ItemForm.svelte';
	import {
		callServer,
	} from '../components/utils';

	async function itemIndex() {
		let sortBy = '';
		if (headers){
			sortBy = headers
				.filter((h)=>{return h.sort})	//only sort is true
				.sort((a, b)=>{return b.order-a.order}) //order by order
				.map((h)=>{return h.name+' '+(h.sort=='up' ? 'asc' : 'desc')})	//return 'name desc'
				.reduce((last, h)=>{return last + h + ','}, '')	//return name desc, size desc
				.slice(0, -1);	//remove the last ,
			console.log(sortBy);
		}
		let url = "/resources.json?sort=" + sortBy;
		if (page) url = url+"&page="+page;
		let rc = await callServer('GET', url);
		return rc;
	}

	let page;
	let pages;
	let items = [];
	let headers;	
	let selectedIdx = -1;

	const blankItem = {
		name: '',
	};

	let item = { ...blankItem };	//clone the blank item
	
	async function refreshData() {
		let rc = await itemIndex();
		items = rc.rows;
		pages = rc.pages;
		
		if (items[0])
		if (!headers) headers = Object.keys(items[0]).map((h)=>{
			return {
				name: h,
				sort: "",
				order: 0
			};
		});

		item = { ...blankItem };
	};

	onMount(async () => {
		console.log("on mount");
		await refreshData();
	});
	
	async function updateItem(){
		let name = document.getElementById("name");
		if(!name.validity.valid) {
			notify('warning', "name is required!");
			return;
		}

		let data = { ...item };
		let rc;
		if (item.id) {
			rc = await callServer('PUT', '/resources/'+item.id, data);
		}
		else {
			rc = await callServer('POST', '/resources', data);
		}
		notify(rc.code, rc.message);
		if (rc.code == 'success') {
			await refreshData();
		}
	}

	async function deleteItem(){
		if (item){
			if (confirm("Are you sure?")){
				let rc = await callServer('DELETE', "/resources/"+item.id);
				notify(rc.code, rc.message);
				if (rc.code=="success") await refreshData();
			}
		}
	}
	async function pageChanged(p){
		page = p;
		await refreshData();
	}
</script>

<div class="columns">
  <div class="column is-two-thirds">
    <h2 class="title">
      Total {pages ? pages.total : ''} resources 
    </h2>
  	{#if items.length > 0}
	  	<ItemList {headers} {items} {blankItem} {refreshData} bind:item bind:selectedIdx />
		<Paginator {pages} {pageChanged}/>
	{/if}
  </div>

  <div class="column">
		<h2 class="title">&nbsp;</h2>

		<ItemForm label={"Name"} >
			<div class="control"><input id="name" required class="input" type="text" placeholder="name" bind:value={item.name}></div>
		</ItemForm>

		<div class="field is-grouped">
			<div class="control"><button class="button is-link" on:click={updateItem}>{item.id ? 'Update' : 'Create'}</button></div>
			{#if item}
				<div class="control"><button class="button is-link is-danger" on:click={deleteItem}>Delete</button></div>
			{/if}
		</div>
  </div>
</div>

<style>
	* {
		box-sizing: border-box;
	}
</style>