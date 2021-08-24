<script context="module">
	export const prerender = true;
    import banner from "/static/pictures/banner.jpg"
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="uk-child-width-1-1@s uk-grid-collapse uk-text-left" uk-grid>
	<div>
		<div class="uk-tile">
		</div>
	</div>
</div>


<div class="uk-section uk-section-small" style = "background-color:#0076b6;">
    <div class="uk-card uk-card-body">

        <h3 class="uk-card-title uk-light">Sustainable travel</h3>
        
            <p class ="uk-light" style = "font-family:Helvetica; font-weight:100;">
                De UGent engageert zich om minder, doordachter en duurzamer te vliegen en zo de CO2-uitstoot van haar vliegreizen tegen 2030 met minstens 1/3de te reduceren t.o.v. 2019.
                Meer informatie: <a href="http://www.ugent.be/reisbeleid" target="_blank">http://www.ugent.be/reisbeleid</a>
            </p>
        
            <p class ="uk-light" style = "font-family:Helvetica; font-weight:100;">
                Ghent University commits itself to fly less, more thoughtfully and more sustainably, and thus to reduce the CO2 emissions of its air travel by at least 1/3rd by 2030 compared to 2019.
                More information: <a href="http://www.ugent.be/travelpolicy" target="_blank">www.ugent.be/travelpolicy</a>
            </p>

    </div>
</div>

    <div class="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover" data-src={banner} uk-img>
    </div>




<style>

</style>
