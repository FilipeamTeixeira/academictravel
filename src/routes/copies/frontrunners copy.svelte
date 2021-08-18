<script>

  import stories from "/static/json_files/frdata.json"

</script>


<div class = "uk-margin-medium-top uk-margin-remove uk-section">
<div class="uk-grid-collapse uk-child-width-expand@s uk-text-center uk-margin-large-top uk-margin" uk-grid>
    {#each stories as stories}
    <a href="#{stories.id}" uk-toggle>
        <div class="uk-visible-toggle uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light" data-src={stories.picture} uk-img>
            <h1 class="uk-invisible-hover" style = "font-weight:100;">{stories.name}</h1>
        </div>
    </a>
    <!--
    <div>
        <a href="#{stories.id}" uk-toggle>
            <img class="uk-background-muted uk-padding" src = {stories.picture} alt = "">
        </a>
    </div> -->
    {/each}
</div>
</div>

<!-- TODO:
    1- add id to name in shiny
    2- add 3 parts of the story-->

{#each stories as stories}
<div id={stories.id} class="uk-modal-full" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>
        <div class="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" uk-grid>
            <div class="uk-background-cover" style="background-image: url('images/photo.jpg');" uk-height-viewport></div>
            <div class="uk-padding-large">
                <h1>{stories.name}</h1>
                <p class = "uk-text-meta">{stories.bio}</p>
                <p class = "uk-text-justify">{stories.story}</p>
            </div>
        </div>
    </div>
</div>
{/each}


<style>

a:hover, a:visited, a:link, a:active{
    text-decoration: none;
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
