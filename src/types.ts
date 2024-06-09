export interface LovelaceCard extends HTMLElement {
  hass: any;
  editMode?: boolean;
  setConfig(config: any): void;
  getCardSize?(): Promise<number> | number;
}

export interface HuiCard extends HTMLElement {
  hass: any;
  editMode?: boolean;
  getCardSize?(): Promise<number> | number;
}

export interface CardConfig {
  type: string;
  view_layout?: {
    show?:
      | "always"
      | "never"
      | {
          mediaquery?: string;
          sidebar?: string;
        };
    column?: number;
  };
}

export interface CardConfigGroup {
  card: LovelaceCard | HuiCard;
  config: CardConfig;
  index: number;
  show?: boolean;
}

export interface ViewConfig {
  title?: string;
  type?: string;
  cards?: Array<CardConfig>;
  layout?: {
    margin?: string;
    padding?: string;
    height?: string;
  };
  view_layout?: {};
}

export interface ColumnViewConfig extends ViewConfig {
  layout?: {
    margin?: string;
    padding?: string;
    height?: string;
    reflow?: boolean;
    width?: number;
    column_widths: string;
    max_width?: number;
    max_cols?: number;
    min_height?: number;
    rtl?: boolean;
    card_margin?: string;
  };
}

export interface GridViewConfig extends ViewConfig {
  layout?: {
    margin?: string;
    padding?: string;
    height?: string;
    mediaquery?: Array<Record<string, any>>;
  };
}

export interface LayoutCardConfig {
  cards?: Array<CardConfig>;
  entities?: Array<CardConfig>;
  layout_type?: string;
  layout?: any;
  layout_options?: any; // legacy
}
