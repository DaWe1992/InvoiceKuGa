/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/Filter','sap/ui/model/TreeBinding','sap/ui/model/odata/v2/ODataTreeBinding','sap/ui/model/ChangeReason','sap/ui/model/TreeBindingUtils'],function(q,F,T,O,C,c){"use strict";var d=function(){if(!(this instanceof T)||this._bIsAdapted){return;}for(var f in d.prototype){if(d.prototype.hasOwnProperty(f)){this[f]=d.prototype[f];}}this.mParameters=this.mParameters||{};this._iPageSize=0;this._aNodes=this._aNodes||[];this._aNodeCache=[];this._aCollapsed=this._aCollapsed||[];this._aExpanded=this._aExpanded||[];this._aRemoved=[];this._aAdded=[];this._aNodeChanges=[];this._aAllChangedNodes=[];this._mSubtreeHandles={};this._iLowestServerLevel=null;this._aExpandedAfterSelectAll=this._aExpandedAfterSelectAll||[];this._mSelected=this._mSelected||{};this._mDeselected=this._mDeselected||{};this._bSelectAll=false;this._iLengthDelta=0;if(this.mParameters.collapseRecursive===undefined){this.bCollapseRecursive=true;}else{this.bCollapseRecursive=!!this.mParameters.collapseRecursive;}this._bIsAdapted=true;this._bReadOnly=true;this._aPendingRequests=[];this._aPendingChildrenRequests=[];};d.prototype.setNumberOfExpandedLevels=function(l){this.resetData();O.prototype.setNumberOfExpandedLevels.apply(this,arguments);};d.prototype.getContexts=function(s,l,t,r){if(this.isInitial()){return[];}s=s||0;l=l||this.oModel.sizeLimit;t=t||0;this._iPageSize=l;this._iThreshold=t;if(this._aNodes.length==0&&!this.isLengthFinal()){this._loadData(s,l,t);}var R=[];var n=this._retrieveNodeSection(s,l);this._aNodeCache=[];var S;var a=0;var L=0;var g={};for(var i=0;i<n.length;i++){var N=n[i];this._aNodeCache[s+i]=N&&N.context?N:undefined;R.push(N.context);if(!N.context){if(N.serverIndex!=undefined){if(S==undefined){S=N.serverIndex;}L=N.serverIndex;}else if(N.positionInParent!=undefined){var p=N.parent;g[p.key]=g[p.key]||[];g[p.key].push(N);}}}a=1+Math.max(L-(S||0),0);if(S!=undefined&&a){this._loadData(S,a,t);}for(var m in g){var o=this._calculateRequestParameters(g[m]);this._loadChildren(g[m][0].parent,o.skip,o.top);}if(r){return n;}else{return R;}};d.prototype._calculateRequestParameters=function(m){var p=m[0].parent;var M=m[0].positionInParent;var a=Math.min(M+Math.max(this._iThreshold,m.length),p.children.length);for(var i=M;i<a;i++){var o=p.children[i];if(o){break;}}return{skip:M,top:i-M};};d.prototype._retrieveNodeSection=function(s,l){return this._bReadOnly?this._indexRetrieveNodeSection(s,l):this._mapRetrieveNodeSection(s,l);};d.prototype._mapRetrieveNodeSection=function(s,l){var n=-1;var N=[];this._map(function(o,r,i,I,p){n++;if(n>=s){if(!o){if(i=="serverIndex"){o={serverIndex:I};}else if(i=="positionInParent"){o={positionInParent:I,parent:p};}}N.push(o);}if(N.length>=l){r.broken=true;}});return N;};d.prototype._indexRetrieveNodeSection=function(s,l){var i,n=[],N,o;for(i=s;i<s+l;i++){N=this.getNodeInfoByRowIndex(i);if(N.index!==undefined&&N.index<this._aNodes.length){o=this._aNodes[N.index];if(!o){o={serverIndex:N.index};}}else if(N.parent){o=N.parent.children[N.childIndex];if(!o){o={parent:N.parent,positionInParent:N.childIndex};}}if(o){n.push(o);o=null;}}return n;};d.prototype.getNodes=function(s,l,t){var n=this.getContexts(s,l,t,true);return n;};d.prototype._map=function(m){var r={broken:false};var f=function(n){if(n.addedSubtrees.length>0&&!n.nodeState.collapsed){for(var j=0;j<n.addedSubtrees.length;j++){var s=n.addedSubtrees[j];t(n,s);if(r.broken){return;}}}};var t=function(n,s){var S=s._getSubtree();if(s){if(q.isArray(S)){if(s._oSubtreeRoot){b(S,s._oSubtreeRoot.serverIndex,s._oSubtreeRoot,s._oSubtreeRoot.originalLevel||0,n.level+1);}else{b(S,null,null,0,n.level+1);}}else{s._oSubtreeRoot.level=n.level+1;a(s._oSubtreeRoot,false,s._oNewParentNode,-1,s._oSubtreeRoot);}}};var a=function(n,I,p,P,o){if(!I){if(!n.nodeState.removed||o==n){m(n,r,"positionInParent",P,p);if(r.broken){return;}}}f(n);if(r.broken){return;}if(n&&n.children&&n.nodeState.expanded){for(var i=0;i<n.children.length;i++){var e=n.children[i];if(e&&!e.nodeState.removed&&!e.nodeState.reinserted){e.level=n.level+1;}if(e&&!e.nodeState.removed){a(e,false,n,i,o);}else if(!e){m(e,r,"positionInParent",i,n);}if(r.broken){return;}}}};var b=function(e,s,I,S,n){for(var i=0;i<e.length;i++){var N=e[i];if(N&&N.nodeState&&N.nodeState.removed&&N!=I){if(!N.initiallyCollapsed){i+=N.magnitude;}continue;}if(N&&S>=0&&n>=0){N.level=N.originalLevel||0;var l=(N.level-S)||0;N.level=n+l||0;}if(s===null){m(N,r,"newNode");}else{m(N,r,"serverIndex",s+i);}if(r.broken){return;}if(N&&N.nodeState){if(!N.initiallyCollapsed&&N.nodeState.collapsed){i+=N.magnitude;}else{if(N.initiallyCollapsed&&N.nodeState.expanded){a(N,true);if(r.broken){return;}}else if(!N.initiallyCollapsed&&N.nodeState.expanded){f(N);}}}if(r.broken){return;}}};b(this._aNodes,0,null);};d.prototype._loadData=function(s,t,e){var r={iSkip:s,iTop:t+(e||0),iThreshold:e};this._aPendingRequests.sort(function(a,b){return a.iSkip-b.iSkip;});for(var i=0;i<this._aPendingRequests.length;i++){if(c._determineRequestDelta(r,this._aPendingRequests[i])===false){return;}}s=r.iSkip;t=r.iTop;function _(D){var E,k,I,i,a=function(n,j){if(!n.isDeepOne&&!n.initiallyCollapsed&&n.serverIndex<I&&n.serverIndex+n.magnitude>=I){return true;}};var b=this._aPendingRequests.indexOf(r);this._aPendingRequests.splice(b,1);if(!this._bLengthFinal){var h=D.__count?parseInt(D.__count,10):0;this._aNodes[h-1]=undefined;this._bLengthFinal=true;}if(D.results&&D.results.length>0){for(i=0;i<D.results.length;i++){E=D.results[i];k=this.oModel.getKey(E);I=s+i;var m=E[this.oTreeProperties["hierarchy-node-descendant-count-for"]];if(m<0){m=0;q.sap.log.error("The entry data with key '"+k+"' under binding path '"+this.getPath()+"' has a negative 'hierarchy-node-descendant-count-for' which isn't allowed.");}var n=this._aNodes[I]=this._aNodes[I]||{key:k,context:this.oModel.getContext("/"+k),magnitude:m,level:E[this.oTreeProperties["hierarchy-level-for"]],originalLevel:E[this.oTreeProperties["hierarchy-level-for"]],initiallyCollapsed:E[this.oTreeProperties["hierarchy-drill-state-for"]]==="collapsed",nodeState:{isLeaf:E[this.oTreeProperties["hierarchy-drill-state-for"]]==="leaf",expanded:E[this.oTreeProperties["hierarchy-drill-state-for"]]==="expanded",collapsed:E[this.oTreeProperties["hierarchy-drill-state-for"]]==="collapsed",selected:this._mSelected[k]?this._mSelected[k].nodeState.selected:false},children:[],addedSubtrees:[],serverIndex:I,parent:null};this._iLowestServerLevel=Math.min(this._iLowestServerLevel,n.level);if(this._bSelectAll){if(!this._aExpandedAfterSelectAll.some(a)){this.setNodeSelection(n,true);}}}}this.oModel.callAfterUpdate(function(){this.fireDataReceived({data:D});}.bind(this));this._fireChange({reason:C.Change});}function f(E){var a=this._aPendingRequests.indexOf(r);this._aPendingRequests.splice(a,1);var A=E.statusCode==0;if(!A){this._aNodes=[];this._bLengthFinal=true;this._fireChange({reason:C.Change});}this.fireDataReceived();}var u=["$skip="+s,"$top="+t];if(!this._bLengthFinal){u.push("$inlinecount=allpages");}if(this.sCustomParams){u.push(this.sCustomParams);}this.fireDataRequested();var l=new F(this.oTreeProperties["hierarchy-level-for"],"LE",this.getNumberOfExpandedLevels());var g=[l];if(this.aApplicationFilters){g=g.concat(this.aApplicationFilters);}r.oRequestHandle=this.oModel.read(this.getPath(),{context:this.oContext,urlParameters:u,filters:[new F({filters:g,and:true})],sorters:this.aSorters||[],success:_.bind(this),error:f.bind(this),groupId:this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId});this._aPendingRequests.push(r);};d.prototype._propagateMagnitudeChange=function(p,D){while(p!=null&&(p.initiallyCollapsed||p.isDeepOne)){p.magnitude+=D;p=p.parent;}};d.prototype._loadChildren=function(p,s,t){var r={sParent:p.key,iSkip:s,iTop:t};this._aPendingChildrenRequests.sort(function(a,b){return a.iSkip-b.iSkip;});for(var i=0;i<this._aPendingChildrenRequests.length;i++){var P=this._aPendingChildrenRequests[i];if(P.sParent===r.sParent){if(c._determineRequestDelta(r,P)===false){return;}}}s=r.iSkip;t=r.iTop;function _(D){var a=this._aPendingChildrenRequests.indexOf(r);this._aPendingChildrenRequests.splice(a,1);if(p.childCount==undefined&&D&&D.__count){var b=D.__count?parseInt(D.__count,10):0;p.childCount=b;p.children[b-1]=undefined;this._propagateMagnitudeChange(p,b);this._cleanTreeStateMaps();}if(D.results&&D.results.length>0){for(var i=0;i<D.results.length;i++){var E=D.results[i];var k=this.oModel.getKey(E);var n=p.children[s+i]=p.children[s+i]||{key:k,context:this.oModel.getContext("/"+k),magnitude:0,level:p.level+1,originalLevel:p.level+1,initiallyCollapsed:E[this.oTreeProperties["hierarchy-drill-state-for"]]==="collapsed",nodeState:{isLeaf:E[this.oTreeProperties["hierarchy-drill-state-for"]]==="leaf",expanded:E[this.oTreeProperties["hierarchy-drill-state-for"]]==="expanded",collapsed:E[this.oTreeProperties["hierarchy-drill-state-for"]]==="collapsed",selected:this._mSelected[k]?this._mSelected[k].nodeState.selected:false},positionInParent:s+i,children:[],addedSubtrees:[],parent:p,originalParent:p,isDeepOne:true,containingServerIndex:p.containingServerIndex||p.serverIndex};if(this._bSelectAll&&this._aExpandedAfterSelectAll.indexOf(p)===-1){this.setNodeSelection(n,true);}}}this.oModel.callAfterUpdate(function(){this.fireDataReceived({data:D});}.bind(this));this._fireChange({reason:C.Change});}function e(E){var a=this._aPendingChildrenRequests.indexOf(r);this._aPendingChildrenRequests.splice(a,1);var A=E.statusCode==0;if(!A){if(p.childCount==undefined){p.children=[];p.childCount=0;this._fireChange({reason:C.Change});}}this.fireDataReceived();}var u=["$skip="+s,"$top="+t];if(p.childCount==undefined){u.push("$inlinecount=allpages");}if(this.sCustomParams){u.push(this.sCustomParams);}this.fireDataRequested();var l=new F(this.oTreeProperties["hierarchy-parent-node-for"],"EQ",p.context.getProperty(this.oTreeProperties["hierarchy-node-for"]));var f=[l];if(this.aApplicationFilters){f=f.concat(this.aApplicationFilters);}r.oRequestHandle=this.oModel.read(this.getPath(),{context:this.oContext,urlParameters:u,filters:[new F({filters:f,and:true})],sorters:this.aSorters||[],success:_.bind(this),error:e.bind(this),groupId:this.sRefreshGroupId?this.sRefreshGroupId:this.sGroupId});this._aPendingChildrenRequests.push(r);};d.prototype.findNode=function(r){return this._bReadOnly?this._indexFindNode(r):this._mapFindNode(r);};d.prototype._mapFindNode=function(r){if(this.isInitial()){return;}var f=this._aNodeCache[r];if(f){return f;}var n=-1;this._map(function(N,R,i,I,p){n++;if(n===r){f=N;R.broken=true;}});return f;};d.prototype._indexFindNode=function(r){if(this.isInitial()){return;}var n=this._aNodeCache[r];if(n){return n;}var N=this.getNodeInfoByRowIndex(r),n;if(N.parent){n=N.parent.children[N.childIndex];}else{n=this._aNodes[N.index];}this._aNodeCache[r]=n;return n;};d.prototype.toggleIndex=function(r){var t=this.findNode(r);if(t){if(t.nodeState.expanded){this.collapse(t);}else{this.expand(t);}}};d.prototype.expand=function(r,s){var t=r;if(typeof r!=="object"){t=this.findNode(r);}t.nodeState.expanded=true;t.nodeState.collapsed=false;var i=this._aCollapsed.indexOf(t);if(i!=-1){this._aCollapsed.splice(i,1);}this._aExpanded.push(t);this._sortNodes(this._aExpanded);if(t.serverIndex!==undefined){this._aNodeChanges[t.serverIndex]=true;}if(this._bSelectAll){this._aExpandedAfterSelectAll.push(t);}if(t.initiallyCollapsed&&t.childCount==undefined){this._loadChildren(t,0,this._iPageSize);}else{this._propagateMagnitudeChange(t.parent,t.magnitude);}this._cleanTreeStateMaps();this._aNodeCache=[];if(!s){this._fireChange({reason:C.Expand});}};d.prototype.expandToLevel=function(l){if(l>this.getNumberOfExpandedLevels()){this.setNumberOfExpandedLevels(l);}};d.prototype.collapse=function(r,s){var t=r;if(typeof r!=="object"){t=this.findNode(r);}t.nodeState.expanded=false;t.nodeState.collapsed=true;var i=this._aExpanded.indexOf(t);if(i!=-1){this._aExpanded.splice(i,1);}if(this._bSelectAll){i=this._aExpandedAfterSelectAll.indexOf(t);if(i!==-1){this._aExpandedAfterSelectAll.splice(i,1);}}this._aCollapsed.push(t);this._sortNodes(this._aCollapsed);if(t.isDeepOne){this._propagateMagnitudeChange(t.parent,t.magnitude*-1);}if(t.serverIndex!==undefined){this._aNodeChanges[t.serverIndex]=true;}this._cleanUpSelection();this._cleanTreeStateMaps();this._aNodeCache=[];if(!s){this._fireChange({reason:C.Collapse});}};d.prototype.collapseToLevel=function(l){if(l<this.getNumberOfExpandedLevels()){if(this.bCollapseRecursive){for(var k in this._mSelected){var s=this._mSelected[k];if(s.level>l){this.setNodeSelection(s,false);}}}this.setNumberOfExpandedLevels(l);}};d.prototype._getInvisibleSelectedNodes=function(){var a=[];var i=true;var f=function(n,b){if(n.nodeState.collapsed||(n.nodeState.removed&&!n.nodeState.reinserted)){i=false;b.broken=true;}};for(var k in this._mSelected){var s=this._mSelected[k];i=true;this._up(s,f,false);if(!i){a.push(s);}}return a;};d.prototype._cleanUpSelection=function(f){var i=this._getInvisibleSelectedNodes();i.forEach(function(s){if(s.key==this._sLeadSelectionKey){this._sLeadSelectionKey=null;}if(this.bCollapseRecursive||f){this.setNodeSelection(s,false);}}.bind(this));};d.prototype._isInSubtree=function(a,o){var i=false;var f=function(n,b){if(n==a){b.broken=true;i=true;}};this._up(o,f,false);return i;};d.prototype._up=function(n,u,o){var r={broken:false};var p=this._getParent(n,o);if(p){this._structuralUp(p,u,r,o);}else{this._flatUp(n,u,r,true);}};d.prototype._structuralUp=function(n,u,b,o){var p=n;do{u(p,b);if(b.broken){return;}n=p;p=this._getParent(p);}while(p);this._flatUp(n,u,b);};d.prototype._flatUp=function(n,u,b,I){var s=n.serverIndex,i=I?s-1:s,o,p;for(;i>=0;i--){if(this._aNodeChanges[i]){o=this._aNodes[i];if(o.initiallyCollapsed){continue;}if(o.serverIndex+o.magnitude>=s){u(o,b);if(b.broken){return;}p=this._getParent(o);if(p){this._structuralUp(p,u,b);return;}}else{continue;}}}};d.prototype._getParent=function(n,o){return o?n.originalParent:n.parent;};d.prototype._cleanTreeStateMaps=function(){this._iLengthDelta=this._bReadOnly?this._indexCleanTreeStateMaps():this._mapCleanTreeStateMaps();};d.prototype._indexCleanTreeStateMaps=function(){return this._calcIndexDelta(this._aNodes.length);};d.prototype._mapCleanTreeStateMaps=function(){var a=this._aCollapsed.concat(this._aRemoved).concat(this._aExpanded).concat(this._aAdded),v=true,V,D=0,f=function(n,B){if(n.nodeState.collapsed||(n.nodeState.removed&&!n.nodeState.reinserted)){v=false;B.broken=true;}},s={};var b=[[0,1],[-1,0]];a.forEach(function(n){if(s[n.key]){return;}else{s[n.key]=true;}if(n.nodeState.added){if(!n.nodeState.removed||n.nodeState.reinserted){v=true;this._up(n,f,false);if(v){D++;}}}else{if(n.nodeState.collapsed||n.nodeState.expanded||n.nodeState.removed){v=true;this._up(n,f,false);if(v){if(n.nodeState.removed&&!n.nodeState.reinserted){if(n.isDeepOne||n.initiallyCollapsed){D-=1;}else{D-=(n.magnitude+1);}}else{if(n.nodeState.collapsed&&n.serverIndex!==undefined&&!n.initiallyCollapsed){D-=n.magnitude;}if(n.nodeState.expanded&&(n.isDeepOne||n.initiallyCollapsed)){D+=n.children.length;}}}if(n.nodeState.reinserted){V=v;v=true;this._up(n,f,true);var i=(b[v|0][V|0]);if(!!i){if(n.isDeepOne){D+=i*1;}else{if(n.initiallyCollapsed){D+=i;}else{D+=i*(1+n.magnitude);}}}}}}}.bind(this));return D;};d.prototype.isLengthFinal=function(){return this._bLengthFinal;};d.prototype.getLength=function(){return this._aNodes.length+this._iLengthDelta;};d.prototype.getContextByIndex=function(r){if(this.isInitial()){return;}var n=this.findNode(r);return n&&n.context;};d.prototype.getNodeByIndex=function(r){if(this.isInitial()){return;}var n=this.findNode(r);return n;};d.prototype.isExpanded=function(r){var n=this.findNode(r);return n&&n.nodeState.expanded;};d.prototype.hasChildren=function(o){if(!o){return false;}var n=this._findNodeByContext(o);var N=n&&n.node;return!(N&&N.nodeState.isLeaf);};d.prototype.nodeHasChildren=function(n){return!(n&&n.nodeState.isLeaf);};d.prototype.setNodeSelection=function(n,i){n.nodeState.selected=i;if(i){delete this._mDeselected[n.key];this._mSelected[n.key]=n;}else{delete this._mSelected[n.key];this._mDeselected[n.key]=n;if(n.key===this._sLeadSelectionKey){this._sLeadSelectionKey=null;}}};d.prototype.isIndexSelected=function(r){var n=this.findNode(r);return n&&n.nodeState?n.nodeState.selected:false;};d.prototype.isIndexSelectable=function(r){var n=this.findNode(r);return!!n;};d.prototype._clearSelection=function(){return this._bReadOnly?this._indexClearSelection():this._mapClearSelection();};d.prototype._indexClearSelection=function(){var o=-1,a=[],s,n,r;this._bSelectAll=false;this._aExpandedAfterSelectAll=[];for(s in this._mSelected){n=this._mSelected[s];this.setNodeSelection(n,false);r=this.getRowIndexByNode(n);a.push(r);if(this._sLeadSelectionKey==s){o=r;}}return{rowIndices:a,oldIndex:o,leadIndex:-1};};d.prototype._mapClearSelection=function(){var n=-1;var o=-1;var m=0;var a=[];this._bSelectAll=false;this._aExpandedAfterSelectAll=[];for(var k in this._mSelected){if(k){m++;}}this._map(function(N,r,i,I,p){n++;if(N&&N.nodeState.selected){this.setNodeSelection(N,false);a.push(n);if(this._sLeadSelectionKey==N.key){o=n;}if(a.length==m){r.broken=true;}}}.bind(this));return{rowIndices:a,oldIndex:o,leadIndex:-1};};d.prototype.setSelectedIndex=function(r){var n=this.findNode(r);if(n){var o=this._clearSelection();var i=o.rowIndices.indexOf(r);if(i>=0){o.rowIndices.splice(i,1);}else{o.rowIndices.push(r);}o.leadKey=n.key;o.leadIndex=r;this.setNodeSelection(n,true);this._publishSelectionChanges(o);}else{q.sap.log.warning("ODataTreeBindingFlat: The selection of index '"+r+"' was ignored. Please make sure to only select rows, for which data has been fetched to the client.");}};d.prototype.getSelectedIndex=function(){return this._bReadOnly?this._indexGetSelectedIndex():this._mapGetSelectedIndex();};d.prototype._indexGetSelectedIndex=function(){if(!this._sLeadSelectionKey||q.isEmptyObject(this._mSelected)){return-1;}var s=this._mSelected[this._sLeadSelectionKey];if(s){return this.getRowIndexByNode(s);}else{return-1;}};d.prototype._mapGetSelectedIndex=function(){if(!this._sLeadSelectionKey||q.isEmptyObject(this._mSelected)){return-1;}var n=-1;this._map(function(N,r){n++;if(N){if(N.key===this._sLeadSelectionKey){r.broken=true;}}}.bind(this));return n;};d.prototype.getSelectedIndices=function(){return this._bReadOnly?this._indexGetSelectedIndices():this._mapGetSelectedIndices();};d.prototype._indexGetSelectedIndices=function(){var n=this._getSelectedNodesInfo();return n.map(function(N){return N.rowIndex;});};d.prototype._mapGetSelectedIndices=function(){var r=[];if(q.isEmptyObject(this._mSelected)){return r;}var n=-1;this._map(function(N){n++;if(N){if(N.nodeState&&N.nodeState.selected){r.push(n);}}});return r;};d.prototype.getSelectedNodesCount=function(){var s;if(this._bSelectAll){if(this._bReadOnly){var r=[],n=0,k;this._aExpandedAfterSelectAll.sort(function(a,b){var A=this._getRelatedServerIndex(a);var B=this._getRelatedServerIndex(b);if(A==B&&a.isDeepOne&&b.isDeepOne){return a.originalLevel-b.originalLevel;}return A-B;}.bind(this));var l=-1,N,e,i;for(i=0;i<this._aExpandedAfterSelectAll.length;i++){N=this._aExpandedAfterSelectAll[i];e=this._getRelatedServerIndex(N);if(e<=l&&!N.initiallyCollapsed){continue;}if(N.initiallyCollapsed){l=e;}else{l=e+N.magnitude;}r.push(N);n+=N.magnitude;}var f=function(N,b){if(r.indexOf(N)!==-1){n--;b.broken=true;}};for(k in this._mSelected){this._up(this._mSelected[k],f,true);}var I;var g=function(N,b){if(N.nodeState.collapsed||(N.nodeState.removed&&!N.nodeState.reinserted)||r.indexOf(N)!==-1){I=false;b.broken=true;}};for(k in this._mDeselected){I=true;this._up(this._mDeselected[k],g,true);if(I){n++;}}s=this.getLength()-n;}else{s=0;this._map(function(N,R,a,b,p){var P;if(N){if(N.nodeState.selected){s++;}}else if(N===undefined&&a==="serverIndex"){var j=true;for(var i=b-1;i>=0;i--){if(this._aNodeChanges[i]){P=this._aNodes[i];if(P.serverIndex+P.magnitude>=b&&this._aExpandedAfterSelectAll.indexOf(P)!==-1){j=false;break;}}}if(j){s++;}}}.bind(this));}}else{var h=this._getInvisibleSelectedNodes();s=Math.max(Object.keys(this._mSelected).length-h.length,0);}return s;};d.prototype.getSelectedContexts=function(){return this._bReadOnly?this._indexGetSelectedContexts():this._mapGetSelectedContexts();};d.prototype._indexGetSelectedContexts=function(){var n=this._getSelectedNodesInfo();return n.map(function(N){return N.node.context;});};d.prototype._mapGetSelectedContexts=function(){var r=[];if(q.isEmptyObject(this._mSelected)){return r;}var m=function(n){if(n){if(n.nodeState.selected&&!n.isArtificial){r.push(n.context);}}};this._map(m);return r;};d.prototype.setSelectionInterval=function(f,t){var m=this._clearSelection();var s=this._setSelectionInterval(f,t,true);var I={};var r=[];var a;for(var i=0;i<m.rowIndices.length;i++){a=m.rowIndices[i];I[a]=true;}for(i=0;i<s.rowIndices.length;i++){a=s.rowIndices[i];if(I[a]){delete I[a];}else{I[a]=true;}}for(a in I){if(I[a]){r.push(parseInt(a,10));}}this._publishSelectionChanges({rowIndices:r,oldIndex:m.oldIndex,leadIndex:s.leadIndex,leadKey:s.leadKey});};d.prototype._setSelectionInterval=function(f,t,s){return this._bReadOnly?this._indexSetSelectionInterval(f,t,s):this._mapSetSelectionInterval(f,t,s);};d.prototype._indexSetSelectionInterval=function(f,t,s){var n=Math.min(f,t),N=Math.max(f,t),a=[],b=[],o,e,i,p;s=!!s;for(i=n;i<=N;i++){e=this.findNode(i);if(e){if(e.nodeState.selected!==s){b.push(i);}if(e.key===this._sLeadSelectionKey){o=i;}this.setNodeSelection(e,s);a.push(e);}}p={rowIndices:b,oldIndex:o,leadIndex:o&&!s?-1:undefined};if(a.length>0&&s){p.leadKey=a[a.length-1].key;p.leadIndex=N;}return p;};d.prototype._mapSetSelectionInterval=function(f,t,s){var n=Math.min(f,t);var N=Math.max(f,t);var a=[];var b=[];var i=Math.abs(N-n)+1;var o;var e=-1;var m=function(g,r,I,h,P){e++;if(g){if(e>=n&&e<=N){if(g.nodeState.selected!==!!s){b.push(e);}if(g.key===this._sLeadSelectionKey){o=e;}this.setNodeSelection(g,!!s);a.push(g);if(a.length===i){r.broken=true;}}}}.bind(this);this._map(m);var p={rowIndices:b,oldIndex:o,leadIndex:o&&!s?-1:undefined};if(a.length>0&&s){var l=a[a.length-1];p.leadKey=l.key;p.leadIndex=N;}return p;};d.prototype.addSelectionInterval=function(f,t){var p=this._setSelectionInterval(f,t,true);this._publishSelectionChanges(p);};d.prototype.removeSelectionInterval=function(f,t){var p=this._setSelectionInterval(f,t,false);this._publishSelectionChanges(p);};d.prototype.selectAll=function(){this._bReadOnly?this._indexSelectAll():this._mapSelectAll();};d.prototype._indexSelectAll=function(){this._bSelectAll=true;this._aExpandedAfterSelectAll=[];var p={rowIndices:[],oldIndex:-1,selectAll:true};var l=this.getLength(),i,n;for(i=0;i<l;i++){n=this.findNode(i);if(n&&!n.isArtificial){if(n.key===this._sLeadSelectionKey){p.oldIndex=i;}if(!n.nodeState.selected){p.rowIndices.push(i);}this.setNodeSelection(n,true);p.leadKey=n.key;p.leadIndex=i;}}this._publishSelectionChanges(p);};d.prototype._mapSelectAll=function(){this._bSelectAll=true;this._aExpandedAfterSelectAll=[];var p={rowIndices:[],oldIndex:-1,selectAll:true};var n=-1;this._map(function(N){if(!N||!N.isArtificial){n++;}if(N){if(N.key===this._sLeadSelectionKey){p.oldIndex=n;}if(N){if(!N.isArtificial&&!N.nodeState.selected){p.rowIndices.push(n);}this.setNodeSelection(N,true);p.leadKey=N.key;p.leadIndex=n;}}}.bind(this));this._publishSelectionChanges(p);};d.prototype.clearSelection=function(s){var o=this._clearSelection();if(!s){this._publishSelectionChanges(o);}};d.prototype._publishSelectionChanges=function(p){p.oldIndex=p.oldIndex||this.getSelectedIndex();p.rowIndices.sort(function(a,b){return a-b;});if(p.leadIndex>=0&&p.leadKey){this._sLeadSelectionKey=p.leadKey;}else if(p.leadIndex===-1){this._sLeadSelectionKey=undefined;}else{p.leadIndex=p.oldIndex;}if(p.rowIndices.length>0||(p.leadIndex!=undefined&&p.leadIndex!==-1)){this.fireSelectionChanged(p);}};d.prototype.setCollapseRecursive=function(b){this.bCollapseRecursive=!!b;};d.prototype.resetData=function(){O.prototype.resetData.apply(this,arguments);this._aNodes=[];this._aCollapsed=[];this._aExpanded=[];this._aExpandedAfterSelectAll=[];this._mSelected={};this._mDeselected={};this._aRemoved=[];this._aNodeChanges=[];this._aAllChangedNodes=[];this._bLengthFinal=false;this._iLowestServerLevel=null;this._bSelectAll=false;this._iLengthDelta=0;};d.prototype._findNodeByContext=function(o){for(var i in this._aNodeCache){if(this._aNodeCache[i]&&this._aNodeCache[i].context==o){return{node:this._aNodeCache[i],index:parseInt(i,10)};}}var n=-1;var N;this._map(function(a,r,I,b,p){n++;if(a){if(a.context===o){N=a;r.broken=true;}}});return{node:N,index:n};};d.prototype._getCorrectChangeGroup=function(k){return this.oModel._resolveGroup(k).groupId;};d.prototype.createEntry=function(p){var a=this.oModel.resolve(this.getPath(),this.getContext());var n;if(a){p=p||{};p.groupId=this._getCorrectChangeGroup(a);p.refreshAfterChange=false;n=this.oModel.createEntry(a,p);}else{q.sap.log.warning("ODataTreeBindingFlat: createEntry failed, as the binding path could not be resolved.");}return n;};d.prototype.submitChanges=function(p){p=p||{};var a=this.oModel.resolve(this.getPath(),this.getContext());if(!a){q.sap.log.warning("ODataTreeBindingFlat: submitChanges failed, because the binding-path could nit be resolved.");return;}p.groupId=this._getCorrectChangeGroup(a);var o=p.success||q.noop;var f=p.error||q.noop;p.success=function(D){o(D);var s=false;if(D.__batchResponses&&D.__batchResponses[0]&&D.__batchResponses[0].__changeResponses&&D.__batchResponses[0].__changeResponses.length>0){var b=D.__batchResponses[0].__changeResponses;for(var i=0;i<b.length;i++){var r=b[i];var S=parseInt(r.statusCode,10);if(S<200||S>299){s=true;break;}}if(s){}else{this._refresh(true);}}else{q.sap.log.warning("ODataTreeBindingFlat.submitChanges - success: Batch-request response does not contain change response.");}}.bind(this);p.error=function(e){f(e);};this._generateSubmitData();this.oModel.submitChanges(p);};d.prototype._generateSubmitData=function(){var I=false;var f=function(N,b){if(N.nodeState.removed&&!N.nodeState.reinserted){I=true;b.broken=true;}};var p=[];var t=function(N){if((N.isDeepOne||N.serverIndex>=0)&&p.indexOf(N)==-1){p.push(N);}if(N.nodeState.added){this._generateDeleteRequest(N);}}.bind(this);this._aAllChangedNodes.forEach(function(N){I=false;this._up(N,f,false);if(I){t(N);}else{if(N.nodeState.removed&&!N.nodeState.reinserted){t(N);}else{var P=N.parent.context.getProperty(this.oTreeProperties["hierarchy-node-for"]);this.oModel.setProperty(this.oTreeProperties["hierarchy-parent-node-for"],P,N.context);}}}.bind(this));p.sort(function(a,b){var A=this._getRelatedServerIndex(a);var B=this._getRelatedServerIndex(b);if(A==B&&a.isDeepOne&&b.isDeepOne){return a.originalLevel-b.originalLevel;}return A-B;}.bind(this));var n=function(D){var b=false;this._up(D,function(P,B){if(P.nodeState.removed&&!P.nodeState.reinserted){b=true;B.broken=true;}},true);return b;}.bind(this);for(var i=0;i<p.length;i++){var D=p[i];if(!n(D)){this._generateDeleteRequest(D);q.sap.log.debug("ODataTreeBindingFlat: DELETE "+D.key);}}};d.prototype._nodeIsOnTopLevel=function(n){if(n&&n.serverIndex>=0){var p=n.parent==null;if(p){if(n.originalLevel==this._iLowestServerLevel){return true;}else{return false;}}}else{q.sap.log.warning("ODataTreeBindingFlat.nodeIsOnTopLevel: Node is not defined or not a server-indexed node.");}};d.prototype._generateDeleteRequest=function(n){var o=n.context;if(n.nodeState.added){this.oModel.deleteCreatedEntry(o);}else{var a=this.oModel.resolve(this.getPath(),this.getContext());var D=this.oModel.remove(o.getPath(),{groupId:this._getCorrectChangeGroup(a),refreshAfterChange:false});return D;}};d.prototype._trackChangedNode=function(n){if(this._aAllChangedNodes.indexOf(n)==-1){this._aAllChangedNodes.push(n);}};d.prototype.addContexts=function(p,v){var n=this._findNodeByContext(p),N=n.node,m=this.getModel(),o,a;if(N){this._bReadOnly=false;if(N.nodeState&&N.nodeState.isLeaf){N.nodeState.isLeaf=false;N.nodeState.collapsed=true;}if(!q.isArray(v)){if(v instanceof sap.ui.model.Context){v=[v];}else{q.sap.log.warning("ODataTreeBinding.addContexts(): The child node argument is not of type sap.ui.model.Context.");}}var b=function(f){return function(){return[f];};};v=v.slice();v.reverse();for(var j=0;j<v.length;j++){var a=v[j];if(!a||!(a instanceof sap.ui.model.Context)){q.sap.log.warning("ODataTreeBindingFlat.addContexts(): no valid child context given!");return;}var o=this._mSubtreeHandles[a.getPath()];this._ensureHierarchyNodeIDForContext(a);if(o&&o._isRemovedSubtree){q.sap.log.info("ODataTreeBindingFlat.addContexts(): Existing context added '"+a.getPath()+"'");o._oNewParentNode=N;o._oSubtreeRoot.nodeState.reinserted=true;o._oSubtreeRoot.originalParent=o._oSubtreeRoot.originalParent||o._oSubtreeRoot.parent;o._oSubtreeRoot.parent=N;o._oSubtreeRoot.containingSubtreeHandle=o;a=o.getContext();this._trackChangedNode(o._oSubtreeRoot);this._mSubtreeHandles[a.getPath()];}else{q.sap.log.info("ODataTreeBindingFlat.addContexts(): Newly created context added.");this._ensureHierarchyNodeIDForContext(a);var f={context:a,key:m.getKey(a),parent:N,nodeState:{isLeaf:true,collapsed:false,expanded:false,selected:false,added:true},addedSubtrees:[],children:[],magnitude:0};this._trackChangedNode(f);this._aAdded.push(f);o={_getSubtree:b(f),_oSubtreeRoot:null,_oNewParentNode:N};}o._iContainingServerIndex=N.serverIndex||N.containingServerIndex;N.addedSubtrees.unshift(o);if(N.serverIndex!==undefined){this._aNodeChanges[N.serverIndex]=true;}}this._aNodeCache=[];this._cleanTreeStateMaps();this._fireChange({reason:C.Add});}else{q.sap.log.warning("The given parent context could not be found in the tree. No new sub-nodes were added!");}};d.prototype._ensureHierarchyNodeIDForContext=function(o){if(o){var n=o.getProperty(this.oTreeProperties["hierarchy-node-for"]);if(o.bCreated&&!n){this.oModel.setProperty(this.oTreeProperties["hierarchy-node-for"],q.sap.uid(),o);}}};d.prototype.removeContext=function(o){var t=this;var n=this._findNodeByContext(o);var N=n.node;var i=n.index;if(N){this._bReadOnly=false;N.nodeState.removed=true;this._aRemoved.push(N);this._trackChangedNode(N);if(N.serverIndex!==undefined){this._aNodeChanges[N.serverIndex]=true;}if(N.containingSubtreeHandle&&N.parent!=null){var a=N.parent.addedSubtrees.indexOf(N.containingSubtreeHandle);if(a!=-1){N.parent.addedSubtrees.splice(a,1);N.nodeState.reinserted=false;N.parent=null;}}this._aNodeCache=[];this.setNodeSelection(N,false);this._cleanUpSelection(true);this._cleanTreeStateMaps();this._fireChange({reason:C.Remove});this._mSubtreeHandles[o.getPath()]={_removedFromVisualIndex:i,_isRemovedSubtree:true,_oSubtreeRoot:N,_getSubtree:function(){if(N.serverIndex!=undefined&&!N.initiallyCollapsed){return t._aNodes.slice(N.serverIndex,N.serverIndex+N.magnitude+1);}else{return N;}},getContext:function(){return o;},_restore:function(){N.nodeState.removed=false;var b=t._aRemoved.indexOf(N);if(b!=-1){t._aRemoved.splice(b,1);}this._aNodeCache=[];t._cleanTreeStateMaps();t._fireChange({reason:C.Add});}};return o;}else{q.sap.log.warning("ODataTreeBinding.removeContexts(): The given context is not part of the tree. Was it removed already?");}};d.prototype._getRelatedServerIndex=function(n){if(n.serverIndex===undefined){return n.containingServerIndex;}else{return n.serverIndex;}};d.prototype.getNodeInfoByRowIndex=function(r){var i=0,e=0,n,t,v=-1;while(i<this._aCollapsed.length||e<this._aExpanded.length){if(this._aCollapsed[i]&&this._aExpanded[e]){if(this._getRelatedServerIndex(this._aCollapsed[i])>this._getRelatedServerIndex(this._aExpanded[e])){n=this._aExpanded[e];e++;t=false;}else{n=this._aCollapsed[i];i++;t=true;}}else if(this._aCollapsed[i]){n=this._aCollapsed[i];i++;t=true;}else{n=this._aExpanded[e];e++;t=false;}if(r<=this._getRelatedServerIndex(n)){break;}if(t){if(!n.isDeepOne&&!n.initiallyCollapsed&&n.serverIndex>v){r+=n.magnitude;v=n.serverIndex+n.magnitude;}}else{if(n.serverIndex>v){if(!n.isDeepOne&&n.initiallyCollapsed){r-=n.magnitude;}if(r<=n.serverIndex){return this._calcDirectIndex(n,r+n.magnitude-n.serverIndex-1);}}}}return{index:r};};d.prototype._calcDirectIndex=function(n,a){var i,m,o;for(i=0;i<n.children.length;i++){o=n.children[i];if(a===0){return{parent:n,childIndex:i};}m=o?o.magnitude:0;a--;if(!o||o.nodeState.collapsed){continue;}if(a<m){return this._calcDirectIndex(o,a);}else{a-=m;}}};d.prototype.getRowIndexByNode=function(n){var D=0;var o;var i;if(n.isDeepOne){while(n.parent){D+=n.positionInParent+1;for(i=0;i<n.positionInParent;i++){o=n.parent.children[i];if(o&&o.nodeState.expanded){D+=o.magnitude;}}n=n.parent;}}return this._calcIndexDelta(n.serverIndex)+n.serverIndex+D;};d.prototype._getSelectedNodesInfo=function(){var n=[];if(q.isEmptyObject(this._mSelected)){return n;}var i=true;var f=function(N,b){if(N.nodeState.collapsed||(N.nodeState.removed&&!N.nodeState.reinserted)){i=false;b.broken=true;}};for(var k in this._mSelected){var s=this._mSelected[k];i=true;this._up(s,f,false);if(i){n.push({node:s,rowIndex:this.getRowIndexByNode(s)});}}n.sort(function(N,o){return N.rowIndex-o.rowIndex;});return n;};d.prototype._calcIndexDelta=function(e){var m={};this._aCollapsed.forEach(function(n){if(n.serverIndex>=0&&n.serverIndex<e&&!n.isDeepOne&&!n.initiallyCollapsed){m[n.serverIndex]=n.magnitude;}});var l=0;var a=0;for(var i=0;i<this._aCollapsed.length;i++){var o=this._aCollapsed[i];if(this._getRelatedServerIndex(o)>=e){break;}if(!o.isDeepOne){if(o.serverIndex>=l&&!o.initiallyCollapsed){a-=o.magnitude;l=o.serverIndex+o.magnitude;}else{}}else{}}var E=0;var I=function(n){var f=false;var g=n.serverIndex||n.containingServerIndex;for(var j in m){if(g>j&&g<j+m[j]){f=true;break;}}return f;};for(i=0;i<this._aExpanded.length;i++){var b=this._aExpanded[i];if(this._getRelatedServerIndex(b)>=e){break;}if(b.isDeepOne){var p=b.parent;var y=false;while(p){if(p.nodeState.collapsed){y=true;break;}p=p.parent;}var f=I(b);if(!y&&!f){E+=b.children.length;}}else if(b.initiallyCollapsed){var f=I(b);if(!f){E+=b.children.length;}}}return E+a;};d.prototype._sortNodes=function(n){var s=function(a,b){var A=this._getRelatedServerIndex(a);var B=this._getRelatedServerIndex(b);return A-B;}.bind(this);n.sort(s);};d.prototype.attachSelectionChanged=function(D,f,l){this.attachEvent("selectionChanged",D,f,l);return this;};d.prototype.detachSelectionChanged=function(f,l){this.detachEvent("selectionChanged",f,l);return this;};d.prototype.fireSelectionChanged=function(a){this.fireEvent("selectionChanged",a);return this;};d.prototype.getRootContexts=function(){};d.prototype.getNodeContexts=function(){};return d;},true);