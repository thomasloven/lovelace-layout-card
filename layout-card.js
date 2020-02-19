!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t){t.exports=JSON.parse('{"name":"layout-card","version":"1.1.0","description":"","private":true,"scripts":{"build":"webpack","watch":"webpack --watch --mode=development","update-card-tools":"npm uninstall card-tools && npm install thomasloven/lovelace-card-tools"},"author":"Thomas Lovén","license":"MIT","devDependencies":{"webpack":"^4.41.5","webpack-cli":"^3.3.10"},"dependencies":{"card-tools":"github:thomasloven/lovelace-card-tools"}}')},function(t,e,n){"use strict";n.r(e);const i=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),o=i.prototype.html,s=i.prototype.css;function r(){return document.querySelector("hc-main")?document.querySelector("hc-main").hass:document.querySelector("home-assistant")?document.querySelector("home-assistant").hass:void 0}function a(t,e,n=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},n)n.dispatchEvent(t);else{var i=function(){var t=document.querySelector("hc-main");return t=t?(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("hc-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-view"):(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=document.querySelector("home-assistant"))&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root"))&&t.shadowRoot)&&t.querySelector("ha-app-layout #view"))&&t.firstElementChild}();i&&i.dispatchEvent(t)}}let c=window.cardHelpers;const l=new Promise(async(t,e)=>{c&&t(),window.loadCardHelpers&&(c=await window.loadCardHelpers(),window.cardHelpers=c,t())});function d(t,e){const n=document.createElement("hui-error-card");return n.setConfig({type:"error",error:t,origConfig:e}),n}function u(t,e){if(!e||"object"!=typeof e||!e.type)return d(`No ${t} type configured`,e);let n=e.type;if(n=n.startsWith("custom:")?n.substr("custom:".length):`hui-${n}-${t}`,customElements.get(n))return function(t,e){let n=document.createElement(t);try{n.setConfig(JSON.parse(JSON.stringify(e)))}catch(t){n=d(t,e)}return l.then(()=>{a("ll-rebuild",{},n)}),n}(n,e);const i=d(`Custom element doesn't exist: ${n}.`,e);i.style.display="None";const o=setTimeout(()=>{i.style.display=""},2e3);return customElements.whenDefined(n).then(()=>{clearTimeout(o),a("ll-rebuild",{},i)}),i}function h(t,e,n){t.forEach(t=>{if(!t)return;const i=e[function(){let t=0;for(let i=0;i<e.length;i++){if(e[i].length<n.min_height)return i;e[i].length<e[t].length&&(t=i)}return t}()];i.appendChild(t),i.length+=t.getCardSize?t.getCardSize():1})}class m extends i{static get properties(){return{hass:{},_config:{}}}async setConfig(t){this._config={min_height:5,column_width:300,max_width:t.column_width||"500px",min_columns:t.column_num||1,max_columns:100,...t},this.cards=[],this.columns=[]}connectedCallback(){super.connectedCallback(),this.place_cards(this.clientWidth)}async firstUpdated(){window.addEventListener("resize",()=>this.place_cards()),window.addEventListener("hass-open-menu",()=>setTimeout(()=>this.place_cards(),100)),window.addEventListener("hass-close-menu",()=>setTimeout(()=>this.place_cards(),100)),window.addEventListener("location-changed",()=>{""===location.hash&&setTimeout(()=>this.place_cards(),100)})}async updated(t){if(!this.cards.length&&(this._config.entities&&this._config.entities.length||this._config.cards&&this._config.cards.length)){const t=this.clientWidth;this.cards=await this.build_cards(),this.place_cards(t)}t.has("hass")&&this.hass&&this.cards&&this.cards.forEach(t=>{t&&(t.hass=this.hass)})}async build_card(t){if("break"===t)return null;const e={...t,...this._config.card_options},n=function(t){return c?c.createCardElement(t):u("card",t)}(e);return n.hass=r(),n.style.gridColumn=e.gridcol,n.style.gridRow=e.gridrow,this.shadowRoot.querySelector("#staging").appendChild(n),new Promise((t,e)=>n.updateComplete?n.updateComplete.then(()=>t(n)):t(n))}async build_cards(){const t=this.shadowRoot.querySelector("#staging");for(;t.lastChild;)t.removeChild(t.lastChild);return Promise.all((this._config.entities||this._config.cards).map(t=>this.build_card(t)))}place_cards(t){"grid"!==this._config.layout&&(void 0!==t&&(this.lastWidth=t),this.lastWidth=this.clientWidth||this.lastWidth,t=this.lastWidth,this.columns=function(t,e,n){const i=t=>"string"==typeof t&&t.endsWith("%")?Math.floor(e*parseInt(t)/100):parseInt(t);let o=0;if("object"==typeof n.column_width){let t=e;for(;t>0;){let e=n.column_width[o];void 0===e&&(e=n.column_width.slice(-1)[0]),t-=i(e),o+=1}o=Math.max(o-1,1)}else o=Math.floor(e/i(n.column_width));o=Math.max(o,n.min_columns),o=Math.min(o,n.max_columns),o=Math.max(o,1);let s=[];for(let t=0;t<o;t++){const t=document.createElement("div");t.classList.add("column"),t.classList.add("cards"),t.length=0,s.push(t)}switch(n.layout){case"horizontal":!function(t,e,n){let i=0;t.forEach(t=>{if(i+=1,!t)return;const n=e[(i-1)%e.length];n.appendChild(t),n.length+=t.getCardSize?t.getCardSize():1})}(t,s);break;case"vertical":!function(t,e,n){let i=0;t.forEach(t=>{if(!t)return void(i+=1);const n=e[i%e.length];n.appendChild(t),n.length+=t.getCardSize?t.getCardSize():1})}(t,s);break;case"auto":default:h(t,s,n)}return s=s.filter(t=>t.childElementCount>0),s}(this.cards,t||1,this._config),this._config.rtl&&this.columns.reverse(),this.format_columns(),this.requestUpdate())}format_columns(){const t=(t,e,n,i="px")=>{if(void 0===this._config[e])return"";let o=`${t}: `;const s=this._config[e];return"object"==typeof s?s.length>n?o+=`${s[n]}`:o+=`${s.slice(-1)}`:o+=`${s}`,o.endsWith("px")||o.endsWith("%")||(o+=i),o+";"};for(const[e,n]of this.columns.entries()){const i=[t("max-width","max_width",e),t("min-width","min_width",e),t("width","column_width",e),t("flex-grow","flex_grow",e,"")];n.style.cssText="".concat(...i)}}getCardSize(){if(this.columns)return Math.max.apply(Math,this.columns.map(t=>t.length))}_isPanel(){if(this.isPanel)return!0;let t=this.parentElement,e=10;for(;e--&&t;){if("hui-panel-view"===t.localName)return!0;if("div"===t.localName)return!1;t=t.parentElement}return!1}render(){return"grid"===this._config.layout?o`
        <div id="staging" class="grid cards"
        style="
        display: grid;
        grid-template-rows: ${this._config.gridrows};
        grid-template-columns: ${this._config.gridcols};
        "></div>
      `:o`
      <div id="columns"
      class="
      ${this._isPanel()?"panel":" "}
      "
      style="
      ${this._config.justify_content?`justify-content: ${this._config.justify_content};`:""}
      ">
        ${this.columns.map(t=>o`
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
      #columns.panel {
        margin-top: 0;
      }

      .column {
        flex-basis: 0;
        flex-grow: 1;
        overflow-x: hidden;
      }


      .cards>* {
        display: block;
        margin: 4px 4px 8px;
      }
      .cards>*:first-child {
        margin-top: 8px;
      }
      .cards>*:last-child {
        margin-bottom: 4px;
      }

      #staging:not(.grid) {
        visibility: hidden;
        height: 0;
      }
    `}get _cardModder(){return{target:this}}}if(!customElements.get("layout-card")){customElements.define("layout-card",m);const t=n(0);console.info(`%cLAYOUT-CARD ${t.version} IS INSTALLED`,"color: green; font-weight: bold","")}}]);