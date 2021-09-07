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
        <div class="uk-text-justify uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-3" style="padding: 40px; font-family:Helvetica; font-weight:100; height:270px; background-color: #93b3ad;">
			This Academic Travel platform is an initiative from the Environmental Department, the Green Office and the Geography Department, all embedded within Ghent University. 
			The tool was conceptualized and developed in light of the new UGent sustainable travel policy which was rolled out in September 2021. 
			In its initial stage, 'Academic Travel' aims to serve as a sensitizing and inspirational tool for the community of UGent employees, 
			hoping to stimulate the transition towards more sustainable work-related travels. 
			A number of UGent members in particular have dedicated their time into realising this 
			tool and are listed below. We are very keen on receiving any feedback or comments you may have. Feel free to contact us (details below).
		</div>
        <div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-3 uk-background-cover " style="height:270px;" data-src={train1} uk-img>
			</div>
</div>
<div class="uk-grid-collapse" uk-grid>
	<div class="uk-card uk-light uk-flex uk-flex-center uk-flex-middle uk-width-1-4" style="height:250px; background-color: #0076b6;">
		<h1 style="transform: rotate(-90deg);">ABOUT US</h1>
	</div>
	<div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-2" style="height:250px; background-color: #f5f5f5;">
		
		<div class="uk-card uk-card-body uk-align-center uk-text-center">
			<h1 class = "uk-text-center uk-margin-top uk-margin-remove-bottom" style = "font-weight:600;">Filipe Teixeira</h1>
			<p class = "uk-margin-remove-top uk-margin-remove-bottom uk-padding-remove function" style="color:#9e9e9e">Postdoctoral researcher at the Department of Geography (Ghent University)</p>
			<div class = "uk-align-center uk-text-center uk-margin-small">
				<span class="uk-badge" style="background-color:#0076b6;">coordination</span>
				<span class="uk-badge" style="background-color:#0076b6">development</span>
				<span class="uk-badge" style="background-color:#0076b6">concept</span>
				<span class="uk-badge" style="background-color:#0076b6">design</span>
				<span class="uk-badge" style="background-color:#0076b6">R/shiny</span>
				<span class="uk-badge" style="background-color:#0076b6">Svelte</span>
			</div>
			
			<div class= "uk-margin-remove uk-padding-remove">
				<a href="https://github.com/FilipeamTeixeira" target="_blank">
					<span uk-icon="icon: github; ratio: 1.2" class = "uk-icon-link"></span>
				</a>
				<span>&nbsp;</span>
					<a href="https://twitter.com/filipeabroad" target="_blank">
						<span uk-icon="icon: twitter; ratio: 1.2" class = "uk-icon-link"></span>
				</a>
			</div>

			</div>
		</div>

	<div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-4" style="height:250px; background-color: #C7CEF6;">
	</div>
</div>
<div class="uk-grid-collapse" uk-grid>
	<div class="uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-5" style="height:250px; background-color: #7496D2;">

		<div class="uk-card uk-card-body uk-align-center uk-text-center">
			<h1 class = "uk-text-center uk-margin-top uk-margin-remove-bottom" style = "font-weight:600;">Freke Caset</h1>
			<p class = "uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom">Postdoctoral researcher at the Department of Geography (Ghent University)</p>
			<div class = "uk-align-center uk-text-center uk-margin-small">
				<span class="uk-badge" style="color:#8E96C7!important;">concept</span>
				<span class="uk-badge" style="color:#8E96C7!important;">coordination</span>
				<span class="uk-badge" style="color:#8E96C7!important;">development</span>
				<span class="uk-badge" style="color:#8E96C7!important;">survey development</span>
			</div>

			<div class= "uk-margin-remove uk-padding-remove">
					<a href="https://twitter.com/c_freke" target="_blank">
						<span uk-icon="icon: twitter; ratio: 1.2" class = "uk-icon-link"></span>
				</a>
			</div>

		</div>

	</div>
	<div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-3-5 uk-background-cover" style="height:250px;" data-src={train2} uk-img></div>
</div>
<div class="uk-grid-collapse" uk-grid>
	<div class="uk-card uk-flex uk-flex-center uk-flex-middle uk-width-3-5 uk-background-cover" style="height:250px;" data-src={train3} uk-img></div>
	<div class="uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-5" style="height:250px; background-color: #d04444;">
		
		<div class="uk-card uk-card-body uk-align-center uk-text-center">
			<h1 class = "uk-text-center uk-margin-top uk-margin-remove-bottom uk-padding-remove" style = "font-weight:600; font-size:30px;">Environmental Department</h1>
			<h1 class = "uk-text-center uk-margin-remove-top uk-margin-remove-bottom uk-padding-remove" style = "font-weight:600; font-size:30px;">and Green Office</h1>
			<p class = "uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom">Riet Van de Velde</p>
			<p class = "uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom">Pieter Van Vooren</p>
			<div class = "uk-align-center uk-text-center uk-margin-small">	
				<span class="uk-badge" style="color:#d04444!important;">coordination</span>
				<span class="uk-badge" style="color:#d04444!important;">concept</span>
			</div>

			<div class= "uk-margin-remove uk-padding-remove uk-align-center">
					<a href="https://www.facebook.com/Duurzaamheidskantoor" target="_blank">
						<span uk-icon="icon: facebook; ratio: 1.2" class = "uk-icon-link"></span>
				</a>
			
				<span>&nbsp;</span>
					<a href="https://www.ugent.be/duurzaam" target="_blank">
						<span uk-icon="icon: home; ratio: 1.1" class = "uk-icon-link"></span>
				</a>
			</div>

		</div>
		
		
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

.function{
	font-weight:100;
	font-family:Helvetica;
	font-size:14px;
}


</style>
