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
	APB_autoMarksToggle: boolean;
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
	APB_gradientToggle: boolean;
	APB_gradientPrimary: string;
	APB_gradientPrimaryLight: string;
	APB_gradientSecondary: string;
	APB_gradientSecondaryLight: string;
	APB_manualMarks: number;
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
	APB_overageToggle: boolean;
	APB_overageColor: string;
	APB_overageLightColor: string;
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
	APB_autoMarksToggle: true,
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
	APB_gradientToggle: false,
	APB_gradientPrimary: '#2978ef',
	APB_gradientPrimaryLight: '#e60076',
	APB_gradientSecondary: '#00bc7d',
	APB_gradientSecondaryLight: '#ffd230',
	APB_manualMarks: 3,
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
	APB_overageToggle: false,
	APB_overageColor: '#38edef',
	APB_overageLightColor: '#d33411',
}
// Loading and saving of settings
export default class ObsidianProgressBars extends Plugin {
	settings: ObsidianProgressBarsSettings;
	settingsTab: ObsidianProgressBarsSettingTab;
  
	copyButtonListener: (event: MouseEvent) => void;

	async onload() {
		await this.loadSettings();
	
		this.settingsTab = new ObsidianProgressBarsSettingTab(this.app, this);
        this.addSettingTab(this.settingsTab);
	
		this.app.workspace.onLayoutReady(this.initializeProgressBars.bind(this));
	}
  
