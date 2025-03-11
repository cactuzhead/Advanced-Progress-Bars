# Advanced-Progress-Bars
![Advanced Progress Bars](/docs/assets/Obsidian Advanced Progress Bars - Hero Banner.png)
This plugin extends obsidian to allow you to create custom progress bars by using a simple markdown code block.

<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;">
  <div style="flex: 0 0 auto; padding-right: 20px; display: flex; align-items: center;">
    <img src="https://storage.ko-fi.com/cdn/fullLogoKofi.png" alt="ko-fi" style="width: 100px; height: auto;">
  </div>
  <div style="flex: 1; display: flex; align-items: center;">
    <p style="margin: 0px">
      If you find value in this plugin and would like to support us, please consider using our <a href="https://ko-fi.com/cactuzhead" target="_blank">ko-fi</a>
    </p>
  </div>
</div>



## Installation
### Installing via Obsidian
- Navigate to **Settings** -> **Community Plugins** -> **Browse** and then search for `Advanced Progress Bars`.
- Now select the Advanced Progress Bars plugin and click the install button.
- Remember to activate the plugin by going to **Settings** -> **Community Plugins** -> **Installed Plugins** and toggling the `APB` plugin on.

### Manual Install
- Find the latest release from<br>**https://cactuzhead.github.io/Advanced-Progress-Bars/**<br>and download the files (`main.js`,  `manifest.json` and `styles.css`).
- Navigate to your vault's plugin folder<br>**[your vault]/.obsidian/plugins**<br>and create a new folder called<br>`advanced-progress-bars`.
- Copy the downloaded files into this new folder.
- Reload Obsidian.
- Remember to activate the plugin by going to **Settings** -> **Community Plugins** -> **Installed Plugins** and toggling the `APB` plugin on.

# Obsidian Settings
## Usage Example Code Block
To insert an `Advanced Progress Bar` into Obsidian, you use a fenced code block similar to the one below.
````
```obsidian-apb
My Title: 57/100
```
````
In the `obsidian-apb` code block, you define the attributes as `Title`: `Value` / `Total`.

![Text Diagram](/docs/assets/Obsidian Advanced Progress Bars - Text Diagram.png)

The `percentage` will be automatically calculated based on your `Value` and `Total`.
> Note: the text within the code block example on the settings page will automatically be updated to reflect the changes you make in the other settings.

## Hotkey Setup
To make it more convenient, you can add a hotkey that automatically inserts a progress bar code block into Obsidian. Simply follow these steps:

1. Open Obsidian and go to the **Settings** by clicking the gear icon in the bottom left corner.
2. From the **Settings** menu, go to the **Hotkeys** section on the left sidebar.
3. In the filter search bar found at the top of the Hotkeys section, start typing **"Advanced Progress Bars"** to find the `Advanced Progress Bars: Paste Code Block` action.
![Hotkey Search](/docs/assets/Obsidian Advanced Progress Bars - Hotkey Search.png)

5. Click on the round plus button next to the found action, and assign the desired hotkey combination (e.g., `Ctrl + Shift + B` or any other combo that suits you).
![Hotkey](/docs/assets/Obsidian Advanced Progress Bars - Hotkey.png)
  
## Copy to Clipboard
Instead of manually typing the code block, or setting up a hotkey,  you can use the `Copy to Clipboard` button, found at the top of the `APB` settings page to quickly copy it for later pasting into Obsidian.

## Refreshing Notes After Changes
To see the changes you've made in the settings, you may need to switch back and forth between notes or reload Obsidian to refresh the active note.

However, if a new progress bar is added to a note, it *will* display correctly, even if the existing progress bars on the same page haven't been refreshed yet.

> Note, This will only be a problem after you make changes to the settings.

## Multiple Advanced Progress Bars
You can also stack progress bars by adding additional bars within the same code block, see example below.
````
```obsidian-apb
My Title: 57/100
Smaller Total: 2/7
Very Large Total: 2034/2345
```
````
The above stacked bars example would be rendered like this (using default dark colors & settings)

![Stacked Bars](/docs/assets/Obsidian Advanced Progress Bars - Settings - Stacked Bars.png)

> Note: The code block example on the settings page will only include one progress bar. You will need to manually add any additional progress bars once pasted into Obsidian.


## Light & Dark Settings
![Light and Dark](/docs/assets/Obsidian Advanced Progress Bars - Settings - Light and Dark.png)

These two buttons (`Light` & `Dark`) will change **ALL** the color settings to their respective defaults.
All other settings will remain unchanged.<br>
**Note:** once selected, all previous colors will be lost forever and can *not* be retrieved.

## Progress Bar Settings
### Default Title
![Title](/docs/assets/Obsidian Advanced Progress Bars - Settings - Title.png)

You can use this to setup your default progress bar title.
By clicking the `Reset to Default` button this will change the title back to `Progress`.
If you change this, the `Title` will be automatically changed in the example code block at the top of the settings for easy copy and pasting later on.

### Default Total
This setting is used to set the `total` you want for your default progress bar.
This is does not need to be set to `100` (as in percentage). For example, you could set it to `7` if you are tracking seven subtasks.

![Smaller Total](/docs/assets/Obsidian Advanced Progress Bars - Smaller Total.png)

