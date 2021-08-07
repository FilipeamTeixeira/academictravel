<script>

</script>


<div class="uk-section" style = "background-color:#C2EDCE">
    <div class="uk-container">


        <div class="uk-margin">
            <form class="uk-search uk-search-default uk-align-center">
                <span uk-search-icon></span>
                <input class="uk-search-input uk-text-lighter" type="search" placeholder="Search">
            </form>

        </div>
    </div>
</div>


<div uk-filter="target: .filter" class="uk-width-1-1 filter-main">
<div class="uk-section uk-margin-large-left uk-padding-small-top" style="background-color: #F5F5F5;">
    <div class="uk-grid-match uk-child-width-1-3@m uk-grid-small" uk-grid >
    <div>
        <div class="uk-tile uk-padding-remove-top">
            <p class="uk-h4">Basic</p>
                <ul uk-accordion>
                    <li>
                    <a class="uk-accordion-title" href="#">What is a train?</a>
                        <div class="uk-accordion-content">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                    </li>
                    <li>
                        <a class="uk-accordion-title"  href="#">Can I get to an island by train?</a>
                        <div class="uk-accordion-content">
                            <p>No</p>
                        </div>
                    </li>
                </ul>
        </div>
    </div>
        <div>
            <div class="uk-tile uk-padding-remove-top">
                <p class="uk-h4">Existential</p>
                    <ul uk-accordion>
                        <li>
                            <a class="uk-accordion-title" href="#">Am I a train?</a>
                            <div class="uk-accordion-content">
                                <p>No</p>
                            </div>
                        </li>
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
font-weight: 100;
}

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

.uk-h4{
    color:#94bb9f;
    font-weight: 300;
}

.uk-accordion-title{
    font-weight: 300;
    font-size: medium;
}

.uk-accordion-content{
    font-weight: 300;
    font-size: small;
}

</style>