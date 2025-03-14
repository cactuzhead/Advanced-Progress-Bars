import { App, Plugin, PluginSettingTab, Setting,  Notice, ButtonComponent, ColorComponent } from 'obsidian';

// Populate settings with values
interface ObsidianProgressBarsSettings {
	/* Progress Bar Settings */
	APB_title: string;
	APB_widthToggle: boolean;
	APB_width: number;	
	APB_height: number;
	APB_progressBarPercentage: number;
	APB_total: number;
	APB_endcapToggle: boolean;
	APB_marksToggle: boolean;
	APB_marksColor: string;
	APB_marksLightColor: string;
	APB_marksWidth: number;
	/* Text Settings */
	APB_titleToggle: boolean;
	APB_titleColor: string;
	APB_titleLightColor: string;
	APB_percentageToggle: boolean;
	APB_percentageColor: string;
	APB_percentageLightColor: string;
	APB_fractionToggle: boolean;
	APB_fractionColor: string;
	APB_fractionLightColor: string;
	APB_completedToggle: boolean;
	APB_completedColor: string;
	APB_completedLightColor: string;
	/* Container Settings */
	APB_borderToggle: boolean;
	APB_colorBorder: string;
	APB_colorLightBorder: string;
	APB_backgroundToggle: boolean;
	APB_colorBackground: string;
	APB_colorLightBackground: string;
	/* Progress Bar Color Settings */
	APB_colornumber: string;
	APB_color1: string;
	APB_color2: string;
	APB_color3: string;
	APB_color4: string;
	APB_color5: string;
	APB_color1Light: string;
	APB_color2Light: string;
	APB_color3Light: string;
	APB_color4Light: string;
	APB_color5Light: string;
	APB_colorBarCompleted: string;
	APB_colorLightBarCompleted: string;
	APB_colorBarBackground: string;
	APB_colorLightBarBackground: string;
	/* Additional Settings */
	APB_progressBarChange: boolean;
}

const DEFAULT_SETTINGS: Partial<ObsidianProgressBarsSettings> = {
	/* Progress Bar Settings */
	APB_title: 'Progress',
	APB_widthToggle: true,
	APB_width: 190,	
	APB_height: 8,
	APB_progressBarPercentage: 83,
	APB_total: 100,
	APB_endcapToggle: true,
	APB_marksToggle: true,
	APB_marksColor: '#000000',
	APB_marksLightColor: '#ffffff',
	APB_marksWidth: 3,
	/* Text Settings */
	APB_titleToggle: true,
	APB_titleColor: '#8fa0ba',
	APB_titleLightColor: '#44546f',
	APB_percentageToggle: true,
	APB_percentageColor: '#c1d7f9',
	APB_percentageLightColor: '#6d85ad',
	APB_fractionToggle: true,
	APB_fractionColor: '#8fa0ba',
	APB_fractionLightColor: '#576a8a',
	APB_completedToggle: true,
	APB_completedColor: '#c1d7f9',
	APB_completedLightColor: '#44546f',
	/* Container Settings */
	APB_borderToggle: true,
	APB_colorBorder: '#474f62',
	APB_colorLightBorder: '#ced0d6',
	APB_backgroundToggle: true,
	APB_colorBackground: '#242a35',
	APB_colorLightBackground: '#f1f2f4',
	/* Progress Bar Color Settings */
	APB_colornumber: 'option5',
	APB_color1: '#2978ef',
	APB_color2: '#8ec822',
	APB_color3: '#dfaa22',
	APB_color4: '#c84922',
	APB_color5: '#dd4a86',
	APB_color1Light: '#278378',
	APB_color2Light: '#2baab9',
	APB_color3Light: '#4a32e2',
	APB_color4Light: '#7c328e',
	APB_color5Light: '#c11e49',
	APB_colorBarCompleted: '#576178',
	APB_colorLightBarCompleted: '#fcfcfd',
	APB_colorBarBackground: '#3b4252',
	APB_colorLightBarBackground: '#d9dde2',
	/* Additional Settings */
	APB_progressBarChange: true,
}
// Loading and saving of settings
export default class ObsidianProgressBars extends Plugin {
	settings: ObsidianProgressBarsSettings;
  
	copyButtonListener: (event: MouseEvent) => void;

	async onload() {
		await this.loadSettings();
	
		this.addSettingTab(new ObsidianProgressBarsSettingTab(this.app, this));
	
		
		this.app.workspace.onLayoutReady(this.initializeProgressBars.bind(this));
	}
  
