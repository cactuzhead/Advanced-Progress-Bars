---
title: Grouping
layout: default
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
nav_order: 25
---
## Grouping
With the introduction of version `1.2.0` you have the ability to visually group together multiple progress bars within a container.

You have always had the ability to stack multiple progress bars in a single code block by simply adding additional lines see example below.
````
```apb
My Title: 57/100
Smaller Total: 2/7
Very Large Total: 2034/2345
```
````

These would be rendered seperately, and would appear in the exact same way as three single code blocks.
This is still the case, but you now have the option of slightly altering the code block to visually group them all inside a container.

You simply need to add a first line to the code block that starts with `[[group]]` as displayed in the example below.

````
```apb
[[group]]
My Title: 57/100
Smaller Total: 2/7
Very Large Total: 2034/2345
```
````

{: .note }
**All** progress bar's within the same code block will be grouped together.


## Adding a Title
Additionally you can choose to add a title for your group of progress bars which will be displayed at the top of the container, before any progress bars are rendered.

To do this, simply add some text after the `[[group]]` on the first line (see below).

````
```apb
[[group]]This is my Title
My Title: 57/100
Smaller Total: 2/7
Very Large Total: 2034/2345
```
````

This code block will result in the output seen below (example only uses default templates for progress bars).

![date title](/assets/Obsidian Advanced Progress Bars - Templates Extended Date Title.png)


## Adding a Template
Of course, you might want to change from the default themes colors for the grouping container and title.

You can achieve this by specifying a theme at the end of the first line in a similar fashion to adding a theme to a progress bar.

Just add the name of the template you have created in the settings within some curly braces (see code block below).

````
```apb
[[group]]This is my Title{Your Template Name}
My Title: 57/100
Smaller Total: 2/7
Very Large Total: 2034/2345
```
````

![date template](/assets/Obsidian Advanced Progress Bars - Templates Extended Date Template.png)

When you specify a template (or use the default template if omitted), it will use these template settings:-

- Container border color
- Container background color
- Container title text color

Only these three colors are used from the template - all other settings are ignored.

{: .note }
You can use any template you want, although I recommend creating a template specifically for this grouping purpose.

You can be as creative as you wish with the all the templates, and can make custom templates for each progress bar within a group like the example below. 

![date example](/assets/Obsidian Advanced Progress Bars - Templates Extended Date Example.png)