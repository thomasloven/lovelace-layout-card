layout-card
===========

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

Get more control over the placement of lovelace cards

For installation instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

Install `layout-card.js` as a `module`.

```yaml
resources:
  - url: /local/layout-card.js
    type: module
```

## Usage

```yaml
type: custom:layout-card
layout: <layout>
min_height: <min_height>
min_columns: <min_columns>
max_columns: <max_columns>
column_num: <column_num>
column_width: <column_width>
max_width: <max_width>
min_width: <min_width>
sidebar_column: <sidebar_column>
flex_grow: <flex_grow>
gridcols: <grid_cols>
gridrows: <grid_rows>
gridgap: <grid_gap>
gridplace: <grid_place>
justify_content: <justify_content>
rtl: <rtl>
cards:
    <cards>
card_options:
    <card_options>
```

## Options
- `<cards>` **Required** A list of lovelace cards to display.
- `<card_options>` are options that are applied to all cards.
- `<layout>` The layout method to use. `auto`, `vertical`, `horizontal` or `grid`. See below. Default: `auto`.
- `<min_height>` The minimum length of a column in `auto` layout. Default: `5`.
- `<min_columns>` The minimum number of columns to use. Default: `1`.
- `<max_columns>` The maximum number of columns to use. Default: `100`.
- `<column_num>` Shorthand to set both `min_columns>` and `<max_columns>`to the same value. Try this first.
- `<column_width>` Width of columns. Default: `300px`.
- `<max_width>`, `<min_width>`, `<flex_grow>` Set the `max-width`, `min-width` and `flex-grow` CSS properties of the columns manually. Default: `column_width or 500px`, `undefined`, `undefined`.
- `<sidebar-column>` is used to mimic the default behavior of lovelace. See below.
- `<grid_rows>`, `<grid_col>`, `<grid_gap>`, `<grid_place>` Set the `grid-template-rows`, `grid-template-columns`, `grid-gap` and `place-items` CSS properties when using `layout: grid`.
- `<justify_content>` Set the `justify-content` CSS property of the column container. Default: `center`.

## Layouts

The basic concept of this card is that it takes a number of other cards, and places them in the browser window, just like lovelace does normally, but allowing you a bit more control.

