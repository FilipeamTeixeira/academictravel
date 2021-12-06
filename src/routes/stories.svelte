<script context="module">
    export const prerender = true;
    import stories from "/static/json_files/frdata.json"

</script>

<div class="uk-child-width-1-3@s uk-grid-collapse uk-text-center uk-light" uk-grid>

        {#each stories as stories}
        <a href="#{stories.id}" uk-toggle>
        <div class="uk-tile uk-tile-default zoom uk-transition-toggle uk-animation-toggle" style="background-color:{stories.color}">
            <h1 class = "uk-text-center uk-margin-medium-left" style = "font-weight:600;">{stories.first_name} {stories.last_name} </h1>
            <p class = "uk-text-meta uk-text-center uk-margin-medium-left">{stories.bio}</p>
            <!-- removed class="uk-transition-slide-bottom-small"-->
            <div class="uk-card-footer uk-position-bottom">
                <span class = "uk-light uk-margin-small-right" uk-icon="info"></span>
                <span class = "uk-light" style="font-size: 14px;">Read story</span>
            </div>
        </div>
        </a>
        {/each}

</div>


<div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1" uk-slider>



<a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
<a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>

</div>

<!-- TODO:
    1- add id to name in shiny
    2- add 3 parts of the story-->

{#each stories as stories}
<div id={stories.id} class="uk-modal-full" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>
        <div class="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" uk-grid>
<!--            <div class="uk-background-cover" style="background-image: url('/static/stories_pics/{stories.picture}');" uk-height-viewport></div>
            <div class="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover" data-src = "static/stories_pics/{stories.picture}" uk-img uk-height-viewport></div>
-->
            <img src = "/stories_pics/{stories.picture}" alt="">
            <div class="uk-padding-large">
                <h1>{stories.first_name} {stories.last_name}</h1>
                <p class = "uk-text-meta">{stories.bio}</p>
                <h1 style = "text-align:left; font-size:20px; font-weight:600;">Which initiatives have you taken/are you taking?</h1>
                <p class = "uk-text-justify">{stories.storyA}</p>
                <h1 style = "text-align:left; font-size:20px; font-weight:600;">Do you have any tips to convince your colleagues?</h1>
                <p class = "uk-text-justify">{stories.storyB}</p>
            </div>
        </div>
    </div>
</div>
{/each}


<style>

a:hover, a:visited, a:link, a:active{
    text-decoration: none;
}

.zoom:hover {
  transform: scale(1.1);
  z-index: 3;
  position:relative;
} 

.uk-section{
    margin:20px;
}
.uk-card-body{
    color: rgb(61, 61, 61);
    font-family: Roboto;
    font-weight: 200;
    font-size: 18px;
}


</style>




<!--

            {#each stories as stories}
        <div class="uk-grid-divider uk-child-width-expand@s frontrun" uk-grid>

    <div>
        <div class="uk-card">
            <div class="uk-card-media-top">
                <img src = {stories.picture} alt = "">
            </div>
            <div class="uk-card-body">
                <h3 class="uk-card-title">{stories.name}</h3>
                <p>{stories.bio}</p>
            </div>
        </div>
    </div>
    <div>
        <h3>Story</h3>
        <p class = "uk-text-justify">
            {stories.story}
        </p>
    </div>
    </div>
    {/each}

-->

<!--
    Colors:
    675864
    d37861
    144a81
    d04444
    93b3ad
    147074
    0076b6
-->