import { css, html, LitElement, property } from "lit-element";
import {
  CardConfigGroup,
  LovelaceCard,
  MasonryViewConfig,
  ViewConfig,
} from "../types";
import { ResizeObserver } from "resize-observer/lib/ResizeObserver";
import { BaseColumnLayout } from "./base-column-layout";

class VerticalLayout extends BaseColumnLayout {
  async _placeColumnCards(cols: Array<Node>, cards: CardConfigGroup[]) {
    let i = 1;
    for (const c of cards) {
      if (c.config.layout?.column) i = c.config.layout.column;
      const col = cols[(i - 1) % cols.length];
      col.appendChild(this.getCardElement(c));
      if (this.isBreak(c.card)) {
        i = i + 1;
      }
    }
  }
}

customElements.define("vertical-layout", VerticalLayout);
