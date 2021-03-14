layout-card
===========

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

Get more control over the placement of lovelace cards

For installation instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

## Quick Start

- Go to one of your lovelace views and select "Edit Dashboard"
- Click the pencil symbol next to the view name to open up the view properties
- Go to the new "Layout" tab
- Select "Masonry" layout from the "Layout type" dropdown list
- Click "Save"

Hopefully, you should see no difference at all now.

- Open up the view properties again and go to the "Layout" tab.
- Enter the following in the "Layout Options" box:
  ```yaml
  width: 300
  max_cols: 10
  ```
- Click Save

You should now have more, narrower, collumns of cards in your view.

![Quick Start](https://user-images.githubusercontent.com/1299821/111066590-11abef80-84c0-11eb-809b-2843fd8610d8.gif)


## Usage

### View Layouts

Layout-card adds four new view layout to lovelace.
- Masonry (`custom:masonry-layout`)
- Horizontal (`custom:horizontal-layout`)
- Vertical (`custom:vertical-layout`)
- Grid (`custom:grid-layout`)

The difference between the types of layout is described below.

Those can be selected either via the GUI as in the Quick Start above, or in the lovelace configuration by setting `type` (and optionally `layout`):

```yaml
views:
  - title: Home
    type: custom:masonry-layout
    layout:
      width: 300
      max_cols: 10
    cards:
      ...
```

### Layout-card

Any layout can also be used inside a lovelace-card by using `layout-card`:

```yaml
type: custom:layout-card
layout_type: masonry
layout_options:
  width: 300
  max_cols: 10
cards:
  ...
```

`Layout-card` will take its `cards` and place them within itself according to the specified layout.

> NOTE: Please be aware that `layout-card` is itself a CARD, and cannot be wider than any other cards in the same view. \
> All cards you specify within it must fit inside this same width. \
> Thus `layout-card` is of limited use expect in [panel mode](https://www.home-assistant.io/lovelace/dashboards-and-views/#panel).

### Card layout options
Some layout types accept options added to separate cards:

```yaml
type: entities
entities:
  - light.bed_light
layout:
  column: 2
```

### Layout-break card
Layout card adds a special card called `layout-break` which can be used to change how some layouts work.

```yaml
type: custom:layout-break
```

## Layouts
Layout-card introduces four layouts.
- Masonry
- Horizontal
- Vertical
- Grid

The first three are column based and work similarly:

- A number of evenly sized columns is prepared based on avaialble space, the `width` option and the `max_cols` option.
- The cards are placed into the columns one at a time in a method depending on the current layout.
- Any empty columns are removed.
- The remaining columns are placed centered on screen.

All column based layouts accept the following options:

|Option|Values|Description|Default|
|---|---|---|---|
|`width`| number | Size in pixels of each column | 300 |
|`max_width` | number | Maximum width of a card | 1.5 * `width` if specified <br> otherwise 500 |
|`max_cols` | number | Maximum number of columns to show | 4 if sidebar is hidden <br> 3 if sidebar is shown |
|`rtl`| `true`/`false` | Place columns in right-to-left order | `false`|

### Masonry layout

The masonry layout immitates the default layout of lovelace.
- Each card is assigned a height based on their contents. One height unit corresponds to roughly 50 pixels, but this may varry.
- When a card is placed in the layout, it is put in the first column which has a total height of less than `min_height` units. \
Otherwise it is put it the shortest column.

![Masonry Layout](https://user-images.githubusercontent.com/1299821/111067510-f2639100-84c4-11eb-9ce1-b40cf1f13772.png)

The masonry layout accepts the following options:
|Option|Values|Description|Default
|---|---|---|---|
|`min_height`| number | Minimum number of card height units in a column before the next one is considered | 5 |

### Horizontal layout

The horizontal layout will add each card to the next column, looping back to the first one when necessary:

![Horizontal Layout](https://user-images.githubusercontent.com/1299821/111067632-7453ba00-84c5-11eb-942c-88dab6d1f19b.png)

A `layout-break` card will cause the next card to be places in the first column.

The horizontal layout accepts the following **card** layout options:
|Option|Values|Description|Default
|---|---|---|---|
|`column`| number | Which column to place the card in. Following cards will be placed in the next column. |  |


### Vertical layout

The vertical layout will add each card to the same column as the previous one.

![Vertical Layout](https://user-images.githubusercontent.com/1299821/111067990-17f19a00-84c7-11eb-905a-2c687e85e972.png)

A `layout-break` card will cause the next card to be placed in the next column.

The vertical layout accepts the following **card** layout options:
|Option|Values|Description|Default
|---|---|---|---|
|`column`| number | Which column to place the card in. Following cards will be placed in the same column. |  |

### Grid layout
The grid layout will give you full controll of your cards by leveraging [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/).

The grid layout accepts any option starting with `grid-` that works for a Grid Container.
The grid layout also accepts any card layout option starting with `grid-` that works for a Grid Item.

![Grid Layout](https://user-images.githubusercontent.com/1299821/111069100-cac3f700-84cb-11eb-904f-cb5661c5734b.png)
<details>
<summary>Screenshot source code</summary>

```yaml
title: Grid layout
type: custom:grid-layout
layout:
  grid-template-columns: 25% 25% 25% 25%
  grid-template-rows: auto
  grid-template-areas: |
    "header header header header"
    "main main . sidebar"
    "footer footer footer footer"
cards:
  - type: entities
    entities:
      - entity: light.bed_light
    title: '1'
    show_header_toggle: false
    layout:
      grid-area: header
  - type: entities
    entities:
      - entity: light.bed_light
    title: '2'
    show_header_toggle: false
    layout:
      grid-area: footer
  - type: entities
    entities:
      - entity: light.bed_light
    title: '3'
    show_header_toggle: false
    layout:
      grid-area: sidebar
  - type: entities
    entities:
      - light.bed_light
      - light.ceiling_lights
      - light.kitchen_lights
    title: '4'
    show_header_toggle: false
    layout:
      grid-area: main
```

</details>


## Card visibility
Individual cards can be displayed or hidden based on their `show:` layout option.

```yaml
- type: entities
  title: Always show
  ...
  layout:
    show: always
- type: entities
  title: Never show
  ...
  layout:
    show: never
```

The options `show: always` and `show: never` are honestly quite pointless... but there's a cooler option:

```yaml
type: entities
title: Never show
...
layout:
  show:
    mediaquery: <mediaquery>
```

This card will only be displayed if the [@media rule](https://www.w3schools.com/cssref/css3_pr_mediaquery.asp) `<mediaquery>` is a match.

Example:
```yaml
- type: markdown
  content: |
    This is only shown on screens more than 800 px wide
  layout:
    show:
      mediaquery: "(min-width: 800px)"
- type: markdown
  content: |
    This is only shown on screens less than 400 px wide
  layout:
    show:
      mediaquery: "(max-width: 400px)"
- type: markdown
  content: |
    This is only shown on touch screen devices
  layout:
    show:
      mediaquery: "(pointer: coarse)"
```

## Use with entity filters
Layout card can be used with cards that populate an `entities:` list, like [Entity Filter](https://www.home-assistant.io/lovelace/entity-filter/) or [auto-entities](https://github.com/thomasloven/lovelace-auto-entities).

If no card type is explicitly specified for the entries, the [Entity](https://www.home-assistant.io/lovelace/entity/) card will be used.

Example:

```yaml
- type: 'custom:auto-entities'
        filter:
          include:
            - domain: light
              options:
                type: light
            - domain: sensor
          exclude: []
        card:
          type: 'custom:layout-card'
          cards: []
          layout_type: masonry
```

![auto-entities](https://user-images.githubusercontent.com/1299821/111070882-019e0b00-84d4-11eb-8a00-86683d598c3e.png)

---
<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
