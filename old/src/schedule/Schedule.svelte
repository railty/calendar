<script>
	import { onMount, afterUpdate, tick } from 'svelte';
	//import GMLabelColor from '../components/GMLabelColor.svelte';
	import { callServer }  from '../components/utils';
	import Icon from 'svelte-awesome';
	import { chevronLeft, chevronRight } from 'svelte-awesome/icons';

	import Datepicker from '../components/Datepicker.svelte';
	import moment from 'moment';

	onMount(async () => {
		console.log("on mount");
	});

	//month start from 0, ie Jan is 0
	let start = new Date(2020, 0, 1);
	let end = new Date(2020, 5, 30);

	let formattedSelected;
	let selected = new Date(2020, 3, 5);;
	let dateChosen;

	let daysOfWeek_cn = [
		['Sunday', '日'],
		['Monday', '一'],
		['Tuesday', '二'],
		['Wednesday', '三'],
		['Thursday', '四'],
		['Friday', '五'],
		['Saturday', '六']
	];

	let daysOfWeek = [
		['Sunday', 'Sun'],
		['Monday', 'Mon'],
		['Tuesday', 'Tue'],
		['Wednesday', 'Wed'],
		['Thursday', 'Thu'],
		['Friday', 'Fri'],
		['Saturday', 'Sat']
	];

	function selectableCallback(dt){
		if (dt.getDay() == 0) return false;
		return true;
	}

	let tmStart = moment('2020-04-01 08:00AM', "YYYY-MM-DD hh:mmA");
	//console.log(tmStart.toString());

	let tmEnd = moment('2020-04-01 06:00PM', "YYYY-MM-DD hh:mmA");
	//console.log(tmEnd.toString());

	let tm = tmStart;
	let hours = [];
	let hour = [];
	let periodLen = 30; //minutes
	let ct = 4; //how many period in a row
	
	while (tm.valueOf() < tmEnd.valueOf()){
		hour.push({
			tm: tm.clone(),
			len: periodLen,
			state: 'available'	//booking, booked
		});

		if (hour.length == ct){
			hours.push(hour);
			hour = [];
		}
		tm.add(periodLen, "minutes")
	}
	if (hour.length > 0) hours.push(hour);

	let colors = {
		'available': 'lightgreen',
		'booking': 'lightblue', 
		'booked': 'blue'
	};

	function click(period){
		if (period.state == "booking") period.state = "available";
		else if (period.state == "available") period.state = "booking";
		hours = hours;
	}

	function test(){
		let bookings = hours.flat().filter((p)=>{return p.state=='booking'});
		bookings = bookings.reduce((last, current)=>{
			if (last.length > 0){
				let l = last[last.length-1];
				let t = l.tm.clone();

				t.add(l.len, "minutes");

				let a = t.valueOf();
				let b = current.tm.valueOf();
				if ( a == b){
					l.len = l.len + current.len;
					return last;					
				}
			}

			last.push({
				tm: current.tm.clone(),
				len: current.len,
			});

			return last;
		}, []);


		console.log("------------------");
		for (let b of bookings){
			console.log(`booking: ${b.tm.format("HH:mmA")} for ${b.len} minutes`);
		}
		
	}
</script>

<h1>Schedule</h1>
<Datepicker 
	start={start}  
	end={end} 
	
	bind:formattedSelected={formattedSelected}
	bind:selected={selected}
	bind:dateChosen={dateChosen}	

	selectableCallback={selectableCallback}
	format={'#{Y}-#{m}-#{d}'}
	daysOfWeek={daysOfWeek}
/>
<table class="table is-bordered">
	<thead>
	</thead>
	<tbody>
	{#each hours as hour}
	<tr>
		{#each hour as period}
			<td style={"background-color:"+colors[period.state]+";"} on:click={()=>{click(period)}}>{period.tm.format("HH:mmA")}</td> 
		{/each}
	</tr>
	{/each}
	</tbody>
</table>

<h2>formattedSelected = {formattedSelected}</h2>
<h2>selected = {selected}</h2>
<h2>dateChosen = {dateChosen}</h2>

<button on:click={test}>test</button>
<style>
	* {
		box-sizing: border-box;
	}
</style>