### Progress Percentage
![Slider](/docs/assets/Obsidian Advanced Progress Bars - Settings - Slider.png)

This slider is used to change the percentage of the demonstration progress bar found near the top of the settings.
It is meant as an aid so you can see how your progress bar will look with different settings.

Additionally, it is also changes the `Value` in the `Example Code` found at the top of the settings.

If you want to use the example code block's `Copy to Clipboard` feature or a hotkey to later paste into obsidian, then you would probably want this to be set to 0.

It is recommended that you do this *after* you are happy with all the other settings and no longer need to see the demonstration progress bar.

### Full Width
![Toggle](/docs/assets/Obsidian Advanced Progress Bars - Settings - Toggle.png)

If this is toggled `on`, then the entire progress bar will expand to fill the width of its container.

If toggled `off` then a new `Width` setting will appear below this setting.

The new `Width` setting will allow you to enter in a number to fix the width of the progress bar (in pixels).

This is particularly useful when displaying a progress bar on a full-screen note, as a flexible width without a fixed limit can cause the progress bar to stretch excessively.

### Height
![Slider](/docs/assets/Obsidian Advanced Progress Bars - Settings - Slider.png)

This slider allows you to set the height of the progress bar from a range of 1 to 15 pixels.

Pressing the `Reset to Default` button changes this value back to 8 pixels tall.

### Round End Caps
If this is toggled `on`, then the progress bar (and its background) will have rounded ends.
Toggling it `off` will change them to square ends.

![End Caps](/docs/assets/Obsidian Advanced Progress Bars - Settings - End Caps.png)

## Section Mark Settings
### Section Marks
![Toggle](/docs/assets/Obsidian Advanced Progress Bars - Settings - Toggle.png)

If the `Number of Colors` setting (located further down on the settings page) is set to a value greater than 1, you can turn this toggle `on`  to display evenly spaced markers along your progress bars.

| Number of Colors | Number of Marks |
| ---------------- | --------------- |
| 1                | 0               |
| 2                | 1               |
| 3                | 2               |
| 4                | 3               |
| 5                | 4               |

### Section Mark Color
This setting defines the color of the vertical section markers.

Use the colorpicker to select a custom color or alternatively, use one of the `Light` or `Dark` defaults by pressing the appropriate buttons.

> Note: the color selected will automatically be set to 50% transparency, allowing the progress bar's color to blend and influence the final appearance.

### Section Mark Width
This is a slider to set the width of each marker from a range of 1 to 5 pixels.
Pressing the `Reset to Default` button changes this value back to 3 pixels wide.

## Text Settings
There are four pairs of settings which relate to `Title`, `Percentage`, `Fraction` (value/total) and `Completed Text`.

![Text Diagram](/docs/assets/Obsidian Advanced Progress Bars - Text Diagram.png)

If you toggle each text item `on`, it will display that particular text on your progress bar (see image above).

The `completed` text will be displayed over the top of the progress bar, and will only be shown when it reaches 100%.

![Completed](/docs/assets/Obsidian Advanced Progress Bars - Settings - Completed.png)

(as always, you can see what it will look like by viewing the demo progress bar near the top of the settings.).

![Color Picker](/docs/assets/Obsidian Advanced Progress Bars - Settings - Color Picker.png)

Using the accompanying color settings will allow you to pick your desired custom color for each of the four text items.

Alternatively, you could use one of the `Light` or `Dark` defaults by pressing the appropriate buttons.

## Container Settings
Similar to the text settings above, this section includes two pairs of options for customizing the Border and Background of the container.

![Container](/docs/assets/Obsidian Advanced Progress Bars - Settings - Container.png)

## Progress Bar Color Settings
Here, you will find all the available color options for customizing the progress bar.

### Number of Colors
This drop-down selection allows you to define how many different colors the progress bar will use.

So for example, if you have 3 colors selected, the bar will change color every time it hits the next 33% of progress.

What this means is that when the Value is between 0 and 33% the entire bar will be colored the same as your 1st Color setting, and when it is between 34 and 66% it will be your 2nd Color, and between 67 and 99%, your 3rd Color.

| Number of Colors | Marks | Size of Section |
| ---------------- | ----- | --------------- |
| 1                | 0     | 100%            |
| 2                | 1     | 50%             |
| 3                | 2     | 33%             |
| 4                | 3     | 25%             |
| 5                | 4     | 20%             |


In the image below, you'll see another example showcasing how this works with the maximum of 5 colors and the marks toggle enabled for clearer definition.

As the percentage increases, the entire bar will change to the color you've set for each of the 5 color settings, updating every 20% increment.

![Colors](/docs/assets/Obsidian Advanced Progress Bars - Settings - Colors.png)

When your progress bar reaches 100%, it will change to the color specified in the `Completed Color` setting.
In this example, you'll also see the `COMPLETED` text, which has been set using the text settings mentioned earlier.<br>
> Note that your `Title` will not change once set - the titles in the above image where only manually changed to better explain what was happening.

### Completed Color
This color is what the progress bar will be when it has reached 100%.
You can see in the image above, that the bottom completed progress bar is set to the default light blue-grey.

### Bar Background Color
This is the color for the remaining portion of the progress bar.
In this example it is a mid blue-grey color.

![Advanced Progress Bars](/docs/assets/Obsidian Advanced Progress Bars - Bar Diagram.png)
