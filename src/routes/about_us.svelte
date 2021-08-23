<script context="module">
	export const prerender = true;
	
	import train1 from '/static/pictures/train1.jpg';
	import train2 from '/static/pictures/train2.jpg';
	import train3 from '/static/pictures/train3.jpg';

</script>

<svelte:head>
	<title>About Us</title>
</svelte:head>


<div class="uk-grid-collapse" uk-grid>
        <div class="uk-text-justify uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-3" style="padding: 40px; font-family:Helvetica; font-weight:100; height:350px; background-color: #93b3ad;">
			This Academic Travel platform is an initiative from the Environmental Department, the Green Office and the Geography Department, all embedded within Ghent University. 
			The tool was conceptualized and developed in light of the new UGent sustainable travel policy which was rolled out in September 2021. 
			In its initial stage, 'Academic Travel' aims to serve as a sensitizing and inspirational tool for the community of UGent employees, 
			hoping to stimulate the transition towards more sustainable work-related travels. 
			A number of UGent members in particular have dedicated their time into realising this 
			tool and are listed below. We are very keen on receiving any feedback of comments you may have. Feel free to contact us (details below).
		</div>
        <div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-3 uk-background-cover " style="height:350px;" data-src={train1} uk-img>
			</div>
</div>
<div class="uk-grid-collapse" uk-grid>
	<div class="uk-card uk-light uk-flex uk-flex-center uk-flex-middle uk-width-1-4" style="height:250px; background-color: #0076b6;">
		<h1 style="transform: rotate(-90deg);">ABOUT US</h1>
	</div>
	<div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-2" style="height:250px; background-color: #f5f5f5;">
		<h1 class = "uk-text-left uk-margin-top" style = "font-weight:600;">Filipe Teixeira</h1>
	</div>
	<div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-4" style="height:250px; background-color: #C7CEF6;">
	</div>
</div>
<div class="uk-grid-collapse" uk-grid>
	<div class="uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-5" style="height:250px; background-color: #7496D2;">
		<h1 class = "uk-text-left uk-margin-top" style = "font-weight:600;">Freke Caset</h1>
	</div>
	<div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-3-5 uk-background-cover" style="height:250px;" data-src={train2} uk-img></div>
</div>
<div class="uk-grid-collapse" uk-grid>
	<div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-3-5 uk-background-cover" style="height:250px;" data-src={train3} uk-img></div>
	<div class="uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-5" style="height:250px; background-color: #d04444;">
		<h3 class = "uk-text-left uk-margin-top" style = "font-weight:600;">Environmental department and Green Office</h3>
	</div>
</div>

<style>

.test{
    color: #675864;
    color:#d37861;
    color:#144a81;
    color:#d04444;
    color:#93b3ad;
    color:#147074;
    color:#0076b6;
}
</style>
