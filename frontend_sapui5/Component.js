/**
 * Main Component of the App.
 * 03.07.2017
 * @author Daniel Wehner
 */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/resource/ResourceModel"
], function (UIComponent, ResourceModel) {
    "use strict";

    return UIComponent.extend("com.danielwehner.invoicekuga.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // set i18n model
            var i18nModel = new ResourceModel({
                bundleName : "com.danielwehner.invoicekuga.i18n.i18n"
            });

            this.setModel(i18nModel, "i18n");
        }
    });
});
