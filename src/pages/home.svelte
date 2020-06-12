<Page name="home">
  <!-- Top Navbar -->
  <Navbar sliding={false}>
    <NavLeft>
      <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" />
    </NavLeft>
    <NavTitle sliding>ex</NavTitle>
    <NavRight>
      <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="right" >
        <Badge color="red">1</Badge>
       </Link>
    </NavRight>
  </Navbar>

  <!-- Page content -->
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

  {#each hours as hour}
    <Row tag="p">
      {#each hour as period}
        <Col>
          <Button fill color={colors[period.state]} outline on:click={()=>{click(period)}}>{period.tm.format("HH:mmA")}</Button>
        </Col> 
      {/each}
    </Row>
  {/each}

  <h2>formattedSelected = {formattedSelected}</h2>
  <h2>selected = {selected}</h2>
  <h2>dateChosen = {dateChosen}</h2>

  <Button fill color="red" on:click={test}>
    <span class="blinking">test</span>
  </Button>

</Page>
<script>
  import {
    Page,
    Badge,
    Navbar,
    NavLeft,
    NavTitle,
    NavTitleLarge,
    NavRight,
    Link,
    Toolbar,
    Block,
    BlockTitle,
    List,
    ListItem,
    Row,
    Col,
    Button
  } from 'framework7-svelte';
	import Datepicker from '../components/Datepicker.svelte';
	import moment from 'moment';

	//month start from 0, ie Jan is 0
	let start = new Date(2020, 0, 1);
	let end = new Date(2020, 5, 30);

	let formattedSelected;
	let selected = new Date(2020, 3, 27);;
	let dateChosen;

	let daysOfWeek_cn = [
		['Sunday', 'æ—¥'],
		['Monday', 'ä¸€'],
		['Tuesday', 'äºŒ'],
		['Wednesday', 'ä¸‰'],
		['Thursday', 'å››'],
		['Friday', 'äº”'],
		['Saturday', 'å…­']
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

<style>

.blinking{
    animation:blinkingText 1.2s infinite;
}
@keyframes blinkingText{
    0%{     color: #000;    }
    49%{    color: #000; }
    60%{    color: transparent; }
    99%{    color:transparent;  }
    100%{   color: #000;    }
}

</style>