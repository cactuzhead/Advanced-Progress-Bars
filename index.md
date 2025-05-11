---
title: Home
layout: home
---
# Advanced-Progress-Bars
![Advanced Progress Bars](/docs/assets/Obsidian Advanced Progress Bars - Hero Banner.png)
This plugin extends obsidian to allow you to create custom progress bars by using a simple markdown code block.

<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;">
  <div style="flex: 0 0 auto; padding-right: 20px; display: flex; align-items: center;">
    <img src="/Advanced-Progress-Bars/docs/assets/ko-fi.png" alt="ko-fi" style="width: 100px; height: auto;">
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
```apb
My Title: 57/100
```
````
In the `apb` code block, you define the attributes as `Title`: `Value` / `Total`.

![Text Diagram](/docs/assets/Obsidian Advanced Progress Bars - Text Diagram.png)

The `percentage` will be automatically calculated based on your `Value` and `Total`.
> Note: the text within the code block example on the settings page will automatically be updated to reflect the changes you make in the other settings.

## Hotkey Setup
To make it more convenient, you can add a hotkey that automatically inserts a progress bar code block into Obsidian. Simply follow these steps:

1. Open Obsidian and go to the **Settings** by clicking the gear icon in the bottom left corner.
2. From the **Settings** menu, go to the **Hotkeys** section on the left sidebar.
3. In the filter search bar found at the top of the Hotkeys section, start typing **"Advanced Progress Bars"** to find the `Advanced Progress Bars: Paste code block` action.
![Hotkey Search](/docs/assets/Obsidian Advanced Progress Bars - Hotkey Search.png)

5. Click on the round plus button next to the found action, and assign the desired hotkey combination (e.g., `Ctrl + Shift + B` or any other combo that suits you).
![Hotkey](/docs/assets/Obsidian Advanced Progress Bars - Hotkey.png)
  
## Copy to Clipboard
Instead of manually typing the code block, or setting up a hotkey,  you can use the `Copy to Clipboard` button, found at the top of the `APB` settings page to quickly copy it for later pasting into Obsidian.

## Refreshing Notes After Changes
To see the changes you've made in the settings reflected in your notes, you may need to switch back and forth between notes or alternatively, reload Obsidian to refresh the active note.

However, if a new progress bar is added to a note, it *will* display correctly, even if the existing progress bars on the same page haven't been refreshed yet.

> Note, This will only be a problem directly after you make changes to the settings.

