import { css, html, LitElement, property } from "lit-element";
import {
  CardConfigGroup,
  LovelaceCard,
  MasonryViewConfig,
  ViewConfig,
} from "../types";
import { ResizeObserver } from "resize-observer/lib/ResizeObserver";
import { BaseLayout } from "./base";

class VerticalLayout extends BaseLayout {
  async _placeColumnCards(cols: Array<Node>, cards: CardConfigGroup[]) {
    let i = 1;
    for (const c of cards) {
      if (this.isBreak(c.card)) {
        i = i + 1;
        continue;
      }
      if (c.config.layout?.column) i = c.config.layout.column;
      const col = cols[(i - 1) % cols.length];
      col.appendChild(c.card);
    }
  }
}

customElements.define("vertical-layout", VerticalLayout);
