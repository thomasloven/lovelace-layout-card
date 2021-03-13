import { css, html, LitElement, property } from "lit-element";
import {
  CardConfigGroup,
  LovelaceCard,
  MasonryViewConfig,
  ViewConfig,
} from "../types";
import { ResizeObserver } from "resize-observer/lib/ResizeObserver";
import { BaseLayout } from "./base";

interface LengthCol extends Node {
  length?: number;
}

class MasonryLayout extends BaseLayout {
  async _placeColumnCards(cols: Array<LengthCol>, cards: CardConfigGroup[]) {
    const min_height = this._config.layout?.min_height || 5;

    function shortestCol() {
      let i = 0;
      for (let j = 0; j < cols.length; j++) {
        if (cols[j].length && cols[j].length < min_height) return cols[j];
        if (cols[j].length < cols[i].length) i = j;
      }
      return cols[i];
    }

    for (const c of cards) {
      const col = shortestCol();
      col.appendChild(this._makeEditable(c));

      col.length += c.card.getCardSize ? await c.card.getCardSize() : 1;
    }
  }
}

customElements.define("masonry-layout", MasonryLayout);