Since `layout-card` is a card in it self its area of effect will be limited to the width of a card, and thus you will (almost) always want to use it in [panel mode](https://www.home-assistant.io/lovelace/views/#panel-mode):

```yaml
views:
  - title: My view
    panel: true
    cards:
      - type: custom:layout-card
        ...
```

### `auto` layout

The auto layout works in the same way as the default lovelace layout.

It follows a simple process.
- A number of columns are prepared based on the screen width and `<column_widt>`.
- If the sidebar is opened, the number of columns is decreased by 1. (**This is not done by layout-card unless `<sidebar_column>` is true.**)
- The number of columns is clamped between `<min_columns>`  and `<max_columns>`
- Cards have a `cardHeight`, which is calculated from their content. One unit is roughly 50 pixels tall.
- Each new card is added to the first row which is less than `<min_height>` units tall.
- If all columns are taller than `<min_height>`, the card is added to the shortes column.
- Once all cards have been placed, any remaining empty columns are removed.

```yaml
type: custom:layout-card
cards:
  - type: entities
    title: 1
    entities:
      - light.bed_light
  - type: entities
    title: 2
    entities:
      - light.bed_light
  - type: entities
    title: 3
    entities:
      - light.bed_light
  - type: entities
    title: 4
    entities:
      - light.bed_light
      - light.bed_light
      - light.bed_light
      - light.bed_light
  - type: entities
    title: 5
    entities:
      - light.bed_light
  - type: entities
    title: 6
    entities:
      - light.bed_light
  - type: entities
    title: 7
    entities:
      - light.bed_light
  - type: entities
    title: 8
    entities:
      - light.bed_light
```
![layout-card 1 - auto](https://user-images.githubusercontent.com/1299821/48088464-62312500-e202-11e8-8ccc-0ef6ac10ec2e.png)

> Note: To get *exactly* the same behavior as the default layout, you need to specify `sidebar_column: true` and `max_columns: 4`. This was given a higher default value to work better with the ridiculously huge screens some people have nowadays.

> Note: The same 8 cards will be used in the following examples and will be omitted for clarity.

### `horizontal` layout

The horizontal layout calculates the number of columns just like the `auto` layout.
It then places the first card in the first column, the second card in the second columns, and so on. Once it reaches the last column, it starts over from the first.

```yaml
type: custom:layout-card
layout: horizontal
cards:
  - ...
```
![layout-card 2 - horizontal](https://user-images.githubusercontent.com/1299821/48088463-62312500-e202-11e8-875a-5ff836069017.png)

### `vertical` layout

The vertical layout calculates the number of columns just like the `auto` layout.
It then places every card in the first column.

```yaml
type: custom:layout-card
layout: vertical
cards:
  - ...
```
![layout-card 3 - vertical](https://user-images.githubusercontent.com/1299821/48088462-62312500-e202-11e8-8e5e-7f4d1821eeb8.png)

It's OK to think I'm out of my mind at this point. And if you don't, you probably will once I claim that this is probably the most useful layout.

Still here? OK. Let me tell you about the `break`.

### `- break`

Just add `- break` to the list of `<cards>` to make card placer move on to the next column for the next card.

This is most useful in the `vertical` layout, but will work in the `horizontal` and `auto` layouts too.

```yaml
type: custom:layout-card
layout: vertical
cards:
  - type: entities
    title: 1
    ...
  - type: entities
    title: 2
    ...
  - break
  - type: entities
    title: 3
    ...
  - break
  - type: entities
    title: 4
    ...
  - type: entities
    title: 6
    ...
  - break
  - type: entities
    title: 7
    ...
```
![layout-card 4 - manual breaks](https://user-images.githubusercontent.com/1299821/48088461-62312500-e202-11e8-96ab-e4f560f8d4fc.png)

### `grid` layout (experimental)

For maximum control, you can place every card manually in a [CSS grid](https://css-tricks.com/snippets/css/complete-guide-grid/) by using the `grid` layout.

To do this, you need to specify `gridrows` and `gridcols` with the settings for `grid-template-rows` and `grid-template-columns` repectively **and** also add `gridcol:` and `gridrow:` for *each card* with the settings for `grid-column` and `grid-row` respectively.

> Hint: This may look better if you also have [card-mod](https://github.com/thomasloven/lovelace-card-mod) and set the card heights to `100 %`.

```yaml
type: custom:layout-card
layout: vertical
column_width: 100%
cards:
  - type: markdown
    content: "# Grid"
  - type: custom:layout-card
    layout: grid
    gridrows: 180px 200px auto
    gridcols: 180px auto 180px
    cards:
      - type: glance
        entities:
          - sun.sun
        gridrow: 1 / 2
        gridcol: 1 / 2
        style: "ha-card { height: 100%; }"
      - type: entities
        entities: &ents
          - light.bed_light
          - light.kitchen_lights
          - light.ceiling_lights
        gridrow: 1 / 3
        gridcol: 2 / 4
        style: "ha-card { height: 100%; }"
      - type: markdown
        content: test
        gridrow: 2 / 4
        gridcol: 1 / 2
        style: "ha-card { height: 100%; }"
      - type: entities
        entities: *ents
        gridrow: 3 / 4
        gridcol: 2 / 3
```
![layout-card - Grid](https://user-images.githubusercontent.com/1299821/71694902-e3f1f380-2db0-11ea-82f1-8f880a2fbb24.png)

You can also ommit `gridrows` or tweak `gridgap` and `gridplace` to get different results. I don't know how this works, but feel free to play around!

## Tweaking layouts

- First of all `<column_num>`, which can be used to force the number of columns displayed:

```yaml
type: custom:layout-card
layout: vertical
column_num: 7
cards:
  - ...
```
![force-number](https://user-images.githubusercontent.com/1299821/68596569-be74f780-049b-11ea-97a7-1d591edf5a26.png)

> Note: See how squeezing cards too tight will make them look weird? Keep this in mind, and don't send me bug reports about it.  
> Your toggles would pop out too if someone forced you into a 100 pixel box.

- The width of columns can be specified either all together...:

```yaml
type: custom:layout-card
column_width: 200
cards:
  - ...
```
![same-width](https://user-images.githubusercontent.com/1299821/68597185-d13bfc00-049c-11ea-8fd4-8d6327a9764a.png)

- ...or as a list of column widths:

```yaml
type: custom:layout-card
column_width: [200, 300, 150]
cards:
  - ...
```
![varied-width](https://user-images.githubusercontent.com/1299821/68597348-1829f180-049d-11ea-917a-c97be3f1e561.png)

If there are more column than values in the list, the last value in the list will be used for the remaining columns.

- Values can be specified either in pixels or in percentages:

```yaml
type: custom:layout-card
column_width: 30%
cards:
  - ...
```
![percentage](https://user-images.githubusercontent.com/1299821/68598310-d4d08280-049e-11ea-8ea7-48d8b14ffef0.png)


- Further tweaks can be made in the same way using `<max_width>` and `<min_width>`, but most of the time `<column_width>` should be enough.

- `<flex_grow>` (single value or list) and `<justify_content>` (single value) can be used to tweak the CSS flexbox settings of the layout. See [this excellent guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) for more info.

- `<rtl>` will populate the columns from right to left instead of left to right.


## A few tips
- `card_options` works really well together with [card-mod](https://github.com/thomasloven/lovelace-card-mod).

- Layout-cards can be placed inside other layout-cards or in vertical-stack cards:
![stacked](https://user-images.githubusercontent.com/1299821/68598908-f0885880-049f-11ea-814f-b91ee6ee9eef.png)

- [gap-card](https://github.com/thomasloven/lovelace-gap-card) can be used to leave a gap in the layout:
![gap](https://user-images.githubusercontent.com/1299821/68599474-eb77d900-04a0-11ea-9b89-f0d090c858b3.png)

- The card list can be populated automatically using [auto-entities](https://github.com/thomasloven/lovelace-auto-entities)

```yaml
type: custom:auto-entities
filter:
  include:
    - domain: light
      options:
        type: light # Make sure to specify a card type for every filter
    - domain: climate
      options:
        type: thermostat
  exclude:
    - state: unavailable
sort:
  method: name
  ignore_case: true
card:
  type: custom:layout-card
```
![auto-entities](https://user-images.githubusercontent.com/1299821/68600943-a86b3500-04a3-11ea-8d08-106e77262552.png)


## Note for Home Assistant Cast users

Layout-card doesn't entirely work with Cast at this time. Specifically, the view may or may not load in if you start a Cast directly to a view which uses layout-card.

If you instead load a different view, and then *switch* to the one using layout-card, things seem to be working better. I hope to be able to fix this soon.

---
<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
