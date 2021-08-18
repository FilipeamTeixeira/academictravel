
<script>

import json_faq from "/static/json_files/faq_en.json"

</script>

<div uk-filter="target: .filter" class="uk-width-1-1">

    <div class="uk-section uk-margin-small-left uk-margin-small-right uk-padding-small-top" style="background-color: #F5F5F5;">
        <div class="uk-grid-match uk-child-width-1-3@m uk-grid-small  uk-padding-remove-bottom uk-margin-remove-bottom" uk-grid >
        <div>
            <div class="uk-tile uk-padding-remove-top">
                <p class="uk-h4">ACCESSIBILITY BY TRAIN</p>
                    <ul uk-accordion class = "filter">
                            {#each json_faq['accessibility'] as faq}
                                <li class = "skills-el" data-name = "div 1">
                                <a class="uk-accordion-title" href="#">{faq.title}</a>
                                    <div class="uk-accordion-content">
                                        <p>{faq.content}</p>
                                    </div>
                                </li>
                                {/each}
                    </ul>
            </div>
        </div>
            <div>
                <div class="uk-tile uk-padding-remove-top">
                    <p class="uk-h4">RESERVATION</p>
                        <ul uk-accordion>
                                {#each json_faq['reservation'] as faq}
                                    <li>
                                    <a class="uk-accordion-title" href="#">{faq.title}</a>
                                        <div class="uk-accordion-content">
                                            <p>{faq.content}</p>
                                        </div>
                                    </li>
                                    {/each}
                        </ul>
                </div>
            </div>
    
            <div>
                <div class="uk-tile uk-padding-remove-top uk-margin-remove-top">
                    <p class="uk-h4">POSSIBLE OBSTACLES</p>
                    <ul uk-accordion>
                            {#each json_faq['obstacles'] as faq}
                                <li>
                                <a class="uk-accordion-title" href="#">{faq.title}</a>
                                    <div class="uk-accordion-content">
                                        <p>{faq.content}</p>
                                    </div>
                                </li>
                                {/each}
                    </ul>
                </div>
            </div>
        </div>
    
            <div class="uk-grid-match uk-child-width-1-3@m uk-grid-small uk-padding-remove-top uk-margin-remove-top" uk-grid >
                    <div>
                        <div class="uk-tile uk-padding-remove-top uk-margin-remove-top">
                            <p class="uk-h4">SUSTAINABILITY</p>
                            <ul uk-accordion>
                                    {#each json_faq['sustainability'] as faq}
                                        <li>
                                        <a class="uk-accordion-title" href="#">{faq.title}</a>
                                            <div class="uk-accordion-content">
                                                <p>{faq.content}</p>
                                            </div>
                                        </li>
                                        {/each}
                            </ul>
                        </div>
                    </div>
    
                <div>
                    <div class="uk-tile uk-padding-remove-top uk-margin-remove-top">
                        <p class="uk-h4">TRAVEL TIPS</p>
                        <ul uk-accordion>
                                {#each json_faq['tips'] as faq}
                                    <li>
                                    <a class="uk-accordion-title" href="#">{faq.title}</a>
                                        <div class="uk-accordion-content">
                                            <p>{faq.content}</p>
                                        </div>
                                    </li>
                                    {/each}
                        </ul>
                    </div>
                </div>
            </div>
    
        </div>
    </div>

<style>

.uk-accordion-title{
color: rgb(61, 61, 61);
font-family: Roboto;
font-weight: 300;
font-size: 14px;
}

.uk-h4{
    color:#94bb9f;
    font-weight: 300;
    font-size:18px;
}

.uk-accordion-content{
    font-weight: 300;
    font-size: small;
}
</style>