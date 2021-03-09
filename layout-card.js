const t=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),e=t.prototype.html,i=t.prototype.css;function n(){return document.querySelector("hc-main")?document.querySelector("hc-main").hass:document.querySelector("home-assistant")?document.querySelector("home-assistant").hass:void 0}function o(t,e,i=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},i)i.dispatchEvent(t);else{var n=function(){var t=document.querySelector("hc-main");return t?(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("hc-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-view")||t.querySelector("hui-panel-view"):(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=document.querySelector("home-assistant"))&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root"))&&t.shadowRoot)&&t.querySelector("ha-app-layout"))&&t.querySelector("#view"))&&t.firstElementChild}();n&&n.dispatchEvent(t)}}let s=window.cardHelpers;const a=new Promise((async(t,e)=>{s&&t();const i=async()=>{s=await window.loadCardHelpers(),window.cardHelpers=s,t()};window.loadCardHelpers?i():window.addEventListener("load",(async()=>{!async function(){if(customElements.get("hui-view"))return!0;await customElements.whenDefined("partial-panel-resolver");const t=document.createElement("partial-panel-resolver");if(t.hass={panels:[{url_path:"tmp",component_name:"lovelace"}]},t._updateRoutes(),await t.routerOptions.routes.tmp.load(),!customElements.get("ha-panel-lovelace"))return!1;const e=document.createElement("ha-panel-lovelace");e.hass=n(),void 0===e.hass&&(await new Promise((t=>{window.addEventListener("connection-status",(e=>{console.log(e),t()}),{once:!0})})),e.hass=n()),e.panel={config:{mode:null}},e._fetchConfig()}(),window.loadCardHelpers&&i()}))}));function r(t,e){const i={type:"error",error:t,origConfig:e},n=document.createElement("hui-error-card");return customElements.whenDefined("hui-error-card").then((()=>{const t=document.createElement("hui-error-card");t.setConfig(i),n.parentElement&&n.parentElement.replaceChild(t,n)})),a.then((()=>{o("ll-rebuild",{},n)})),n}function c(t,e){if(!e||"object"!=typeof e||!e.type)return r(`No ${t} type configured`,e);let i=e.type;if(i=i.startsWith("custom:")?i.substr("custom:".length):`hui-${i}-${t}`,customElements.get(i))return function(t,e){let i=document.createElement(t);try{i.setConfig(JSON.parse(JSON.stringify(e)))}catch(t){i=r(t,e)}return a.then((()=>{o("ll-rebuild",{},i)})),i}(i,e);const n=r(`Custom element doesn't exist: ${i}.`,e);n.style.display="None";const s=setTimeout((()=>{n.style.display=""}),2e3);return customElements.whenDefined(i).then((()=>{clearTimeout(s),o("ll-rebuild",{},n)})),n}const l=t=>"function"==typeof t.getCardSize?t.getCardSize():customElements.get(t.localName)?1:customElements.whenDefined(t.localName).then((()=>l(t))),d=async(t,e,i)=>{const o=t=>"string"==typeof t&&t.endsWith("%")?Math.floor(e*parseInt(t)/100):parseInt(t);let s=0;if("object"==typeof i.column_width){let t=e;for(;t>0;){let e=i.column_width[s];void 0===e&&(e=i.column_width.slice(-1)[0]),t-=o(e),s+=1}s=Math.max(s-1,1)}else s=Math.floor(e/o(i.column_width));s=Math.max(s,i.min_columns),s=Math.min(s,i.max_columns),"auto"===i.layout&&"docked"===n().dockedSidebar&&!window.matchMedia("(max-width: 870px)").matches&&i.sidebar_column&&(s-=1),s=Math.max(s,1);let a=[];for(let t=0;t<s;t++){const t=document.createElement("div");t.classList.add("column"),t.classList.add("cards"),t.length=0,a.push(t)}switch(i.layout){case"horizontal":await(async(t,e,i)=>{let n=0;for(const i of t){if(n+=1,!i)continue;const t=e[(n-1)%e.length];t.appendChild(i),t.length+=await l(i)}})(t,a);break;case"vertical":await(async(t,e,i)=>{let n=0;for(const i of t){if(!i){n+=1;continue}const t=e[n%e.length];t.appendChild(i),t.length+=await l(i)}})(t,a);break;case"auto":default:await(async(t,e,i)=>{function n(){let t=0;for(let n=0;n<e.length;n++){if(e[n].length<i.min_height)return n;e[n].length<e[t].length&&(t=n)}return t}for(const i of t){if(!i)continue;const t=e[n()];t.appendChild(i),t.length+=await l(i)}})(t,a,i)}return a=a.filter((t=>t.childElementCount>0)),a};var h=function(t){if("getBBox"in t){var e=t.getBBox();return Object.freeze({height:e.height,left:0,top:0,width:e.width})}var i=window.getComputedStyle(t);return Object.freeze({height:parseFloat(i.height||"0"),left:parseFloat(i.paddingLeft||"0"),top:parseFloat(i.paddingTop||"0"),width:parseFloat(i.width||"0")})},u=Object.defineProperty({ContentRect:h},"__esModule",{value:!0}),g=function(){function t(t){this.target=t,this.$$broadcastWidth=this.$$broadcastHeight=0}return Object.defineProperty(t.prototype,"broadcastWidth",{get:function(){return this.$$broadcastWidth},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"broadcastHeight",{get:function(){return this.$$broadcastHeight},enumerable:!0,configurable:!0}),t.prototype.isActive=function(){var t=u.ContentRect(this.target);return!!t&&(t.width!==this.broadcastWidth||t.height!==this.broadcastHeight)},t}(),m=Object.defineProperty({ResizeObservation:g},"__esModule",{value:!0}),p=function(t){this.target=t,this.contentRect=u.ContentRect(t)},f=Object.defineProperty({ResizeObserverEntry:p},"__esModule",{value:!0}),w=[],y=function(){function t(t){this.$$observationTargets=[],this.$$activeTargets=[],this.$$skippedTargets=[];var e=function(t){if(void 0===t)return"Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.";if("function"!=typeof t)return"Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function."}(t);if(e)throw TypeError(e);this.$$callback=t,w.push(this)}return t.prototype.observe=function(t){var e=v("observe",t);if(e)throw TypeError(e);b(this.$$observationTargets,t)>0||(this.$$observationTargets.push(new m.ResizeObservation(t)),R())},t.prototype.unobserve=function(t){var e=v("unobserve",t);if(e)throw TypeError(e);var i=b(this.$$observationTargets,t);i<0||(this.$$observationTargets.splice(i,1),T())},t.prototype.disconnect=function(){this.$$observationTargets=[],this.$$activeTargets=[]},t}();function v(t,e){return void 0===e?"Failed to execute '"+t+"' on 'ResizeObserver': 1 argument required, but only 0 present.":e instanceof window.Element?void 0:"Failed to execute '"+t+"' on 'ResizeObserver': parameter 1 is not of type 'Element'."}function b(t,e){for(var i=0;i<t.length;i+=1)if(t[i].target===e)return i;return-1}var _,$=function(t){w.forEach((function(e){e.$$activeTargets=[],e.$$skippedTargets=[],e.$$observationTargets.forEach((function(i){i.isActive()&&(x(i.target)>t?e.$$activeTargets.push(i):e.$$skippedTargets.push(i))}))}))},E=function(){var t=1/0;return w.forEach((function(e){if(e.$$activeTargets.length){var i=[];e.$$activeTargets.forEach((function(e){var n=new f.ResizeObserverEntry(e.target);i.push(n),e.$$broadcastWidth=n.contentRect.width,e.$$broadcastHeight=n.contentRect.height;var o=x(e.target);o<t&&(t=o)})),e.$$callback(i,e),e.$$activeTargets=[]}})),t},x=function(t){for(var e=0;t.parentNode;)t=t.parentNode,e+=1;return e},C=function(){var t,e=0;for($(e);w.some((function(t){return!!t.$$activeTargets.length}));)e=E(),$(e);w.some((function(t){return!!t.$$skippedTargets.length}))&&(t=new window.ErrorEvent("ResizeLoopError",{message:"ResizeObserver loop completed with undelivered notifications."}),window.dispatchEvent(t))},R=function(){_||S()},S=function(){_=window.requestAnimationFrame((function(){C(),S()}))},T=function(){_&&!w.some((function(t){return!!t.$$observationTargets.length}))&&(window.cancelAnimationFrame(_),_=void 0)},z="1.4.0b0";class O extends t{static get properties(){return{hass:{},_config:{}}}async setConfig(t){this._config={layout:"auto",min_height:5,column_width:300,max_width:t.column_width||"500px",min_columns:t.column_num||1,max_columns:t.column_num||100,sidebar_column:!1,...t},this.cards=[],this.columns=[],this._layoutWidth=0}connectedCallback(){super.connectedCallback();let t=this.parentElement,e=10;for(;e--&&t;){if("HUI-PANEL-VIEW"===t.tagName)this.classList.add("panel");else if("HUI-VERTICAL-STACK-CARD"===t.tagName)this.classList.add("stacked");else if("DIV"!==t.tagName&&"root"!==t.id)break;t=t.parentElement?t.parentElement:t.getRootNode().host}}async firstUpdated(){window.addEventListener("location-changed",(()=>{""===location.hash&&setTimeout((()=>this.updateSize()),100)})),this.resizer||(this.resizer=new y((()=>{this.updateSize()})),this.resizer.observe(this)),this.updateSize()}async updateSize(){let t=this.getBoundingClientRect().width;this.classList.contains("panel")&&!window.matchMedia("(max-width: 870px)").matches&&this._config.sidebar_column&&(this.hass&&"docked"===this.hass.dockedSidebar?t+=256:t+=64),t&&Math.abs(t-this._layoutWidth)>50&&(this._layoutWidth=t,this.resizer.disconnect(),await this.place_cards(),this.requestUpdate().then((()=>this.resizer.observe(this))))}async updated(t){if(!this.cards.length&&(this._config.entities&&this._config.entities.length||this._config.cards&&this._config.cards.length)&&(this.clientWidth,this.cards=await this.build_cards(),await this.place_cards(),this.requestUpdate()),t.has("hass")&&this.hass&&this.cards)for(const t of this.cards)t&&(t.hass=this.hass)}async build_card(t){if("break"===t){if("grid"===this._config.layout){const t=document.createElement("div");return this.shadowRoot.querySelector("#staging").appendChild(t),t}return null}const e={...t,...this._config.card_options},i=function(t){return s?s.createCardElement(t):c("card",t)}(e);return i.hass=n(),"grid"===this._config.layout&&(i.style.gridColumn=e.gridcol||"auto",i.style.gridRow=e.gridrow||"auto"),this.shadowRoot.querySelector("#staging").appendChild(i),new Promise(((t,e)=>i.updateComplete?i.updateComplete.then((()=>t(i))):t(i)))}async build_cards(){const t=this.shadowRoot.querySelector("#staging");for(;t.lastChild;)t.removeChild(t.lastChild);return Promise.all((this._config.entities||this._config.cards).map((t=>this.build_card(t))))}async place_cards(){"grid"!==this._config.layout&&this.cards.length&&(this.columns=await d(this.cards,this._layoutWidth||1,this._config),this._config.rtl&&this.columns.reverse(),this.format_columns())}format_columns(){const t=(t,e,i,n="px")=>{if(void 0===this._config[e])return"";let o=`${t}: `;const s=this._config[e];return"object"==typeof s?s.length>i?o+=`${s[i]}`:o+=`${s.slice(-1)}`:o+=`${s}`,o.endsWith("px")||o.endsWith("%")||(o+=n),o+";"};for(const[e,i]of this.columns.entries()){const n=[t("max-width","max_width",e),t("min-width","min_width",e),t("width","column_width",e),t("flex-grow","flex_grow",e,"")];i.style.cssText="".concat(...n)}}getCardSize(){return this.columns&&this.columns.length?Math.max.apply(Math,this.columns.map((t=>t.length))):this._config.entities?2*this._config.entities.length:this._config.cards?2*this._config.cards.length:1}render(){return"grid"===this._config.layout?e`
        <div
          id="staging"
          class="grid"
          style="
        display: grid;
        grid-template-rows: ${this._config.gridrows||"auto"};
        grid-template-columns: ${this._config.gridcols||"auto"};
        grid-gap: ${this._config.gridgap||"auto"};
        place-items: ${this._config.gridplace||"auto"};
        "
        ></div>
      `:e`
      <div
        id="columns"
        style="
      ${this._config.justify_content?`justify-content: ${this._config.justify_content};`:""}
      "
      >
        ${this.columns.map((t=>e` ${t} `))}
      </div>
      <div id="staging"></div>
    `}static get styles(){return i`
      :host {
        padding: 0;
        display: block;
        margin-bottom: 0 !important;
      }
      :host(.panel) {
        padding: 0 4px;
        margin-top: 8px;
      }
      :host(.panel.stacked:first-child) {
        margin-top: 8px !important;
      }
      @media (max-width: 500px) {
        :host(.panel) {
          padding-left: 0px;
          padding-right: 0px;
        }
      }

      #columns {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: -8px;
      }

      .column {
        flex-basis: 0;
        flex-grow: 1;
        overflow-x: hidden;
      }
      .column:first-child {
        margin-left: -4px;
      }
      .column:last-child {
        margin-right: -4px;
      }
      :host(.panel) .column {
        margin: 0;
      }

      .cards > *,
      .grid > * {
        display: block;
        margin: 4px 4px 8px;
      }
      .cards > *:first-child {
        margin-top: 8px;
      }
      .cards > *:last-child {
        margin-bottom: 4px;
      }
      @media (max-width: 500px) {
        .cards:first-child > *,
        .grid > * {
          margin-left: 0px;
        }
        .cards:last-child > *,
        .grid > * {
          margin-right: 0px;
        }
      }

      #staging:not(.grid) {
        visibility: hidden;
        height: 0;
      }
      #staging.grid {
        margin: 0 -4px;
      }
    `}get _cardModder(){return{target:this}}}customElements.get("layout-card")||(customElements.define("layout-card",O),console.info(`%cLAYOUT-CARD ${z} IS INSTALLED`,"color: green; font-weight: bold",""));
