<script>
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
    <div class="uk-card uk-card-body uk-align-center uk-text-justify">

        <h3 class="uk-card-title uk-light">Sustainable travel policy</h3>
        
            <p class ="uk-light" style = "font-family:Helvetica; font-weight:100;">
                De UGent engageert zich om minder, doordachter en duurzamer te vliegen en zo de CO2-uitstoot van haar vliegreizen tegen 2030 met minstens 1/3de te reduceren t.o.v. 2019.
                Meer informatie: <a href="http://www.ugent.be/reisbeleid" target="_blank">http://www.ugent.be/reisbeleid</a>
            </p>
        
            <p class ="uk-light" style = "font-family:Helvetica; font-weight:100;">
                Ghent University commits itself to fly less, more thoughtfully and more sustainably, and thus to reduce the CO2 emissions of its air travel by at least 1/3rd by 2030 compared to 2019.
                More information: <a href="http://www.ugent.be/travelpolicy" target="_blank">www.ugent.be/travelpolicy</a>
            </p>
            <hr class="uk-grid-divider uk-margin-left uk-margin-right uk-margin-medium-top uk-light">
            <h3 class="uk-card-title uk-light">Help us build this tool</h3>

            <p class ="uk-light" style = "font-family:Helvetica; font-weight:100;">
                Some of the maps that are displayed on this website were developed by crowdsourcing information from the UGent community. By means of a survey, we ask for information about one particular sustainable UGent-related trip: how did you travel? How about travel expenses? Did you take any transfers? How was the comfort like? Did you enjoy your trip? Etc. By consolidating this input into interactive maps, you easily get a sense of where and how UGent colleagues have traveled and how they experienced their trips. More detailed stories can be consulted in the ‘Community stories’ tab page on this website. Take a look at the growing pool of examples – and get inspired! Do you want to help us build these maps? Did you travel sustainably for UGent-related purposes? Please fill in this 
                <a href="https://www.enquete.ugent.be/survey322/index.php/676424?lang=en" target="_blank">survey</a>! We would love to hear from you.
            </p>

    </div>
</div>

    <div class="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover" data-src={banner} uk-img>
    </div>




<style>

</style>
