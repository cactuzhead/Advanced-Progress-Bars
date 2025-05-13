---
title: Usage
layout: default
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
nav_order: 2
---
## Usage Example Code Block
To insert an `Advanced Progress Bar` into Obsidian, you use a fenced code block similar to the one below.
````
```apb
My Title: 57/100
```
````
In the `apb` code block, you define the attributes as `Title`: `Value` / `Total`.

![Text Diagram](/assets/Obsidian Advanced Progress Bars - Text Diagram.png)

The `percentage` will be automatically calculated based on your `Value` and `Total`.
{: .note }
the text within the code block example on the settings page will automatically be updated to reflect the changes you make in the other settings.

## Hotkey Setup
To make it more convenient, you can add a hotkey that automatically inserts a progress bar code block into Obsidian. Simply follow these steps:

1. Open Obsidian and go to the **Settings** by clicking the gear icon in the bottom left corner.
2. From the **Settings** menu, go to the **Hotkeys** section on the left sidebar.
3. In the filter search bar found at the top of the Hotkeys section, start typing **"Advanced Progress Bars"** to find the `Advanced Progress Bars: Paste code block` action.
![Hotkey Search](/assets/Obsidian Advanced Progress Bars - Hotkey Search.png)

5. Click on the round plus button next to the found action, and assign the desired hotkey combination (e.g., `Ctrl + Shift + B` or any other combo that suits you).
![Hotkey](/assets/Obsidian Advanced Progress Bars - Hotkey.png)
  
## Copy to Clipboard
Instead of manually typing the code block, or setting up a hotkey,  you can use the `Copy to Clipboard` button, found at the top of the `APB` settings page to quickly copy it for later pasting into Obsidian.

## Refreshing Notes After Changes
To see the changes you've made in the settings reflected in your notes, you may need to switch back and forth between notes or alternatively, reload Obsidian to refresh the active note.

However, if a new progress bar is added to a note, it *will* display correctly, even if the existing progress bars on the same page haven't been refreshed yet.

{: .note }
This will only be a problem directly after you make changes to the settings.

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

![Stacked Bars](/assets/Obsidian Advanced Progress Bars - Settings - Stacked Bars.png)

{: .note }
The code block example on the settings page will only include one progress bar. You will need to manually add any additional progress bars once pasted into Obsidian.
