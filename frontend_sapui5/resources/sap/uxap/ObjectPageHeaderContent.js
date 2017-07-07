/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","./library","sap/m/Button","./ObjectImageHelper"],function(C,l,B,O){"use strict";var a=C.extend("sap.uxap.ObjectPageHeaderContent",{metadata:{library:"sap.uxap",properties:{contentDesign:{type:"sap.uxap.ObjectPageHeaderDesign",group:"Misc",defaultValue:sap.uxap.ObjectPageHeaderDesign.Light}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},_editHeaderButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_objectImage:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_placeholder:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}}}});a.prototype.onBeforeRendering=function(){var p=this.getParent(),e=this.getAggregation("_editHeaderButton");if(e){return;}if(p&&(p instanceof l.ObjectPageLayout)&&p.getShowEditHeaderButton()){e=this._getInternalBtnAggregation("_editHeaderButton","EDIT_HEADER","-editHeaderBtn","Transparent");e.attachPress(this._handleEditHeaderButtonPress,this);}};a.prototype.exit=function(){var e=this.getAggregation("_editHeaderButton");if(e){e.detachPress(this._handleEditHeaderButtonPress,this);}};a.prototype._handleEditHeaderButtonPress=function(e){this.getParent().fireEditHeaderButtonPress();};a.prototype._getInternalBtnAggregation=function(A,b,s,c){if(!this.getAggregation(A)){var o=new B({text:l.i18nModel.getResourceBundle().getText(b),type:c,id:this.getId()+s});this.setAggregation(A,o);}return this.getAggregation(A);};a.prototype._getObjectImage=function(){if(!this.getAggregation("_objectImage")){var p=this.getParent(),h=p&&p.getHeaderTitle&&p.getHeaderTitle(),o=h&&O.createObjectImage(h);if(o){this.setAggregation("_objectImage",o,true);}}return this.getAggregation("_objectImage");};a.prototype._destroyObjectImage=function(s){var o=this.getAggregation("_objectImage");if(o){o.destroy();this.getAggregation("_objectImage",null,s);}};a.prototype._getPlaceholder=function(){if(!this.getAggregation("_placeholder")){var p=this.getParent(),h=p&&p.getHeaderTitle&&p.getHeaderTitle(),s=h.getShowPlaceholder();var P=s&&O.createPlaceholder();if(P){this.setAggregation("_placeholder",P,true);}}return this.getAggregation("_placeholder");};a.prototype._getLayoutDataForControl=function(c){var L=c.getLayoutData();if(!L){return;}else if(L instanceof l.ObjectPageHeaderLayoutData){return L;}else if(L.getMetadata().getName()=="sap.ui.core.VariantLayoutData"){var b=L.getMultipleLayoutData();for(var i=0;i<b.length;i++){var o=b[i];if(o instanceof l.ObjectPageHeaderLayoutData){return o;}}}};return a;});
