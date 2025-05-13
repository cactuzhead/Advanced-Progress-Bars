---
title: Dashboard++
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
nav_order: 13
---

## Using in Dashboard++
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

{: .note }
Tag linking for tasks and sub-tasks do not work on Dashboard++ pages only simple manually edited progress bars work.

In earlier versions, this workaround worked, but starting with release `1.0.8`, I have refined it to hide the list bullet for progress bars, resulting in a cleaner, more polished look (see image below).

![dashboardplusplus](/assets/Obsidian Advanced Progress Bars - DashboardPlusPlus.png)

Now, you can effortlessly place simple progress bars anywhere in column lists without a list bullet on the left, enhancing visual clarity.