## Multiple Advanced Progress Bars
You can also stack progress bars by adding additional bars within the same code block, see example below.
````
```apb
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

If this is toggled `on`, the progress bar will automaticlaly have equally spaced vertical markers along its length.
The following table shows how many marks will be displayed depending on the `Number of Colors` setting (located further down on the settings page).

| Number of Colors | Number of Marks |
| ---------------- | --------------- |
| 1                | 0               |
| 2                | 1               |
| 3                | 2               |
| 4                | 3               |
| 5                | 4               |

> Note: if you have 1 color selected, you will by default, not see any markers.

### Automatically Assigned Marks
If this is toggled `on`, the progress bar will automaticlaly have equally spaced vertical markers along its length - as described above.

However, if you want to manually overide this behavior to choose the number of equally spaced marks along the progress bar then, toggle this setting `off`.

If you do so, a new slider will apear underneath to allow you to set the number of marks you wish to be used.

### Number of Marks
If you have the `Automatically Assigned Marks` toggle in the `off` position (as described above), you can use this slider to pick exactly how many vertical marks you want evenly distributed along your progress bar.

> Note: this overrides the automatically assigned system

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

## Override Error Warning
Typically, when your `Value` exceeds the `Total`, this error will appear to help you identify and correct any mistakes while editing the Value.

![Error](/docs/assets/Obsidian Advanced Progress Bars - Error.png)

However, there may be instances where you would prefer the ability to exceed 100%, and this is where this setting proves useful.

When you toggle `on` the `Override large value error`, **APB** will no longer display an error if the Value exceeds the Total.

Additionally, a second setting will appear, allowing you to customize the color of the percentage text once it exceeds 100%.

As usual, there are two defaults `Light` and `Dark` or select a custom color using the colorpicker.

![Error](/docs/assets/Obsidian Advanced Progress Bars - Error Override.png)

As shown in the image above, the percentage text changes color and now displays values exceeding 100%.

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

### Gradient
If you set the `Number of colors` to 1 color, this new gradient option will become visible.

When toggled `on`, you will see one toggle and two additional color settings appear underneath.

The `Gradient Type` allows you to select between a `color-mixed linear gradient` and a `simple linear gradient`.

The `color-mixed linear gradient` smoothly transitions between two colors (settings below) from 0% to 100%. The progress bar displays this gradient, shifting from the primary color to a blended shade based on the completion percentage.

In contrast, the `simple linear gradient` always applys the full gradient of colors, but will stretch and squash it depending on the completion percentage of the progress bar.

![Gradient Types](/docs/assets/Obsidian Advanced Progress Bars - Gradient Types.png)

In the above image examples, the left gradients are the `color-mixed linear gradient` and the right ones are the `simple linear gradient`.

The `Primary Gradient` is used to set the left color of the gradient, whilst the `Secondary Gradient` is used to set the right color.

![Gradient](/docs/assets/Obsidian Advanced Progress Bars - Light and Dark Gradient.png)

Each has two default buttons for `Light` and `Dark` colors, or you can alternatively use the colorpicker to select any color you wish.

### Completed Color
This color is what the progress bar will be when it has reached 100%.
You can see in the image above, that the bottom completed progress bar is using the default `Dark` option which is a light blue-grey color.

### Bar Background Color
This is the color for the remaining portion of the progress bar.
In this example it is a mid blue-grey color.

![Advanced Progress Bars](/docs/assets/Obsidian Advanced Progress Bars - Bar Diagram.png)

## Tasks Settings
Here, you will find all the available options for customizing the progress bar when using tags to link to tasks.

### Enable Task Linking
When toggled on, progress bars can use tags to link to matching tags in your tasks.  This results in your progress bar automatically tracking tags to display your current task completion.

Normally your code block would look something like this:-
````
```apb
My Title: 57/100
```
````
To add a tag to your progress bar, you add a hastag to the end of your `Title`, followed by your tag name.
````
```apb
My Title#orange: 57/100
```
````
As you can see in the image below, the tag will be displayed as a badge to the left of your `Title`.
![Tasks](/docs/assets/Obsidian Advanced Progress Bars - Tasks.png)

> Note: If there is at least one matching tag in your tasks, APB will automatically find them, and change your `Value/Total` in the code block.  You do not need to manually edit the code block once setup.

So the previous code block example above, will now automatically be changed to somthing like this:-
````
```apb
My Title#orange: 1/2
```
````
In the example above, the tag is #orange (all lowercase) and is added to the end of your `Title` (but before the colon).

### Add Tags to Tasks
Now simply add the same tag to the end of each top task you want to link to this progress bar.
```php
- [x] Task 1 #orange
  - [ ] Subtask 1
  - [x] Subtask 2
    - [ ] Sub Subtask 1
- [ ] Task 2 #banana
- [ ] Task 3 #orange
```
In the example above, there are a total of 3 top tasks and 3 subtasks (1 of which is a sub-subtask).

The `#orange` progress bar would see 2 linked top level tasks (task 1 and task 3) and it would see that one of those was completed, so your progress bar would therefore be set to 50% (1/2).

> Note: your tags are case sensative so you need to exactly match your tags for APB to link them. You can use any case and even numbers if you wish.

If you add a tag to your progress bar and it does not match any task tags, you will see an error saying (in this example) `#orange not found`.

![tag not found](/docs/assets/Obsidian Advanced Progress Bars - Tag Not Found.png)

> Note: if you see this error, the progress bar's data may be incorrect and will not update as it is not correctly linked.

### Other tags
If you add tags to your subtasks (or sub-subtasks, etc) they will be ignored by APB.

### Track More than One Tag
In the `Add Tags to Tasks` example above, you will notice there are 3 top tasks, two of which are tagged with `#orange`.  However there was also one top task that was tagged with `#banana`.

This `#banana` tag was ignored by the progress bar which was looking for `#orange` tags.
You can however (if you desire) add a second progress bar, and give it the `#banana` tag so it will track all `#banana` top tasks.

![multi tags](/docs/assets/Obsidian Advanced Progress Bars - Multi Tags.png)

In the image above, both `#orange` and `#banana` are being tracked automatically.

