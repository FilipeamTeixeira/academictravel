<script context="module">
	export const prerender = true;
import FaqEn from "./faq_en.svelte";

</script>


<div class="uk-section" style = "background-color:#C2EDCE">
    <div class="uk-container">

        <div class="uk-margin">
            <h1 class = "uk-heading-small uk-text-center uk-text-lighter" style="color:#5b8a68">Frequently asked questions</h1>
            <h4 class = "uk-margin-remove uk-padding-remove uk-text-center uk-text-lighter" style="color:#5b8a68">If your question cannot be found below, please feel free to contact us.</h4>

           <!-- <form class="uk-search uk-search-default uk-align-center">
                <span uk-search-icon></span>
                
                <input bind:value={searchTerm} uk-filter-control="" class="uk-search-input uk-text-lighter" type="search" placeholder="Search">
            </form>
            -->
        </div>
    </div>
</div>    
    

<FaqEn />

<style>

.uk-search-input{
    border: 0px;
    padding: 25px 0;
}

.uk-search{
  border-radius: 15px;
  border: 0px;
  background-color: white;
  width: 600px;
  height: 50px;
}


</style>


<!--
        <div>
            <div class="uk-tile uk-padding-remove-top">
                <p class="uk-h4">TRAIN SUPPLY</p>
                <ul uk-accordion>
                    <li>
                        <a class="uk-accordion-title"  href="#">Title</a>
                        <div class="uk-accordion-content">
                            <p>Text</p>
                        </div>
                    </li>
                    <li>
                        <a class="uk-accordion-title"  href="#">Title</a>
                        <div class="uk-accordion-content">
                            <p>Text</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

-->