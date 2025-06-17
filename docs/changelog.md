---
title: Changelog
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
nav_order: 999
---

# Changelog

## Release v1.1.2 <span class="label label-green badge">NEW</span>
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
