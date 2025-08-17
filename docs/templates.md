---
title: Templates
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
nav_order: 120
---

## Templates  <span class="label label-grey badge">NEW v1.1.0</span>
Starting in release `1.1.0`, you now have the ability to assign a custom template to each individual progress bar.

This update removed a lot of the color and gradient settings from the `Progress Bar Color` section and instead, moved them to a simplified default template.

The default template will automatically be applied to all progress bars that have not been alocated a specific custom template.

{: .note }
**All** progress bars will still use all the other defaults set outwith the templating feature.  These include, but are not limited to marks, text and tasks.

With the introduction of templates, you can now have gradients with up to 5 equally spaced color stops for greater customisation.

<span class="label label-green badge">NEW v1.1.4</span>

{: .note }
With the introduction of version 1.1.4 most of the default color settings have now been moved into the template system for greater customisability. Please visit our `Templates Extended` page for full details.

## Add Template
To add a new template, press the `Add Template` button and a new template row will be added to the bottom of the template list.

Each row will consist of these following settings:-

### Template Name
Assign a unique, short, and descriptive name to your template. This name will be used in the code block for each progress bar where you want the template applied.

{: .note }
The template names are case insensative so `My Template` is the same as `mY teMpLATE`.

A normal progress bar code block will look something like this.
````
```apb
My Title: 57/100
```
````

If you wish to add a template to the progress bar, you need to add the name of the template encapsulated in curly braces at the end of your data line as shown below.

````
```apb
My Title: 57/100{My Template}
```
````

You can still do a multi line in the code block, and give each progress bar a different template if you wish.

````
```apb
Rainfall: 194/365{rain}
Wind: 111/365{wind}
Sunshine: 267/365{sun}
```
````
The above code block will result in three progress bars, each using their own template for styling (as seen below).

![Multiple Line Templates](/assets/Obsidian Advanced Progress Bars - Multiple Line Templates.png)

### Gradient Toggle
Toggle this `on` to make the progress bar into a gradient.

If you toggle this `off`, your progress bar will either be a single color or a series of stepped colors instead of a gradient (see **stepped colors** below).

When a single valid color is specified, your progress bar will display that color uniformly.  

If no valid colors are provided (e.g. all set to `#000000`), the progress bar will default to a fallback blue color, ensuring a consistent, single-color appearance.

{: .note }
For ***all*** templates, assigning either a single valid color or no valid colors will produce a solid-colored progress bar, regardless of whether the gradient option is toggled `on` or `off`.

## Stepped Colors
If you have the gradient toggled `off`, and you have 2 or more colors defined in your template, your progress bar will step though those colors based on your percentage completed.

**e.g.** If you have the maximum 5 colors defined in your template, your progress bar will switch to the next color every 20%.

So in the case of a template using the default 5 color rainbow palette, the progress bars entire color would change to the following, depending on the percentage completed:-

| Start | End | Color |
|:------|:---:|:------|
| 0%    | 19% | Red    |
| 20%   | 39% | Yellow |
| 40%   | 59% | Green  |
| 60%   | 79% | Purple |
| 80%   | 99% | Blue   |

![Stepped Templates](/assets/Obsidian Advanced Progress Bars - Stepped Template.png)

### Gradient Type Toggle
Use this toggle to switch between a masked-linear (`on`) and linear (`off`) progress bar.

A **masked-linear** gradient will *always* run from 0% to 100% of the progress bars total width.
 However, depending on your percentage completed, you will only see part of that overall gradient. 

**i.e.** from 0% to your current percentage completed (see below).  The remaing right portion of the progress bar is masked from view.

![Masked-Linear Gradient](/assets/Obsidian Advanced Progress Bars - Masked Linear Gradient.png)

A **linear** gradient will *always* show the complete gradient regardless of percentage completed.

This results in the gradient being stretched to the width of the completed section of the progress bar (see below).

![Linear Gradient](/assets/Obsidian Advanced Progress Bars - Linear Gradient.png)

### Colorpickers (color 1 - 5)
With the new template system you can have up to 5 color stops for your gradient/stepped progress bar.  Any `#000000` pure black colors will be ignored.

So for example, you could press the default rainbow button to populate your template with 5 colors stops: Red, Yellow, Green, Purple and Blue.

![Templates Rainbow](/assets/Obsidian Advanced Progress Bars - Templates Rainbow.png)

Then you could remove some of them by changing them to `#000000`, let's say Red, Green and Purple.

![Templates 2 Colors](/assets/Obsidian Advanced Progress Bars - Templates 2 Colors.png)

This would leave you with two colors, Yellow and Blue in positions 2 and 5.

All the `#000000` colors in postions 1, 3 and 4 would be ignored and your progress bar would use the two valid colors in the order from left to right.

![Templates Progress Bar](/assets/Obsidian Advanced Progress Bars - Templates Progress Bar.png)

### Color Presets
These 3 buttons when pressed, will fill all 5 color pickers with either the `Light`, `Dark` or `Rainbow` presets.

{: .note }
When pressed these will overwrite any colors you have already assigned and can not be undone.

### Movement Buttons (up & down)
If you wish to order your templates in the list, use these two buttons to move the row up or down.

### Delete Button
If you no longer need your template, then press this button.  **Note** that this can not be undone.
