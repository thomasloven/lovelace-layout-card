export interface LovelaceCard extends HTMLElement {
  hass: any;
  setConfig(config: any): void;
  getCardSize?(): Promise<number> | number;
}

export interface ViewConfig {
  title?: string;
  type?: string;
  cards?: Array<LayoutCardConfig>;
}

export interface LayoutCardConfig {
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
  config: LayoutCardConfig;
}

export interface MasonryViewConfig extends ViewConfig {
  layout?: {
    width?: number;
    max_width?: number;
    max_cols?: number;
    min_height?: number;
  };
  cards?: Array<LayoutCardConfig>;
}