And you can track as many tags as you wish by simply adding additonal progress bars with a new tag for each.

### Tag Badge Colors
Once you toggle the task linking setting to `on`, two additional color settings will appear underneath.

`Task Text Color`  is used to set the color of the tag badge's text, whilst the `Task Background Color` is used to set the background color of the tag badge.


## Sub Tasks
In addition to the color settings mentioned above, you should also see a new toggle option called `Enable Sub-Task Linking`.

When toggled `on` it should reveal two further color settings underneath it.

These are used to change the text color of the sub tasks, with one being used after you have completed all sub tasks.

As with all color settings, there are Light and Dark buttons to set default colors - or choose your custom color from the colorpicker.

If you activate the sub task toggle, APB will keep a count of all subtasks of your top level tasks and display it in text form underneath your progress bar.

```php
- [x] Task 1 #orange
- [ ] Task 2 #banana  
  - [x] Subtask 1
    - [ ] Sub Subtask 1
- [ ] Task 3 #orange
- [ ] Task 4 #banana
  - [ ] Subtask 1
```
So for the tasks example above, you will see a sub task count for `#banana` that will be 1/3 as there are a total of three sub tasks (or sub-subtasks), one of which is completed.

![multi tags](/docs/assets/Obsidian Advanced Progress Bars - Sub Tasks.png)

As you can see in the image below, if you complete all sub tasks for the specified tag, your text will change color and add the word `COMPLETED` after it.

![multi tags](/docs/assets/Obsidian Advanced Progress Bars - Sub Tasks Completed.png)

> Note: subtasks **do not** require tags themselves, they will be counted according to their top tasks tag.
If you do add tags to subtasks, they will be totally ignored by APB.

### Subtask Code Block
For APB to track your subtasks, it adds additional data to the end of the `My Title#Tag` in your code block.
````
```apb
My Title#banana~2/4: 0/2
```
````
As you can see in the example above, there is a `~2/4` placed directly after the `#banana` tag.
This is simply the `Value/Total` for subtasks of your progress bars tag, and is automatically added by APB.

> Note: For task linked progress bars - it is not recommended that you make any changes manually to the code block apart from the `Title` or `#tag` as it will be overwritten when APB refreshes the data.

## Refreshing
If you have `Enable Task Linking` turned `on` the progress bars will update when you change between notes.
This can be used to "manually" make sure that notes are refreshed and up-to-date.

Additionally, APB will refresh automatically after you make changes to either the liniked progress bar code block or the tasks themselves.
For performance and user experience reasons, it will only update 2 seconds after it detects a change.

> Note: if you are not going to be using tags to keep track of your task progress, then it is **highly** advised to turn `off` the `Enable Task Linking` for a smoother and efficient experience.

## Using in Dashboard++
NEW 1.0.8
{: .label .label-green }

## Using in Dashboard++ {: .label .label-green .inline } NEW 1.0.8

Dashboard++ (aka DashboardPlusPlus) is a CSS snippet that provides a homepage for organizing and navigating notes.
You can find it at <a href="https://github.com/TfTHacker/DashboardPlusPlus" target="_blank">https://github.com/TfTHacker/DashboardPlusPlus</a> 

If you want to incude progress bars into the columns of your Dashboard++ page, you can not use a standard APB code block.
However, there is a workaround detailed below.

### Progress Bar in Columns
You normally insert a progress bar by pasting in  the standard APB code block which may look something like this:-
````
```apb
My Title: 57/100
```
````
You *can* still do this on the page, but it will not be able to be placed inside columns (as a list item).

Instead, if you want to place them in the columns (as a list item) you will have to use a workaround by simply omitting the last three backticks so that it looks like this:-
````
- ```apb
My Title: 57/100
````
As shown in the example above, the code block omits the closing backticks and begins with a hyphen and space to format it as a list item.

> Note: tag linking for tasks and sub-tasks do not work on Dashboard++ pages only simple manually edited progress bars work.

In earlier versions, this workaround worked, but starting with release `1.0.8`, I have refined it to hide the list bullet for progress bars, resulting in a cleaner, more polished look (see image below).

![dashboardplusplus](/docs/assets/Obsidian Advanced Progress Bars - DashboardPlusPlus.png)

Now, you can effortlessly place simple progress bars anywhere in column lists without a list bullet on the left, enhancing visual clarity.
