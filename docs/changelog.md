---
title: Changelog
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
nav_order: 999
---

# Changelog

## Release v1.2.1 <span class="label label-green badge">NEW</span>
### Bug Fixes
- Inline edit gear settings icon is now hidden when a wikilink is used to display the progress bar on another note (it will still be viewable on the original note).
- Progress bars within callouts should now work as intended.
- Progress bars using task linking were only counting tasks marked with [x] for the **Total** in top-level and sub-tasks.  Now any custom status markers will also be counted towards the **Total**.
Completed tasks using [x] or [X] are the only ones counting towards the **Value**

## Release v1.2.0
### New Features
- Added date functionality so you can use a start and end date to keep track of days.
- Added prefix and suffix to templates so that you can add custom text before and/or after the value and total.
- Added grouping of multiple progress bars with optional title and template.
- Added a hotkey to insert a date code block using todays date as the start and 1 week later for the end date (you can change default duration).
- Added a copy button on every custom template to duplicate the entire template which is useful for creating similar variants.
- <span class="label label-red badge">REMOVED</span> `Height`, `Round end caps`, `Number of marks` and `Overage color` from the standard settings as they are now primarily template based.
- Added a border around color pickers so they can be easily seen on mobile.
- Increased time to 3 seconds for editing template name.
### Documentation
- Updated `Usage` page to include information about the new Date Progress Bars.
- Updated `Templates` page to add Duplicate Template Button information.
- Updated `Templates Extended` page to include Prefix & Suffix information.
- Updated `Hotkeys` page to include Paste Date Code Block.
- Added a new `Grouping` page to include information on how to create and customise your groups.
### Bug Fixes
- Fixed bug where the subtask text can be visible for progress bars without a tag or without a task matching tag.
- Fixed a bug where if you set the completed bar color to pure black (#000000) it would still be displayed instead of hidden.
- Made sure that the template name's textbox is not shrunk down in width on mobile so you can actually see the name.
- Fixed the template name not being case insensitive as intended.


## Release v1.1.4
### New Features
- Expanded the templates system to allow for additional per template container, text and bar colors.
- Added a button to transfer all your default settings to the default template.
- <span class="label label-red badge">REMOVED</span> many settings that are now handled by the templates :-
    - **Light & Dark setting**
    - **Progress bar color**
        - completed color
        - bar background color
    - **Progress bar container**      
        - border toggle
        - border color
        - background toggle
        - background color
    - **Text**
        - show title text toggle
        - title text color
        - show percentage text toggle
        - percentage tect color
        - show fraction text toggle
        - fraction text color
        - show completed text toggle
        - completed text color
    - **Tasks**
        - sub task color
        - sub task completed color
- <span class="label label-red badge">REMOVED</span> inline edit gear color settings as this is now automatically assigned based on your progress bar containers background color.

### Documentation
- Added comprehensive info about new expanded templates functionality.
- Removed info about settings that have been replaced by the new template functionality.

### Bug Fixes
- Removed an unused rogue CSS property which was causing a white bar to briefly appear at the top of the notes when starting Obsidian.

## Release v1.1.3
### New Features
- Inline editing for swift adjustments to the value of a standard progress bar (without a tag).

### Bug Fixes
- Hotkeys are now enabled immediately upon plugin activation, allowing seamless interaction without needing to render a progress bar first.

### Documentation
- Added `Inline Edit` page to explain the 4 new settings.
- Added `Hotkeys` page for quick access to hotkey setup information.

## Release v1.1.2
### New Features
- Added a new toggle in the `Progress bar container` section of the settings called `Top margin`.  This will allow you to choose to set a larger margin at the top of the code block so that the </> is now above the progress bars container when you hover over it.
- Added a new toggle in the `tasks` section of the settings called `Auto tasks`.  This will allow you to turn `on` automatic task refreshing or `off` for manual refreshing.  It is **highly recommended** that you have this turned `off` and use a manual refresh hotkey or page switching.
- Added a new hotkey called `Task manual refresh` which you can use to quickly refresh all linked tasks on your current note.

### Documentation
- Updated `Container` page to include `Top margin` toggle explanation.
- Updated `Tasks` page to include `Auto tasks` toggle explanation, refreshing and hotkey information.

## Release v1.1.1
### New Features
- Added Unicode support which fixed tag tracking not working with non-English languages that use letters like é, ñ, ü, ç or indeed, any characters in Latin, Greek, Cyrillic, Hebrew, Arabic, Hindi, Japanese, Chinese, and many more including emoji.

### Documentation
- Updated `Tasks` page to explain introduction of Unicode tags to support most languages.

## Release v1.1.0
### New Features
- **New Template System:** Default and custom templates support assignable colors (up to 5), gradients, and gradient types for richer visual styling.
- **Individual Progress Bar Styling:** Assign custom templates to specific progress bars to create unique styles, independent of the default color configuration.

- <span class="label label-red badge">REMOVED</span> **Removed Legacy Color and Gradient Settings:** Eliminated previous settings that applied uniform colors and gradients to **all** progress bars, enabling more flexible and targeted styling.

- **Added Box Shadow Feature:** Introduced global support for glow or drop shadows on progress bars, with customizable options for shadow color, blur, and inset.

- **Codebase Refactoring:** Streamlined and optimized the code for enhanced clarity, efficiency, and maintainability.

### Documentation
- **New Theme:** Changed from `Minimal` jekyll theme to the `Just-The-Docs` jekyll theme.  This provides a multi-page system with side menu for easier, less cluttered documentation.

- **New Pages:** Added documentation pages for both of the new features - Templates and Box Shadows.


## Release v1.0.8
- Added removal of the list bullets, to the left of progress bars, within columns on a Dashboard++ page, enhancing visual clarity.

## Release v1.0.7
- Added a new toggle in the Progress Bar Color section called `Gradient Type`. This setting allows you to select either a color-mixed linear gradient or a simple linear gradient for your gradients.
- Added a new section called `Tasks` with 6 settings.
This will allow you to track the completion of tasks (and sub tasks) and for these to be reflected automatically in your progress bar.
This is done by using tags, please see the full documentation for a detailed explanation of what this is, what the settings do and how to add tags.

## Release v1.0.6
- Added an `Override large value error toggle` with accompanying percentage text color options.
With this set, APB will no longer show an error when the Value exceeds the Total. Instead, it will display the percentage text in a new color and now supports values exceeding 100%.

## Release v1.0.5
- Nine different types of fixes for submission.
- Refactored code to use various settings functions.
- Added gradient settings.

## Release v1.0.4
- Fixes for submission.
- Removed old var's.
- Removed console.log's.
- Added async/await for nearly all saveSettings.

## Release v1.0.3
- Fixes for submission.
- Removed old var's.
- Removed console.log's.
- Added async/await for nearly all saveSettings.

## Release v1.0.2
Updated plugin with 3 new files:
- main.js
- manifest.json
- styles.css

## Release v1.0.1
Update index.md