customElements.whenDefined('card-tools').then(() => {
class LayoutCard extends Polymer.Element {

  static get template() {
    return Polymer.html`
    <style>
    #columns {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
    .column {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 500px;
      overflow-x: hidden;
    }
    .column > *:first-child {
      margin-top: 0;
    }
    .column > * {
      display: block;
      margin: 4px 4px 8px;
    }
    </style>
    <div id="columns"></div>
    `;
  }

  setConfig(config) {
    cardTools.checkVersion(0.1);

    this.config = config;

    this.colnum = 0;
    this.config.min_height = this.config.minheight || 5;
    this.config.column_width = this.config.column_width || 300;
    this.config.layout = this.config.layout || 'auto';
    this.config.max_columns = this.config.max_columns || 100;

    window.addEventListener('resize', () => this._updateColumns());
    window.addEventListener('hass-open-menu', () => setTimeout(() => this._updateColumns(), 10));
    window.addEventListener('hass-close-menu', () => setTimeout(() => this._updateColumns(), 10));
    setTimeout(() => this._updateColumns(), 10);
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateColumns();
    this._build();
  }

  _updateColumns() {
    if (this.parentElement && this.parentElement.id === "view")
    {
      this.style.padding = "8px 4px 0";
      this.style.display = "block";
    } else {
      this.style.marginRight = "0";
      this.style.marginLeft = "0";
    }
    let numcols = 0;
    if (this.config.column_num) {
      numcols = this.config.column_num;
    } else {
      let colWidth = this.config.column_width || 300;
      numcols = Math.max(1,
        this.parentElement ? Math.floor(this.parentElement.clientWidth/this.config.column_width) : 0);
    }
    numcols = Math.min(numcols, this.config.max_columns);
    if(numcols != this.colnum) {
      this.colnum = numcols;
      this._build();
    }
  }

  _build() {
    if(!this.$) return;
    const root = this.$.columns;
    while(root.lastChild) root.removeChild(root.lastChild);

    this._cards = this.config.cards.map((c) => {
      if (typeof c === 'string') return c;
      let el = cardTools.createCard(c);
      if (this._hass) el.hass = this._hass;
      return el;
    });

    let cols = [];
    let colLen = [];
    for(let i = 0; i < this.colnum; i++) {
      cols.push([]);
      colLen.push(0);
    }

    let shortest = () => {
      let i = 0;
      for(let j = 0; j < colLen.length; j++) {
        if(colLen[j] < this.config.min_height) {
          i = j;
          break;
        }
        if(colLen[j] < colLen[i])
          i = j;
      }
      return i;
    }

    let i = 0;
    this._cards.forEach((c) => {
      let sz;
      if(typeof c !== 'string') {
        this.appendChild(c);
        sz = typeof c.getCardSize === 'function' ? c.getCardSize() : 1;
      }
      switch (this.config.layout) {
        case 'auto':
          if(typeof c === 'string') break;
          cols[shortest()].push(c);
          colLen[shortest()] += sz;
          break;
        case 'vertical':
          if(typeof c === 'string') {
            i += 1;
          } else {
            if (i >= this.colnum) i = 0;
            cols[i].push(c);
            colLen[i] += sz;
          }
          break;
        case 'horizontal':
          if(c instanceof String) {
            i += 1;
          } else {
            if (i >= this.colnum) i = 0;
            cols[i].push(c);
            colLen[i] += sz;
            i += 1;
          }
          break;
      }
    });

    cols = cols.filter(c => c.length > 0);
    let maxlen = 0;
    cols.forEach( c => {
      const cEl = document.createElement('div');
      cEl.classList.add('column');
      c.filter(e => typeof e !== 'string').forEach(e => cEl.appendChild(e));
      root.appendChild(cEl);
      if(c.length > maxlen) maxlen = c.length;
    });

    this.maxlen = maxlen;
  }

  set hass(hass) {
    this._hass = hass;
    if(this._cards)
    this._cards.filter(c => typeof c !== 'string').forEach(c => c.hass = hass);
  }

  getCardSize() {
    return this.maxlen;
  }

}

customElements.define('layout-card', LayoutCard);
});

window.setTimeout(() => {
  if(customElements.get('card-tools')) return;
  customElements.define('layout-card', class extends HTMLElement{
    setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
  });
}, 2000);
