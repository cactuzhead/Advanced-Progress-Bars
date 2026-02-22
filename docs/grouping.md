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


## Percentage Sorting
With the introduction of version `1.3.0` you have the ability to sort any grouped progress bars, either in ascending or descending order.

For sorting to work, you must have a title line with either `[[asc]]` or `[[desc]]` added to the end of the line.

The minimal requirement is to have your top line have `[[group]][[asc]]` or `[[group]][[desc]]`.
You can of course also have Text for the title and a template as mentioned above.

````
```apb
[[group]]This is my Title{Your Template Name}[[asc]]
My Title: 57/100
Smaller Total: 2/7
Very Large Total: 2034/2345
```
````

All progress bars will be sorted apropriately based on percentage completed, regardless of what type of progress bar or scales they use i.e. numeric or date progress bars.

### Manual Sort Hotkey Setup <span class="label label-green badge">NEW v1.3.0</span>
To add a hotkey that automatically sorts grouped progress bars either in ascending or desdcending order. Simply follow these steps:

1. Open Obsidian and go to the **Settings** by clicking the gear icon in the bottom left corner.
2. From the **Settings** menu, go to the **Hotkeys** section on the left sidebar.
3. In the filter search bar found at the top of the Hotkeys section, start typing **"Advanced Progress Bars"** to find the `Advanced Progress Bars: Manual Sort` action.
![Sort Hotkey Search](/assets/Obsidian Advanced Progress Bars - Manual Sort.png)

4. Click on the round plus button next to the found action, and assign the desired hotkey combination (e.g., `Ctrl + Shift + S` or any other combo that suits you).
![Sort Hotkey](/assets/Obsidian Advanced Progress Bars - Sort Hotkey.png)


{: .note }
Using the sort hotkey will result in **all** progress bars within any groups with an `[[asc]]` or `[[desc]]` being sorted on the currently opened page.

If you have two or more groups on your page, each can be sorted independantly of each other.

For example, if you want one group of progress bars to sort in ascending order but another group in descending order, then simply group them seperately and give them the appropriate `[[asc]]` or `[[desc]]` to the end of each of their title lines.

{: .note }
Any grouped progress bars where the `[[asc]]` or `[[desc]]` is not added to the end of the title line will not sort at all - which can be helpful if you want to always keep them in your desired order.

In this example, you can see that the first line has a text title but with no custom template added before the `[[asc]]`

````
```apb
[[group]]Game Achievements[[asc]]
Online Winner x300: 157/300{rainbow4}
Use Level Editor: 2/5{rainbow5}
Crash into a Tree: 3/10{rainbow6}
Online Winner x100: 157/100{rainbow1}
Matches Played: 1234/1337{rainbow1}
Create a Party: 6/10{rainbow3}
Collect All Gifts: 111/150{rainbow2}
7 Day Streak: 2026-02-14||2026-02-21{date}
Multiplayer Wins: 30/100{rainbow8}
```
````

The above example also has various progress bar lines, each with very different scales and even a date progress bar.
Each progress bar line has also been assigned a custom template.

The normal result you would see is this:-
![Unsorted](/assets/Obsidian Advanced Progress Bars - Unsorted.png)

Once you use the sort hotkey you will now see the following in ascending order:-
![Sorted Asc](/assets/Obsidian Advanced Progress Bars - Sorted Asc.png)


And if you change the `[[asc]]` to `[[desc]]` and use the sort hotkey once more, you will now see this:-
![Sorted Desc](/assets/Obsidian Advanced Progress Bars - Sorted Desc.png)