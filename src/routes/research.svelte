<script>

    import { onMount } from 'svelte';

    let message = "<span style = 'font-size=20px; font-weight:100;'></span> Some of the maps that are displayed in this section were developed by crowdsourcing information from the UGent community. By means of this survey, we ask for information about one particular sustainable UGent-related trip: how did you travel? How about travel expenses? Did you take any transfers? How was the comfort like? Did you enjoy your trip? Etc. By consolidating this input into interactive maps, you easily get a sense of where and how UGent colleagues have traveled and how they experienced their trips. More detailed stories can be consulted in the ‘Community stories’ tab page of this website. Take a look at the growing pool of examples – and get inspired! Do you want to help us build these maps? Did you travel sustainably for UGent-related purposes? Please fill in this survey! We would love to hear from you."
    //onMount(UIkit.notification({message: 'Notification message'}))
    onMount(UIkit.modal.alert(message));

</script>

<!-- This is the modal -->

<div id="popup-window" class="uk-modal-full" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>
        <div class="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" uk-grid>
            <div class="uk-background-cover" uk-height-viewport></div>
            <div class="uk-padding-large">
                <h1>Test</h1>
            </div>
        </div>
    </div>
</div>

