sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'testproject/test/integration/FirstJourney',
		'testproject/test/integration/pages/BusinessPartnersList',
		'testproject/test/integration/pages/BusinessPartnersObjectPage'
    ],
    function(JourneyRunner, opaJourney, BusinessPartnersList, BusinessPartnersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('testproject') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBusinessPartnersList: BusinessPartnersList,
					onTheBusinessPartnersObjectPage: BusinessPartnersObjectPage
                }
            },
            opaJourney.run
        );
    }
);