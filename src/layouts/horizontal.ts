import { CardConfigGroup } from "../types";
import { BaseColumnLayout } from "./base-column-layout";

class HorizontalLayout extends BaseColumnLayout {
  async _placeColumnCards(cols: Array<Node>, cards: CardConfigGroup[]) {
    let i = 0;
    for (const c of cards) {
      i += 1;
      if (c.config.view_layout?.column) i = c.config.view_layout.column;
      const col = cols[(i - 1) % cols.length];
      col.appendChild(this.getCardElement(c));
      if (this.isBreak(c.config)) {
        i = 0;
        if (!this.lovelace?.editMode) {
          col.removeChild(c.card);
        }
      }
    }
  }
}

customElements.define("horizontal-layout", HorizontalLayout);
