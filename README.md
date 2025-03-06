# Advanced-Progress-Bars
[Advanced Progress Bars](/docs/assets/Obsidian Advanced Progress Bars - Hero Banner.png)
This plugin extends obsidian to allow you to create custom progress bars by using a simple markdown code block.

If you find value in this plugin and would like to support us, please consider using our [ko-fi](https://ko-fi.com/cactuzhead)

![ko-fi|100](https://storage.ko-fi.com/cdn/fullLogoKofi.png)


## Installation
### Installing via Obsidian
- Navigate to Settings -> Community Plugins -> Browse and then search for `APB`.
- Now select the Advanced Progress Bars plugin and click the install button.
- Remember to activate the plugin by going to `Settings` -> `Community Plugins` -> `Installed Plugins` and toggling the `APB` plugin on.

### Manual Install
- Find the latest release from https://cactuzhead.github.io/Advanced-Progress-Bars/ and download the files (`main.js`,  `manifest.json` and `styles.css`).
- Navigate to your vault's plugin folder ([vault]/.obsidian/plugins), and create a new folder called `obsidian-advanced-progress-bars`.
- Copy the downloaded files into this new folder.
- Reload Obsidian.
- Remember to activate the plugin by going to `Settings` -> `Community Plugins` -> `Installed Plugins` and toggling the `APB` plugin on.

# Obsidian Settings
## Usage Example Code Block
To insert an `Advanced Progress Bar` into `Obsidian`, you use a fenced code block similar to the one below.
````
```obsidian-apb
My Title: 57/100
```
````
In the `obsidian-apb` code block, you define the attributes as `Title`: `Value` / `Total`.

![Text Diagram](/docs/assets/Obsidian Advanced Progress Bars - Text Diagram.png)
Note: the text within the code block example on the settings page will automatically be updated to reflect the changes you make in the other settings.

### Hotkey Setup
To make it more convenient, you can add a hotkey that automatically inserts a progress bar code block into Obsidian. Simply follow these steps:

1. **Open Obsidian** and go to the **Settings** by clicking the gear icon in the bottom left corner.
2. From the **Settings** menu, go to the **Hotkeys** section on the left sidebar.
3. In the filter search bar found at the top of the Hotkeys section, start typing **"Advanced Progress Bars"** to find the **"Advance Progress Bars: Paste Code Block"** action.
![Hotkey Search](/docs/assets/Obsidian Advanced Progress Bars - Hotkey Search.png)
4. Click on the round plus button next to the found action, and assign the desired hotkey combination (e.g., `Ctrl + Shift + B` or any other combo that suits you).
5. 
![Hotkey](/docs/assets/Obsidian Advanced Progress Bars - Hotkey.png)
  
### Copy to Clipboard
Instead of manually typing the code block, or setting up a hotkey,  you can use the `Copy to Clipboard` button, found at the top of the settings page to quickly copy it for later pasting into Obsidian.

### Multiple Advanced Progress Bars
You can also stack progress bars by adding additional bars within the same code block, see example below.
````
```obsidian-apb
My Title: 57/100
Smaller Total: 2/7
Very Large Total: 2034/2345
```
````
The above stacked bars example would be rendered like this (using default dark colors & settings)

![Stacked Bars](/docs/assets/Obsidian Advanced Progress Bars - Settings - Stacked Bars.png)

Note: The code block example on the settings page will only include one progress bar. You will need to manually add any additional progress bars once pasted into Obsidian.

## More Information
For full details about Advanced Progress Bars, please visit 
