---
title: Tasks
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
nav_order: 11
---

- TOC
{:toc}
## Tasks Settings
Here, you will find all the available options for customizing the progress bar when using tags to link to tasks.

### Unicode <span class="label label-green badge">NEW v1.1.1</span>
Added Unicode support which fixed tag tracking not working with non-English languages that use letters like é, ñ, ü, ç or indeed, any characters in Latin, Greek, Cyrillic, Hebrew, Arabic, Hindi, Japanese, Chinese, and many more including emoji.

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
![Tasks](/assets/Obsidian Advanced Progress Bars - Tasks.png)

{: .note }
If there is at least one matching tag in your tasks, APB will automatically find them, and change your `Value/Total` in the code block.  You do not need to manually edit the code block once setup.

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

{: .note }
Your tags are case sensative so you need to exactly match your tags for APB to link them. You can use any case and even numbers if you wish.

If you add a tag to your progress bar and it does not match any task tags, you will see an error saying (in this example) `#orange not found`.

![tag not found](/assets/Obsidian Advanced Progress Bars - Tag Not Found.png)

{: .note }
If you see this error, the progress bar's data may be incorrect and will not update as it is not correctly linked.

### Other tags
If you add tags to your subtasks (or sub-subtasks, etc) they will be ignored by APB.

### Track More than One Tag
In the `Add Tags to Tasks` example above, you will notice there are 3 top tasks, two of which are tagged with `#orange`.  However there was also one top task that was tagged with `#banana`.

This `#banana` tag was ignored by the progress bar which was looking for `#orange` tags.
You can however (if you desire) add a second progress bar, and give it the `#banana` tag so it will track all `#banana` top tasks.

![multi tags](/assets/Obsidian Advanced Progress Bars - Multi Tags.png)

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

![multi tags](/assets/Obsidian Advanced Progress Bars - Sub Tasks.png)

As you can see in the image below, if you complete all sub tasks for the specified tag, your text will change color and add the word `COMPLETED` after it.

![multi tags](/assets/Obsidian Advanced Progress Bars - Sub Tasks Completed.png)

{: .note }
Subtasks **do not** require tags themselves, they will be counted according to their top tasks tag.
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

{: .note }
For task linked progress bars - it is not recommended that you make any changes manually to the code block apart from the `Title` or `#tag` as it will be overwritten when APB refreshes the data.

## Refreshing
If you have `Enable Task Linking` turned `on` the progress bars will update when you change between notes.
This can be used to "manually" make sure that notes are refreshed and up-to-date.

Additionally, APB will refresh automatically after you make changes to either the liniked progress bar code block or the tasks themselves.
For performance and user experience reasons, it will only update 2 seconds after it detects a change.

{: .note }
If you are not going to be using tags to keep track of your task progress, then it is **highly** advised to turn `off` the `Enable Task Linking` for a smoother and efficient experience.
