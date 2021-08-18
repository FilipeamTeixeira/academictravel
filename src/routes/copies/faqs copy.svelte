<script>


async function getUsers() {
    let response = await fetch("/static/json_files/new_json.json");
    let users = await response.json();
    return users;
  }
  const promise = getUsers();
    
    </script>
    

    
    <div class="uk-section" style = "background-color:#C2EDCE">
        <div class="uk-container">
    
            <div class="uk-margin">
                <form class="uk-search uk-search-default uk-align-center">
                    <span uk-search-icon></span>
                    <input onkeyup="filterSearch();" class="uk-search-input uk-text-lighter" type="search" placeholder="Search">
                </form>
    
            </div>
        </div>
    </div>    
        
    
    <div uk-filter="target: .filter" class="uk-width-1-1 filter-main">
    <div class="uk-section uk-margin-small-left uk-margin-small-right uk-padding-small-top" style="background-color: #F5F5F5;">
        <div class="uk-grid-match uk-child-width-1-3@m uk-grid-small  uk-padding-remove-bottom uk-margin-remove-bottom" uk-grid >
        <div>
            <div class="uk-tile uk-padding-remove-top">
                <p class="uk-h4">ACCESSIBILITY BY TRAIN</p>
                    <ul uk-accordion>
                        <li>
                        <a class="uk-accordion-title" href="#">Which cities can you reach relatively comfortably by train in less than 8 hours of travel?</a>
                            <div class="uk-accordion-content">
                                <p>Click on the 'maps' tab. Here you can find an overview of these cities, along with an estimate of the travel time and number of transfers.</p>
                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title"  href="#">Which cities can you reach relatively comfortably by night train?</a>
                            <div class="uk-accordion-content">
                                <p>Here you will find an overview of the night trains, e.g. from Brussels (to Vienna and Innsbruck), from Cologne (to Munich and Nuremberg), from Hendaye (to Madrid), ... In 2022, trains will also go from Brussels to Malmö and Berlin.</p>
                            </div>
                        </li>
                    </ul>
            </div>
        </div>
            <div>
                <div class="uk-tile uk-padding-remove-top">
                    <p class="uk-h4">RESERVATION</p>
                        <ul uk-accordion>
                            <li>
                                <a class="uk-accordion-title" href="#">Where can I book long-distance trains?</a>
                                <div class="uk-accordion-content">
                                    <p>UGent employees can use our contract with Uniglobe Smart Travel. This organisation takes care of your train booking. You can also book directly via SNCB. For complicated routes you can also make use of HappyRail. Booking well in advance (3 to 6 months before your trip) is recommended.</p>
                                </div>
                            </li>
                            <li>
                                <a class="uk-accordion-title"  href="#">How do you book a night train?</a>
                                <div class="uk-accordion-content">
                                    <p>This depends on the train company that operates the train. All information can be found here.</p>
                                </div>
                            </li>
                            <li>
                                <a class="uk-accordion-title"  href="#">Can you use an Interrail Global Pass?</a>
                                <div class="uk-accordion-content">
                                    <p>The Interrail Global pass is not only available for youngsters! It can also be financially advantageous for staff when the train ticket is expensive or when you travel to multiple destinations in a short period of time. A pass for 4 travel days within 1 month costs 246 EUR. For young people the fares are much lower. Please mind: for high speed trains there may be extra charges for reservations. </p>
                                </div>
                            </li>
                            <li>
                                <a class="uk-accordion-title"  href="#">Will external funders accept a more expensive train ticket when compared to a flight ticket?</a>
                                <div class="uk-accordion-content">
                                    <p>Each institution should pursue ambitious CO2 reduction objectives. If you do encounter problems, you can always contact duurzaam@ugent.be. We will then try to start a dialogue with them.</p>
                                </div>
                            </li>
                        </ul>
                </div>
            </div>
    
            <div>
                <div class="uk-tile uk-padding-remove-top uk-margin-remove-top">
                    <p class="uk-h4">POSSIBLE OBSTACLES</p>
                    <ul uk-accordion>
                        <li>
                            <a class="uk-accordion-title"  href="#">Is there a compensation for more expensive train tickets for UGent staff?</a>
                            <div class="uk-accordion-content">
                                <p>Train travel is subsidized by 30 EUR for train tickets > 100 EUR or by 100 EUR for train tickets > 200 EUR. You can find the procedure here.</p>
                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title"  href="#">Is there a compensation for more expensive train tickets for visitors?</a>
                            <div class="uk-accordion-content">
                                <p>If the train ticket is not purchased by a staff member from Ghent University, then there is no compensation. We rely on similar efforts by the visitor's organization. If the train ticket is purchased by Ghent University, then the same subsidy scheme applies.</p>
                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title"  href="#">Is there a compensation for more expensive train tickets for UGent students?</a>
                            <div class="uk-accordion-content">
                                <p>There will be a top-up grant for students who want to travel sustainably. A first phase will involve Erasmus+ and we hope to later extend this for all student travel grants.</p>
                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title"  href="#">Will you be compensated if the train journey makes your travel a day or so longer?</a>
                            <div class="uk-accordion-content">
                                <p>Yes. A daily allowance can be obtained for the extra day of travel. There is also an allowance for students.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    
            <div class="uk-grid-match uk-child-width-1-3@m uk-grid-small uk-padding-remove-top uk-margin-remove-top" uk-grid >
                    <div>
                        <div class="uk-tile uk-padding-remove-top uk-margin-remove-top">
                            <p class="uk-h4">SUSTAINABILITY</p>
                            <ul uk-accordion>
                                <li>
                                    <a class="uk-accordion-title"  href="#">What is the difference in CO2 emissions between my flight and my train journey?</a>
                                    <div class="uk-accordion-content">
                                        <p>With the Ecopassenger site you can compare the CO2 impact of your trip by train or plane.</p>
                                    </div>
                                </li>
                                <li>
                                    <a class="uk-accordion-title"  href="#">How does Ghent University stimulate more sustainable academic travel?</a>
                                    <div class="uk-accordion-content">
                                        <p>With a sustainable travel policy, Ghent University commits itself to fly less and to travel more conscientiously and more sustainably. We aim to reduce the CO2 emissions of the total air travel by at least 1/3rd by 2030 as compared to 2019.</p>
                                    </div>
                                </li>
                                <li>
                                    <a class="uk-accordion-title"  href="#">Can we monitor the CO2 impact of our business trips?</a>
                                    <div class="uk-accordion-content">
                                        <p>Yes. Targets have been defined for each faculty (at least 1/3 reduction in CO2 emissions from flights by 2030 as compared to 2019). These are monitored annually using a mobility barometer.</p>
                                    </div>
                                </li>
                                <li>
                                    <a class="uk-accordion-title"  href="#">How can we convince our fellow colleagues at Ghent University to travel more sustainably?</a>
                                    <div class="uk-accordion-content">
                                        <p>Awareness-raising material will be distributed and can be requested at duurzaam@ugent.be. Additionally, the faculty-specific mobility barometer (which will be extended to the departments in a later phase) will keep the pressure high and will hopefully nudge people towards reaching our ambitious goals together.</p>
                                    </div>
                                </li>
                                <li>
                                    <a class="uk-accordion-title"  href="#">How can we also convince our research partners to take the train more often?</a>
                                    <div class="uk-accordion-content">
                                        <p>There is a call for UGent to take the lead in international research partnerships by making prior agreements on travel behavior. Here you can find an example of a charter that you can draw on together with your research partners.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
    
                <div>
                    <div class="uk-tile uk-padding-remove-top uk-margin-remove-top">
                        <p class="uk-h4">TRAVEL TIPS</p>
                        <ul uk-accordion>
                            <li>
                                <a class="uk-accordion-title"  href="#">Getting to and from the station</a>
                                <div class="uk-accordion-content">
                                    <p>As is the case when travelling to and from an airport, it is easy to use a taxi service at European railway stations. If you know the area well (or you want to prepare well), you can also use the bus or a shared bicycle system. In Belgium there is BlueBike, in the Netherlands the OV-bike, and there are plenty of other local initiatives, for example, in the UK and in Switzerland.</p>
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
    font-weight: 300;
    font-size: 14px;
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
        font-size:18px;
    }
    
    .uk-accordion-content{
        font-weight: 300;
        font-size: small;
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

    <!--
        {#await promise}
                            <p>Loading...</p>
                            {:then user}
    -->