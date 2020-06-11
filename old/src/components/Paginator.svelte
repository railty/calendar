<script>

let neighbor = 2;
function neighbors(n){
	let ns = [];
	for (let i=n-neighbor; i<=n+neighbor; i++) ns.push(i);
	return ns;
}

export let pageChanged;
export let pages;
let bs = [];

$: {
	let ps = neighbors(1).concat(neighbors(pages.lastPage)).concat(neighbors(pages.page));
	//unique
	ps = ps.filter((value, index, self)=>{
		return self.indexOf(value) === index;
	});	
	//>0 and <lastpage
	ps = ps.filter((p)=>{return p>0 && p<=pages.lastPage});
	//sort
	ps = ps.sort((a, b)=>{return a-b});

	//add . if there is a gap in between 
	bs = [];
	if (ps[0]){
		bs.push(ps[0])
		for (let i=1; i<ps.length; i++){
			if (ps[i]-ps[i-1]>1) bs.push('.');
			bs.push(ps[i])
		}
	}
}


function onPage(e){
	let p = e.currentTarget.getAttribute('data');
	pageChanged(p);
}
function onNext(e){
	let p = pages.page + 1;
	if (p <= pages.lastPage) pageChanged(p);
}
function onPrevious(e){
	let p = pages.page - 1;
	if (p >= 1) pageChanged(p);
	
}
</script>

<nav class="pagination is-centered" role="navigation" aria-label="pagination">
	<a href='#' class="pagination-previous" on:click|preventDefault={onPrevious} >Previous</a>
	<a href='#' class="pagination-next" on:click|preventDefault={onNext} >Next page</a>
	<ul class="pagination-list">
		{#each bs as b}
			{#if b == '.'}
				<li><span class="pagination-ellipsis">&hellip;</span></li>
			{:else}
				<li><a data={b} href='#' on:click|preventDefault={onPage} class="pagination-link {b == pages.page ? 'is-current' : ''}" aria-label="Goto page {b}">{b}</a></li>
			{/if}
		{/each}
	</ul>
</nav>		
