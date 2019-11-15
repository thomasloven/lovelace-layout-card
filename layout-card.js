!function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);const o=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),r=o.prototype.html,s=o.prototype.css;const i="custom:";function c(t,e){const n=document.createElement("hui-error-card");return n.setConfig({type:"error",error:t,origConfig:e}),n}function a(t,e){if(!e||"object"!=typeof e||!e.type)return c(`No ${t} type configured`,e);let n=e.type;if(n=n.startsWith(i)?n.substr(i.length):`hui-${n}-${t}`,customElements.get(n))return function(t,e){const n=document.createElement(t);try{n.setConfig(e)}catch(t){return c(t,e)}return n}(n,e);const o=c(`Custom element doesn't exist: ${n}.`,e);o.style.display="None";const r=setTimeout(()=>{o.style.display=""},2e3);return customElements.whenDefined(n).then(()=>{clearTimeout(r),function(t,e,n=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},n)n.dispatchEvent(t);else{var o=document.querySelector("home-assistant");(o=(o=(o=(o=(o=(o=(o=(o=(o=(o=(o=o&&o.shadowRoot)&&o.querySelector("home-assistant-main"))&&o.shadowRoot)&&o.querySelector("app-drawer-layout partial-panel-resolver"))&&o.shadowRoot||o)&&o.querySelector("ha-panel-lovelace"))&&o.shadowRoot)&&o.querySelector("hui-root"))&&o.shadowRoot)&&o.querySelector("ha-app-layout #view"))&&o.firstElementChild)&&o.dispatchEvent(t)}}("ll-rebuild",{},o)}),o}function l(){return document.querySelector("home-assistant").hass}const u=2;class d extends o{static get version(){return u}static get properties(){return{noHass:{type:Boolean}}}setConfig(t){var e;this._config=t,this.el?this.el.setConfig(t):(this.el=this.create(t),this._hass&&(this.el.hass=this._hass),this.noHass&&(e=this,document.querySelector("home-assistant").provideHass(e)))}set config(t){this.setConfig(t)}set hass(t){this._hass=t,this.el&&(this.el.hass=t)}createRenderRoot(){return this}render(){return r`${this.el}`}}const h=function(t,e){const n=Object.getOwnPropertyDescriptors(e.prototype);for(const[e,o]of Object.entries(n))"constructor"!==e&&Object.defineProperty(t.prototype,e,o);const o=Object.getOwnPropertyDescriptors(e);for(const[e,n]of Object.entries(o))"prototype"!==e&&Object.defineProperty(t,e,n);const r=Object.getPrototypeOf(e),s=Object.getOwnPropertyDescriptors(r.prototype);for(const[e,n]of Object.entries(s))"constructor"!==e&&Object.defineProperty(Object.getPrototypeOf(t).prototype,e,n);const i=Object.getOwnPropertyDescriptors(r);for(const[e,n]of Object.entries(i))"prototype"!==e&&Object.defineProperty(Object.getPrototypeOf(t),e,n)},m=customElements.get("card-maker");if(!m||!m.version||m.version<u){class t extends d{create(t){return function(t){return a("card",t)}(t)}getCardSize(){return this.firstElementChild&&this.firstElementChild.getCardSize?this.firstElementChild.getCardSize():1}}m?h(m,t):customElements.define("card-maker",t)}const f=customElements.get("element-maker");if(!f||!f.version||f.version<u){class t extends d{create(t){return function(t){return a("element",t)}(t)}}f?h(f,t):customElements.define("element-maker",t)}const p=customElements.get("entity-row-maker");if(!p||!p.version||p.version<u){class t extends d{create(t){return function(t){const e=new Set(["call-service","divider","section","weblink"]);if(!t)return c("Invalid configuration given.",t);if("string"==typeof t&&(t={entity:t}),"object"!=typeof t||!t.entity&&!t.type)return c("Invalid configuration given.",t);const n=t.type||"default";if(e.has(n)||n.startsWith(i))return a("row",t);const o=t.entity.split(".",1)[0];return Object.assign(t,{type:{alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"}[o]||"text"}),a("entity-row",t)}(t)}}p?h(p,t):customElements.define("entity-row-maker",t)}function g(t,e,n){t.forEach(t=>{if(!t)return;const o=e[function(){let t=0;for(let o=0;o<e.length;o++){if(e[o].length<n.min_height)return o;e[o].length<e[t].length&&(t=o)}return t}()];o.appendChild(t),o.length+=t.getCardSize?t.getCardSize():1})}customElements.define("layout-card",class extends o{static get properties(){return{hass:{},_config:{}}}async setConfig(t){this._config={min_height:5,column_width:300,max_width:t.column_width||"500px",min_columns:t.column_num||1,max_columns:100,...t},this.cards=[],this.columns=[]}async firstUpdated(){window.addEventListener("resize",()=>this.place_cards()),window.addEventListener("hass-open-menu",()=>setTimeout(()=>this.place_cards(),100)),window.addEventListener("hass-close-menu",()=>setTimeout(()=>this.place_cards(),100)),window.addEventListener("location-changed",()=>{""===location.hash&&setTimeout(()=>this.place_cards(),100)})}async updated(t){!this.cards.length&&(this._config.entities&&this._config.entities.length||this._config.cards&&this._config.cards.length)&&(this.cards=await this.build_cards(),this.place_cards()),t.has("hass")&&this.hass&&this.cards&&this.cards.forEach(t=>{t&&(t.hass=this.hass)})}async build_card(t){if("break"===t)return null;const e=document.createElement("card-maker");return e.config={...t,...this._config.card_options},e.hass=l(),this.shadowRoot.querySelector("#staging").appendChild(e),new Promise((t,n)=>e.updateComplete.then(()=>t(e)))}async build_cards(){const t=this.shadowRoot.querySelector("#staging");for(;t.lastChild;)t.removeChild(t.lastChild);return Promise.all((this._config.entities||this._config.cards).map(t=>this.build_card(t)))}place_cards(){const t=this.shadowRoot.querySelector("#columns").clientWidth;this.columns=function(t,e,n){const o=t=>"string"==typeof t&&t.endsWith("%")?Math.floor(e*parseInt(t)/100):parseInt(t);let r=0;if("object"==typeof n.column_width){let t=e;for(;t>0;){let e=n.column_width[r];void 0===e&&(e=n.column_width.slice(-1)[0]),t-=o(e),r+=1}r=Math.max(r-1,1)}else r=Math.floor(e/o(n.column_width));r=Math.max(r,n.min_columns),r=Math.min(r,n.max_columns);let s=[];for(let t=0;t<r;t++){const t=document.createElement("div");t.classList.add("column"),t.length=0,s.push(t)}switch(n.layout){case"horizontal":!function(t,e,n){let o=0;t.forEach(t=>{if(o+=1,!t)return;const n=e[(o-1)%e.length];n.appendChild(t),n.length+=t.getCardSize?t.getCardSize():1})}(t,s);break;case"vertical":!function(t,e,n){let o=0;t.forEach(t=>{if(!t)return void(o+=1);const n=e[o%e.length];n.appendChild(t),n.length+=t.getCardSize?t.getCardSize():1})}(t,s);break;case"auto":default:g(t,s,n)}return s=s.filter(t=>t.childElementCount>0)}(this.cards,t,this._config),this.format_columns(),this.requestUpdate()}format_columns(){const t=(t,e,n,o="px")=>{if(void 0===this._config[e])return"";let r=`${t}: `;const s=this._config[e];return"object"==typeof s?s.length>n?r+=`${s[n]}`:r+=`${s.slice(-1)}`:r+=`${s}`,r.endsWith("px")||r.endsWith("%")||(r+=o),r+";"};for(const[e,n]of this.columns.entries()){const o=[t("max-width","max_width",e),t("min-width","min_width",e),t("width","column_width",e),t("flex-grow","flex_grow",e,"")];n.style.cssText="".concat(...o)}}getCardSize(){if(this.columns)return Math.max.apply(Math,this.columns.map(t=>t.length))}_isPanel(){if(this.isPanel)return!0;let t=this.parentElement,e=10;for(;e--;){if("hui-panel-view"===t.localName)return!0;if("div"===t.localName)return!1;t=t.parentElement}return!1}render(){return r`
      <div id="columns"
      class="
      ${this._config.rtl?"rtl":" "}
      ${this._isPanel()?"panel":" "}
      "
      style="
      ${this._config.justify_content?`justify-content: ${this._config.justify_content};`:""}
      ">
        ${this.columns.map(t=>r`
          ${t}
        `)}
      </div>
      <div id="staging"></div>
    `}static get styles(){return s`
      :host {
        padding: 0 4px;
        display: block;
        margin-bottom: 0!important;
      }

      #columns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: -8px;
      }
      #columns.rtl {
        flex-direction: row-reverse;
      }
      #columns.panel {
        margin-top: 0;
      }

      .column {
        flex-basis: 0;
        flex-grow: 1;
        overflow-x: hidden;
      }

      card-maker>* {
        display: block;
        margin: 4px 4px 8px;
      }
      card-maker:first-child>* {
        margin-top: 8px;
      }
      card-maker:last-child>* {
        margin-bottom: 4px;
      }

      #staging {
        visibility: hidden;
        height: 0;
      }
    `}get _cardModder(){return{target:this}}})}]);