	initializeProgressBars() {
		this.registerMarkdownCodeBlockProcessor('obsidian-apb', (source, el, ctx) => {

			// Split the source string into rows
			const rows = source.trim().split('\n');
			el.empty(); // Clear the default rendering

			// Loop through each line and do something with it
			rows.forEach((row, index) => {
				// Use regex to extract the label and progress (Value/Total)
				const match = row.match(/^(.+):\s*(\d+)\/(\d+)$/);		

				if (!match) {
					console.error('Invalid format for advanced progress bar block:', row);

					const APB_errorContainer = document.createElement('div');
					APB_errorContainer.addClass('error-container');
					
					const APB_errorMessage = document.createElement('div');
					APB_errorMessage.addClass('error-text-container');				
					APB_errorMessage.createEl('span', { text: 'APB_ Error: Invalid block format' });

					APB_errorContainer.appendChild(APB_errorMessage);
					el.appendChild(APB_errorContainer);
		
					return;
				}

				// Extract label, current value, and total value from the match
				const label = match[1];
				const current = parseInt(match[2], 10);
				const total = parseInt(match[3], 10);

				// Check if current value is too large or total is zero
				if (current > total && total !== 0) {
					console.error('Invalid value for advanced progress bar block:', row);

					const APB_errorContainer = document.createElement('div');
					APB_errorContainer.addClass('error-container');

					const APB_errorMessage = document.createElement('div');
					APB_errorMessage.addClass('error-text-container');
					APB_errorMessage.createEl('span', { text: 'APB_ Error: Value is too large' });

					APB_errorContainer.appendChild(APB_errorMessage);
					el.appendChild(APB_errorContainer);

					return;
				}
	  
				// Check if parsing was successful and that total is not zero
				if (isNaN(current) || isNaN(total) || total === 0) {
					console.error('Invalid advanced progress bar values:', row);	

					const APB_errorContainer = document.createElement('div');
					APB_errorContainer.addClass('error-container');

					const APB_errorMessage = document.createElement('div');
					APB_errorMessage.addClass('error-text-container');
					APB_errorMessage.createEl('span', { text: 'APB_ Error: Invalid number' });

					APB_errorContainer.appendChild(APB_errorMessage);
					el.appendChild(APB_errorContainer);

					return;
				}
	  
				// Calculate the width percentage of the progress bar
				const percentage = (current / total) * 100;
		
				// Ensure the width percentage is between 0 and 100
				const clampedPercentage = Math.min(Math.max(Math.round(percentage), 0), 100);
		
				const APB_container = document.createElement('div');
				APB_container.addClass('progressBar-container');

				if (this.settings.APB_borderToggle) {
					APB_container.style.border = '1px solid'+ this.settings.APB_colorBorder;
				} else {
					APB_container.style.border = '0px';
				}

				if (this.settings.APB_backgroundToggle) {
					APB_container.style.background = this.settings.APB_colorBackground;
				} else {
					APB_container.style.background = 'transparent';
				}

				// APB_Text Container
				const APB_textContainer = document.createElement('div');
				APB_textContainer.addClass('progressBar-text-container');

				// APB_ BarBackground container
				const APB_backgroundToggle = document.createElement('div');
				APB_backgroundToggle.addClass('progressBar-background');
				APB_backgroundToggle.style.background = this.settings.APB_colorBarBackground;

				// APB_Title
				const APB_title = document.createElement('div');
				APB_title.addClass('progressBar-title');
				if (this.settings.APB_titleToggle) {
					APB_title.createEl('span', { text: label });
					APB_title.style.color = this.settings.APB_titleColor;
				}

				// APB_Percentage
				const APB_percentage = document.createElement('div');
				APB_percentage.addClass('progressBar-percentage');
				if (this.settings.APB_percentageToggle) {
					APB_percentage.createEl('span', { text: clampedPercentage+'%' });
					APB_percentage.style.color = this.settings.APB_percentageColor;
				}

				// APB_Value
				const APB_value = document.createElement('div');
				APB_value.addClass('progressBar-value');
				if (this.settings.APB_fractionToggle) {
					APB_value.createEl('span', { text: '('+current+'/'+total+')' });
					APB_value.style.color = this.settings.APB_fractionColor;
				}

				// APB_Completed
				const APB_completed = document.createElement('div');
				APB_completed.addClass('progressBar-completed');
				if (this.settings.APB_completedToggle) {
					APB_completed.createEl('span', { text: '' });
					APB_completed.style.color = this.settings.APB_percentageColor;
				}

				// progressBar
				const APB = document.createElement('div');
				APB.addClass('progressBar');

				const progressBarwidth: number = this.settings.APB_width;
				let numericWidth = parseInt(progressBarwidth.toString(), 10);

				if (this.settings.APB_widthToggle) {			
					APB_container.style.width = '100%';
					APB_backgroundToggle.style.width = '100%';
					APB.style.width = `${clampedPercentage}%`;
				} else {
					APB_backgroundToggle.style.width = `${progressBarwidth}px`;
					APB_container.style.width = `${numericWidth + 10}px`;
					APB.style.width = `${numericWidth / 100 * clampedPercentage}px`;
				}
								
				APB.style.height = `${this.settings.APB_height}px`;
		
				setEndCaps(APB_backgroundToggle, APB, this.settings.APB_endcapToggle);
				APB_backgroundToggle.appendChild(APB);
		
				const marks = document.createElement('div');
				marks.addClass('marks');			
		
				const numberOfSections = parseInt(this.settings.APB_colornumber.replace(/\D/g, ''));

				// create required number of section marks if NOT completed
				if (clampedPercentage !== 100) {
					APB_backgroundToggle.appendChild(marks);

					if (this.settings.APB_marksToggle) {			
						for (let i = 1; i <= (numberOfSections - 1); i++) {			
							const mark = document.createElement('div');
							mark.addClass('mark');
							mark.style.left = `${(i * (100/numberOfSections))}%`;
							marks.appendChild(mark);											
						
							const dpr = window.devicePixelRatio || 1; // Get the device pixel ratio
							const adjustedBorderWidth = this.settings.APB_marksWidth / dpr; // use DPI to create correct pixel width 

							const rgbaColor = hexToRgba(this.settings.APB_marksColor, 0.5);
							mark.style.borderLeft = adjustedBorderWidth + 'px solid ' + rgbaColor;	
						}
					}
				}

				APB.appendChild(APB_completed);

				// loop to set correct progress bar color
				for (let i = 1; i <= numberOfSections; i++) {
					let sectionsize = `${(i * (100/numberOfSections))}%`;
					
					const markLeftValue = parseFloat(sectionsize);
					
					if ((clampedPercentage <= markLeftValue) && this.settings.APB_progressBarChange) {
						APB.style.backgroundColor = String(this.settings[`APB_color${i}` as keyof ObsidianProgressBarsSettings]);
	
						if (clampedPercentage == 100) {
							APB.style.backgroundColor = this.settings.APB_colorBarCompleted;
							if (this.settings.APB_completedToggle) {
								APB_completed.textContent ='COMPLETED';
							}
						}
						this.settings.APB_progressBarChange = false;
						this.saveSettings();
					}
				}

				this.settings.APB_progressBarChange = true;

				APB_container.appendChild(APB_textContainer);
					if (this.settings.APB_titleToggle) {
						APB_textContainer.appendChild(APB_title);
					}
					if (this.settings.APB_percentageToggle) {
						APB_textContainer.appendChild(APB_percentage);
					}
					if (this.settings.APB_fractionToggle) {
						APB_textContainer.appendChild(APB_value);
					}

				APB_container.appendChild(APB_backgroundToggle);

				el.appendChild(APB_container);
		  });
		});

		// Register a custom command to paste text
        this.addCommand({
            id: 'paste-code-block',
            name: 'Paste Code Block',

			editorCallback: async (editor, view) => {
				editor.focus();
				// Ensure editor is valid
				if (!editor) {
				  new Notice("No active editor found!");
				  return;
				}
				
				// Construct the code block text
				const valueFromPercentageOfTotal = Math.floor((this.settings.APB_total/100) * this.settings.APB_progressBarPercentage);
				const codeBlockText = `\`\`\`obsidian-apb\n${this.settings.APB_title}: ${valueFromPercentageOfTotal}/${this.settings.APB_total}\n\`\`\``;
		
				// Get the current cursor position
				const cursor = editor.getCursor();
		
				// Insert the code block text at the cursor position
				editor.replaceRange(codeBlockText, cursor);
		
				// Calculate the new cursor position
				const lines = codeBlockText.split('\n');
				const newCursor = {
					line: cursor.line + lines.length - 1,
					ch: lines[lines.length - 1].length // Length of the last line
				};

				// Ensure the cursor moves after the insertion
				setTimeout(() => {
					editor.setCursor(newCursor);
					editor.refresh();
				}, 0); // Zero-delay timeout ensures this runs after DOM updates
			},
			});
		}

	async loadSettings() {
	  	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
	  	await this.saveData(this.settings);
	}

	async onunload(): Promise<void> {
		// Check if the button still exists in the DOM
		const copyButton = document.querySelector('button');
		if (copyButton) {
			// Remove the event listener to clean up resources
			copyButton.removeEventListener('click', this.copyButtonListener);
		} else {

		}
	}

}

// Create Settings Tab Content
class ObsidianProgressBarsSettingTab extends PluginSettingTab {
	plugin: ObsidianProgressBars;

	// Explicitly define the type of the event listener
    private copyButtonListener: (event: MouseEvent) => void;

