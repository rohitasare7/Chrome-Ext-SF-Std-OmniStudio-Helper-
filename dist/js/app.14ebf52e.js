(function(){"use strict";var e={9020:function(e,t,a){var o=a(5130),r=a(6768);const s={class:"dark:bg-gray-900 py-2 bg-gray-100"},l={class:"p-5 w-11/12 antialiased mx-auto"};function n(e,t,a,o,n,i){const c=(0,r.g2)("ToggleLightDarkMode"),d=(0,r.g2)("SecondaryComp");return(0,r.uX)(),(0,r.CE)("div",s,[(0,r.Lk)("div",l,[(0,r.bF)(c),(0,r.bF)(d)])])}a(4603),a(7566),a(8721);var i=a(4232),c=a(144);a(4114);let d,u=null==localStorage.getItem("apiVersion")?"60.0":localStorage.getItem("apiVersion"),m={async getSession(e){e=p(e);const t="access_token",a=window.location.href.includes(t),o=localStorage.getItem(e+"_"+t);if(this.instanceHostname=e,a){if(window.location.href.includes(t)){const a=new URL(window.location.href),o=new URLSearchParams(a.hash.substring(1)),r=decodeURI(o.get(t));e=decodeURI(o.get("instance_url")).replace(/^https?:\/\//i,""),this.sessionId=r,localStorage.setItem(e+"_"+t,r)}}else if(o)this.sessionId=o;else{let t=await new Promise((t=>chrome.runtime.sendMessage({message:"getSession",sfHost:e},t)));t&&(this.instanceHostname=p(t.hostname),this.sessionId=t.key)}},async rest(e,{logErrors:t=!0,method:a="GET",api:o="normal",body:r,bodyType:s="json",responseType:l="json",headers:n={},progressHandler:i=null}={}){if(!this.instanceHostname)throw new Error("Instance Hostname not found");let c=new XMLHttpRequest;e+=(e.includes("?")?"&":"?")+"cache="+Math.random();const u="https://"+this.instanceHostname;if(c.open(a,u+e,!0),c.setRequestHeader("Accept","application/json; charset=UTF-8"),"bulk"==o)c.setRequestHeader("X-SFDC-Session",this.sessionId);else{if("normal"!=o)throw new Error("Unknown api");c.setRequestHeader("Authorization","Bearer "+this.sessionId)}if(void 0!==r)if("json"==s)r=JSON.stringify(r),c.setRequestHeader("Content-Type","application/json; charset=UTF-8");else if("raw"!=s)throw new Error("Unknown bodyType");for(let[d,v]of Object.entries(n))c.setRequestHeader(d,v);if(c.responseType=l,await new Promise(((e,t)=>{i&&(i.abort=()=>{let e=new Error("The request was aborted.");e.name="AbortError",t(e),c.abort()}),c.onreadystatechange=()=>{4==c.readyState&&e()},c.send(r)})),c.status>=200&&c.status<300)return c.response;if(0==c.status){t||console.error("Received no response from Salesforce REST API",c);let e=new Error;throw e.name="SalesforceRestError",e.message="Network error, offline or timeout",e}if(401==c.status){let e=c.response.length>0?c.response[0].message:"New access token needed";localStorage.getItem(this.instanceHostname+"_access_token")&&(d=e,f());let t=new Error;throw t.name="Unauthorized",t.message=e,t}{t||console.error("Received error response from Salesforce REST API",c);let e=new Error;e.name="SalesforceRestError",e.detail=c.response;try{e.message=e.detail.map((e=>`${e.errorCode}: ${e.message}${e.fields&&e.fields.length>0?` [${e.fields.join(", ")}]`:""}`)).join("\n")}catch(m){e.message=JSON.stringify(c.response)}throw e.message||(e.message="HTTP error "+c.status+" "+c.statusText),e}},wsdl(e,t){let a={Enterprise:{servicePortAddress:"/services/Soap/c/"+e,targetNamespaces:' xmlns="urn:enterprise.soap.sforce.com" xmlns:sf="urn:sobject.enterprise.soap.sforce.com"',apiName:"Enterprise"},Partner:{servicePortAddress:"/services/Soap/u/"+e,targetNamespaces:' xmlns="urn:partner.soap.sforce.com" xmlns:sf="urn:sobject.partner.soap.sforce.com"',apiName:"Partner"},Apex:{servicePortAddress:"/services/Soap/s/"+e,targetNamespaces:' xmlns="http://soap.sforce.com/2006/08/apex"',apiName:"Apex"},Metadata:{servicePortAddress:"/services/Soap/m/"+e,targetNamespaces:' xmlns="http://soap.sforce.com/2006/04/metadata"',apiName:"Metadata"},Tooling:{servicePortAddress:"/services/Soap/T/"+e,targetNamespaces:' xmlns="urn:tooling.soap.sforce.com" xmlns:sf="urn:sobject.tooling.soap.sforce.com" xmlns:mns="urn:metadata.tooling.soap.sforce.com"',apiName:"Tooling"}};return t&&(a=a[t]),a},async soap(e,t,a,{headers:o}={}){if(!this.instanceHostname||!this.sessionId)throw new Error("Session not found");let r=new XMLHttpRequest;r.open("POST","https://"+this.instanceHostname+e.servicePortAddress+"?cache="+Math.random(),!0),r.setRequestHeader("Content-Type","text/xml"),r.setRequestHeader("SOAPAction",'""');let s="Metadata"==e.apiName?"met:SessionHeader":"SessionHeader",l="Metadata"==e.apiName?"met:sessionId":"sessionId",n="Metadata"==e.apiName?`met:${t}`:t,i=['xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"','xmlns:xsd="http://www.w3.org/2001/XMLSchema"','xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'];"Metadata"==e.apiName&&i.push('xmlns:met="http://soap.sforce.com/2006/04/metadata"');let c=v.stringify({name:"soapenv:Envelope",attributes:` ${i.join(" ")}${e.targetNamespaces}`,value:{"soapenv:Header":Object.assign({},{[s]:{[l]:this.sessionId}},o),"soapenv:Body":{[n]:a}}});if(r.responseType="document",await new Promise((e=>{r.onreadystatechange=()=>{4==r.readyState&&e(r)},r.send(c)})),200==r.status){let e=r.response.querySelector(t+"Response"),a=v.parse(e).result;return a}{console.error("Received error response from Salesforce SOAP API",r);let e=new Error;e.name="SalesforceSoapError",e.detail=r.response;try{e.message=r.response.querySelector("faultstring").textContent}catch(d){e.message="HTTP error "+r.status+" "+r.statusText}throw e}},asArray(e){return e?e instanceof Array?e:[e]:[]}};class v{static stringify({name:e,attributes:t,value:a}){function o(e,t){if(null==t)e.setAttribute("xsi:nil","true");else if("object"==typeof t)for(let[a,s]of Object.entries(t))if("_"==a)null==s?e.setAttribute("xsi:nil","true"):e.textContent=s;else if("$xsi:type"==a)e.setAttribute("xsi:type",s);else if(void 0===s);else if(Array.isArray(s))for(let t of s){let s=r.createElement(a);o(s,t),e.appendChild(s)}else{let t=r.createElement(a);o(t,s),e.appendChild(t)}else e.textContent=t}let r=(new DOMParser).parseFromString("<"+e+t+"/>","text/xml");return o(r.documentElement,a),'<?xml version="1.0" encoding="UTF-8"?>'+(new XMLSerializer).serializeToString(r).replace(/ xmlns=""/g,"")}static parse(e){function t(e){let a="",o=null;if("true"==e.getAttribute("xsi:nil"))return null;let r=e.getAttribute("xsi:type");r&&(o={"$xsi:type":r});for(let s=e.firstChild;null!=s;s=s.nextSibling)if(s instanceof CharacterData)a+=s.data;else{if(!(s instanceof Element))throw new Error("Unknown child node type");{null==o&&(o={});let e=s.localName,a=t(s);e in o?o[e]instanceof Array?o[e].push(a):o[e]=[o[e],a]:o[e]=a}}return o||a}return t(e)}}function p(e){if(e){const t=e.replace(/\.lightning\.force\./,".my.salesforce.").replace(/\.mcas\.ms$/,"");return t}return e}function f(){const e=document.getElementById("invalidTokenBanner");e&&e.classList.remove("hide");const t=document.getElementById("mainTabs");t&&t.classList.add("mask")}const g=e=>{const t=new Date(e),a={day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0};return t.toLocaleString("en-IN",a)};const y=async(e,t)=>{const a=await new Promise(((e,a)=>{chrome.storage.local.get({[t]:[]},(a=>{const o=a[t];e(o)}))})),o=a.some((t=>t.items.some((t=>t.id===e.id))));if(o)return console.log("Item already exists:",e),!1;{let o=a.find((t=>t.type===e.type));return o?o.items.push({id:e.id,name:e.name}):(o={type:e.type,items:[{id:e.id,name:e.name}]},a.push(o)),chrome.storage.local.set({[t]:a},(()=>{console.log("Record list updated for domain:",t)})),!0}};const h=async e=>new Promise(((t,a)=>{chrome.storage.local.get({[e]:[]},(a=>{const o=a[e];t(o)}))})),b=async(e,t)=>{const a=await new Promise(((e,a)=>{chrome.storage.local.get({[t]:[]},(a=>{const o=a[t];e(o)}))})),o=a.findIndex((t=>t.items.some((t=>t.id===e))));return-1!==o?(a[o].items=a[o].items.filter((t=>t.id!==e)),chrome.storage.local.set({[t]:a},(()=>{console.log("Record with ID",e,"deleted for domain:",t)})),!0):(console.log("Item with ID",e,"not found for domain:",t),!1)},_=e=>{const t=/https:\/\/([^.]+)\.(lightning\.force\.com|my\.salesforce\.com|vf\.force\.com|my\.site\.com)$/,a=e.match(t);if(a)return a[1];const o=/https:\/\/([^.]+)\.sandbox\.(lightning\.force\.com|my\.salesforce\.com|vf\.force\.com|my\.site\.com)$/,r=e.match(o);if(r)return r[1];const s=/https:\/\/([^.]+)\.develop\.(lightning\.force\.com|my\.salesforce\.com|vf\.force\.com|my\.site\.com)$/,l=e.match(s);if(l)return l[1];const n=/https:\/\/([^-]+)-([^.]+)\.trailblaze\.(lightning\.force\.com|my\.salesforce\.com|vf\.force\.com|my\.site\.com)$/,i=e.match(n);return i?i[2]:null},k=[{id:1,obj:"OmniScript",omnistudio:".vf.force.com/lightning/cmp/omnistudio__OmniDesignerAuraWrapper?c__recordId=",vlocity_cmt:".vf.force.com/lightning/cmp/vlocity_cmt__OmniDesignerAuraWrapper?c__recordId="},{id:2,obj:"IntegrationProcedure",omnistudio:".vf.force.com/apex/omnistudio__integrationproceduredesigner?id=",vlocity_cmt:".vf.force.com/apex/vlocity_cmt__integrationproceduredesigner?id="},{id:3,obj:"FlexCard",omnistudio:"/lightning/r/OmniUiCard/",vlocity_cmt:"/lightning/r/vlocity_cmt__VlocityCard__c/"},{id:4,obj:"DataRaptor",omnistudio:".vf.force.com/apex/omnistudio__drmapper?id=",vlocity_cmt:".vf.force.com/apex/vlocity_cmt__drmapper?id="}],w=(e,t)=>{const a=k.find((e=>e.obj===t));return a?a[e]:null},x=(e,t,a,o,r)=>{let s="",l="vlocity-cmt",n="false"!=localStorage.getItem(o+"_isSandbox");switch(n&&(s=".sandbox"),r&&"omnistudio"==r&&(l="omnistudio"),a){case"OmniScript":case"DataRaptor":case"IntegrationProcedure":return`https://${e}--${l}${s}${w(r,a)}${t}`;case"FlexCard":return`https://${o}${w(r,a)}${t}/view`;default:return null}},S=(e,t,a,o)=>{const r=localStorage.getItem(t+"_ns");return x(e,a,o,t,r)},R=[{id:1,obj:"OmniScript",omnistudio:"/query/?q=SELECT+Id,Name,IsActive,VersionNumber,Type,SubType,LastModifiedDate,LastModifiedBy.Name+FROM+OmniProcess+WHERE+IsActive=TRUE+AND+OmniProcessType='OmniScript'+ORDER+BY+LastModifiedDate+DESC",vlocity_cmt:"/query/?q=SELECT+Id,Name,vlocity_cmt__Version__c,vlocity_cmt__Type__c,vlocity_cmt__SubType__c,LastModifiedBy.Name,LastModifiedDate+FROM+vlocity_cmt__OmniScript__c+WHERE+vlocity_cmt__IsActive__c=TRUE+AND+vlocity_cmt__OmniProcessType__c='OmniScript'+ORDER+BY+LastModifiedDate+DESC"},{id:2,obj:"IntegrationProcedure",omnistudio:"/query/?q=SELECT+Id,Name,IsActive,VersionNumber,Type,SubType,LastModifiedDate,LastModifiedBy.Name+FROM+OmniProcess+WHERE+IsActive=TRUE+AND+OmniProcessType='Integration Procedure'+ORDER+BY+LastModifiedDate+DESC",vlocity_cmt:"/query/?q=SELECT+Id,Name,vlocity_cmt__Version__c,vlocity_cmt__Type__c,vlocity_cmt__SubType__c,LastModifiedBy.Name,LastModifiedDate+FROM+vlocity_cmt__OmniScript__c+WHERE+vlocity_cmt__IsActive__c=TRUE+AND+vlocity_cmt__OmniProcessType__c='Integration Procedure'+ORDER+BY+LastModifiedDate+DESC"},{id:3,obj:"FlexCard",omnistudio:"/query/?q=SELECT+Id,Name,IsActive,VersionNumber,LastModifiedDate,LastModifiedBy.Name+FROM+OmniUiCard+WHERE+IsActive=TRUE+ORDER+BY+LastModifiedDate+DESC",vlocity_cmt:"/query/?q=SELECT+Id,Name,vlocity_cmt__Version__c,LastModifiedBy.Name,LastModifiedDate+FROM+vlocity_cmt__VlocityCard__c+WHERE+vlocity_cmt__Active__c=TRUE+ORDER+BY+LastModifiedDate+DESC"},{id:4,obj:"DataRaptor",omnistudio:"/query/?q=SELECT+Id,Name,Type,LastModifiedDate,LastModifiedBy.Name+FROM+OmniDataTransform+ORDER+BY+LastModifiedDate",vlocity_cmt:"/query/?q=SELECT+Id,Name,vlocity_cmt__Type__c,LastModifiedBy.Name,LastModifiedDate+FROM+vlocity_cmt__DRBundle__c+ORDER+BY+LastModifiedDate"}],E=(e,t)=>{const a=R.find((e=>e.obj===t));return a?a[e]:null},L=["type"];var T={__name:"PrimaryButton",props:{type:{type:String,default:"submit"},isRed:Boolean,isBlue:Boolean},setup(e){return(t,a)=>((0,r.uX)(),(0,r.CE)("button",{type:e.type,class:(0,i.C4)({"bg-gray-800 hover:bg-gray-700":!e.isRed&&!e.isBlue,"bg-red-700 hover:bg-red-800":e.isRed,"bg-blue-700 hover:bg-blue-800":e.isBlue,"text-white dark:bg-gray-200 dark:hover:bg-white dark:text-gray-800 inline-flex items-center px-4 py-2 border border-transparent rounded-2xl font-semibold text-xs  uppercase tracking-widest focus:outline-none transition ease-in-out duration-300":!0})},[(0,r.RG)(t.$slots,"default")],10,L))}};const C=T;var I=C;const O=["value"];var N={__name:"TextInput",props:{modelValue:String},emits:["update:modelValue"],setup(e,{expose:t}){const a=(0,c.KR)(null);return(0,r.sV)((()=>{a.value.hasAttribute("autofocus")&&a.value.focus()})),t({focus:()=>a.value.focus()}),(t,o)=>((0,r.uX)(),(0,r.CE)("input",{ref_key:"input",ref:a,class:"text-base border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-2xl shadow-sm py-1 px-2 border outline-indigo-500 dark:outline-none",value:e.modelValue,onInput:o[0]||(o[0]=e=>t.$emit("update:modelValue",e.target.value))},null,40,O))}};const D=N;var F=D;const q=(0,r.Lk)("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),M=(0,r.Lk)("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1),A=[q,M];var P={__name:"LoadingCircle",props:{cssStyle:{type:String}},setup(e){return(t,a)=>((0,r.uX)(),(0,r.CE)(r.FK,null,[((0,r.uX)(),(0,r.CE)("svg",{class:(0,i.C4)(["animate-spin",e.cssStyle]),xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},A,2)),(0,r.RG)(t.$slots,"default")],64))}};const j=P;var B=j;const V={class:"block font-normal text-sm text-gray-600 dark:text-gray-300"};var H={__name:"TextDesc",props:{},setup(e){return(e,t)=>((0,r.uX)(),(0,r.CE)("p",V,[(0,r.RG)(e.$slots,"default")]))}};const W=H;var X=W;const K={class:"block font-semibold text-xl text-gray-600 dark:text-gray-300"};var $={__name:"PrimaryHeading",props:{},setup(e){return(e,t)=>((0,r.uX)(),(0,r.CE)("p",K,[(0,r.RG)(e.$slots,"default")]))}};const U=$;var z=U;const Q=["type"];var G={__name:"SVGIconButton",props:{type:{type:String,default:"button"},icon:{type:String,default:""},color:{type:String,default:""},isSquare:{type:Boolean,default:!1}},setup(e){return(t,a)=>((0,r.uX)(),(0,r.CE)("button",{type:e.type,class:(0,i.C4)(["inline-flex items-center p-1.5 border shadow-md rounded-full font-semibold text-xs focus:outline-none disabled:opacity-25 transition ease-in-out duration-300",{"bg-rose-100 hover:bg-rose-200 border-rose-300/50 dark:bg-rose-700 dark:hover:bg-rose-600 dark:border-rose-900 ":"red"==e.color,"bg-green-100 hover:bg-green-200 border-green-300 dark:bg-green-700 dark:hover:bg-green-600 dark:border-green-900 ":"green"==e.color,"bg-blue-100 hover:bg-blue-200 border-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600 dark:border-blue-900 ":"blue"==e.color,"bg-gray-100 hover:bg-gray-200 border-gray-300 dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:border-gray-800 ":"gray"==e.color,"!rounded-md":e.isSquare}])},[((0,r.uX)(),(0,r.Wv)((0,r.$y)(e.icon),{class:(0,i.C4)(["w-6 h-6 stroke-2 transition duration-75",{"fill-red-700 hover:fill-red-800 dark:fill-red-100":"red"==e.color,"fill-green-700 hover:fill-green-800 dark:fill-green-100":"green"==e.color,"fill-blue-700 hover:fill-blue-800 dark:fill-blue-100":"blue"==e.color,"fill-gray-600 hover:fill-gray-700 dark:fill-gray-100":"gray"==e.color}])},null,8,["class"])),(0,r.RG)(t.$slots,"default")],10,Q))}};const J=G;var Y=J;const Z={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},ee=(0,r.Lk)("path",{d:"m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7z"},null,-1),te=[ee];function ae(e,t){return(0,r.uX)(),(0,r.CE)("svg",Z,te)}var oe=a(1241);const re={},se=(0,oe.A)(re,[["render",ae]]);var le=se;const ne={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},ie=(0,r.Lk)("path",{d:"M15 20q-.425 0-.712-.288T14 19t.288-.712T15 18h2q.425 0 .713-.288T18 17v-2q0-.95.55-1.725t1.45-1.1v-.35q-.9-.325-1.45-1.1T18 9V7q0-.425-.288-.712T17 6h-2q-.425 0-.712-.288T14 5t.288-.712T15 4h2q1.25 0 2.125.875T20 7v2q0 .425.288.713T21 10t.713.288T22 11v2q0 .425-.288.713T21 14t-.712.288T20 15v2q0 1.25-.875 2.125T17 20zm-8 0q-1.25 0-2.125-.875T4 17v-2q0-.425-.288-.712T3 14t-.712-.288T2 13v-2q0-.425.288-.712T3 10t.713-.288T4 9V7q0-1.25.875-2.125T7 4h2q.425 0 .713.288T10 5t-.288.713T9 6H7q-.425 0-.712.288T6 7v2q0 .95-.55 1.725T4 11.825v.35q.9.325 1.45 1.1T6 15v2q0 .425.288.713T7 18h2q.425 0 .713.288T10 19t-.288.713T9 20z"},null,-1),ce=[ie];function de(e,t){return(0,r.uX)(),(0,r.CE)("svg",ne,ce)}const ue={},me=(0,oe.A)(ue,[["render",de]]);var ve=me;const pe={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},fe=(0,r.Lk)("path",{d:"m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"},null,-1),ge=[fe];function ye(e,t){return(0,r.uX)(),(0,r.CE)("svg",pe,ge)}const he={},be=(0,oe.A)(he,[["render",ye]]);var _e=be;const ke={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},we=(0,r.Lk)("path",{d:"M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"},null,-1),xe=[we];function Se(e,t){return(0,r.uX)(),(0,r.CE)("svg",ke,xe)}const Re={},Ee=(0,oe.A)(Re,[["render",Se]]);var Le=Ee,Te=a(772);const Ce={key:0},Ie={key:1},Oe={key:0,class:"mt-4 rounded-xl bg-white dark:bg-gray-800 dark:shadow p-3 sm:p-5"},Ne={class:"mb-2"},De={class:"text-blue-600 dark:text-blue-400"},Fe={class:"text-left ml-2"},qe={class:"flex justify-center text-center items-center my-1.5"},Me=["href"],Ae={name:"favoriteTableComp"};var Pe=Object.assign(Ae,{props:{sfHost:String,currenObject:String},emits:["fireEvent"],setup(e,{expose:t,emit:a}){const o=a,s=e,l=(0,c.KR)([]),n=(0,c.KR)([]),d=(0,c.KR)(["name"]),u=(0,c.KR)(""),m=(0,c.KR)("LastModifiedDate"),v="desc",p=(0,c.KR)([{text:"Id",value:"id"},{text:"Name",value:"name",sortable:!0},{text:"Actions",value:"Actions",width:300}]),f=((0,c.KR)(""),(0,c.KR)(!1)),g=((0,c.KR)(s?.sfHost??""),(0,c.KR)("")),y=(0,c.KR)(""),k=()=>{g.value=s?.currenObject},w=async(e=!1)=>{e&&await new Promise((e=>setTimeout(e,1e3))),l.value=await h(s?.sfHost),k(),n.value=[];for(const t of l.value)t.type===s?.currenObject&&n.value.push(...t.items);return n},x=async e=>{let t=await b(e,s?.sfHost);t&&(n.value=n.value.filter((t=>t.id!==e)),o("fireEvent",{action:"deleteItem",recId:e}))},R=async()=>{await w(!0)};return(0,r.wB)((()=>s.currenObject),(async e=>{e&&await w(!1)}),{immediate:!0}),(0,r.sV)((async()=>{l.value=await h(s?.sfHost),g.value=s?.currenObject,k(),y.value=_(`https://${s?.sfHost}`)})),t({getLatestFavItemList:R}),(e,t)=>{const a=(0,r.g2)("LoadingCircle");return f.value?((0,r.uX)(),(0,r.CE)("div",Ce,[(0,r.bF)(I,null,{default:(0,r.k6)((()=>[(0,r.bF)(a,{cssStyle:"h-4 w-4 mr-2"},{default:(0,r.k6)((()=>[(0,r.eW)("Data is loading...")])),_:1})])),_:1})])):((0,r.uX)(),(0,r.CE)("div",Ie,[n.value.length>0?((0,r.uX)(),(0,r.CE)("div",Oe,[(0,r.Lk)("div",Ne,[(0,r.bF)(z,null,{default:(0,r.k6)((()=>[(0,r.eW)("Favorite Records for "),(0,r.Lk)("span",De,(0,i.v_)(s?.currenObject),1)])),_:1}),(0,r.bF)(X,null,{default:(0,r.k6)((()=>[(0,r.eW)("Please note, there might be newer versions so please refer latest data from above table. ")])),_:1})]),(0,r.bF)(F,{modelValue:u.value,"onUpdate:modelValue":t[0]||(t[0]=e=>u.value=e),type:"text",class:"!px-3 !py-1.5 my-2 text-sm",placeholder:"Filter records.."},null,8,["modelValue"]),(0,r.bF)((0,c.R1)(Te.A),{headers:p.value,items:n.value,"search-field":d.value,"rows-per-page":10,"header-text-direction":"center","body-text-direction":"center","search-value":u.value,"sort-by":m.value,"sort-type":v,"no-hover":!0,"theme-color":"#312e3d","table-class-name":"tableCSS mt-4 mb-8 rounded-xl border dark:border-gray-600"},{loading:(0,r.k6)((()=>[(0,r.bF)(X,{class:"font-semibold my-4"},{default:(0,r.k6)((()=>[(0,r.eW)("Data loading, please wait...")])),_:1})])),"item-Name":(0,r.k6)((({name:e})=>[(0,r.Lk)("p",Fe,(0,i.v_)(e),1)])),"item-Actions":(0,r.k6)((({id:e})=>[(0,r.Lk)("div",qe,[(0,r.Lk)("a",{href:(0,c.R1)(S)(y.value,s?.sfHost,e,s?.currenObject),target:"_blank"},[(0,r.bF)(I,null,{default:(0,r.k6)((()=>[(0,r.eW)("Open in SF")])),_:1})],8,Me),(0,r.bF)(Y,{onClick:t=>x(e),icon:Le,isSquare:!1,color:"red",class:"!p-1.5 ml-2",title:"Remove from Favorite"},null,8,["onClick"])])])),_:1},8,["headers","items","search-field","search-value","sort-by"])])):(0,r.Q3)("",!0)]))}}});const je=Pe;var Be=je;const Ve={class:"fixed inset-0 overflow-y-scroll px-4 py-6 sm:px-0 z-50","scroll-region":""},He=(0,r.Lk)("div",{class:"absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"},null,-1),We=[He];var Xe={__name:"Modal",props:{show:{type:Boolean,default:!1},maxWidth:{type:String,default:"2xl"},closeable:{type:Boolean,default:!0},cssStyle:String},emits:["close"],setup(e,{emit:t}){const a=e,s=t;(0,r.wB)((()=>a.show),(()=>{a.show?document.body.style.overflow="block":document.body.style.overflow=null}));const l=()=>{a.closeable&&s("close")},n=e=>{"Escape"===e.key&&a.show&&l()};(0,r.sV)((()=>document.addEventListener("keydown",n))),(0,r.hi)((()=>{document.removeEventListener("keydown",n),document.body.style.overflow=null}));const c=(0,r.EW)((()=>{const e={sm:"sm:max-w-sm",md:"sm:max-w-md",lg:"sm:max-w-lg",xl:"sm:max-w-xl","2xl":"sm:max-w-2xl"};return e[a.maxWidth]||""}));return(t,a)=>((0,r.uX)(),(0,r.Wv)(r.Im,{to:"body"},[(0,r.bF)(o.eB,{"leave-active-class":"duration-200"},{default:(0,r.k6)((()=>[(0,r.bo)((0,r.Lk)("div",Ve,[(0,r.bF)(o.eB,{"enter-active-class":"ease-out duration-300","enter-from-class":"opacity-0","enter-to-class":"opacity-100","leave-active-class":"ease-in duration-200","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:(0,r.k6)((()=>[(0,r.bo)((0,r.Lk)("div",{class:"fixed inset-0 transform transition-all",onClick:l},We,512),[[o.aG,e.show]])])),_:1}),(0,r.bF)(o.eB,{"enter-active-class":"ease-out duration-300","enter-from-class":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95","enter-to-class":"opacity-100 translate-y-0 sm:scale-100","leave-active-class":"ease-in duration-200","leave-from-class":"opacity-100 translate-y-0 sm:scale-100","leave-to-class":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"},{default:(0,r.k6)((()=>[(0,r.bo)((0,r.Lk)("div",{class:(0,i.C4)(["mb-6 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto dark:border dark:border-gray-700",[c.value,e.cssStyle]])},[e.show?(0,r.RG)(t.$slots,"default",{key:0}):(0,r.Q3)("",!0)],2),[[o.aG,e.show]])])),_:3})],512),[[o.aG,e.show]])])),_:3})]))}};const Ke=Xe;var $e=Ke,Ue=a(7005);const ze={class:"rounded-xl bg-white dark:bg-gray-800 dark:shadow p-3 sm:p-5"},Qe={class:"flex justify-between mb-4"},Ge={class:"font-semibold"},Je={class:"font-semibold"},Ye={key:2},Ze={key:0,class:"flex space-x-2"},et={key:0,class:"mt-4"},tt={key:1},at={key:0,class:"mt-4 rounded-xl bg-white dark:bg-gray-800 dark:shadow p-3 sm:p-5"},ot={class:"mb-2"},rt={class:"text-blue-600 dark:text-blue-400"},st={key:0},lt={class:"text-left ml-2"},nt={class:"flex justify-center text-center items-center my-1.5"},it=["href"],ct={key:1},dt={key:2,class:"flex items-end justify-end mt-10"},ut=(0,r.Lk)("a",{href:"https://www.youtube.com/@ThatSalesforceGuy",target:"_blank",class:"text-blue-700 font-semibold dark:text-blue-400"},"That Salesforce Guy",-1),mt=(0,r.Lk)("span",{class:"sr-only"},"Close modal",-1),vt={key:0,class:"p-6"},pt={class:"flex justify-between items-center mb-4"},ft={class:"font-semibold"},gt={key:0},yt={class:"flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-2"},ht={class:"w-full lg:w-1/2 mr-3"},bt={class:"w-full lg:w-1/2"},_t={name:"indexComp"};var kt=Object.assign(_t,{setup(e){const t=(0,c.KR)([]),a=(0,c.KR)(["Name","LastModifiedBy.Name","LastModifiedDate"]),o=(0,c.KR)(""),s=(0,c.KR)("LastModifiedDate"),l="desc",n=(0,c.KR)([]),d=(0,c.KR)(""),v=(0,c.KR)(!1),p=(0,c.KR)(!1),f=(0,c.KR)(!1),b=(0,c.KR)(""),k=(0,c.KR)(""),w=(0,c.KR)(""),x="Salesforce OmniStudio Helper",R=(0,c.KR)("OmniScripts Loaded | "+x),L=(0,c.KR)("FlexCards Loaded | "+x),T=(0,c.KR)("Integration Procedures Loaded | "+x),C=(0,c.KR)("DataRaptors Loaded | "+x),O=(0,c.KR)(""),N=async e=>{console.log("inside initData 1");try{await m.getSession(e);const t=localStorage.getItem(e+"_ns");!O.value&&t?(O.value=Z(),console.log("orgNameSpace.value 2 -> "+O.value),A()):console.log("ns not found")}catch(t){throw console.error("Error getting session: ",t),t}},D=e=>new Promise(((t,a)=>{m.getSession(b.value).then((()=>{let o=m.rest(e);o.then((e=>{t(e)})).catch((e=>{console.error("Error fetching limits: ",e),a(e)}))})).catch((e=>{console.error("Error getting session: ",e),a(e)}))})),q=(e,t)=>new Promise(((a,o)=>{m.getSession(b.value).then((()=>{let r=m.rest(e,t);r.then((e=>{a(e)})).catch((e=>{console.error("Error fetching limits: ",e),o(e)}))})).catch((e=>{console.error("Error getting session: ",e),o(e)}))})),M=async e=>{p.value=!0,console.log("sfHost --\x3e "+e);let t="/services/data/v"+u+"/query/?q=SELECT+Name,NamespacePrefix+FROM+ApexClass+WHERE+NAME='DRDataPackService'";if(null==localStorage.getItem(e+"_ns")){const a=await D(t);1==a.totalSize&&a.done&&a.records.length>0&&(localStorage.setItem(e+"_ns",a.records[0].NamespacePrefix),console.log("Namespace saved:",a.records[0].NamespacePrefix),A(a.records[0].NamespacePrefix));let o="/services/data/v"+u+"/query/?q=SELECT+IsSandbox,+InstanceName+FROM+Organization";const r="isSandbox",s=await D(o);null==localStorage.getItem(e+"_"+r)&&s.records.length>0&&localStorage.setItem(e+"_"+r,s.records[0].IsSandbox)}p.value=!1},A=()=>{n.value=[{text:"Id",value:"Id"},{text:"Name",value:"Name",sortable:!0},{text:"LastModified By",value:"LastModifiedBy.Name"},{text:"LastModified Date",value:"LastModifiedDateNew",sortable:!0},{text:"Actions",value:"Actions",width:300}]},P=()=>{let e="VersionNumber";"vlocity_cmt"==O.value&&(e="vlocity_cmt__Version__c");const t={text:"Version",value:e},a=n.value.some((e=>e.value===t.value));a||n.value.splice(2,0,t)},j=async e=>{v.value=!0,k.value="OmniScript";let a="OmniScript";e&&(k.value="IntegrationProcedure",a="Integration Procedure");let o="/services/data/v"+u+E(O.value,k.value);try{const a=await D(o);a?.records.forEach((e=>{e.LastModifiedDateNew=g(e.LastModifiedDate),e.iconColor=Q(e.Id)})),t.value=a?.records,d.value=e?T.value:R.value,P()}catch(r){console.error("Error fetching OmniScript list: ",r)}v.value=!1,document.title=e?T.value:R.value},V=async()=>{v.value=!0,k.value="FlexCard";let e="/services/data/v"+u+E(O.value,k.value);try{const a=await D(e);a?.records.forEach((e=>{e.LastModifiedDateNew=g(e.LastModifiedDate),e.iconColor=Q(e.Id)})),t.value=a?.records,d.value=L.value,P()}catch(a){console.error("Error fetching getFlexCardList: ",a)}v.value=!1,document.title=L.value},H=async()=>{v.value=!0,k.value="DataRaptor";let e="/services/data/v"+u+E(O.value,k.value);try{let a="VersionNumber";const o=await D(e);o?.records.forEach((e=>{e.LastModifiedDateNew=g(e.LastModifiedDate),e.iconColor=Q(e.Id)})),t.value=o?.records,d.value=C.value,"vlocity_cmt"==O.value&&(a="vlocity_cmt__Version__c"),n.value=n.value.filter((e=>e.value!==a))}catch(a){console.error("Error fetching getDataRaptorList: ",a)}v.value=!1,document.title=C.value},W=(0,c.KR)(null),K=(e,t)=>{let a={type:k.value,id:e,name:t},o=y(a,b.value);o&&(W.value.getLatestFavItemList(),$(e,"blue"))},$=(e,a)=>{const o=t.value.findIndex((t=>t.Id===e));-1!==o&&(t.value[o].iconColor=a)},U=(0,c.KR)([]),Q=e=>{const t=U.value.some((t=>t.items.some((t=>t.id===e))));return t?"blue":"gray"},G=e=>{"deleteItem"==e?.action&&$(e?.recId,"gray")},J=e=>{try{ee.value.modelValue=JSON.stringify(e,null,2)}catch(t){console.log("error --\x3e "+t),ee.value.modelValue="Invalid JSON"}},Z=()=>{if(b.value){const e=localStorage.getItem(b.value+"_ns");return null!==e?e:null}return null},ee=(0,c.KR)(null),te=(0,c.KR)(null),ae=(0,c.KR)(""),oe=(0,c.KR)(null),re=(0,c.KR)(null),se=async()=>{let e,t;f.value=!0,ae.value=null;let a=Z();try{"IntegrationProcedure"==ie.value?.queriedObject?(e=`/services/apexrest/${a}/v1/integrationprocedure/${ie.value.Type}_${ie.value.SubType}`,t=te.value.modelValue):"DataRaptor"==ie?.value.queriedObject&&(e=`/services/apexrest/${a}/v2/DataRaptor/`,t={bundleName:ie.value?.Name,objectList:te.value.modelValue,bulkUpload:ie.value?.bulkUpload},t=JSON.stringify(t));const o=await q(e,{method:"POST",body:JSON.parse(t)});"DataRaptor"==ie?.value.queriedObject?re.value=o?.hasErrors?o?.errors??o?.returnResultsData:o?.returnResultsData:re.value=o,J(re.value)}catch(o){console.log(o),ae.value=o}f.value=!1},ne=(0,c.KR)(!1),ie=(0,c.KR)({}),ce=(e,t,a,o,r)=>{ne.value=!0,ie.value={Id:t,Type:a,SubType:o,queriedObject:e,Name:r}},de=()=>{ne.value=!1,ae.value=null,re.value=" ",ee.value,ee.value.modelValue=" "};return(0,r.sV)((async()=>{let e=new URLSearchParams(location.search.slice(1)),t=e.get("host");b.value=t,w.value=_(`https://${b.value}`),U.value=await h(b.value),document.title=x,await M(t),await N(t)})),(e,u)=>((0,r.uX)(),(0,r.CE)(r.FK,null,[(0,r.Lk)("div",ze,[(0,r.Lk)("div",Qe,[b.value?((0,r.uX)(),(0,r.Wv)(X,{key:0},{default:(0,r.k6)((()=>[(0,r.eW)("Current Org : "),(0,r.Lk)("span",Ge,(0,i.v_)(b.value),1)])),_:1})):(0,r.Q3)("",!0),O.value?((0,r.uX)(),(0,r.Wv)(X,{key:1,class:"mr-3"},{default:(0,r.k6)((()=>[(0,r.eW)("Package : "),(0,r.Lk)("span",Je,(0,i.v_)("omnistudio"==O.value?"Standard OmniStudio":"Vlocity OmniStudio"),1)])),_:1})):((0,r.uX)(),(0,r.CE)("div",Ye,[p.value?((0,r.uX)(),(0,r.Wv)(X,{key:0,class:"text-red-500 font-semibold"},{default:(0,r.k6)((()=>[(0,r.bF)(I,null,{default:(0,r.k6)((()=>[(0,r.bF)(B,{cssStyle:"h-4 w-4 mr-2"},{default:(0,r.k6)((()=>[(0,r.eW)("Fetching OmniStdio Package...")])),_:1})])),_:1})])),_:1})):((0,r.uX)(),(0,r.Wv)(X,{key:1,class:"text-red-500 font-semibold"},{default:(0,r.k6)((()=>[(0,r.eW)(" No OmniStudio Found ")])),_:1}))]))]),O.value?((0,r.uX)(),(0,r.CE)("div",Ze,[(0,r.bF)(I,{isBlue:!0,onClick:u[0]||(u[0]=e=>j(!1))},{default:(0,r.k6)((()=>[(0,r.eW)(" Load OmniScript ")])),_:1}),(0,r.bF)(I,{isBlue:!0,onClick:V},{default:(0,r.k6)((()=>[(0,r.eW)(" Load FlexCard ")])),_:1}),(0,r.bF)(I,{isBlue:!0,onClick:u[1]||(u[1]=e=>j(!0))},{default:(0,r.k6)((()=>[(0,r.eW)(" Load Integration Procedure ")])),_:1}),(0,r.bF)(I,{isBlue:!0,onClick:H},{default:(0,r.k6)((()=>[(0,r.eW)(" Load DataRaptor ")])),_:1})])):(0,r.Q3)("",!0)]),v.value?((0,r.uX)(),(0,r.CE)("div",et,[(0,r.bF)(I,null,{default:(0,r.k6)((()=>[(0,r.bF)(B,{cssStyle:"h-4 w-4 mr-2"},{default:(0,r.k6)((()=>[(0,r.eW)("Data is loading...")])),_:1})])),_:1})])):((0,r.uX)(),(0,r.CE)("div",tt,[d.value?((0,r.uX)(),(0,r.CE)("div",at,[(0,r.Lk)("div",ot,[(0,r.bF)(z,null,{default:(0,r.k6)((()=>[(0,r.eW)("Records loaded for "),(0,r.Lk)("span",rt,(0,i.v_)(k.value),1)])),_:1}),t.value.length>0?((0,r.uX)(),(0,r.Wv)(X,{key:0},{default:(0,r.k6)((()=>[(0,r.eW)("All records are active records")])),_:1})):((0,r.uX)(),(0,r.Wv)(X,{key:1},{default:(0,r.k6)((()=>[(0,r.eW)("No records found.")])),_:1}))]),t.value.length>0?((0,r.uX)(),(0,r.CE)("div",st,[(0,r.bF)(F,{modelValue:o.value,"onUpdate:modelValue":u[2]||(u[2]=e=>o.value=e),type:"text",class:"!px-3 !py-1.5 my-2 text-sm",placeholder:"Filter records.."},null,8,["modelValue"]),(0,r.bF)((0,c.R1)(Te.A),{headers:n.value,items:t.value,"search-field":a.value,"rows-per-page":10,"header-text-direction":"center","body-text-direction":"center","search-value":o.value,"sort-by":s.value,"sort-type":l,"no-hover":!0,"theme-color":"#312e3d","table-class-name":"tableCSS mt-4 mb-8 rounded-xl border dark:border-gray-600"},{loading:(0,r.k6)((()=>[(0,r.bF)(X,{class:"font-semibold my-4"},{default:(0,r.k6)((()=>[(0,r.eW)("Data loading, please wait...")])),_:1})])),"item-Name":(0,r.k6)((({Name:e})=>[(0,r.Lk)("p",lt,(0,i.v_)(e),1)])),"item-Actions":(0,r.k6)((({Id:e,Name:t,iconColor:a,Type:o,vlocity_cmt__Type__c:s,SubType:l,vlocity_cmt__SubType__c:n})=>[(0,r.Lk)("div",nt,[(0,r.Lk)("a",{href:(0,c.R1)(S)(w.value,b.value,e,k.value),target:"_blank"},[(0,r.bF)(I,null,{default:(0,r.k6)((()=>[(0,r.eW)("Open in SF")])),_:1})],8,it),(0,r.bF)(Y,{onClick:a=>K(e,t),icon:le,isSquare:!1,color:a,class:"!p-1.5 ml-2",title:"Add to Favorite"},null,8,["onClick","color"]),"DataRaptor"==k.value||"IntegrationProcedure"==k.value?((0,r.uX)(),(0,r.Wv)(Y,{key:0,onClick:a=>ce(k.value,e,o??s,l??n,t),icon:ve,isSquare:!1,color:"green",class:"!p-1.5 ml-2",title:"Execute with Payload"},null,8,["onClick"])):(0,r.Q3)("",!0)])])),_:1},8,["headers","items","search-field","search-value","sort-by"])])):(0,r.Q3)("",!0)])):(0,r.Q3)("",!0),b.value&&t.value.length>0?((0,r.uX)(),(0,r.CE)("div",ct,[(0,r.bF)(Be,{sfHost:b.value,currenObject:k.value,ref_key:"childComponentRef",ref:W,onFireEvent:G},null,8,["sfHost","currenObject"])])):(0,r.Q3)("",!0),b.value&&t.value.length>0?((0,r.uX)(),(0,r.CE)("div",dt,[(0,r.bF)(X,null,{default:(0,r.k6)((()=>[(0,r.eW)("Salesforce OmniStudio Helper by "),ut])),_:1})])):(0,r.Q3)("",!0)])),(0,r.bF)($e,{show:ne.value,onClose:de,cssStyle:"mt-24 !max-w-screen-xl"},{default:(0,r.k6)((()=>[(0,r.Lk)("button",{type:"button",onClick:de,class:"absolute top-3 end-3 text-gray-400 bg-gray-100 hover:bg-gray-200 hover:text-gray-600 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:bg-gray-600 dark:text-white dark:fill-gray-200 dark:hover:fill-white dark:hover:bg-gray-500 transition duration-200 ease-in-out"},[(0,r.bF)(_e,{class:"w-6 h-6"}),mt]),ie.value?((0,r.uX)(),(0,r.CE)("div",vt,[(0,r.Lk)("div",pt,[(0,r.bF)(X,null,{default:(0,r.k6)((()=>[(0,r.eW)((0,i.v_)("IntegrationProcedure"==k.value?"Integration Procedure":"Data Raptor")+" : ",1),(0,r.Lk)("span",ft,(0,i.v_)(ie.value.Name),1)])),_:1}),f.value?((0,r.uX)(),(0,r.Wv)(I,{key:1,class:"mr-16"},{default:(0,r.k6)((()=>[(0,r.bF)(B,{cssStyle:"h-4 w-4 mr-2"},{default:(0,r.k6)((()=>[(0,r.eW)("Waiting for Response..")])),_:1})])),_:1})):((0,r.uX)(),(0,r.Wv)(I,{key:0,isBlue:!0,onClick:se,class:"mr-16"},{default:(0,r.k6)((()=>[(0,r.eW)(" Execute ")])),_:1}))]),ae.value?((0,r.uX)(),(0,r.CE)("div",gt,[(0,r.bF)(X,{class:"text-red-600 font-semibold my-4"},{default:(0,r.k6)((()=>[(0,r.eW)((0,i.v_)(ae.value),1)])),_:1})])):(0,r.Q3)("",!0),(0,r.Lk)("div",yt,[(0,r.Lk)("div",ht,[(0,r.bF)((0,c.R1)(Ue.Q),{ref_key:"requestJSON",ref:te,codeValue:oe.value,lang:"json",textEditor:"true",height:"500px",width:"100%",fontSize:"12px",copy:"true",class:"dark:border dark:border-gray-700 dark:shadow"},null,8,["codeValue"])]),(0,r.Lk)("div",bt,[(0,r.bF)((0,c.R1)(Ue.Q),{ref_key:"responseJSON",ref:ee,codeValue:re.value,lang:"json",textEditor:"true",height:"500px",width:"100%",fontSize:"12px",copy:"true",class:"dark:border dark:border-gray-700 dark:shadow"},null,8,["codeValue"])])])])):(0,r.Q3)("",!0)])),_:1},8,["show"])],64))}});const wt=kt;var xt=wt;const St={for:"theme",class:"theme md:top-6 md:right-6 z-40 rounded-2xl dark:shadow-xl absolute top-1 right-1"},Rt={class:"theme__toggle-wrap"},Et=(0,r.Fv)('<span class="theme__icon" data-v-76a18a32><span class="theme__icon-part" data-v-76a18a32></span><span class="theme__icon-part" data-v-76a18a32></span><span class="theme__icon-part" data-v-76a18a32></span><span class="theme__icon-part" data-v-76a18a32></span><span class="theme__icon-part" data-v-76a18a32></span><span class="theme__icon-part" data-v-76a18a32></span><span class="theme__icon-part" data-v-76a18a32></span><span class="theme__icon-part" data-v-76a18a32></span><span class="theme__icon-part" data-v-76a18a32></span></span>',1);var Lt={__name:"ToggleLightDarkMode",setup(e){const t=(0,c.KR)(!1);(0,r.sV)((()=>{const e=localStorage.getItem("color-theme");("dark"===e||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&(t.value=!0,document.documentElement.classList.add("dark"))}));const a=()=>{t.value=!t.value,t.value?(document.documentElement.classList.add("dark"),localStorage.setItem("color-theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("color-theme","light"))};return(e,s)=>((0,r.uX)(),(0,r.CE)("label",St,[(0,r.Lk)("span",Rt,[(0,r.bo)((0,r.Lk)("input",{id:"theme",class:"theme__toggle",type:"checkbox",role:"switch",name:"theme",value:"dark",onClick:a,"onUpdate:modelValue":s[0]||(s[0]=e=>t.value=e)},null,512),[[o.lH,t.value]]),Et])]))}};const Tt=(0,oe.A)(Lt,[["__scopeId","data-v-76a18a32"]]);var Ct=Tt,It={name:"App",components:{SecondaryComp:xt,ToggleLightDarkMode:Ct}};const Ot=(0,oe.A)(It,[["render",n]]);var Nt=Ot;(0,o.Ef)(Nt).mount("#secondaryApp")}},t={};function a(o){var r=t[o];if(void 0!==r)return r.exports;var s=t[o]={exports:{}};return e[o].call(s.exports,s,s.exports,a),s.exports}a.m=e,function(){var e=[];a.O=function(t,o,r,s){if(!o){var l=1/0;for(d=0;d<e.length;d++){o=e[d][0],r=e[d][1],s=e[d][2];for(var n=!0,i=0;i<o.length;i++)(!1&s||l>=s)&&Object.keys(a.O).every((function(e){return a.O[e](o[i])}))?o.splice(i--,1):(n=!1,s<l&&(l=s));if(n){e.splice(d--,1);var c=r();void 0!==c&&(t=c)}}return t}s=s||0;for(var d=e.length;d>0&&e[d-1][2]>s;d--)e[d]=e[d-1];e[d]=[o,r,s]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){a.d=function(e,t){for(var o in t)a.o(t,o)&&!a.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){a.j=524}(),function(){var e={524:0,996:0};a.O.j=function(t){return 0===e[t]};var t=function(t,o){var r,s,l=o[0],n=o[1],i=o[2],c=0;if(l.some((function(t){return 0!==e[t]}))){for(r in n)a.o(n,r)&&(a.m[r]=n[r]);if(i)var d=i(a)}for(t&&t(o);c<l.length;c++)s=l[c],a.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return a.O(d)},o=self["webpackChunkmy_chrome_extension"]=self["webpackChunkmy_chrome_extension"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=a.O(void 0,[504,996],(function(){return a(9020)}));o=a.O(o)})();
//# sourceMappingURL=app.14ebf52e.js.map