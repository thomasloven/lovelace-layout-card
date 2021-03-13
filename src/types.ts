export interface LovelaceCard extends HTMLElement {
  hass: any;
  editMode?: boolean;
  setConfig(config: any): void;
  getCardSize?(): Promise<number> | number;
}

export interface ViewConfig {
  title?: string;
  type?: string;
  cards?: Array<CardConfig>;
}

export interface CardConfig {
  type: string;
  layout?: {
    show?:
      | "always"
      | "never"
      | {
          mediaquery: string;
        };
    column?: number;
  };
}

export interface CardConfigGroup {
  card: LovelaceCard;
  config: CardConfig;
  index: number;
  show?: boolean;
}

export interface MasonryViewConfig extends ViewConfig {
  layout?: {
    width?: number;
    max_width?: number;
    max_cols?: number;
    min_height?: number;
  };
  cards?: Array<CardConfig>;
}

export interface LayoutCardConfig {
  cards?: Array<CardConfig>;
  layout?: {
    type?: string
    layout?: any;
}