	constructor(app: App, plugin: ObsidianProgressBars) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async display(): Promise<void> {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h3', { text: 'Advanced Progress Bars' });

		const paragraph = containerEl.createEl('p', { text: 'If you find value in this plugin and would like to support us, please consider using our ' });

		paragraph.createEl('a', {
			href: 'https://ko-fi.com/cactuzhead',
			text: 'ko-fi',
			cls: 'custom-link'
		});

		const container = containerEl.createEl('div');
		container.addClass('custom-container');
		container.appendChild(paragraph);

		// Create Ko-Fi link
		const koFiLink = container.createEl('a');
		koFiLink.href = 'https://ko-fi.com/cactuzhead';
		koFiLink.target = '_blank';

		// Ko-Fi logo
		const koFiImage = koFiLink.createEl('img');
		koFiImage.setAttribute('src', 'https://storage.ko-fi.com/cdn/fullLogoKofi.png');
		koFiImage.setAttribute('alt', 'Support us on Ko-fi');

		// Style the image link
		koFiImage.style.width = '100px';
		koFiImage.style.height = 'auto';
		koFiLink.style.display = 'inline-block';
		koFiLink.style.marginLeft = '10px';

		/************ Usage Example Code Block *************/
		new Setting(containerEl)
			.setName('Usage Example Code Block')
			.setDesc(createFragment((frag) => {
			frag.appendText('Use this code block and edit the ');

			const customElement = frag.createEl('span');
			customElement.setText('Title: Value/Total');
			customElement.classList.add('highlight-text');

			frag.appendText(' as needed.');
			frag.createEl('br');
			frag.appendText('If you require more than one bar, simply create additional ');

			const customElement2 = frag.createEl('span');
			customElement2.setText('Title: Value/Total');
			customElement2.classList.add('highlight-text');

			frag.appendText(' lines within the code block.');
			frag.createEl('br');
			frag.appendText('Note: ');

			const customElement3 = frag.createEl('span');
			customElement3.setText('Total');
			customElement3.classList.add('highlight-text');

			frag.appendText(' does not need to be 100.');
			frag.createEl('br');
			frag.appendText('Visit ');

			frag.createEl('a', {
				href: 'https://cactuzhead.github.io/Advanced-Progress-Bars/',
				text: 'cactuzhead',
				cls: 'custom-link'
			});

			frag.appendText(' for more detailed information.');
		}))

    .addTextArea((textArea) => {
		const valueFromPercentageOfTotal = Math.floor((this.plugin.settings.APB_total/100) * this.plugin.settings.APB_progressBarPercentage);
		textArea.setValue(`\`\`\`obsidian-apb\n${this.plugin.settings.APB_title}: ${valueFromPercentageOfTotal}/${this.plugin.settings.APB_total}\n\`\`\``);

        textArea.inputEl.style.height = '80px';
        textArea.inputEl.style.width = '200px';
        textArea.inputEl.style.resize = 'none';

		const container = textArea.inputEl.parentElement;
		// check container exists before appending the button
		if (container) {
			// Example for adding the copy button and text area to the settings
			const copyButton = containerEl.createEl('button', { text: 'Copy to Clipboard' });

			// Store the click event listener in a class property
			this.copyButtonListener = (event: MouseEvent) => {
				navigator.clipboard.writeText(textArea.inputEl.value)
					.then(() => {
						new Notice('Content copied to clipboard!');
					})
					.catch((err) => {
						new Notice('Failed to copy content: ' + err);
					});
			};

			// Add the event listener to the button
			copyButton.addEventListener('click', this.copyButtonListener);

			copyButton.style.marginTop = '10px';
			copyButton.style.display = 'block';
			container.style.display = 'flex';
        	container.style.flexDirection = 'column';
	} else {
			console.error('Unable to find the parent container for the textarea');
		}
	});

	/************ SECTION Light & Dark Settings *************/
	 containerEl.createEl('h4', { text: 'Light & Dark' });

	/************ Light & Dark Quick Apply *************/
	new Setting(containerEl)
		.setName('Apply all Light & Dark color defaults')
		.setDesc(createFragment((frag) => {
            frag.appendText('These two options ');
            frag.createEl('span', {
                text: '(Light & Dark)',
				cls: 'highlight-text'
            });
            frag.appendText(' will change ALL the color settings below to their respective defaults. (All other settings will remain unchanged).');
			frag.createEl('br');
			frag.appendText(' Note: once selected, all previous colors will be lost forever and can not be retrieved.');

		}))
			.addButton((button) =>
			button.setIcon('sun').setTooltip('Reset to Light default')	
			.onClick(async() => {				
				this.plugin.settings.APB_marksColor = DEFAULT_SETTINGS.APB_marksLightColor as string;
				this.plugin.settings.APB_titleColor = DEFAULT_SETTINGS.APB_titleLightColor as string;
				this.plugin.settings.APB_percentageColor = DEFAULT_SETTINGS.APB_percentageLightColor as string;
				this.plugin.settings.APB_fractionColor = DEFAULT_SETTINGS.APB_fractionLightColor as string;
				this.plugin.settings.APB_colorBorder = DEFAULT_SETTINGS.APB_colorLightBorder as string;
				this.plugin.settings.APB_colorBackground = DEFAULT_SETTINGS.APB_colorLightBackground as string;
				this.plugin.settings.APB_colorBarCompleted = DEFAULT_SETTINGS.APB_colorLightBarCompleted as string;
				this.plugin.settings.APB_colorBarBackground = DEFAULT_SETTINGS.APB_colorLightBarBackground as string;
				this.plugin.settings.APB_completedColor = DEFAULT_SETTINGS.APB_completedLightColor as string;

				this.plugin.settings.APB_color1 = DEFAULT_SETTINGS.APB_color1Light as string;
				this.plugin.settings.APB_color2 = DEFAULT_SETTINGS.APB_color2Light as string;
				this.plugin.settings.APB_color3 = DEFAULT_SETTINGS.APB_color3Light as string;
				this.plugin.settings.APB_color4 = DEFAULT_SETTINGS.APB_color4Light as string;
				this.plugin.settings.APB_color5 = DEFAULT_SETTINGS.APB_color5Light as string;

				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('moon').setTooltip('Reset to Dark default')
			.onClick(async() => {
				this.plugin.settings.APB_marksColor = DEFAULT_SETTINGS.APB_marksColor as string;
				this.plugin.settings.APB_colorBorder = DEFAULT_SETTINGS.APB_colorBorder as string;
				this.plugin.settings.APB_titleColor = DEFAULT_SETTINGS.APB_titleColor as string;
				this.plugin.settings.APB_percentageColor = DEFAULT_SETTINGS.APB_percentageColor as string;
				this.plugin.settings.APB_fractionColor = DEFAULT_SETTINGS.APB_fractionColor as string;
				this.plugin.settings.APB_colorBorder = DEFAULT_SETTINGS.APB_colorBorder as string;
				this.plugin.settings.APB_colorBackground = DEFAULT_SETTINGS.APB_colorBackground as string;
				this.plugin.settings.APB_colorBarCompleted = DEFAULT_SETTINGS.APB_colorBarCompleted as string;
				this.plugin.settings.APB_colorBarBackground = DEFAULT_SETTINGS.APB_colorBarBackground as string;
				this.plugin.settings.APB_completedColor = DEFAULT_SETTINGS.APB_completedColor as string;

				this.plugin.settings.APB_color1 = DEFAULT_SETTINGS.APB_color1 as string;
				this.plugin.settings.APB_color2 = DEFAULT_SETTINGS.APB_color2 as string;
				this.plugin.settings.APB_color3 = DEFAULT_SETTINGS.APB_color3 as string;
				this.plugin.settings.APB_color4 = DEFAULT_SETTINGS.APB_color4 as string;
				this.plugin.settings.APB_color5 = DEFAULT_SETTINGS.APB_color5 as string;

				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ SECTION progress Progress Bar *************/
	containerEl.createEl('h4', { text: 'Demonstration Progress Bar' });

	new Setting(containerEl)
		.setDesc('Any changes you make to this settings page will be instantly reflected in the demonstration progress bar below.  Use it as a guide when making your decisions.')

		/************ Demo Progress Bar *************/
		const progressBarContainer = containerEl.createEl('div');
		progressBarContainer.addClass('progressBar-container');

		if (this.plugin.settings.APB_borderToggle) {
			progressBarContainer.style.border = '1px solid'+ this.plugin.settings.APB_colorBorder;
		} else {
			progressBarContainer.style.border = '0px';
		}

		if (this.plugin.settings.APB_backgroundToggle) {
			progressBarContainer.style.background = this.plugin.settings.APB_colorBackground;
		} else {
			progressBarContainer.style.background = 'transparent';
		}

		// DemoBar Text Container
		const progressBarTextContainer = containerEl.createEl('div');
		progressBarTextContainer.addClass('progressBar-text-container');

		// DemoBar BarBackground container
		const progressBarBackground = containerEl.createEl('div');
		progressBarBackground.addClass('progressBar-background');
		progressBarBackground.style.background = this.plugin.settings.APB_colorBarBackground;

		// DemoBar Title
		const progressBarTitle = containerEl.createEl('div');
		progressBarTitle.addClass('progressBar-title');
		if (this.plugin.settings.APB_titleToggle) {
			progressBarTitle.createEl('span', { text: this.plugin.settings.APB_title });
			progressBarTitle.style.color = this.plugin.settings.APB_titleColor;
		}

		// DemoBar Percentage
		const progressBarPercentage = containerEl.createEl('div');
		progressBarPercentage.addClass('progressBar-percentage');
		if (this.plugin.settings.APB_percentageToggle) {
			progressBarPercentage.createEl('span', { text: this.plugin.settings.APB_progressBarPercentage+'%' });
			progressBarPercentage.style.color = this.plugin.settings.APB_percentageColor;
		}

		// DemoBar Value
		const progressBarValue = containerEl.createEl('div');
		progressBarValue.addClass('progressBar-value');
		const valueFromPercentageOfTotal = Math.floor((this.plugin.settings.APB_total/100) * this.plugin.settings.APB_progressBarPercentage);
		if (this.plugin.settings.APB_fractionToggle) {
			progressBarValue.createEl('span', { text: '('+valueFromPercentageOfTotal+'/'+this.plugin.settings.APB_total+')' });
			progressBarValue.style.color = this.plugin.settings.APB_fractionColor;
		}

		// DemoBar Completed
		const completed = containerEl.createEl('div');
		completed.addClass('progressBar-completed');
		if (this.plugin.settings.APB_completedToggle) {
			completed.style.color = this.plugin.settings.APB_completedColor;

			if (this.plugin.settings.APB_progressBarPercentage == 100) {
				completed.textContent = 'COMPLETED';
			}
		}

		// DemoBar
		const progressbar = containerEl.createEl('div');
		progressbar.addClass('progressBar');

		const progressBarwidth: number = this.plugin.settings.APB_width;
		let numericWidth = parseInt(progressBarwidth.toString(), 10);

		// Ensure the width percentage is between 0 and 100
		const clampedPercentage = Math.min(Math.max(Math.round(this.plugin.settings.APB_progressBarPercentage), 0), 100);

		if (this.plugin.settings.APB_widthToggle) {
			progressBarContainer.style.width = '100%';
			progressBarBackground.style.width = '100%';
			progressbar.style.width = `${clampedPercentage}%`;
		} else {
			progressBarContainer.style.width = `${numericWidth}px`;
			progressBarBackground.style.width = `${String(numericWidth - 12)}px`; // -12 for 5px padding and for 1px border
			progressbar.style.width = `${((numericWidth - 12) / 100 * clampedPercentage)}px`; // -12 for 5px padding and for 1px border
		}

		progressBarContainer.style.margin = '17px';

		progressbar.style.height = `${this.plugin.settings.APB_height}px`;

		setEndCaps(progressBarBackground, progressbar, this.plugin.settings.APB_endcapToggle);
		progressBarBackground.appendChild(progressbar);

		progressbar.appendChild(completed);

		const marks = containerEl.createEl('div');
		marks.addClass('marks');

		const numberOfSections = parseInt(this.plugin.settings.APB_colornumber.replace(/\D/g, ''));

		// create required number of section marks if NOT completed
		if (this.plugin.settings.APB_progressBarPercentage !== 100) {
			progressBarBackground.appendChild(marks);

			if (this.plugin.settings.APB_marksToggle) {
				for (let i = 1; i <= (numberOfSections - 1); i++) {
					const mark = containerEl.createEl('div');
					mark.addClass('mark');
					mark.style.left = `${(i * (100/numberOfSections))}%`;
					marks.appendChild(mark);

					const dpr = window.devicePixelRatio || 1; // Get the device pixel ratio
					const adjustedBorderWidth = this.plugin.settings.APB_marksWidth / dpr; // use DPI to create correct pixel width

					const rgbaColor = hexToRgba(this.plugin.settings.APB_marksColor, 0.5);
					mark.style.borderLeft = adjustedBorderWidth + 'px solid ' + rgbaColor;	
				}
			}
		}

		// loop to set correct progress bar color
		for (let i = 1; i <= numberOfSections; i++) {
			let sectionsize = `${(i * (100/numberOfSections))}%`;

			const progressBarPercentage = parseFloat(this.plugin.settings.APB_progressBarPercentage.toString());
			const markLeftValue = parseFloat(sectionsize);

			if ((progressBarPercentage <= markLeftValue) && this.plugin.settings.APB_progressBarChange) {
				progressbar.style.backgroundColor = String(this.plugin.settings[`APB_color${i}` as keyof ObsidianProgressBarsSettings]);
				if (progressBarPercentage == 100) {
					progressbar.style.backgroundColor = this.plugin.settings.APB_colorBarCompleted;
				}
				this.plugin.settings.APB_progressBarChange = false;
				this.plugin.saveSettings();
			}
		}

		this.plugin.settings.APB_progressBarChange = true;
		this.plugin.saveSettings();

		const progresstext = containerEl.createEl('p', { text: 'This is a Demo Progress Bar.' });

		// Demo Container
		const containerprogress = containerEl.createEl('div');
		containerprogress.addClass('custom-container');
		containerprogress.appendChild(progresstext);

		progressBarContainer.appendChild(progressBarTextContainer);
			if (this.plugin.settings.APB_titleToggle) {
				progressBarTextContainer.appendChild(progressBarTitle);
			}
			if (this.plugin.settings.APB_percentageToggle) {
				progressBarTextContainer.appendChild(progressBarPercentage);
			}
			if (this.plugin.settings.APB_fractionToggle) {
				progressBarTextContainer.appendChild(progressBarValue);
			}

		containerprogress.appendChild(progressBarContainer);

		progressBarContainer.appendChild(progressBarBackground);


	/************ SECTION Progress Bar Appearance *************/
	containerEl.createEl('h4', { text: 'Progress Bar' });

	/************ Default Title *************/
	new Setting(containerEl)
		.setName('Default title')
		.setDesc(createFragment((frag) => {
            frag.appendText('Set the default title of a new progress bar. If you change this, the ');
            frag.createEl('span', {
                text: 'Title',
				cls: 'highlight-text'
            });
            frag.appendText(' will be automatically changed in the example code block at the top of the settings for easy copy and pasting later on.');
        }))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your title')
			.setValue(this.plugin.settings.APB_title || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.APB_title = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		})
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_title = DEFAULT_SETTINGS.APB_title as string;
				this.plugin.settings.APB_progressBarChange = true;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Default Total *************/
	let timeoutId: ReturnType<typeof setTimeout>;
	new Setting(containerEl)
	.setName('Default total')
	.setDesc(createFragment((frag) => {
		frag.appendText('Set the default ');
		frag.createEl('span', {
			text: 'Total',
			cls: 'highlight-text'
		});
		frag.appendText(' of a new progress bar. If you change this, the ');
		frag.createEl('span', {
			text: 'Total',
			cls: 'highlight-text'
		});
		frag.appendText(' will be automatically changed in the example code block above for easy copy and pasting later on.');
	}))
	.addText(text => text
		.setPlaceholder('100')
		.setValue (this.plugin.settings.APB_total !== undefined ? String(this.plugin.settings.APB_total) : String(DEFAULT_SETTINGS.APB_total))
		.onChange((value) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(async() => {
				const parsedValue = parseInt(value, 10);

				if (parsedValue >= 1 && (!isNaN(parsedValue) && parsedValue === parseFloat(value))) {
					this.plugin.settings.APB_total = parsedValue;
					await this.plugin.saveSettings();
					this.display();
				} else {						
					text.setValue(String(this.plugin.settings.APB_total ?? DEFAULT_SETTINGS.APB_total));

					await this.plugin.saveSettings();
					this.display();
					new Notice('Please enter a value 1 or above.');
				}
			}, 1000);
		})
		.inputEl.classList.add('custom-textbox')
	)
	.addButton((button) =>
		button.setIcon('rotate-ccw').setTooltip('Reset to default')
		.onClick(async() => {
			this.plugin.settings.APB_total = DEFAULT_SETTINGS.APB_total as number;
			this.plugin.settings.APB_progressBarChange = true;
			await this.plugin.saveSettings();
			this.display();
		})
	);

	/************ Progress Percentage *************/
	new Setting(containerEl)
		.setName('Progress percentage')
		.setDesc(createFragment((frag) => {
            frag.appendText('Set the percentage for the demonstration progress bar above. This will also update the ');
            frag.createEl('span', {
                text: 'Value',
				cls: 'highlight-text'
            });
            frag.appendText(' parameter in the Example Code at the top of the settings. Once you are satisfied with all other settings, you will likely want to set this back to 0.');
        }))
		.addSlider((slider) => {			
			slider
			.setLimits(0, 100, 1)
			.setDynamicTooltip()				
			.setValue(this.plugin.settings.APB_progressBarPercentage ?? DEFAULT_SETTINGS.APB_progressBarPercentage)
			.onChange(async(value) =>  {
				this.plugin.settings.APB_progressBarPercentage = value;
				this.plugin.settings.APB_progressBarChange = true;
				await this.plugin.saveSettings();
				this.display();							
			})
		})			
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {					
				this.plugin.settings.APB_progressBarPercentage = DEFAULT_SETTINGS.APB_progressBarPercentage as number;
				this.plugin.settings.APB_progressBarChange = true;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Full Width *************/
	new Setting(containerEl)
		.setName('Full width')
		.setDesc(createFragment((frag) => {
            frag.appendText('Toggle this on to set the progress bar to fill the entire width of its container. For a fixed width, toggle this off and use the ');
            frag.createEl('span', {
                text: 'Width',
				cls: 'highlight-text'
            });
            frag.appendText(' option that will appear below.');
        }))
		.addToggle((toggle) =>
			toggle.setValue(this.plugin.settings.APB_widthToggle)
			.onChange(async(value) => {
				this.plugin.settings.APB_widthToggle = value;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_widthToggle = DEFAULT_SETTINGS.APB_widthToggle as boolean;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	if (!this.plugin.settings.APB_widthToggle) {
		/************ Width *************/
		let timeoutId: ReturnType<typeof setTimeout>;
		new Setting(containerEl)
			.setName('Width')
			.setDesc('Set the width of the progress bar container in pixels (minimum 100). Note: If you want it to span the full width, make sure to enable the toggle above.')
			.addText(text => text
				.setPlaceholder('200')
				.setValue (this.plugin.settings.APB_width !== undefined ? String(this.plugin.settings.APB_width) : String(DEFAULT_SETTINGS.APB_width))
				.onChange((value) => {
					clearTimeout(timeoutId);
					timeoutId = setTimeout(async() => {
						const parsedValue = parseInt(value, 10);

						if (parsedValue >= 100 && (!isNaN(parsedValue) && parsedValue === parseFloat(value))) {
							this.plugin.settings.APB_width = parsedValue;
							await this.plugin.saveSettings();
							this.display();
						} else {						
							text.setValue(String(this.plugin.settings.APB_width ?? DEFAULT_SETTINGS.APB_width));

							await this.plugin.saveSettings();
							this.display();
							new Notice('Please enter a value 100 or above.');
						}
					}, 1000);
				})
				.inputEl.classList.add('custom-textbox')
			)
			.addButton((button) =>
				button.setIcon('rotate-ccw').setTooltip('Reset to default')
				.onClick(async() => {
					this.plugin.settings.APB_width = DEFAULT_SETTINGS.APB_width as number;
					await this.plugin.saveSettings();
					this.display();
				})
			);
	}

	/************ Height *************/
	new Setting(containerEl)
		.setName('Height')
		.setDesc('Set the height of the progress bar in pixels.  (See demonstration progress bar above)')
		.addSlider((slider) => {		
			slider
				.setLimits(1, 15, 1)
				.setDynamicTooltip()				
				.setValue(this.plugin.settings.APB_height ?? DEFAULT_SETTINGS.APB_height)
				.onChange(async(value) =>  {
					this.plugin.settings.APB_height = value;
					setEndCaps(progressBarBackground, progressbar, this.plugin.settings.APB_endcapToggle); 
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();				
				})
			})
			.addButton((button) =>
				button.setIcon('rotate-ccw').setTooltip('Reset to default')
				.onClick(async() => {
					this.plugin.settings.APB_height = DEFAULT_SETTINGS.APB_height as number;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();					
				})
			);
			
	/************ End Caps *************/
	new Setting(containerEl)
		.setName('Round end caps')
		.setDesc('When toggled, the progress bar will have either a round or square end cap.  (See demonstration progress bar above)')
		.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.APB_endcapToggle)
				.onChange(async(value) => {
					this.plugin.settings.APB_endcapToggle = value;
					setEndCaps(progressBarBackground, progressbar, this.plugin.settings.APB_endcapToggle); 
					await this.plugin.saveSettings();
					this.display();
				}))
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_endcapToggle = DEFAULT_SETTINGS.APB_endcapToggle as boolean;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ SECTION Marks Settings *************/
	containerEl.createEl('h4', { text: 'Section Marks' });

	/************ Bar Section Marks *************/
	new Setting(containerEl)
		.setName('Section marks')
		.setDesc(createFragment((frag) => {
            frag.appendText('When toggled on, the progress bar will have vertical section marks equally spaced along its length.  The number and spacing of these will change depending on how many colors your progress bar uses (see ');
            frag.createEl('span', {
                text: 'Number of colors',
				cls: 'highlight-text'
            });
            frag.appendText(' setting below). Note: if the bar reaches 100% or the bar has only one color, no marks will not be displayed.  (See demonstration progress bar above)');
        }))
		.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.APB_marksToggle)
				.onChange(async(value) => {
					this.plugin.settings.APB_marksToggle = value;
					await this.plugin.saveSettings();
					this.display();
				}))
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {				
				this.plugin.settings.APB_marksToggle = DEFAULT_SETTINGS.APB_marksToggle as boolean;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Section Mark Color *************/
	new Setting(containerEl)
	.setName('Section Mark color')
	.setDesc(createFragment((frag) => {
		frag.appendText('Select the color of the section ');
		frag.createEl('span', {
			text: 'Marks',
			cls: 'highlight-text'
		});
		frag.appendText('. Note: The color will be set to 50% transparency, allowing the progress bar\'s color to blend and influence the final appearance.');
	}))
	.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
		.setValue(this.plugin.settings.APB_marksColor)
		.onChange(async(value) => {
			this.plugin.settings.APB_marksColor = value;
			await this.plugin.saveSettings();
			this.display();
		}))
		.addButton((button) =>
			button.setIcon('sun').setTooltip('Reset to Light default')
			.onClick(async() => {
				this.plugin.settings.APB_marksColor = DEFAULT_SETTINGS.APB_marksLightColor as string;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('moon').setTooltip('Reset to Dark default')
			.onClick(async() => {
				this.plugin.settings.APB_marksColor = DEFAULT_SETTINGS.APB_marksColor as string;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Bar Section Mark Width *************/
	if (this.plugin.settings.APB_marksToggle) {
		new Setting(containerEl)
		.setName('Section mark width')
		.setDesc('Set the width of the section mark lines on the progress bar from a range of 1 to 5 pixels.  (See demonstration progress bar above)')
		.addSlider((slider) => {			
			slider
				.setLimits(1, 5, 1)
				.setDynamicTooltip()				
				.setValue(this.plugin.settings.APB_marksWidth ?? DEFAULT_SETTINGS.APB_marksWidth)
				.onChange(async(value) =>  {
					this.plugin.settings.APB_marksWidth = value;
					await this.plugin.saveSettings();
					this.display();							
				})
			})			
			.addButton((button) =>
				button.setIcon('rotate-ccw').setTooltip('Reset to default')
				.onClick(async() => {					
					this.plugin.settings.APB_marksWidth = DEFAULT_SETTINGS.APB_marksWidth as number;
					await this.plugin.saveSettings();
					this.display();
				})
			);
		}

	/************ SECTION Text Settings *************/
	containerEl.createEl('h4', { text: 'Text' });

	/************ Show Title *************/
	new Setting(containerEl)
		.setName('Show title text')
		.setDesc(createFragment((frag) => {
            frag.appendText('When toggled on, the ');
            frag.createEl('span', {
                text: 'Title',
				cls: 'highlight-text'
            });
            frag.appendText(' text will be displayed above the progress bar.  (See demonstration progress bar above)');
        }))
		.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.APB_titleToggle)
				.onChange(async(value) => {
					this.plugin.settings.APB_titleToggle = value;
					await this.plugin.saveSettings();
					this.display();
				}))
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_titleToggle = DEFAULT_SETTINGS.APB_titleToggle as boolean;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Title Color *************/
	new Setting(containerEl)
		.setName('Title text color')
		.setDesc(createFragment((frag) => {
            frag.appendText('Select the color of the ');
            frag.createEl('span', {
                text: 'Title',
				cls: 'highlight-text'
            });
            frag.appendText(' text.');
        }))
		.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
			.setValue(this.plugin.settings.APB_titleColor)
			.onChange(async(value) => {
				this.plugin.settings.APB_titleColor = value;
				await this.plugin.saveSettings();
				this.display();
			}))
			.addButton((button) =>
				button.setIcon('sun').setTooltip('Reset to Light default')
				.onClick(async() => {
					this.plugin.settings.APB_titleColor = DEFAULT_SETTINGS.APB_titleLightColor as string;
					await this.plugin.saveSettings();
					this.display();
				}))
			.addButton((button) =>
				button.setIcon('moon').setTooltip('Reset to Dark default')
				.onClick(async() => {
					this.plugin.settings.APB_titleColor = DEFAULT_SETTINGS.APB_titleColor as string;
					await this.plugin.saveSettings();
					this.display();
				})
			);

	/************ Show Percentage *************/
	new Setting(containerEl)
		.setName('Show percentage text')
		.setDesc(createFragment((frag) => {
            frag.appendText('When toggled on, the ');
            frag.createEl('span', {
                text: 'Percentage',
				cls: 'highlight-text'
            });
            frag.appendText(' text will be displayed above the progress bar.  (See demonstration progress bar above)');
        }))
		.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.APB_percentageToggle)
				.onChange(async(value) => {
					this.plugin.settings.APB_percentageToggle = value;
					await this.plugin.saveSettings();
					this.display();
				}))
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_percentageToggle = DEFAULT_SETTINGS.APB_percentageToggle as boolean;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Percentage Color *************/
	new Setting(containerEl)
		.setName('Percentage text color')
		.setDesc(createFragment((frag) => {
            frag.appendText('Select the color of the ');
            frag.createEl('span', {
                text: 'Percentage',
				cls: 'highlight-text'
            });
            frag.appendText(' text.');
        }))
		.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
			.setValue(this.plugin.settings.APB_percentageColor)
			.onChange(async(value) => {
				this.plugin.settings.APB_percentageColor = value;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('sun').setTooltip('Reset to Light default')
			.onClick(async() => {
				this.plugin.settings.APB_percentageColor = DEFAULT_SETTINGS.APB_percentageLightColor as string;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('moon').setTooltip('Reset to Dark default')
			.onClick(async() => {
				this.plugin.settings.APB_percentageColor = DEFAULT_SETTINGS.APB_percentageColor as string;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Show Fraction *************/
	new Setting(containerEl)
		.setName('Show fraction text (Value/Total)')
		.setDesc(createFragment((frag) => {
            frag.appendText('When toggled on, the fraction text ');
            frag.createEl('span', {
                text: '(Value/Total)',
				cls: 'highlight-text'
            });
            frag.appendText(' will be displayed above the progress bar.  (See demonstration progress bar above)');
        }))
		.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.APB_fractionToggle)
				.onChange(async(value) => {
					this.plugin.settings.APB_fractionToggle = value;
					await this.plugin.saveSettings();
					this.display();
				}))
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_fractionToggle = DEFAULT_SETTINGS.APB_fractionToggle as boolean;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Fraction Color *************/
	new Setting(containerEl)
		.setName('Fraction text color')
		.setDesc(createFragment((frag) => {
            frag.appendText('Select the color of the ');
            frag.createEl('span', {
                text: 'Fraction',
				cls: 'highlight-text'
            });
            frag.appendText(' text.');
        }))
		.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
			.setValue(this.plugin.settings.APB_fractionColor)
			.onChange(async(value) => {
				this.plugin.settings.APB_fractionColor = value;
				await this.plugin.saveSettings();
				this.display();
			}))
			.addButton((button) =>
				button.setIcon('sun').setTooltip('Reset to Light default')
				.onClick(async() => {
					this.plugin.settings.APB_fractionColor = DEFAULT_SETTINGS.APB_fractionLightColor as string;
					await this.plugin.saveSettings();
					this.display();
				}))
			.addButton((button) =>
				button.setIcon('moon').setTooltip('Reset to Dark default')
				.onClick(async() => {
					this.plugin.settings.APB_fractionColor = DEFAULT_SETTINGS.APB_fractionColor as string;
					await this.plugin.saveSettings();
					this.display();
				})
			);

	/************ Show Completed *************/
	new Setting(containerEl)
	.setName('Show completed text')
	.setDesc('When toggled on, the word COMPLETED will be displayed on the progress bar when it reaches 100%.  (See demonstration progress bar above)')
	.addToggle((toggle) =>
			toggle.setValue(this.plugin.settings.APB_completedToggle)
			.onChange(async(value) => {
				this.plugin.settings.APB_completedToggle = value;
				await this.plugin.saveSettings();
				this.display();
			}))
	.addButton((button) =>
		button.setIcon('rotate-ccw').setTooltip('Reset to default')
		.onClick(async() => {
			this.plugin.settings.APB_completedToggle = DEFAULT_SETTINGS.APB_completedToggle as boolean;
			await this.plugin.saveSettings();
			this.display();
		})
	);

	/************ Completed Color *************/
	new Setting(containerEl)
	.setName('Completed text color')
	.setDesc(createFragment((frag) => {
		frag.appendText('Select the color of the ');
		frag.createEl('span', {
			text: 'Completed',
			cls: 'highlight-text'
		});
		frag.appendText(' text.');
	}))
	.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
		.setValue(this.plugin.settings.APB_completedColor)
		.onChange(async(value) => {
			this.plugin.settings.APB_completedColor = value;
			await this.plugin.saveSettings();
			this.display();
		}))
		.addButton((button) =>
			button.setIcon('sun').setTooltip('Reset to Light default')
			.onClick(async() => {
				this.plugin.settings.APB_completedColor = DEFAULT_SETTINGS.APB_completedLightColor as string;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('moon').setTooltip('Reset to Dark default')
			.onClick(async() => {
				this.plugin.settings.APB_completedColor = DEFAULT_SETTINGS.APB_completedColor as string;
				await this.plugin.saveSettings();
				this.display();
			})
		);


	/************ SECTION Border & Background *************/	
	containerEl.createEl('h4', { text: 'Progress Bar Container' });

	/************ Border *************/
	new Setting(containerEl)
		.setName('Border')
		.setDesc('When toggled on, a border will be displayed around the progress bar container.')
		.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.APB_borderToggle)
				.onChange(async(value) => {
					this.plugin.settings.APB_borderToggle = value;
					await this.plugin.saveSettings();
					this.display();
				}))
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_borderToggle = DEFAULT_SETTINGS.APB_borderToggle as boolean;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Border Color *************/
	new Setting(containerEl)
		.setName('Border color')
		.setDesc('Select the color of the border around the progress bar container.')
		.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
			.setValue(this.plugin.settings.APB_colorBorder)
			.onChange(async(value) => {
				this.plugin.settings.APB_colorBorder = value;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('sun').setTooltip('Reset to Light default')
			.onClick(async() => {
				this.plugin.settings.APB_colorBorder = DEFAULT_SETTINGS.APB_colorLightBorder as string;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('moon').setTooltip('Reset to Dark default')
			.onClick(async() => {
				this.plugin.settings.APB_colorBorder = DEFAULT_SETTINGS.APB_colorBorder as string;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Background *************/
	new Setting(containerEl)
		.setName('Background')
		.setDesc('When toggled on, the background of the progress bar container will show.')
		.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.APB_backgroundToggle)
				.onChange(async(value) => {
					this.plugin.settings.APB_backgroundToggle = value;
					await this.plugin.saveSettings();
					this.display();
				}))
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_backgroundToggle = DEFAULT_SETTINGS.APB_backgroundToggle as boolean;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ Background Color *************/
	new Setting(containerEl)
		.setName('Background color')
		.setDesc('Select the background color of the progress bar container.')
		.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
			.setValue(this.plugin.settings.APB_colorBackground)
			.onChange(async(value) => {
				this.plugin.settings.APB_colorBackground = value;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('sun').setTooltip('Reset to Light default')
			.onClick(async() => {
				this.plugin.settings.APB_colorBackground = DEFAULT_SETTINGS.APB_colorLightBackground as string;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('moon').setTooltip('Reset to Dark default')
			.onClick(async() => {
				this.plugin.settings.APB_colorBackground = DEFAULT_SETTINGS.APB_colorBackground as string;
				await this.plugin.saveSettings();
				this.display();
			})
		);
		
	/************ SECTION Progress Bar Color Options *************/
	containerEl.createEl('h4', { text: 'Progress Bar Color' });

	/************ Number of Colors Dropdown *************/
	new Setting(this.containerEl)
		.setName('Number of colors')
		.setDesc('Select how many different colors you want the progress bar to use.  Each color will be used for the entire bar depending on its percentage completed.  (See demonstration progress bar above)')
		.addDropdown((dropdown) => {
			dropdown
				.addOptions({
					option1: '1 color',
					option2: '2 colors',
					option3: '3 colors',
					option4: '4 colors',
					option5: '5 colors'
				})
				.setValue(this.plugin.settings.APB_colornumber)
				.onChange(async(value) => {
					this.plugin.settings.APB_colornumber = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				});
		})
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {
				this.plugin.settings.APB_colornumber = DEFAULT_SETTINGS.APB_colornumber as string;
				this.plugin.settings.APB_progressBarChange = true;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	/************ 1st Color *************/
	new Setting(containerEl)
		.setName('1st color')
		.setDesc('This color will be used for the entire progrees bar if the percentage is within the first section.')
		.addColorPicker((PBcolorpicker1) =>	PBcolorpicker1
			.setValue(this.plugin.settings.APB_color1)
			.onChange(async(value) => {
				this.plugin.settings.APB_color1 = value;
				await this.plugin.saveSettings();
				this.display();
			})
		)
		.addButton((button) =>
			button.setIcon('sun').setTooltip('Reset to Light default')
			.onClick(async() => {
				this.plugin.settings.APB_color1 = DEFAULT_SETTINGS.APB_color1Light as string;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('moon').setTooltip('Reset to Dark default')
			.onClick(async() => {
				this.plugin.settings.APB_color1 = DEFAULT_SETTINGS.APB_color1 as string;
				await this.plugin.saveSettings();
				this.display();
			})
		);

	if (this.plugin.settings.APB_colornumber !== 'option1') {
		/************ 2nd Color *************/
		new Setting(containerEl)
			.setName('2nd color')
			.setDesc('This color will be used for the entire progrees bar if the percentage is within the second section.')
			.addColorPicker((PBcolorpicker2) =>	PBcolorpicker2
				.setValue(this.plugin.settings.APB_color2)
				.onChange(async(value) => {
					this.plugin.settings.APB_color2 = value;
					await this.plugin.saveSettings();
					this.display();
				}))
			.addButton((button) =>
				button.setIcon('sun').setTooltip('Reset to Light default')
				.onClick(async() => {
					this.plugin.settings.APB_color2 = DEFAULT_SETTINGS.APB_color2Light as string;
					await this.plugin.saveSettings();
					this.display();
				}))
			.addButton((button) =>
				button.setIcon('moon').setTooltip('Reset to Dark default')
				.onClick(async() => {
					this.plugin.settings.APB_color2 = DEFAULT_SETTINGS.APB_color2 as string;
					await this.plugin.saveSettings();
					this.display();
				})
			);

		if (this.plugin.settings.APB_colornumber !== 'option2') {
			/************ 3rd Color *************/
			new Setting(containerEl)
				.setName('3rd color')
				.setDesc('This color will be used for the entire progrees bar if the percentage is within the third section.')
				.addColorPicker((PBcolorpicker3) =>	PBcolorpicker3
					.setValue(this.plugin.settings.APB_color3)
					.onChange(async(value) => {
						this.plugin.settings.APB_color3 = value;
						await this.plugin.saveSettings();
						this.display();
					}))
				.addButton((button) =>
					button.setIcon('sun').setTooltip('Reset to Light default')
					.onClick(async() => {
						this.plugin.settings.APB_color3 = DEFAULT_SETTINGS.APB_color3Light as string;
						await this.plugin.saveSettings();
						this.display();
					}))
				.addButton((button) =>
					button.setIcon('moon').setTooltip('Reset to Dark default')
					.onClick(async() => {
						this.plugin.settings.APB_color3 = DEFAULT_SETTINGS.APB_color3 as string;
						await this.plugin.saveSettings();
						this.display();
					})
				);
	
			if (this.plugin.settings.APB_colornumber !== 'option3') {
				/************ 4th Color *************/
				new Setting(containerEl)
					.setName('4th color')
					.setDesc('This color will be used for the entire progrees bar if the percentage is within the fourth section.')
					.addColorPicker((PBcolorpicker4) =>	PBcolorpicker4
						.setValue(this.plugin.settings.APB_color4)
						.onChange(async(value) => {
							this.plugin.settings.APB_color4 = value;
							await this.plugin.saveSettings();
							this.display();
						}))
					.addButton((button) =>
						button.setIcon('sun').setTooltip('Reset to Light default')
						.onClick(async() => {
							this.plugin.settings.APB_color4 = DEFAULT_SETTINGS.APB_color4Light as string;
							await this.plugin.saveSettings();
							this.display();
						}))
					.addButton((button) =>
						button.setIcon('moon').setTooltip('Reset to Dark default')
						.onClick(async() => {
							this.plugin.settings.APB_color4 = DEFAULT_SETTINGS.APB_color4 as string;
							await this.plugin.saveSettings();
							this.display();
						})
					);

				if (this.plugin.settings.APB_colornumber !== 'option4') {
					/************ 5th Color *************/
					new Setting(containerEl)
						.setName('5th color')
						.setDesc('This color will be used for the entire progrees bar if the percentage is within the fifth section.')
						.addColorPicker((PBcolorpicker5) =>	PBcolorpicker5
							.setValue(this.plugin.settings.APB_color5)
							.onChange(async(value) => {
								this.plugin.settings.APB_color5 = value;
								await this.plugin.saveSettings();
								this.display();
							}))
						.addButton((button) =>
							button.setIcon('sun').setTooltip('Reset to Light default')
							.onClick(async() => {
								this.plugin.settings.APB_color5 = DEFAULT_SETTINGS.APB_color5Light as string;
								await this.plugin.saveSettings();
								this.display();
							}))
						.addButton((button) =>
							button.setIcon('moon').setTooltip('Reset to Dark default')
							.onClick(async() => {
								this.plugin.settings.APB_color5 = DEFAULT_SETTINGS.APB_color5 as string;
								await this.plugin.saveSettings();
								this.display();
							})
						);
					}
				}
			}
		}

	/************ Completed Color *************/
	new Setting(containerEl)
		.setName('Completed color')
		.setDesc('Select the color the entire progress bar will use when it reaches 100% completion.')
		.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
			.setValue(this.plugin.settings.APB_colorBarCompleted)
			.onChange(async(value) => {
				this.plugin.settings.APB_colorBarCompleted = value;
				await this.plugin.saveSettings();
				this.display();
			}))
			.addButton((button) =>
				button.setIcon('sun').setTooltip('Reset to Light default')
				.onClick(async() => {
					this.plugin.settings.APB_colorBarCompleted = DEFAULT_SETTINGS.APB_colorLightBarCompleted as string;
					await this.plugin.saveSettings();
					this.display();
				}))
			.addButton((button) =>
				button.setIcon('moon').setTooltip('Reset to Dark default')
				.onClick(async() => {
					this.plugin.settings.APB_colorBarCompleted = DEFAULT_SETTINGS.APB_colorBarCompleted as string;
					await this.plugin.saveSettings();
					this.display();
				})
			);

	/************ Bar Background Color *************/
	new Setting(containerEl)
		.setName('Bar background color')
		.setDesc('This color will be used for the progress bar\'s background, representing the remaining percentage.')
		.addColorPicker((PBcolorpicker0) =>	PBcolorpicker0
			.setValue(this.plugin.settings.APB_colorBarBackground)
			.onChange(async(value) => {
				this.plugin.settings.APB_colorBarBackground = value;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('sun').setTooltip('Reset to Light default')
			.onClick(async() => {
				this.plugin.settings.APB_colorBarBackground = DEFAULT_SETTINGS.APB_colorLightBarBackground as string;
				await this.plugin.saveSettings();
				this.display();
			}))
		.addButton((button) =>
			button.setIcon('moon').setTooltip('Reset to Dark default')
			.onClick(async() => {
				this.plugin.settings.APB_colorBarBackground = DEFAULT_SETTINGS.APB_colorBarBackground as string;
				await this.plugin.saveSettings();
				this.display();
			})
		);	
	
    }
}

/************ setEndCaps Function *************/
function setEndCaps(progressBarBackground: HTMLElement | null, progressbar: HTMLElement | null, endCap: boolean) {
	if (progressBarBackground && progressbar) {
		if (endCap) {
			progressBarBackground.style.borderRadius = '7px';
			progressbar.style.borderRadius = '7px';
		} else {
			progressBarBackground.style.borderRadius = '0px';
			progressbar.style.borderRadius = '0px';
		}
	} else {
		console.error('Elements are not defined');
	}
}

/************ hexToRGBA Function *************/
function hexToRgba(hex: string, alpha: number = 1): string {
    hex = hex.replace('#', '');

    // If hex is 3 characters, expand to 6 (e.g., #F00 => #FF0000)
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Convert hex to RGB values
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Return the RGBA string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}