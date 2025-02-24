# Advanced-Progress-Bars
![Advanced Progress Bars](/docs/assets/Obsidian Advanced Progress Bars - Hero Banner.png)
Obsidian plugin to create custom progress bars

## Code Block
To insert an Advance Progress Bar into obsidian, you use a fenced code block similar to the one below.
````
```obsidian-bar
Progress: 57/100
```
````
Within your `obsidian-bar` code block, specify the attributes `Title`: `Value`/ `Total`.

## Installation
### Installing via Obsidian
Navigate to Settings -> Community Plugins -> Browse and then search for `APB`.  Now select the Advance Progress Bars plugin and click the install button.

### Manual Install
Navigate to https://cactuzhead.github.io/Advanced-Progress-Bars/ and copy the `main.js` and `manifest.json` to your vault's .obsidian/plugins/obsidian-apb directory (ex. `VaultFolder/.obsidian/plugins/obsidian-apb/`).

![Advanced Progress Bars](/docs/assets/Obsidian Advanced Progress Bars - Text Diagram.png)

### Segmented Marks
![[Obsidian Advanced Progress Bars - Settings - Toggle 2.png]]
If you have the `Number of Colors` setting (found lower down on the settings page) to a value more than 1, you can use this toggle to display equally separated segmented marks along your progress bars.

| Number of Colors | Marks | Segments |
| ---------------- | ----- | -------- |
| 1                | 0     | 1        |
| 2                | 1     | 2        |
| 3                | 2     | 3        |
| 4                | 3     | 4        |
| 5                | 4     | 5        |
