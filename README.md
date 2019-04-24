layout-card
===========

Get more control over the placement of lovelace cards

# Installation instructions

This card requires [card-tools](https://github.com/thomasloven/lovelace-card-tools) to be installed.

For installation instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

The recommended type of this plugin is: `js`

### If you are using [custom\_updater](https://github.com/custom-components/custom_updater):
```yaml
resources:
- url: /customcards/github/thomasloven/card-tools.js?track=true
  type: js
- url: /customcards/github/thomasloven/layout-card.js?track=true
  type: js
```

# Usage instructions

This card takes other cards and place them in different layouts.

This card works best if used in [panel mode](https://www.home-assistant.io/lovelace/views/#panel-mode).

Each layout consists of columns, the number of which is determined by your screen width and the settings of layout-card.

There are three different layouts:

### `auto`

This layout works the same way as the default lovelace layout. Cards are automatically added to stacks depending on their height.
That may seem pointless, but trust me, this has it's uses.

![layout-card 1 - auto](https://user-images.githubusercontent.com/1299821/48088464-62312500-e202-11e8-8ccc-0ef6ac10ec2e.png)
```yaml
  - title: Default
    panel: true
    cards:
      - type: custom:layout-card
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

### horizontal

This layout will place cards in one column at a time, and then move on to the next - horizontally.

![layout-card 2 - horizontal](https://user-images.githubusercontent.com/1299821/48088463-62312500-e202-11e8-875a-5ff836069017.png)
```yaml
  - title: Horizontal
    panel: true
    cards:
      - type: custom:layout-card
        layout: horizontal
        cards:
          - type: entities
```

### vertical

This layout will place cards vertically in one column

![layout-card 3 - vertical](https://user-images.githubusercontent.com/1299821/48088462-62312500-e202-11e8-8e5e-7f4d1821eeb8.png)
```yaml
  - title: Vertical
    panel: true
    cards:
      - type: custom:layout-card
        layout: vertical
        cards:
          - type: entities
```

It's OK to think I'm out of my mind at this point, but hang on; let me introduce the `break`.

Add a `- break` to the list of cards to break the column right there, and move on to the next one.

![layout-card 4 - manual breaks](https://user-images.githubusercontent.com/1299821/48088461-62312500-e202-11e8-96ab-e4f560f8d4fc.png)
```yaml
  - title: Manual breaks
    panel: true
    cards:
      - type: custom:layout-card
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
            title: 5
            ...
          - type: entities
            title: 6
            ...
          - break
          - type: entities
            title: 7
            ...
          - type: entities
            title: 8
            ...
```

Breaks also work with the `horizontal` layout, and even `auto`. Experiment a bit.

## Configuration
```yaml
title: My view
panel: true
cards:
  - type: custom:layout-card
    layout: <layout>
    column_num: <column num>
    max_columns: <max columns>
    column_width: <column width>
    max_width: <max width>
    min_height: <min height>
    ltr: <ltr>
    rebuild: <rebuild>
    cards:
      <cards>
```

### `<layout>`
Optional. Default: `auto`

Either `auto`, `vertical` or `horizontal`.

### `<column num>`
Optional. Default: 1

The minimum number of columns to make. Note that if a column has no cards, it will be removed regardless.

### `<max columns>`
Optional. Default: 100

The maximum number of columns to make.

### `<column width>`
Optional. Default: 300

The minimum width of a column in pixels.


### `<max width>`
Optional. Default: 500

The maximum width of a column in pixels.
`<max width>` can also be an array of values ending with `%` or `px`. In that case the values will specify the width of each column. This works best when combined with `<column count>` and `<max columns>`.

Ex: `max_width: [70%, 300px, 30%]` will result in three columns, where the center one is 300 pixels wide, and the left and right divide the remaining space in a 70/30 ratio.

![varied sizes](https://user-images.githubusercontent.com/1299821/53567104-807ab200-3b5e-11e9-8a20-67190b80b70d.jpg)

This allows for some really interesting layout options when combined with stacks. Play around!

![advanced layout](https://user-images.githubusercontent.com/1299821/53567164-a738e880-3b5e-11e9-93f2-d2041c512b8a.jpg)

### `<min height>`
Optional. Default: 5

The number of units needed before a column is considered not empty.

### `<rtl>`
Optional. Default: false

If set to true, columns will be placed right-to-left.

### `<rebuild>`
Optional. Default: false

If set, a rebuild of the layout will be triggered after this many milliseconds. May be useful if your layout looks different after a page reload or when you return to the view, but it will cause your screen to flash once.

### `<cards>`
Required.

A list of cards to put in the layout.

The list can also contain `- break` - see description of layouts above.

# FAQ

### Can I leave a gap in the layout?

Yes. By using the compainon card: [gap-card](https://github.com/thomasloven/lovelace-gap-card).

---
<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
