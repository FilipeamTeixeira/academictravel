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
        <div class="uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-3" style="font-family:Helvetica; font-weight:100; height:350px; background-color: #93b3ad;">
			We, Filipe, Freke and Riet, did...
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
		<h1 class = "uk-text-left uk-margin-top" style = "font-weight:600;">Riet</h1>
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
