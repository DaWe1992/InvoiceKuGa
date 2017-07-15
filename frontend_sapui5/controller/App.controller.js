/**
 * AppController.
 * 04.07.2017
 *
 * @author Daniel Wehner
 */
sap.ui.define([
    "com/danielwehner/invoicekuga/controller/BaseController",
    "com/danielwehner/invoicekuga/service/SessionService",
    "sap/m/Popover",
	"sap/m/Button",
    "sap/m/Label"
], function(BaseController, SessionService, Popover, Button, Label) {
    "use strict";

    return BaseController.extend("com.danielwehner.invoicekuga.controller.App", {

        /**
         * onInit function.
         * Sets the content density class for the app.
         */
        onInit: function() {
            /*this.getView().addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
            );*/
        },

        /**
         * Toggles side bar navigation.
         */
        onSideNavButtonPress: function() {
            var viewId = this.getView().getId();
            var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
            var sideExpanded = toolPage.getSideExpanded();

            // toggle side navigation
			toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },

        /**
         * Displays a popover when
         * the user name is pressed.
         *
         * @param oEvent
         */
        handleUserNamePress: function(oEvent) {
			var oPopover = new Popover({
                showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content: [
                    new Button({
                        text: "Nutzer",
                        icon: "sap-icon://notes",
                        type: sap.m.ButtonType.Transparent,
                        press: ""
                    }),
					new Button({
						text: "Logout",
                        icon: "sap-icon://log",
						type: sap.m.ButtonType.Transparent,
                        press: this.logout
					})
				]
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

			oPopover.openBy(oEvent.getSource());
		},

        /**
         * Logs user out.
         */
        logout: function() {
            new SessionService().logout(
                function() {location.reload();},
                function() {}
            );
        },

		/**
		 * Navigates to the customer page.
		 */
		onNavToCustomers: function() {
			this.getRouter().navTo("customers");
		},

        /**
         * Navigates to the earnings page.
         */
        onNavToEarnings: function() {
            this.getRouter().navTo("earnings");
        }
    });
});
