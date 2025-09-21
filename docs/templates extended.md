---
title: Templates Extended
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
nav_order: 125
---

## Templates Extended <span class="label label-green badge">NEW v1.1.4</span>
Starting in release `1.1.4`, you now have the additional ability to have per template color settings for the container, text, sub task text and progress bar.

![Examples](/assets/Obsidian Advanced Progress Bars - Templates Extended Examples.png)

This update removed a lot of the default settings from the main settings and moved them to the templates.

For information about the original template system settings created before this update, please visit our `Templates` page.


## Edit Extended Colors
You should see a small change to the the existing template system.

Now, the default template and all custom templates should have a small settings button to the right of their template name.

![Button](/assets/Obsidian Advanced Progress Bars - Templates Extended Button.png)

This button once clicked will expand to show you 21 additional color settings for greater versatility of your Advanced Progress Bars.

The default template when expanded, will be highlighted by a green border around the new extended settings panel as well as the settings button itself.

![Default](/assets/Obsidian Advanced Progress Bars - Templates Extended Default Panel.png)

{: .note }
You can open and close this panel at any time by pressing this button.

All custom templates will be differentiated from the default settings by using a blue border to highlight their settings instead of the default's green.

![Custom](/assets/Obsidian Advanced Progress Bars - Templates Extended Custom Panel.png)

The panel will stay open (visible) until you either close it or you view another templates extended panel.  This was done so you don't get confused about which template the panel belongs to.

## Colors
Each color setting within the default extended panel has a light and dark button so that you can set it to a default light or dark color.

It is slightly different in the custom templates extended panel, as each color setting instead has a reset to default color and reset to pure black buttons.

This gives you a quick way to copy the currently set default color or to hide/not display the related item by settting to `#000000`. 

However as always, you can use the color picker to set it to any color you desire for your default and custom templates.

## Transfer previous default colors
At the bottom of the `default` extended settings panel is an additional unique button which will transfer all of your previous colors to the default template.

![Transfer](/assets/Obsidian Advanced Progress Bars - Templates Extended Transfer.png)

You should only need to use this once, however, if in the future you change your defaults you can use this again to return to your original v1.1.3 default colors.

## Turning off & on
Instead of using a toggle to turn on or off a particular setting as was previously done prior to v1.1.4 you can simply set your color to pure black `#000000` this will tell APB to not display this particular setting (or make it invisible).

The *only* setting that you can not switch off or make transparent is the `Bar background color` as it is required to be a color for the progress bar to work correctly.

This is why it the only color setting that allows you to use pure black `#000000`.

## Prefix and suffix
With release `v1.2.0` you now have `Prefix` and `Suffix` settings in the extended templates panel.
This means you can now have a per template prefix and suffix for both the value and the total.
![Prefix and Suffix Settings](/assets/Obsidian Advanced Progress Bars - Templates Extended Prefix Suffix Settings.png)

These will be added before and/or after your progress bars `value` and `total`.
![Prefix and Suffix](/assets/Obsidian Advanced Progress Bars - Templates Extended Prefix Suffix.png)

Examples of a prefix could be a currency like `$`, `£` and `€` or your suffix could be something like `days`, `kg` or `miles`.

{: .note }
The prefix and suffix will be directly next to the value and total numbers so in some cases you may wish to add a space after a prefix or a space before a suffix to seperate the number from them.

Assigning unique per template prefixes and suffixes to the value and total of your progress bar provides remarkable versatility, allowing for tailored and visually striking designs.

You can leave a prefix or suffix blank and they will not affect your layout, or you can even just use a space if you want to seperate items.

## Dates color & format
You can set a custom color for the `Dates color` text and the `Days left` text.

This text is shown below your progress bar as seen in this image below.
![dates](/assets/Obsidian Advanced Progress Bars - Templates Extended Dates.png)

You can additionally set the date format that you wish these dates to use by using the `Enable USA date format` toggle.

When toggled on, your dates will be in the format `Dec 31, 2025` and when you toggle it off `31 Dec 2025` will be the format used.

## Number of marks
You can manually override the number of evenly spaced marks along the progress bar with this setting, to a maximum of 19.
This means you can have a maximum of 20 sections along your progress bar.

If you set the slider to `0`, your progress bar will have no marks at all.

And if you want the progress bar to use the default automatically calculated value that you set up in the `Section marks` part of the settings, then you can set this slider to `-1` for the defaults to work.

## End cap style
You can now set the style of your end caps per template rather than a global setting.

When toggled on, the progress bar will have a `round end cap` and when toggled off it will have a `square end cap`.

## Bar height
Each template now supports a customizable bar height, adjustable via a slider ranging from 1px to 15px, with a default value of 8px.

## Overage percentage text color
This is another new per template setting which changes the color of the percentage text if it exceeds the total.