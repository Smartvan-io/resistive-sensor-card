function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}function e(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=globalThis,s=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new o(i,t,r)},l=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,r))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:c,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:v}=Object,m=globalThis,g=m.trustedTypes,f=g?g.emptyScript:"",$=m.reactiveElementPolyfillSupport,_=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),A={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;class x extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=A){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return s?.call(this)},set(e){const n=s?.call(this);r.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=v(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(s)t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const s of e){const e=document.createElement("style"),r=i.litNonce;void 0!==r&&e.setAttribute("nonce",r),e.textContent=s.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s,this[s]=r.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??b)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[_("elementProperties")]=new Map,x[_("finalized")]=new Map,$?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S=globalThis,w=S.trustedTypes,E=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,N="?"+P,O=`<${N}>`,U=document,k=()=>U.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,R="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,z=/>/g,D=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,B=/"/g,V=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,J=U.createTreeWalker(U,129);function K(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===H?"!--"===l[1]?o=j:void 0!==l[1]?o=z:void 0!==l[2]?(V.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=D):void 0!==l[3]&&(o=D):o===D?">"===l[0]?(o=r??H,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?D:'"'===l[3]?B:L):o===B||o===L?o=D:o===j||o===z?o=H:(o=D,r=void 0);const h=o===D&&t[e+1].startsWith("/>")?" ":"";n+=o===H?i+O:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+P+h):i+P+(-2===c?e:h)}return[K(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=G.createElement(l,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[n++],i=s.getAttribute(t).split(P),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(V.test(s.tagName)){const t=s.textContent.split(P),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],k()),J.nextNode(),a.push({type:2,index:++r});s.append(t[e],k())}}}else if(8===s.nodeType)if(s.data===N)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(P,t+1));)a.push({type:7,index:r}),t+=P.length-1}r++}}static createElement(t,e){const i=U.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===F)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=M(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??U).importNode(e,!0);J.currentNode=s;let r=J.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Y(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=J.nextNode(),n++)}return J.currentNode=U,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),M(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new G(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Y(this.O(k()),this.O(k()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=Q(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==F,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=Q(this,s[i+o],e,o),a===F&&(a=this._$AH[o]),n||=!M(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??W)===F)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=S.litHtmlPolyfillSupport;nt?.(G,Y),(S.litHtmlVersions??=[]).push("3.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let ot=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Y(e.insertBefore(k(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};ot._$litElement$=!0,ot.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:ot});const at=globalThis.litElementPolyfillSupport;at?.({LitElement:ot}),(globalThis.litElementVersions??=[]).push("4.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=t=>(e,i)=>{void 0!==i?i.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ct={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},dt=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t)},init(e){return void 0!==e&&this.P(s,void 0,t),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,s?{...t,wrapped:!0}:t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}var pt,ut;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(pt||(pt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ut||(ut={}));const vt=[{name:"device",required:!0,selector:{device:{filter:{integration:"smartvanio",model:"SmartVan.io Tank Sensor"}}}},{name:"variant",required:!0,selector:{select:{mode:"dropdown",options:[{value:"tile",label:"Tile (per-sensor numbers)"},{value:"gauge",label:"Gauge (circular fill)"},{value:"bar",label:"Bar (horizontal fill)"}].map((t=>({value:t.value,label:t.label})))}}},{name:"min",selector:{number:{mode:"box",step:1}}},{name:"max",selector:{number:{mode:"box",step:1}}}],mt={device:"Resistive sensor module",variant:"Style",min:"Min (gauge / bar)",max:"Max (gauge / bar)"};let gt=class extends ot{constructor(){super(...arguments),this._config={type:"custom:smartvan-io-resistive-sensor",device:"",variant:"tile"},this._computeLabel=t=>{var e;return null!==(e=mt[t.name])&&void 0!==e?e:t.name},this._valueChanged=t=>{console.log("[smartvan-io-resistive-editor] _valueChanged",t.detail),function(t,e,i,s){s=s||{},i=null==i?{}:i;var r=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});r.detail=i,t.dispatchEvent(r)}(this,"config-changed",{config:t.detail.value})}}setConfig(t){this._config=Object.assign({variant:"tile",min:0,max:100},t)}render(){return this.hass&&this._config?I`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${vt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:W}};t([ht({attribute:!1}),e("design:type",Object)],gt.prototype,"hass",void 0),t([function(t){return ht({...t,state:!0,attribute:!1})}(),e("design:type",Object)],gt.prototype,"_config",void 0),gt=t([lt("smartvan-io-resistive-sensor-editor")],gt);let ft=class extends ot{constructor(){super(...arguments),this.label="Sensor",this.interpolated="—",this.unit="",this.raw="—",this.openCircuit=!1}render(){return I`
      <div class="tile">
        <div class="label">${this.label}</div>
        <div class="value">
          ${this.interpolated}<span class="unit">${this.unit}</span>
        </div>
        <div class="raw">raw: ${this.raw} V</div>
        ${this.openCircuit?I`<div class="warn">⚠ open circuit</div>`:null}
      </div>
    `}};ft.styles=a`
    :host {
      display: block;
    }
    .tile {
      background: var(--card-background-color, #16181d);
      border: 1px solid var(--divider-color, #2a2d33);
      border-radius: 6px;
      padding: 14px;
      text-align: center;
    }
    .label {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .value {
      font-size: 2.4rem;
      line-height: 1;
      font-weight: 600;
      margin-top: 6px;
    }
    .unit {
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      margin-left: 2px;
    }
    .raw {
      margin-top: 10px;
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
    .warn {
      margin-top: 8px;
      color: var(--warning-color, #fbbf24);
      font-size: 0.85rem;
    }
  `,t([ht(),e("design:type",String)],ft.prototype,"label",void 0),t([ht(),e("design:type",String)],ft.prototype,"interpolated",void 0),t([ht(),e("design:type",String)],ft.prototype,"unit",void 0),t([ht(),e("design:type",String)],ft.prototype,"raw",void 0),t([ht({attribute:!1}),e("design:type",Boolean)],ft.prototype,"openCircuit",void 0),ft=t([lt("smartvan-io-resistive-tile")],ft);let $t=class extends ot{constructor(){super(...arguments),this.label="Sensor",this.value=NaN,this.unit="",this.min=0,this.max=100}render(){const t=Number(this.value),e=!isNaN(t),i=e?`${t.toFixed(1)}${this.unit}`:"—",s=this.max-this.min||1,r=e?Math.min(100,Math.max(0,(t-this.min)/s*100)):0;return I`
      <div class="row">
        <span class="label">${this.label}</span>
        <span class="value">${i}</span>
      </div>
      <div class="track">
        <div class="fill ${e?"":"empty"}" style="width: ${r}%"></div>
      </div>
    `}};$t.styles=a`
    :host {
      display: block;
      padding: 10px 4px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      letter-spacing: 0.04em;
    }
    .label {
      text-transform: uppercase;
    }
    .value {
      color: var(--primary-text-color);
      font-weight: 600;
    }
    .track {
      margin-top: 8px;
      background: var(--divider-color, #2a2d33);
      height: 16px;
      border-radius: 8px;
      overflow: hidden;
    }
    .fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .fill.empty {
      background: var(--secondary-text-color);
    }
  `,t([ht(),e("design:type",String)],$t.prototype,"label",void 0),t([ht({attribute:!1}),e("design:type",Number)],$t.prototype,"value",void 0),t([ht(),e("design:type",String)],$t.prototype,"unit",void 0),t([ht({attribute:!1}),e("design:type",Number)],$t.prototype,"min",void 0),t([ht({attribute:!1}),e("design:type",Number)],$t.prototype,"max",void 0),$t=t([lt("smartvan-io-resistive-bar")],$t);let _t=class extends ot{constructor(){super(...arguments),this.label="Sensor",this.value=NaN,this.unit="",this.min=0,this.max=100}render(){const t=Number(this.value),e=!isNaN(t),i=e?`${t.toFixed(1)}${this.unit}`:"—",s=this.max-this.min||1,r=e?Math.min(1,Math.max(0,(t-this.min)/s)):0,n=180*r-90;return I`
      <div class="gauge">
        <svg viewBox="-110 -110 220 130" aria-hidden="true">
          <!-- Track -->
          <path
            d="M -100 0 A 100 100 0 0 1 100 0"
            fill="none"
            stroke="var(--divider-color, #2a2d33)"
            stroke-width="14"
            stroke-linecap="round"
          />
          <!-- Filled portion -->
          <path
            d="${function(t,e,i){const s=t=>{const e=t*Math.PI/180;return[Math.cos(e)*i,Math.sin(e)*i]},[r,n]=s(t),[o,a]=s(e),l=Math.abs(e-t)>180?1:0;return`M ${r} ${n} A ${i} ${i} 0 ${l} 1 ${o} ${a}`}(-180,180*r-180,100)}"
            fill="none"
            stroke="#3b82f6"
            stroke-width="14"
            stroke-linecap="round"
            opacity=${e?1:.3}
          />
          <!-- Needle -->
          <g transform="rotate(${n})">
            <line x1="0" y1="0" x2="0" y2="-90" stroke="var(--primary-text-color)" stroke-width="3" />
            <circle r="6" fill="var(--primary-text-color)" />
          </g>
        </svg>
        <div class="value">${i}</div>
        <div class="label">${this.label}</div>
      </div>
    `}};_t.styles=a`
    :host {
      display: block;
    }
    .gauge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
    }
    svg {
      width: 100%;
      max-width: 220px;
      height: auto;
    }
    .label {
      margin-top: 4px;
      color: var(--secondary-text-color);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-size: 0.85rem;
    }
    .value {
      color: var(--primary-text-color);
      font-weight: 600;
      font-size: 1.4rem;
      margin-top: 2px;
    }
  `,t([ht(),e("design:type",String)],_t.prototype,"label",void 0),t([ht({attribute:!1}),e("design:type",Number)],_t.prototype,"value",void 0),t([ht(),e("design:type",String)],_t.prototype,"unit",void 0),t([ht({attribute:!1}),e("design:type",Number)],_t.prototype,"min",void 0),t([ht({attribute:!1}),e("design:type",Number)],_t.prototype,"max",void 0),_t=t([lt("smartvan-io-resistive-gauge")],_t);let yt=class extends ot{static getConfigElement(){return document.createElement("smartvan-io-resistive-sensor-editor")}static getStubConfig(){return{device:"",variant:"tile"}}setConfig(t){this.config=Object.assign({variant:"tile",min:0,max:100},t)}render(){var t;if(console.log("[smartvan-io-resistive] render",{config:this.config,hasHass:!!this.hass}),!this.config)return I`<ha-card>Loading…</ha-card>`;if(!this.config.device)return console.log("[smartvan-io-resistive] render → placeholder1 (no device)"),I`
        <ha-card>
          <div class="placeholder">
            Pick a SmartVan.io resistive sensor in the editor.
          </div>
        </ha-card>
      `;const e=this._entitiesForDevice(this.config.device);if(0===e.length)return console.log("[smartvan-io-resistive] render → placeholder2 (no entities)",{device:this.config.device}),I`
        <ha-card>
          <div class="placeholder">
            Configure this card in the SmartVan.io add-on, then come back.
          </div>
        </ha-card>
      `;console.log("[smartvan-io-resistive] render → real card",{device:this.config.device,entityCount:e.length});const i=null!==(t=this.config.variant)&&void 0!==t?t:"tile",s=[1,2].map((t=>this._readSensor(t,e)));return I`
      <ha-card>
        <div class="header">Resistive sensors</div>
        ${this._renderVariant(i,s)}
      </ha-card>
    `}_renderVariant(t,e){var i,s;const r=null!==(i=this.config.min)&&void 0!==i?i:0,n=null!==(s=this.config.max)&&void 0!==s?s:100;switch(t){case"bar":return I`
          <div class="stack">
            ${e.map((t=>I`
                <smartvan-io-resistive-bar
                  label=${t.label}
                  .value=${t.interpolated}
                  .min=${r}
                  .max=${n}
                  unit=${t.unit}
                ></smartvan-io-resistive-bar>
              `))}
          </div>
        `;case"gauge":return I`
          <div class="grid">
            ${e.map((t=>I`
                <smartvan-io-resistive-gauge
                  label=${t.label}
                  .value=${t.interpolated}
                  .min=${r}
                  .max=${n}
                  unit=${t.unit}
                ></smartvan-io-resistive-gauge>
              `))}
          </div>
        `;default:return I`
          <div class="grid">
            ${e.map((t=>I`
                <smartvan-io-resistive-tile
                  label=${t.label}
                  interpolated=${t.interpolatedDisplay}
                  raw=${t.rawDisplay}
                  unit=${t.unit}
                  .openCircuit=${t.openCircuit}
                ></smartvan-io-resistive-tile>
              `))}
          </div>
        `}}_readSensor(t,e){var i,s,r;const n=t=>e.find((e=>{var i;return null===(i=e.unique_id)||void 0===i?void 0:i.endsWith(`_${t}`)}))||e.find((e=>{var i;return null===(i=e.entity_id)||void 0===i?void 0:i.endsWith(`_${t}`)})),o=n(`sensor_${t}_raw`),a=n(`sensor_${t}_interpolated_value`),l=n(`sensor_${t}_input_open`),c=o?this.hass.states[o.entity_id]:void 0,d=a?this.hass.states[a.entity_id]:void 0,h=l?this.hass.states[l.entity_id]:void 0,p=parseFloat(null!==(i=null==d?void 0:d.state)&&void 0!==i?i:""),u=parseFloat(null!==(s=null==c?void 0:c.state)&&void 0!==s?s:"");return{label:`Sensor ${t}`,raw:u,rawDisplay:isNaN(u)?"—":u.toFixed(3),interpolated:p,interpolatedDisplay:isNaN(p)?"—":p.toFixed(1),unit:(null===(r=null==d?void 0:d.attributes)||void 0===r?void 0:r.unit_of_measurement)||"",openCircuit:"on"===(null==h?void 0:h.state)}}_entitiesForDevice(t){var e;if(!(null===(e=this.hass)||void 0===e?void 0:e.entities))return console.log("[smartvan-io-resistive] no hass.entities",{hass:!!this.hass}),[];const i=Object.values(this.hass.entities),s=i.filter((e=>e.device_id===t));return console.log("[smartvan-io-resistive] _entitiesForDevice",{device:t,hassEntitiesCount:i.length,matchCount:s.length,sampleEntity:i.find((t=>{var e;return null===(e=t.entity_id)||void 0===e?void 0:e.includes("smartvanio_res")}))}),s}getCardSize(){return 2}};yt.styles=a`
    :host {
      display: block;
    }
    ha-card {
      padding: 12px;
    }
    .header {
      font-weight: 600;
      padding: 4px 4px 12px;
      color: var(--primary-text-color);
    }
    .placeholder {
      padding: 16px;
      color: var(--secondary-text-color);
      text-align: center;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `,t([ht({attribute:!1}),e("design:type",Object)],yt.prototype,"hass",void 0),t([ht({attribute:!1}),e("design:type",Object)],yt.prototype,"config",void 0),yt=t([lt("smartvan-io-resistive-sensor")],yt),window.customCards&&window.customCards.push({type:"smartvan-io-resistive-sensor",name:"SmartVan.io Resistive Sensor",description:"Display-only card for SmartVan.io tank/level sensor modules. Pick a visual style; calibrate in the SmartVan.io add-on.",preview:!0});
//# sourceMappingURL=index.js.map