	initializeProgressBars() {
		this.registerMarkdownCodeBlockProcessor('apb', (source, el, ctx) => {

			// Split the source string into rows
			const rows = source.trim().split('\n');
			el.empty(); // Clear the default rendering

			// Loop through each line
			rows.forEach((row, index) => {
				// Use regex to extract the label and progress (Value/Total)
				const match = row.match(/^(.+):\s*(\d+)\/(\d+)$/);		

				if (!match) {
					// console.error('Invalid format for advanced progress bar block:', row);

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

				if (!this.settings.APB_overageToggle) {
					// Check if current value is too large or total is not zero
					if (current > total && total !== 0) {
						// console.error('Invalid value for advanced progress bar block:', row);

						const APB_errorContainer = document.createElement('div');
						APB_errorContainer.addClass('error-container');

						const APB_errorMessage = document.createElement('div');
						APB_errorMessage.addClass('error-text-container');
						APB_errorMessage.createEl('span', { text: 'APB_ Error: Value is too large' });

						APB_errorContainer.appendChild(APB_errorMessage);
						el.appendChild(APB_errorContainer);

						return;
					}
				}
		
				// Check if parsing was successful and that total is zero
				if (isNaN(current) || isNaN(total) || total === 0) {
					// console.error('Invalid advanced progress bar values:', row);	

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
				const overage = Math.round(percentage - 100);
		
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
				const APB_background = document.createElement('div');
				APB_background.addClass('progressBar-background');
				APB_background.style.background = this.settings.APB_colorBarBackground;

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
					if(this.settings.APB_overageToggle && overage > 0) {
						APB_percentage.createEl('span', { text: (overage+100)+'%' });
						APB_percentage.style.color = this.settings.APB_overageColor;
					} else {
						APB_percentage.createEl('span', { text: clampedPercentage+'%' });
						APB_percentage.style.color = this.settings.APB_percentageColor;
					}
					
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
					APB_background.style.width = '100%';
					APB.style.width = `${clampedPercentage}%`;
				} else {
					APB_background.style.width = `${progressBarwidth}px`;
					APB_container.style.width = `${numericWidth + 10}px`;
					APB.style.width = `${numericWidth / 100 * clampedPercentage}px`;
				}
								
				APB.style.height = `${this.settings.APB_height}px`;
		
				this.settingsTab.setEndCaps(APB_background, APB, this.settings.APB_endcapToggle);
				APB_background.appendChild(APB);
		
				const marks = document.createElement('div');
				marks.addClass('marks');

				var numberOfColors = parseInt(this.settings.APB_colornumber.replace(/\D/g, ''));
				var numberOfSections;

				if (this.settings.APB_autoMarksToggle){
					numberOfSections = numberOfColors;
				} else {
					numberOfSections = this.settings.APB_manualMarks + 1;
				}

				// create required number of section marks if NOT completed
				if (clampedPercentage !== 100) {
					if (this.settings.APB_marksToggle) {
						for (let i = 1; i <= (numberOfSections - 1); i++) {			
							const mark = document.createElement('div');
							mark.addClass('mark');
							mark.style.left = `${(i * (100/numberOfSections))}%`;
							marks.appendChild(mark);											
						
							const dpr = window.devicePixelRatio || 1; // Get the device pixel ratio
							const adjustedBorderWidth = this.settings.APB_marksWidth / dpr; // use DPI to create correct pixel width 

							const rgbaColor = this.settingsTab.hexToRgba(this.settings.APB_marksColor, 0.5);
							mark.style.borderLeft = adjustedBorderWidth + 'px solid ' + rgbaColor;	
						}
					}
					APB_background.appendChild(marks);
				}

				APB.appendChild(APB_completed);

				// loop to set correct progress bar color
				for (let i = 1; i <= numberOfColors; i++) {
					let sectionsize = `${(i * (100/numberOfColors))}%`;
					
					const markLeftValue = parseFloat(sectionsize);
					
					if ((clampedPercentage <= markLeftValue) && this.settings.APB_progressBarChange) {
						APB.style.backgroundColor = String(this.settings[`APB_color${i}` as keyof ObsidianProgressBarsSettings]);

						if (this.settings.APB_gradientToggle && clampedPercentage < 100) {
							APB.style.backgroundImage = String('linear-gradient(to right,'+ this.settings.APB_gradientPrimary + ','+ this.settings.APB_gradientSecondary +')');
						}
	
						if (clampedPercentage == 100) {
							APB.style.backgroundColor = this.settings.APB_colorBarCompleted;
							if (this.settings.APB_completedToggle) {
								APB_completed.addClass('progressBar-completed');
								APB_completed.style.color = this.settings.APB_completedColor;

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

				APB_container.appendChild(APB_background);

				el.appendChild(APB_container);
		  });
		});

		// Register a custom command to paste text
        this.addCommand({
            id: 'paste-code-block',
            name: 'Paste code block',

			editorCallback: async (editor, view) => {
				editor.focus();
				// Ensure editor is valid
				if (!editor) {
				  new Notice("No active editor found!");
				  return;
				}

				// Construct the code block text
				const valueFromPercentageOfTotal = Math.floor((this.settings.APB_total/100) * this.settings.APB_progressBarPercentage);
				const codeBlockText = `\`\`\`apb\n${this.settings.APB_title}: ${valueFromPercentageOfTotal}/${this.settings.APB_total}\n\`\`\``;

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
		const copyButton = document.querySelector('#copypastebutton');
		if (copyButton) {
			// Remove the event listener to clean up resources
			copyButton.removeEventListener('click', this.copyButtonListener);
		} else {
			// Button not found
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
		this.display(); 
	}

	display(): void {
        this.containerEl.empty();
        this.createSettingsUI(this.containerEl);
    }

	// create the UI for the settings
	createSettingsUI(containerEl: HTMLElement ): void {

		const paragraph = containerEl.createEl('p', { text: 'If you find value in this plugin and would like to support us, please consider using our ' });

		// Create Ko-Fi link
		var link = 'https://ko-fi.com/cactuzhead';

		paragraph.createEl('a', {
			href: link,
			text: 'ko-fi',
			cls: 'custom-link'
		});

		const container = containerEl.createEl('div');
		container.addClass('custom-container');
		container.appendChild(paragraph);
		
		const koFiLink = container.createEl('a');
		koFiLink.target = '_blank';

		// Ko-Fi logo
		var parser = new DOMParser();
		var kofiLogo = '<svg width=\"80\" height=\"22\" viewBox=\"0 0 80 22\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\"><g transform=\"matrix(0.108521,0,0,0.108521,-0.00522351,0.26727)\"><clipPath id=\"_clip1\"><rect x=\"-0.006\" y=\"0.3\" width=\"737.184\" height=\"200.806\"/></clipPath><g clip-path=\"url(#_clip1)\"><defs><mask id=\"Mask\"><g transform=\"matrix(9.2148,-0,-0,9.2148,0.0481336,-2.46284)\"><image id=\"_Image2\" width=\"80px\" height=\"22px\" xlink:href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAWCAAAAABye0QAAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAMUlEQVQ4jWNcKcxATfCE8akkVQ28xcLISFUDGZmoahwDA8OogaMGjho4auCogUPFQAC80QOoo1cvEAAAAABJRU5ErkJggg==\"/></g></mask></defs><g mask=\"url(#Mask)\"><path d=\"M345.948,199.597C333.351,199.597 320.101,192.881 308.601,181.463C308.164,182.224 307.701,182.96 307.225,183.671C302.379,190.933 293.043,199.597 276.038,199.597C264.399,199.597 248.713,195.081 240.055,173.567C234.251,159.149 231.549,137.051 231.549,104.018C231.549,75.038 234.892,51.931 241.482,35.345C245.294,25.742 250.299,18.143 256.35,12.758C263.454,6.441 272.112,3.098 281.378,3.098C293.607,3.098 304.098,8.616 310.917,18.638C311.957,20.173 312.908,21.803 313.764,23.528C327.326,9.942 341.121,3.092 354.999,3.092C373.279,3.092 385.084,15.72 385.084,35.269C385.084,46.305 379.97,59.117 369.879,73.338C364.063,81.533 356.826,89.924 348.593,98.024C363.72,120.871 377.649,149.261 377.649,167.179C377.649,175.844 374.402,183.963 368.496,190.039C362.515,196.198 354.504,199.591 345.935,199.591L345.948,199.597Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M369.867,35.269C369.867,25.977 366.15,18.315 355.006,18.315C342.929,18.315 325.049,26.91 303.217,62.207C303.914,58.027 304.143,54.076 304.143,50.365C304.143,31.318 296.246,18.315 281.385,18.315C258.855,18.315 246.779,50.131 246.779,104.013C246.779,167.187 256.762,184.369 276.044,184.369C292.301,184.369 300.66,173.218 301.593,144.657C313.207,169.971 332.019,184.369 345.954,184.369C355.012,184.369 362.446,176.935 362.446,167.18C362.446,152.782 347.813,121.893 328.537,95.881C350.604,76.605 369.879,51.754 369.879,35.263L369.867,35.269Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M695.015,83.124C672.151,83.124 653.549,64.241 653.549,41.027C653.549,29.921 657.78,19.633 665.451,12.059C673.142,4.473 683.639,0.3 695.015,0.3C706.396,0.3 717.069,4.442 724.879,11.958C732.811,19.595 737.177,29.997 737.177,41.255C737.177,64.343 718.264,83.124 695.015,83.124Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M695.016,67.902C709.879,67.902 721.954,55.832 721.954,41.256C721.954,26.68 710.578,15.523 695.016,15.523C679.458,15.523 668.769,26.68 668.769,41.028C668.769,55.375 680.384,67.902 695.016,67.902Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M691.999,200.862C677.025,200.862 664.762,193.416 657.486,179.906C651.558,168.888 648.67,153.627 648.67,133.261C648.67,112.894 651.569,97.659 657.532,86.641C664.935,72.96 677.505,65.425 692.924,65.425C708.344,65.425 719.501,72.078 726.574,84.662C732.54,95.28 735.32,110.141 735.32,131.434C735.32,152.727 732.498,168.349 726.689,179.493C719.509,193.27 707.184,200.862 691.999,200.862Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M692.924,80.654C672.951,80.654 663.894,98.42 663.894,133.261C663.894,168.102 673.185,185.64 691.999,185.64C710.812,185.64 720.104,168.559 720.104,131.441C720.104,94.323 711.047,80.654 692.932,80.654L692.924,80.654Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M597.708,200.865C582.396,200.865 571.631,193.92 565.725,180.226C561.94,171.447 559.966,159.681 559.275,140.983C554.353,138.896 550.275,136.194 546.95,132.826C540.627,126.42 537.424,118.06 537.424,107.981C537.424,97.281 540.496,88.515 546.551,81.931C549.838,78.361 553.923,75.5 558.887,73.312C559.77,51.791 566.578,33.701 578.711,20.787C591.124,7.575 608.831,0.3 628.597,0.3C642.753,0.3 655.044,4.105 664.139,11.298C673.8,18.941 679.121,29.743 679.121,41.712C679.121,57.582 670.782,70.191 657.317,76.623C665.706,82.084 672.152,91.046 672.152,105.932C672.152,119.328 667.514,129.61 658.369,136.505C653.047,140.513 646.405,143.272 637.616,145.036C636.468,161.248 634.019,172.57 629.96,180.885C623.567,193.958 612.418,200.865 597.708,200.865Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M663.892,41.713C663.892,27.365 651.118,15.523 628.588,15.523C597.934,15.523 574.01,36.473 574.01,78.152L574.01,84.526C559.147,87.489 552.639,94.32 552.639,107.982C552.639,119.824 559.143,126.655 574.236,129.617C574.701,173.801 580.51,185.643 597.692,185.643C614.873,185.643 621.846,173.116 623.006,131.672C647.624,129.624 656.916,122.792 656.916,105.94C656.916,90.907 647.624,84.761 623.006,82.941C622.771,74.74 622.771,68.822 622.545,64.496C626.261,65.409 631.138,66.088 635.319,66.088C652.969,66.088 663.885,56.295 663.885,41.719L663.892,41.713Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M418.638,199.597C398.105,199.597 379.287,190.927 365.65,175.184C352.565,160.082 345.353,139.588 345.353,117.49C345.353,95.392 352.539,75.704 365.586,61.477C378.957,46.895 397.801,38.859 418.638,38.859C439.475,38.859 458.354,46.781 471.65,61.166C484.912,75.52 491.923,94.992 491.923,117.484C491.923,139.975 484.716,160.075 471.623,175.178C457.982,190.92 439.164,199.591 418.638,199.591L418.638,199.597Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M418.639,54.082C384.494,54.082 360.576,80.094 360.576,117.484C360.576,154.875 385.427,184.369 418.639,184.369C451.85,184.369 476.7,155.573 476.7,117.484C476.7,79.396 452.78,54.082 418.639,54.082ZM416.089,131.654C408.89,131.654 403.55,125.153 403.55,117.256C403.55,110.057 408.89,104.247 416.089,104.247C423.288,104.247 428.399,110.05 428.399,117.256C428.399,125.153 423.058,131.654 416.089,131.654Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M511.712,143.855C498.455,143.855 488.921,141.363 481.703,136.009C472.868,129.451 468.384,119.309 468.384,105.875C468.384,90.138 475.456,81.461 481.388,76.952C489.094,71.091 499.395,68.357 513.797,68.357C528.203,68.357 538.846,70.894 546.621,76.337C553.106,80.878 560.839,89.809 560.839,106.573C560.839,123.337 552.63,132.337 545.742,136.669C537.844,141.642 527.347,143.855 511.705,143.855L511.712,143.855Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M513.797,83.581C492.2,83.581 483.607,90.78 483.607,105.876C483.607,123.293 493.363,128.634 511.712,128.634C535.632,128.634 545.619,123.059 545.619,106.568C545.619,90.076 535.636,83.575 513.805,83.575L513.797,83.581Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M96.246,197.935C61.202,197.935 32.697,182.263 15.991,153.803C1.199,128.856 -0.006,101.836 -0.006,71.644C-0.006,53.745 5.379,38.161 15.559,26.573C24.915,15.929 38.171,9.035 52.893,7.157C70.367,4.944 92.091,4.76 114.678,4.76C151.434,4.76 161.817,5.21 176.279,6.656C195.517,8.565 211.704,15.746 223.082,27.423C234.639,39.283 240.747,55.121 240.747,73.243L240.747,76.884C240.747,107.805 220.076,133.683 191.267,140.717C189.117,145.792 186.453,150.84 183.301,155.813L183.218,155.94C173.07,171.626 149.214,197.942 103.521,197.942L96.24,197.942L96.246,197.935Z\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M174.77,21.798C161.114,20.434 151.555,19.977 114.684,19.977C91.013,19.977 70.983,20.206 54.828,22.254C33.434,24.988 15.223,41.372 15.223,71.646C15.223,101.92 16.815,125.362 29.108,146.072C42.992,169.743 66.207,182.714 96.253,182.714L103.534,182.714C140.404,182.714 160.435,163.14 170.45,147.664C174.776,140.833 177.96,134.008 180.009,127.177C206.185,124.9 225.531,103.277 225.531,76.878L225.531,73.238C225.531,44.79 206.871,24.988 174.776,21.798L174.77,21.798Z\" style=\"fill:white;fill-rule:nonzero;\"/><rect x=\"648.67\" y=\"58.671\" width=\"34.387\" height=\"24.363\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M668.769,41.028C668.769,55.832 680.384,67.902 695.016,67.902C709.648,67.902 721.954,55.832 721.954,41.256C721.954,26.68 710.578,15.523 695.016,15.523C679.458,15.523 668.769,26.68 668.769,41.028ZM663.893,133.264C663.893,168.562 673.185,185.643 691.998,185.643C710.812,185.643 720.103,168.562 720.103,131.444C720.103,94.326 711.046,80.657 692.931,80.657C672.958,80.657 663.901,98.423 663.901,133.264M552.647,107.982C552.647,119.824 559.148,126.655 574.245,129.617C574.705,173.801 580.518,185.643 597.7,185.643C614.882,185.643 621.854,173.116 623.014,131.672C647.629,129.624 656.921,122.792 656.921,105.94C656.921,90.907 647.629,84.761 623.014,82.941C622.78,74.74 622.78,68.822 622.549,64.496C626.266,65.409 631.146,66.088 635.323,66.088C652.977,66.088 663.893,56.295 663.893,41.719C663.893,27.143 651.119,15.53 628.589,15.53C597.934,15.53 574.01,36.48 574.01,78.158L574.01,84.533C559.148,87.495 552.64,94.326 552.64,107.988M483.606,105.876C483.606,123.293 493.362,128.634 511.711,128.634C535.631,128.634 545.617,123.059 545.617,106.567C545.617,90.076 535.631,83.575 513.803,83.575C491.98,83.575 483.613,90.774 483.613,105.87M403.541,117.255C403.541,110.056 408.881,104.246 416.08,104.246C423.279,104.246 428.394,110.05 428.394,117.255C428.394,125.152 423.053,131.653 416.08,131.653C409.108,131.653 403.541,125.152 403.541,117.255ZM360.575,117.49C360.575,155.578 385.426,184.374 418.637,184.374C451.849,184.374 476.698,155.578 476.698,117.49C476.698,79.401 452.778,54.087 418.637,54.087C384.493,54.087 360.575,80.099 360.575,117.49ZM281.379,18.314C258.849,18.314 246.773,50.129 246.773,104.011C246.773,167.185 256.762,184.368 276.038,184.368C292.295,184.368 300.655,173.218 301.587,144.656C313.201,169.97 332.013,184.368 345.948,184.368C355.006,184.368 362.439,176.934 362.439,167.179C362.439,152.781 347.807,121.892 328.531,95.88C350.598,76.604 369.873,51.753 369.873,35.262C369.873,25.97 366.156,18.308 355.012,18.308C342.936,18.308 325.055,26.902 303.223,62.2C303.921,58.02 304.149,54.068 304.149,50.358C304.149,31.31 296.253,18.308 281.391,18.308\" style=\"fill:rgb(32,32,32);fill-rule:nonzero;\"/><path d=\"M15.218,71.646C15.218,41.372 33.428,24.988 54.822,22.254C70.984,20.206 91.014,19.977 114.679,19.977C151.55,19.977 161.108,20.434 174.764,21.798C206.859,24.982 225.519,44.784 225.519,73.238L225.519,76.878C225.519,103.283 206.174,124.906 179.997,127.177C177.948,134.008 174.764,140.833 170.439,147.664C160.423,163.14 140.393,182.714 103.522,182.714L96.241,182.714C66.195,182.714 42.98,169.743 29.096,146.072C16.804,125.362 15.212,102.37 15.212,71.646\" style=\"fill:rgb(32,32,32);fill-rule:nonzero;\"/><path d=\"M32.285,71.872C32.285,101.233 34.105,120.121 43.664,137.647C54.586,157.905 74.388,165.644 96.924,165.644L103.977,165.644C133.567,165.644 147.907,151.303 155.874,138.788C159.743,132.414 163.156,125.361 164.976,116.481L166.34,110.791L174.535,110.791C192.745,110.791 208.449,96 208.449,77.105L208.449,73.692C208.449,52.527 195.25,41.369 172.258,38.642C159.287,37.507 151.548,37.05 114.672,37.05C89.865,37.05 72.112,37.278 58.684,39.327C39.795,42.061 32.279,52.755 32.279,71.872\" style=\"fill:white;fill-rule:nonzero;\"/><path d=\"M166.348,87.575C166.348,90.308 168.397,92.357 172.037,92.357C183.645,92.357 190.019,85.754 190.019,74.832C190.019,63.91 183.645,57.079 172.037,57.079C168.397,57.079 166.348,59.128 166.348,61.861L166.348,87.581L166.348,87.575Z\" style=\"fill:rgb(32,32,32);fill-rule:nonzero;\"/><path d=\"M54.593,86.205C54.593,99.633 62.103,111.24 71.662,120.348C78.036,126.495 88.051,132.869 94.876,136.966C96.925,138.102 98.974,138.787 101.251,138.787C103.984,138.787 106.255,138.102 108.082,136.966C114.913,132.869 124.922,126.495 131.068,120.348C140.855,111.246 148.365,99.639 148.365,86.205C148.365,71.636 137.443,58.665 121.738,58.665C112.408,58.665 106.033,63.447 101.251,70.044C96.925,63.441 90.329,58.665 80.992,58.665C65.059,58.665 54.587,71.636 54.587,86.205\" style=\"fill:rgb(255,90,22);fill-rule:nonzero;\"/></g></g></g></svg>';
		
		koFiLink.setAttribute('href', link);
		koFiLink.addClass('kofi-button');
		koFiLink.appendChild(parser.parseFromString(kofiLogo, 'text/xml').documentElement);

		/************ Usage Example Code Block *************/
		new Setting(containerEl)
			.setName('Usage example code block')
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
			textArea.setValue(`\`\`\`apb\n${this.plugin.settings.APB_title}: ${valueFromPercentageOfTotal}/${this.plugin.settings.APB_total}\n\`\`\``);

			textArea.inputEl.style.height = '80px';
			textArea.inputEl.style.width = '200px';
			textArea.inputEl.style.resize = 'none';

			const container = textArea.inputEl.parentElement;
			// check container exists before appending the button
			if (container) {
				const copyButton = containerEl.createEl('button', { text: 'Copy to Clipboard', attr: { id: 'copypastebutton'} });

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

/************ SECTION Light & Dark *************/
const setting1 = new Setting(containerEl).setName('Light & dark').setHeading();
const heading1 = setting1.settingEl.querySelector('.setting-item-name');
if (heading1) {heading1.addClass('header-highlight');}


/************ Light & Dark Quick Apply *************/
new Setting(containerEl)
	.setName('Apply all light & dark color defaults')
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
		button.setIcon('sun').setTooltip('Reset to light default')	
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
			this.plugin.settings.APB_overageColor = DEFAULT_SETTINGS.APB_overageLightColor as string;			

			this.plugin.settings.APB_gradientPrimary = DEFAULT_SETTINGS.APB_gradientPrimaryLight as string;
			this.plugin.settings.APB_gradientSecondary = DEFAULT_SETTINGS.APB_gradientSecondaryLight as string;
			this.plugin.settings.APB_color1 = DEFAULT_SETTINGS.APB_color1Light as string;
			this.plugin.settings.APB_color2 = DEFAULT_SETTINGS.APB_color2Light as string;
			this.plugin.settings.APB_color3 = DEFAULT_SETTINGS.APB_color3Light as string;
			this.plugin.settings.APB_color4 = DEFAULT_SETTINGS.APB_color4Light as string;
			this.plugin.settings.APB_color5 = DEFAULT_SETTINGS.APB_color5Light as string;

			await this.plugin.saveSettings();
			this.display();
		}))
	.addButton((button) =>
		button.setIcon('moon').setTooltip('Reset to dark default')
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
			this.plugin.settings.APB_overageColor = DEFAULT_SETTINGS.APB_overageColor as string;

			this.plugin.settings.APB_gradientPrimary = DEFAULT_SETTINGS.APB_gradientPrimary as string;
			this.plugin.settings.APB_gradientSecondary = DEFAULT_SETTINGS.APB_gradientSecondary as string;
			this.plugin.settings.APB_color1 = DEFAULT_SETTINGS.APB_color1 as string;
			this.plugin.settings.APB_color2 = DEFAULT_SETTINGS.APB_color2 as string;
			this.plugin.settings.APB_color3 = DEFAULT_SETTINGS.APB_color3 as string;
			this.plugin.settings.APB_color4 = DEFAULT_SETTINGS.APB_color4 as string;
			this.plugin.settings.APB_color5 = DEFAULT_SETTINGS.APB_color5 as string;

			await this.plugin.saveSettings();
			this.display();
		})
	);

/************ SECTION Progress Bar *************/
const setting2 = new Setting(containerEl).setName('Demonstration progress bar').setHeading();
const heading2 = setting2.settingEl.querySelector('.setting-item-name');
if (heading2) {heading2.addClass('header-highlight');}

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

	this.setEndCaps(progressBarBackground, progressbar, this.plugin.settings.APB_endcapToggle);
	progressBarBackground.appendChild(progressbar);

	progressbar.appendChild(completed);

	const marks = containerEl.createEl('div');
	marks.addClass('marks');

	var numberOfColors = parseInt(this.plugin.settings.APB_colornumber.replace(/\D/g, ''));
	var numberOfSections;

	if (this.plugin.settings.APB_autoMarksToggle){
		numberOfSections = numberOfColors;
	} else {
		numberOfSections = this.plugin.settings.APB_manualMarks + 1;
	}

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

				const rgbaColor = this.hexToRgba(this.plugin.settings.APB_marksColor, 0.5);
				mark.style.borderLeft = adjustedBorderWidth + 'px solid ' + rgbaColor;	
			}
		}
	}

	// loop to set correct progress bar color
	for (let i = 1; i <= numberOfColors; i++) {
		let sectionsize = `${(i * (100/numberOfColors))}%`;

		const progressBarPercentage = parseFloat(this.plugin.settings.APB_progressBarPercentage.toString());
		const markLeftValue = parseFloat(sectionsize);

		if ((progressBarPercentage <= markLeftValue) && this.plugin.settings.APB_progressBarChange) {
			progressbar.style.backgroundColor = String(this.plugin.settings[`APB_color${i}` as keyof ObsidianProgressBarsSettings]);
			
			if (this.plugin.settings.APB_gradientToggle && progressBarPercentage < 100) {
				progressbar.style.backgroundImage = String('linear-gradient(to right,'+ this.plugin.settings.APB_gradientPrimary + ','+ this.plugin.settings.APB_gradientSecondary +')');
			}
			
			if (progressBarPercentage == 100) {
				progressbar.style.backgroundColor = this.plugin.settings.APB_colorBarCompleted;
			}
			this.plugin.settings.APB_progressBarChange = false;
			this.plugin.saveSettings();
		}
	}

	this.plugin.settings.APB_progressBarChange = true;
	this.plugin.saveSettings();

	const progresstext = containerEl.createEl('p', { text: 'This is a demo progress bar.' });

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
	const setting3 = new Setting(containerEl).setName('Progress bar').setHeading();
	const heading3 = setting3.settingEl.querySelector('.setting-item-name');
	if (heading3) {heading3.addClass('header-highlight');}

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
	this.createToggleSetting(containerEl, 'Full width',
		'Toggle this on to set the progress bar to fill the entire width of its container. For a fixed width, toggle this off and use the %%Width%% option that will appear below.',
		'APB_widthToggle');

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
					this.setEndCaps(progressBarBackground, progressbar, this.plugin.settings.APB_endcapToggle); 
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
	this.createToggleSetting(containerEl, 'Round end caps',
		'When toggled, the progress bar will have either a round or square end cap.  (See demonstration progress bar above)',
		'APB_endcapToggle');

	/************ SECTION Section Marks *************/
	const setting4 = new Setting(containerEl).setName('Section marks').setHeading();
	const heading4 = setting4.settingEl.querySelector('.setting-item-name');
	if (heading4) {heading4.addClass('header-highlight');}

	/************ Bar Section Marks *************/
	this.createToggleSetting(containerEl, 'Section marks',
		'When toggled on, the progress bar will have vertical section marks equally spaced along its length.  The number and spacing of these will depend on the settings below. (See demonstration progress bar above)',
		'APB_marksToggle');
	
	if (this.plugin.settings.APB_marksToggle) {

		/************ Automaticly Assigned Marks *************/
		this.createToggleSetting(containerEl, 'Automatically assigned marks',
			'When toggled on, your progress bar will automatically assign equally spaced vertical marks based on how many colors your progress bar uses (see %%Number of colors%% setting below). Note: if the bar reaches 100% or the bar has only one color or is a gradient, no marks will be displayed automatically.  (toggle off to override this behavior)',
			'APB_autoMarksToggle');

		if (!this.plugin.settings.APB_autoMarksToggle) {
			/************ Manual Marks *************/
			new Setting(containerEl)
			.setName('Number of marks')
			.setDesc('Manually override the number of evenly spaced marks along the gradient progress bar regardless of the number of colors used.')
			.addSlider((slider) => {			
				slider
					.setLimits(1, 4, 1)
					.setDynamicTooltip()				
					.setValue(this.plugin.settings.APB_manualMarks ?? DEFAULT_SETTINGS.APB_manualMarks)
					.onChange(async(value) =>  {
						this.plugin.settings.APB_manualMarks = value;
						await this.plugin.saveSettings();
						this.display();							
					})
				})			
				.addButton((button) =>
					button.setIcon('rotate-ccw').setTooltip('Reset to default')
					.onClick(async() => {					
						this.plugin.settings.APB_manualMarks = DEFAULT_SETTINGS.APB_manualMarks as number;
						await this.plugin.saveSettings();
						this.display();
					})
				);
		}

		/************ Section Mark Color *************/
		this.createColorPickerSetting(containerEl, 'Section mark color', 'Select the color of the section %%Marks%%. Note: The color will be set to 50% transparency, allowing the progress bar\'s color to blend and influence the final appearance.',
			'APB_marksColor', DEFAULT_SETTINGS.APB_marksLightColor as string, DEFAULT_SETTINGS.APB_marksColor as string);

		/************ Bar Section Mark Width *************/
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

	/************ SECTION Text *************/
	const setting5 = new Setting(containerEl).setName('Text').setHeading();
	const heading5 = setting5.settingEl.querySelector('.setting-item-name');
	if (heading5) {heading5.addClass('header-highlight');}

	/************ Show Title *************/
	this.createToggleSetting(containerEl, 'Show title text',
		'When toggled on, the %%Title%% text will be displayed above the progress bar.  (See demonstration progress bar above)',
		'APB_titleToggle');

	/************ Title Color *************/
	this.createColorPickerSetting(containerEl, 'Title text color', 'Select the color of the %%Title%% text.',
		'APB_titleColor', DEFAULT_SETTINGS.APB_titleLightColor as string, DEFAULT_SETTINGS.APB_titleColor as string);

	/************ Show Percentage *************/
	this.createToggleSetting(containerEl, 'Show percentage text',
		'When toggled on, the %%Percentage%% text will be displayed above the progress bar.  (See demonstration progress bar above)',
		'APB_percentageToggle');

	/************ Percentage Color *************/
	this.createColorPickerSetting(containerEl, 'Percentage text color', 'Select the color of the %%Percentage%% text.',
		'APB_percentageColor', DEFAULT_SETTINGS.APB_percentageLightColor as string, DEFAULT_SETTINGS.APB_percentageColor as string);

	/************ Show Fraction *************/
	this.createToggleSetting(containerEl, 'Show fraction text (value/total)',
		'When toggled on, the fraction text %%(Value/Total)%% will be displayed above the progress bar.  (See demonstration progress bar above)',
		'APB_fractionToggle');

	/************ Fraction Color *************/
	this.createColorPickerSetting(containerEl, 'Fraction text color', 'Select the color of the %%Fraction%% text.',
		'APB_fractionColor', DEFAULT_SETTINGS.APB_fractionLightColor as string, DEFAULT_SETTINGS.APB_fractionColor as string);

	/************ Show Completed *************/
	this.createToggleSetting(containerEl, 'Show completed text',
		'When toggled on, the word COMPLETED will be displayed on the progress bar when it reaches 100%.  (See demonstration progress bar above)',
		'APB_completedToggle');

	/************ Completed Color *************/
	this.createColorPickerSetting(containerEl, 'Completed text color', 'Select the color of the %%Completed%% text.',
		'APB_completedColor', DEFAULT_SETTINGS.APB_completedLightColor as string, DEFAULT_SETTINGS.APB_completedColor as string);

	/************ SECTION Override Container *************/	
	const setting7 = new Setting(containerEl).setName('Override error warning').setHeading();
	const heading7 = setting7.settingEl.querySelector('.setting-item-name');
	if (heading7) {heading7.addClass('header-highlight');}

	/************ Overage Percentage *************/
	this.createToggleSetting(containerEl, 'Override large value error',
		'When toggled on, you will not get an error when the %%Value%% is greater than the Total',
		'APB_overageToggle');
	
	if (this.plugin.settings.APB_overageToggle) {
		/************ Overage Color *************/
		this.createColorPickerSetting(containerEl, 'Overage percentage text color', 'Select the color of the %%Percentage%% text when it is greater than 100%.',
			'APB_overageColor', DEFAULT_SETTINGS.APB_overageLightColor as string, DEFAULT_SETTINGS.APB_overageColor as string);
	}

	/************ SECTION Progress Bar Container *************/	
	const setting8 = new Setting(containerEl).setName('Progress bar container').setHeading();
	const heading8 = setting8.settingEl.querySelector('.setting-item-name');
	if (heading8) {heading8.addClass('header-highlight');}

	/************ Border *************/
	this.createToggleSetting(containerEl, 'Border',
		'When toggled on, a border will be displayed around the progress bar container.',
		'APB_borderToggle');

	/************ Border Color *************/
	this.createColorPickerSetting(containerEl, 'Border color', 'Select the color of the border around the progress bar container.',
		'APB_colorBorder', DEFAULT_SETTINGS.APB_colorLightBorder as string, DEFAULT_SETTINGS.APB_colorBorder as string);

	/************ Background *************/
	this.createToggleSetting(containerEl, 'Background',
		'When toggled on, the background of the progress bar container will show.',
		'APB_backgroundToggle');

	/************ Background Color *************/
	this.createColorPickerSetting(containerEl, 'Background color', 'Select the background color of the progress bar container.',
		'APB_colorBackground', DEFAULT_SETTINGS.APB_colorLightBackground as string, DEFAULT_SETTINGS.APB_colorBackground as string);
		
	/************ SECTION Progress Bar Color *************/
	const setting9 = new Setting(containerEl).setName('Progress bar color').setHeading();
	const heading9 = setting9.settingEl.querySelector('.setting-item-name');
	if (heading9) {heading9.addClass('header-highlight');}

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

					if (value !== '1 color'){
						this.plugin.settings.APB_gradientToggle = false;
					}

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
	
		
	if (this.plugin.settings.APB_colornumber == 'option1') {
		/************ Gradient *************/
		this.createToggleSetting(containerEl, 'Gradient',
			'When toggled on, the progress bar will become a gradient using the Primary and Secondary color options that will appear below.',
			'APB_gradientToggle');

		if (this.plugin.settings.APB_gradientToggle) {
			this.createColorPickerSetting(containerEl, 'Primary gradient color', 'This color will be used for the left side of the gradient.',
				'APB_gradientPrimary', DEFAULT_SETTINGS.APB_gradientPrimaryLight as string, DEFAULT_SETTINGS.APB_gradientPrimary as string);

			this.createColorPickerSetting(containerEl, 'Secondary gradient color', 'This color will be used for the right side of the gradient.',
				'APB_gradientSecondary', DEFAULT_SETTINGS.APB_gradientSecondaryLight as string, DEFAULT_SETTINGS.APB_gradientSecondary as string);
		}
	}

	if (!this.plugin.settings.APB_gradientToggle) {
		/************ 1st Color *************/
		this.createColorPickerSetting(containerEl, '1st color', 'This color will be used for the entire progrees bar if the percentage is within the first section.',
			'APB_color1', DEFAULT_SETTINGS.APB_color1Light as string, DEFAULT_SETTINGS.APB_color1 as string);
	}

	if (this.plugin.settings.APB_colornumber !== 'option1') {
		/************ 2nd Color *************/
		this.createColorPickerSetting(containerEl, '2nd color', 'This color will be used for the entire progrees bar if the percentage is within the second section.',
			'APB_color2', DEFAULT_SETTINGS.APB_color2Light as string, DEFAULT_SETTINGS.APB_color2 as string);

		if (this.plugin.settings.APB_colornumber !== 'option2') {
			/************ 3rd Color *************/
			this.createColorPickerSetting(containerEl, '3rd color', 'This color will be used for the entire progrees bar if the percentage is within the third section.',
				'APB_color3', DEFAULT_SETTINGS.APB_color3Light as string, DEFAULT_SETTINGS.APB_color3 as string);

			if (this.plugin.settings.APB_colornumber !== 'option3') {
				/************ 4th Color *************/
				this.createColorPickerSetting(containerEl, '4th color', 'This color will be used for the entire progrees bar if the percentage is within the fourth section.',
					'APB_color4', DEFAULT_SETTINGS.APB_color4Light as string, DEFAULT_SETTINGS.APB_color4 as string);

				if (this.plugin.settings.APB_colornumber !== 'option4') {
					/************ 5th Color *************/
					this.createColorPickerSetting(containerEl, '5th color', 'This color will be used for the entire progrees bar if the percentage is within the fifth section.',
						'APB_color5', DEFAULT_SETTINGS.APB_color5Light as string, DEFAULT_SETTINGS.APB_color5 as string);				
					}
				}
			}
		}

	/************ Completed Color *************/
	this.createColorPickerSetting(containerEl, 'Completed color', 'Select the color the entire progress bar will use when it reaches 100% completion.',
		'APB_colorBarCompleted', DEFAULT_SETTINGS.APB_colorLightBarCompleted as string, DEFAULT_SETTINGS.APB_colorBarCompleted as string);

	/************ Bar Background Color *************/
	this.createColorPickerSetting(containerEl, 'Bar background color', 'This color will be used for the progress bar\'s background, representing the remaining percentage.',
		'APB_colorBarBackground', DEFAULT_SETTINGS.APB_colorLightBarBackground as string, DEFAULT_SETTINGS.APB_colorBarBackground as string);

	return;

}

/************ setEndCaps Function *************/
setEndCaps(progressBarBackground: HTMLElement | null, progressbar: HTMLElement | null, endCap: boolean) {
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

/************ hexToRgba Function *************/
hexToRgba(hex: string, alpha: number = 1): string {
    hex = hex.replace('#', '');

    // If hex is 3 characters, expand to 6 (e.g. #F00 => #FF0000)
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

/************ Create light/dark buttons Function *************/
addColorResetButtonsForSettings<K extends keyof ObsidianProgressBarsSettings>(setting: Setting, colorSettingKey: K, defaultLightColor: ObsidianProgressBarsSettings[K],
	defaultDarkColor: ObsidianProgressBarsSettings[K]) {
	setting.addButton((button: ButtonComponent) => {
		this.addColorResetButton(button, 'sun', 'Reset to light default', 
			colorSettingKey, defaultLightColor);
	});

	setting.addButton((button: ButtonComponent) => {
		this.addColorResetButton(button, 'moon', 'Reset to dark default', 
			colorSettingKey, defaultDarkColor);
	});
}

/************ Create a color reset button Function *************/
addColorResetButton<K extends keyof ObsidianProgressBarsSettings>(button: ButtonComponent, icon: string, tooltip: string, colorSettingKey: K, defaultColorValue: ObsidianProgressBarsSettings[K]) {
	button.setIcon(icon)
		.setTooltip(tooltip)
		.onClick(async() => {
			this.plugin.settings[colorSettingKey] = defaultColorValue;
			await this.plugin.saveSettings();
			this.display();
		});
}

/************ Create a colorPicker with light/dark buttons Function *************/
createColorPickerSetting(
	containerEl: HTMLElement,
	setName: string,
	setDesc: string,
	settingKey: keyof ObsidianProgressBarsSettings,
	defaultLightColor: string,
	defaultDarkColor: string
) {
	const match = setDesc.match(/(.*)%%(.*)%%(.*)/);
	let before: string, middle: string, after: string;


	if (match && match.length === 4) {
        // Successfully found three parts
        before = match[1]; // Text before %%
        middle = match[2]; // Text between %% and %%
        after = match[3];  // Text after %%
    } else {
        // Fallback if no %%...%% found
        before = setDesc;
        middle = '';
        after = '';
    }

	const setting = new Setting(containerEl)
		.setName(setName)
		.setDesc(createFragment((frag) => {
            frag.appendText(before);
            frag.createEl('span', {
                text: middle || '',
                cls: 'highlight-text'
            });
            frag.appendText(after);
        }))
		.addColorPicker((colorPicker: ColorComponent) => colorPicker
			.setValue(this.plugin.settings[settingKey] as string)
			.onChange(async (value: string) => {
				(this.plugin.settings[settingKey] as string) = value;
				await this.plugin.saveSettings();
				this.display();
			}));
	this.addColorResetButtonsForSettings(setting, settingKey, defaultLightColor, defaultDarkColor);
}

/************ Create a Toggle with reset button Function *************/
createToggleSetting(
	containerEl: HTMLElement,
	setName: string,
	setDesc: string,
	settingKey: keyof ObsidianProgressBarsSettings
) {
	const match = setDesc.match(/(.*)%%(.*)%%(.*)/);
	let before: string, middle: string, after: string;


	if (match && match.length === 4) {
        // Successfully found three parts
        before = match[1]; // Text before %%
        middle = match[2]; // Text between %% and %%
        after = match[3];  // Text after %%
    } else {
        // Fallback if no %%...%% found
        before = setDesc;
        middle = '';
        after = '';
    }
	
	const setting = new Setting(containerEl)
		.setName(setName)
		.setDesc(createFragment((frag) => {
            frag.appendText(before);
            frag.createEl('span', {
                text: middle || '',
                cls: 'highlight-text'
            });
            frag.appendText(after);
        }))
	.addToggle((toggle) =>
			toggle.setValue(this.plugin.settings[settingKey] as boolean)
			.onChange(async(value) => {
				(this.plugin.settings[settingKey] as boolean) = value;
				await this.plugin.saveSettings();
				this.display();
			}))
	.addButton((button) =>
		button.setIcon('rotate-ccw').setTooltip('Reset to default')
		.onClick(async() => {
			(this.plugin.settings[settingKey] as boolean) = DEFAULT_SETTINGS[settingKey] as boolean;
			await this.plugin.saveSettings();
			this.display();
		})
	);
}



}