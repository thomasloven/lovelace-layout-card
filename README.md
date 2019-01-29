layout-card
===========

Get more control over the placement of cards

> You may think of this as a test-drive for the future of default lovelace behavior. As such I appreciate any feedback (even more than usual). Let me know if and how you use this, and we might see it as default behavior in the future. Or something else entirely, who knows...

## Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:layout-card`
| cards | list | **Required** | The cards to display
| layout | string | auto | `auto`, `vertical`, `horizontal`
| column\_num | number | none | Number of columns to force

### More options

There are a few more options you can play around with:

- `min_height` - (default: 5) determines how long a column must be before a card is placed in the next one.
- `column_width` - (default: 300) determines how wide a column is in pixels.
- `max_columns` - (default: 100) determines the maximum number of columns.


## Instructions

This card requires [card-tools](https://github.com/thomasloven/lovelace-card-tools) to be installed.

This card takes other cards and place them in different layouts.

The card works best if used in a view with `panel: true`.

Each layout consists of columns, the number of which is determined by your screen width. The number of columns can also be overridden by setting `column_num`.

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

---

And as mentioned, use `column_num` to override the number of columns.

![layout-card 5 - number of columns](https://user-images.githubusercontent.com/1299821/48088460-61988e80-e202-11e8-990f-22c5e0319b43.png)
```yaml
      - type: custom:layout-card
        layout: auto
        column_num: 2
        cards:
        ...
```

![layout-card 6 - number of columns](https://user-images.githubusercontent.com/1299821/48088459-61988e80-e202-11e8-9694-e7688ce34b5c.png)
```yaml
      - type: custom:layout-card
        layout: horizontal
        column_num: 8
        cards:
        ...
```
