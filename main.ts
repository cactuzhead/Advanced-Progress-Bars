import { App, Plugin, PluginSettingTab, Setting,  Notice, ButtonComponent, ColorComponent, ToggleComponent, TextComponent, TFile, MarkdownView } from 'obsidian';

interface Template {
	name: string;
	gradient: boolean;
	gradientType: boolean;
	colors: string[]; // Array of up to 5 colors
}

interface TextSegment {
    text: string;
    isHighlighted: boolean;
    isNewLine?: boolean;
}

// Extend ColorComponent to include inputEl
declare module "obsidian" {
	interface ColorComponent {
	  inputEl: HTMLInputElement;
	}
  }

// Populate settings with values
interface ObsidianProgressBarsSettings {
	/* Progress Bar Settings */
	APB_title: string;
	APB_total: number;
	APB_progressBarPercentage: number;
	APB_widthToggle: boolean;
	APB_width: number;
	APB_height: number;
	APB_endcapToggle: boolean;
	/* Section Mark Settings */
	APB_marksToggle: boolean;
	APB_autoMarksToggle: boolean;
	APB_manualMarks: number;
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
	/* Override Error Settings */
	APB_overageToggle: boolean;
	APB_overageColor: string;
	APB_overageLightColor: string;
	/* Container Settings */
	APB_borderToggle: boolean;
	APB_colorBorder: string;
	APB_colorLightBorder: string;
	APB_backgroundToggle: boolean;
	APB_colorBackground: string;
	APB_colorLightBackground: string;
	/* Box-shadow Settings */
	APB_boxShadowToggle: boolean;
	APB_boxShadowTypeToggle: boolean;
	APB_hOffset: number;
	APB_vOffset: number;
	APB_blur: number;
	APB_boxShadowInsetToggle: boolean;
	APB_colorBoxShadow: string;
	APB_colorLightBoxShadow: string;
	/* Progress Bar Color Settings */
	APB_colorBarCompleted: string;
	APB_colorLightBarCompleted: string;
	APB_colorBarBackground: string;
	APB_colorLightBarBackground: string;	
	/* Task Settings */
	APB_allowTasksToggle: boolean;
	APB_colorTaskText: string;
	APB_colorLightTaskText: string;
	APB_colorTaskBackground: string;
	APB_colorLightTaskBackground: string;
	APB_allowSubTasksToggle: boolean;
	APB_colorSubTaskText: string;
	APB_colorLightSubTaskText: string;
	APB_colorSubTaskCompletedText: string;
	APB_colorLightSubTaskCompletedText: string;
	/* Additional Settings */
	APB_progressBarChange: boolean;
	APB_fallbackColor: string;	
	/* Default Color Palettes */
	defaultLightColors: string[];
  	defaultDarkColors: string[];
  	defaultRainbowColors: string[];
	/* Default Template */
	defaultTemplate: Template;	
	/* Templates */	
	templates: Template[];
}

const DEFAULT_SETTINGS: Partial<ObsidianProgressBarsSettings> = {
	/* Progress Bar Settings */
	APB_title: 'Progress',
	APB_total: 100,
	APB_progressBarPercentage: 83,
	APB_widthToggle: true,
	APB_width: 190,	
	APB_height: 8,
	APB_endcapToggle: true,
	/* Section Mark Settings */
	APB_marksToggle: true,
	APB_autoMarksToggle: true,	
	APB_manualMarks: 3,
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
	/* Override Error Settings */
	APB_overageToggle: false,
	APB_overageColor: '#38edef',
	APB_overageLightColor: '#d33411',
	/* Container Settings */
	APB_borderToggle: true,
	APB_colorBorder: '#474f62',
	APB_colorLightBorder: '#ced0d6',
	APB_backgroundToggle: true,
	APB_colorBackground: '#242a35',
	APB_colorLightBackground: '#f1f2f4',
	/* Box-shadow Settings */
	APB_boxShadowToggle: false,
	APB_boxShadowTypeToggle: false,
	APB_hOffset: 2,
	APB_vOffset: 2,
	APB_blur: 5,
	APB_boxShadowInsetToggle: false,
	APB_colorBoxShadow: '#00fff7',
	APB_colorLightBoxShadow: '#474747',
	/* Progress Bar Color Settings */
	APB_colorBarCompleted: '#576178',
	APB_colorLightBarCompleted: '#fcfcfd',
	APB_colorBarBackground: '#3b4252',
	APB_colorLightBarBackground: '#d9dde2',
	/* Task Settings */
	APB_allowTasksToggle: false,
	APB_colorTaskText: '#8fa0ba',
	APB_colorLightTaskText: '#ffffff',
	APB_colorTaskBackground: '#3b4252',
	APB_colorLightTaskBackground: '#44546F',
	APB_allowSubTasksToggle: false,
	APB_colorSubTaskText: '#8fa0ba',
	APB_colorLightSubTaskText: '#6c7a90',
	APB_colorSubTaskCompletedText: '#6dd374',
	APB_colorLightSubTaskCompletedText: '#349a16',
	/* Additional Settings */
	APB_progressBarChange: true,
	APB_fallbackColor: '#2978ef',
	/* Default Color Palettes */
	defaultLightColors: ['#278378', '#2baab9', '#4a32e2', '#7c328e', '#c11e49'], // old APB_color1Light to APB_color5Light
  	defaultDarkColors: ['#2978ef', '#8ec822', '#dfaa22', '#c84922', '#dd4a86'], // old APB_color1 to APB_color5
	defaultRainbowColors: ['#ff0000', '#eeff00', '#11ff00', '#7300ff', '#00e1ff'], // rainbow RYGPB
	/* Default Template */
	defaultTemplate: {
		name: 'Default',
		gradient: true,
		gradientType: false,
		colors: ['#2978ef', '#8ec822', '#dfaa22', '#c84922', '#dd4a86'] // Match old APB_color1 to APB_color5
	  },
	/* Array of templates */
	  templates: []
	}


// Loading and saving of settings
export default class ObsidianProgressBars extends Plugin {
	settings: ObsidianProgressBarsSettings;
	settingsTab: ObsidianProgressBarsSettingTab;

	private isUpdating = false;
	private lastProcessedFile: TFile | null = null;
	private lastChangeTime = 0;
    private readonly MIN_CHANGE_INTERVAL = 5000; // 5s to cover debounce
	private hasRegisteredEvents = false;
	private lastProcessedFileTime: Map<string, number> = new Map();

	copyButtonListener: (event: MouseEvent) => void;

	async onload() {
		await this.loadSettings();
	
		this.settingsTab = new ObsidianProgressBarsSettingTab(this.app, this);
        this.addSettingTab(this.settingsTab);	
		this.app.workspace.onLayoutReady(this.initializeProgressBars.bind(this));

		if (!this.hasRegisteredEvents) {
            this.registerEvents();
            this.hasRegisteredEvents = true;
        }
	}

	// Check for apb code blocks with tags
	private async hasApbWithTag(file: TFile, app: App): Promise<boolean> {
		try {
			const content = await app.vault.read(file);
			const apbTagRegex = /```apb\b[\s\S]*?#(\w+)[\s\S]*?\n```/g; // Matches apb with #tag
			return apbTagRegex.test(content);
		} catch (e) {
            console.error('Error checking hasApbWithTag:', e);
            return false;
        }
	}

	// Helper to check if the active view is a dashboard page
	private isDashboardPage(view: MarkdownView | null): boolean {
		if (!view) return false;
		const container = view.contentEl;
		return container.querySelector('.dashboard') !== null;
	}

	// Helper to check if file has apb block or is a dashboard page
	private async shouldUpdateProgress(file: TFile, app: App): Promise<boolean> {
		const view = app.workspace.getActiveViewOfType(MarkdownView);
		if (await this.hasApbWithTag(file, app)) return true;
		return this.isDashboardPage(view);
	}

	private registerEvents() {
        this.registerEvent(
            this.app.metadataCache.on('changed', debounce(async (file: TFile) => {
                const now = Date.now();
				const lastTime = this.lastProcessedFileTime.get(file.path) || 0;

                if (this.isUpdating || now - this.lastChangeTime < this.MIN_CHANGE_INTERVAL) {
                    // console.log('Skipping self-triggered or rapid change:', { isUpdating: this.isUpdating, timeSinceLast: now - this.lastChangeTime });
					return;
                }
                if (!this.settings.APB_allowTasksToggle) return;
                const activeFile = this.app.workspace.getActiveFile();
                if (!activeFile || file.path !== activeFile.path) return;
                if (!(await this.shouldUpdateProgress(activeFile, this.app))) return;

                const editorView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!editorView) return;
                const editor = editorView.editor;
                const cursorBefore = editor.getCursor();
                // console.log('- CHANGED - Dashboard or APB detected');
				new Notice('Processing Task Update ...', 2000);
				// Add 2-second delay before starting the update
				// await new Promise(resolve => setTimeout(resolve, 2000));

                try {
                    this.isUpdating = true;
                    this.lastChangeTime = now;
					this.lastProcessedFileTime.set(file.path, now)
                    this.lastProcessedFile = activeFile;
					
                    await this.updateProgress();
					new Notice('Task Update Completed', 2000);	
                } catch (error) {
					// Show error notice if update fails
					new Notice('Task Update Failed: ' + error.message, 2000);
				} finally {
                    // Delay reset to ensure async events are caught
                    setTimeout(() => {
                        this.isUpdating = false;
                    }, 2000);
                }

                editor.setCursor(cursorBefore);
            }, 2000))
        );

	// Register file-open event
	this.registerEvent(
		this.app.workspace.on('file-open', debounce(async () => {
			if (this.isUpdating) {
				// console.log('Skipping self-triggered file-open');
				return;
			}
			if (!this.settings.APB_allowTasksToggle) return;
			const activeFile = this.app.workspace.getActiveFile();
			if (!activeFile || activeFile.path === this.lastProcessedFile?.path) {
				// console.log('Skipping already processed file:', activeFile?.path);
				return;
			}
			if (!(await this.shouldUpdateProgress(activeFile, this.app))) return;

			// console.log('- OPEN - Dashboard or APB detected');
			try {
				this.isUpdating = true;
				const now = Date.now();
                this.lastProcessedFileTime.set(activeFile.path, now);
				this.lastProcessedFile = activeFile;
				await this.updateProgress();
			} finally {
				setTimeout(() => {
					this.isUpdating = false;
				}, 2000);
			}
		}, 2000))
	);
}

	async updateProgress() {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) return;
		let tagMap = new Map();
		
		// Read the content of the updated file
		const content = await this.app.vault.read(activeFile);		
		const taskRegex = /(?:^|\n)([ \t]*)(?:-|\*|\d+\.) \[([ x])\] (.+)$/gm;

		let match;
		let currentTopTag = null; // Tracks the current top-level task's tag

		while ((match = taskRegex.exec(content)) !== null) {
			const [fullMatch, indent, status, fullDescription] = match;
			const normalizedIndent = indent.replace(/\t/g, '    ');
			const indentLevel = normalizedIndent.length;
		
			const tagMatch = fullDescription.match(/#([\p{L}\p{N}\p{Emoji}_-]+)/u);
			const taskTag = tagMatch ? tagMatch[1].normalize('NFC') : null;
			// console.log("tagMatch: " + taskTag);


			if (indentLevel === 0) {
				// Top-level task
				currentTopTag = taskTag || null;
				if (currentTopTag) {
					if (!tagMap.has(currentTopTag)) {
						tagMap.set(currentTopTag, { total: 0, completed: 0, subTotal: 0, subCompleted: 0 });
					}
					tagMap.get(currentTopTag).total++;
					if (status.trim() === 'x') {
						tagMap.get(currentTopTag).completed++;
					}
				}
			} else if (currentTopTag) {
				// Subtask: Count under currentTopTag, ignoring taskTag
				tagMap.get(currentTopTag).subTotal++;
				if (status.trim() === 'x') {
					tagMap.get(currentTopTag).subCompleted++;
				}
			}
		}

		// Update progress bars for each tag
		for (const [tag, { total, completed, subTotal, subCompleted }] of tagMap.entries()) {
			// console.log(`Tag: ${tag}`, { total, completed, subTotal, subCompleted });
			this.updateProgressBarInNote(tag.normalize('NFC'), completed, total, subCompleted, subTotal);
		}
	}
	
	async findMatchingTasks(tag: string): Promise<boolean> {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) return false;
	
		const content = await this.app.vault.read(activeFile);
		const taskRegex = /- \[.\] (.*?)#([\p{L}\p{N}\p{Emoji}_-]+)/gu;
	
		let match;
		while ((match = taskRegex.exec(content)) !== null) {
			// const taskTag = match[2]; // The tag from the task (e.g. "todo")
			const taskTag = match[2].normalize('NFC');
			// if (taskTag === tag) {
			if (taskTag === tag.normalize('NFC')) {
				return true; // Found a task with a matching tag
			}
		}
		return false; // No matching task tag found
	}

	// change the CSS of the progress bars tag depending on whether it matches task tag
	async updateTagSpan(tagSpan: HTMLSpanElement, extractedTag: string) {
		if (extractedTag) {			
			try {
				if (this.settings.APB_allowTasksToggle) {
					const hasMatchingProgressBar = await this.findMatchingTasks(extractedTag);
					tagSpan.id = hasMatchingProgressBar ? 'APB_tag' : 'APB_notag';
					if (tagSpan.id == 'APB_tag') {
						tagSpan.style.color = this.settings.APB_colorTaskText;
						tagSpan.style.background = this.settings.APB_colorTaskBackground;
					}
					tagSpan.textContent = hasMatchingProgressBar ? extractedTag : '#' + extractedTag + ' not found';	
				} else {
					tagSpan.id = 'APB_tasksDisabled';
					tagSpan.textContent = 'tasks are disabled';
				}
			} catch (error) {
				console.error('Error searching tasks for tag:', error);
				tagSpan.textContent = '#' + extractedTag + ' not found';
				tagSpan.id = 'APB_notag';
			}
		} else {
			console.warn('No tag was found.');
		}
	}

	updateProgressBarInNote(tag: string, value: number, total: number, subCompleted: number, subTotal: number) {
		const editorView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!editorView) {
			// console.log("No active Markdown view");
			return;
		}
	
		const fileContent = editorView.editor.getValue();
		const regex = /```apb\n([\s\S]+?)\n```/g;

		const updatedContent = fileContent.replace(regex, (match: string, p1: string) => {
			const lines = p1.trim().split('\n');
			let updatedLines = lines.map((line: string) => {
			
			const matchProgress = line.match(/^(.+?)\s*(?:#([\p{L}\p{N}\p{Emoji}_-]+))?(?:\s*~(\d+)\/(\d+))?\s*:\s*(\d+)\/(\d+)(?:\{([^}]+)\})?(?:\s*(?:\[.*?\])?)?$/u);
	
				if (matchProgress) {
					const title = matchProgress[1].trim() || '';
					const progressBarTag = matchProgress[2] || '';
					const subCurrent = matchProgress[3] ? parseInt(matchProgress[3], 10) : null;
					const subMax = matchProgress[4] ? parseInt(matchProgress[4], 10) : null;
					const templateName = matchProgress[7] || '';	
	
					if (tag.normalize('NFC') === progressBarTag.normalize('NFC')) {
						const templatePart = templateName ? `{${templateName}}` : '';
						return `${title}#${tag}~${subCompleted}/${subTotal}: ${value}/${total}${templatePart}`;
					}
				}
				return line;
			});
	
			return '```apb\n' + updatedLines.join('\n') + '\n```';
		});
	
		this.isUpdating = true;
		try {
			// Update the file with the new content
			if (fileContent !== updatedContent) {
				const setValueTime = Date.now()
				editorView.editor.setValue(updatedContent);
			}
		} finally {
			setTimeout(() => {
				this.isUpdating = false;
			}, 2000);
		}			
	}

	initializeProgressBars() {
		this.registerMarkdownCodeBlockProcessor('apb', (source, el, ctx) => {
		  this.renderProgressBar(source, el);
		});
	  }

	renderProgressBar(source: string, el: HTMLElement) { {	
			// Split the source string into rows
			const rows = source.trim().split('\n');
			el.empty(); // Clear the default rendering

			// Loop through each line
			rows.forEach((row, index) => {
				// Use regex to extract the label and progress (Value/Total)
				const match = row.match(/^(.+?)(?:#([\p{L}\p{N}\p{Emoji}_-]+))?(?:~(\d+)\/(\d+))?(?::\s*(\d+)\/(\d+))(?:\{([^}]+)\})?(?:\s.*)?$/u);
				
				if (!match) {
					displayAPBError(el, `APB_Error: Invalid block format`);
    			return;
				}

				const label = match[1] || '';
				const extractedTag = match[2] || '';
				const subvalue = match[3] ? parseInt(match[3], 10) : null;
				const subtotal = match[4] ? parseInt(match[4], 10) : null;
				const current = match[5] ? parseInt(match[5], 10) : 0;
				const total = match[6] ? parseInt(match[6], 10) : 0;
				const templateName = match[7] || '';

				if (!this.settings.APB_overageToggle) {
					// Check if current value is too large or total is not zero
					if (current > total && total !== 0) {
						displayAPBError(el, `APB_Error: Value is too large`);
    					return;
					}
				}
		
				// Check if parsing was successful and that total is zero
				if (isNaN(current) || isNaN(total) || total === 0) {
					displayAPBError(el, `APB_Error: Invalid number`);
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

				const boxShadowInset = this.settings.APB_boxShadowInsetToggle ? ' inset ' : '';

				if (this.settings.APB_boxShadowToggle) {
					if (this.settings.APB_boxShadowTypeToggle) {
						APB_container.style.boxShadow = this.settings.APB_hOffset + 'px ' + this.settings.APB_vOffset + 'px ' + this.settings.APB_blur + 'px ' + this.settings.APB_colorBoxShadow + boxShadowInset;
					} else {
						APB_container.style.boxShadow = '0px 0px ' + this.settings.APB_blur + 'px ' + this.settings.APB_colorBoxShadow + boxShadowInset;
					}
					el.style.padding = this.settings.APB_blur + 'px';
				} else {
					APB_container.style.boxShadow = '';
					el.style.padding = '0px';
				}


				// APB_Text Container
				const APB_textContainer = document.createElement('div');
				APB_textContainer.addClass('progressBar-text-container');

				// APB_ BarBackground container
				const APB_background = document.createElement('div');
				APB_background.addClass('progressBar-background');

				if (clampedPercentage !== 100) {
					APB_background.style.overflow ='hidden';
				}				

				// APB_Title
				const APB_title = document.createElement('div');
				APB_title.addClass('progressBar-title');
				if (this.settings.APB_titleToggle) {

					// Split the titleWithSubtasks into title, tag, and optional subtasks
					const subtaskSplit = label.split('~');
					const subtaskPart = subtaskSplit[1];   // e.g. "1/2" or undefined

					// Extract subvalue and subtotal if present
					let subvalue = null;
					let subtotal = null;
					
					if (subtaskPart) {
						const subtaskMatch = subtaskPart.match(/(\d+)\/(\d+)/);
						if (subtaskMatch) {
							subvalue = parseInt(subtaskMatch[1], 10);
							subtotal = parseInt(subtaskMatch[2], 10);
						}
					}
					
					if (extractedTag) {
						const editorView = this.app.workspace.getActiveViewOfType(MarkdownView);
						if (editorView) {
							 const tagSpan = APB_title.createEl('span', { text: extractedTag });
							 this.updateTagSpan(tagSpan, extractedTag);
						}
					} else {
						// console.warn("No tag was found in APB_title.");
					}

					APB_title.createEl('span', { text: label });
					APB_title.style.color = this.settings.APB_titleColor;
				}
				const APB_subtask = document.createElement('div');

				// Sub Tasks
				if (this.settings.APB_allowTasksToggle && this.settings.APB_allowSubTasksToggle) {
					if (subtotal !== null && subtotal !==0) {
						if (subvalue == subtotal) {
							APB_subtask.addClass('progressBar-subtask-completed');							
							APB_subtask.style.color = this.settings.APB_colorSubTaskCompletedText;							
							APB_subtask.createEl('span', { text: 'Sub Tasks - ' + subvalue + '/' + subtotal + ' completed'});	
						} else {
							APB_subtask.addClass('progressBar-subtask');
							APB_subtask.style.color = this.settings.APB_colorSubTaskText;	
							APB_subtask.createEl('span', { text: 'Sub Tasks - ' + subvalue + '/' + subtotal });
						}
					}
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
		
				let template = null;
				let isValidTemplate = false;
				let isTemplateNameProvided = false;
				
				// Check if templateName is provided (not null, undefined, or empty string)
				if (templateName && templateName.trim() !== "") {
					isTemplateNameProvided = true;		  
					const matchedTemplate = this.settings.templates.find(t => t.name.toLowerCase() === templateName.toLowerCase());
				
					isValidTemplate = !!matchedTemplate;
					template = isValidTemplate ? matchedTemplate : this.settings.defaultTemplate;

					if (!isValidTemplate) {			
						displayAPBError(el, `APB_Error: Template "${templateName}" not found`);
						return;
					}
				} else {			
					// template = null; // Explicitly set to null to indicate no template
					template = this.settings.defaultTemplate;
				}
		
				const useGradient = template ? template.gradient : false;
				const gradientType = template ? template.gradientType : false;
				const colors = template && template.colors ? Array.isArray(template.colors) ? template.colors : [template.colors] : ["#ff0000", "#00ff00"] as string[];
				const validColors = colors.filter(c => c && c !== '#000000').slice(0, 5);		
				const numberOfValidColors = validColors.length;


				// Create progressBar-filled (filled portion)
				const filledBar = document.createElement('div');
				filledBar.className = 'progressBar-filled';
				filledBar.style.position = 'relative';
				filledBar.style.width = `${clampedPercentage}%`;
				filledBar.style.height = `${this.settings.APB_height}px`;
				APB_background.appendChild(filledBar);


				// progressBar
				const APB = document.createElement('div');
				APB.addClass('progressBar');

				const progressBarwidth: number = this.settings.APB_width;
				let numericWidth = parseInt(progressBarwidth.toString(), 10);

				if (this.settings.APB_widthToggle) {			
					APB_container.style.width = '100%';
					APB_background.style.width = '100%';
					APB.style.width = `${100 - clampedPercentage}%`;
				} else {
					APB_background.style.width = `${progressBarwidth}px`;
					APB_container.style.width = `${numericWidth + 10}px`;
					APB.style.width = `${100 - clampedPercentage}%`;
				}
				
				APB.style.background = this.settings.APB_colorBarBackground;
				APB.style.height = `${this.settings.APB_height}px`;		

				this.settingsTab.setEndCaps(APB_background, APB, this.settings.APB_endcapToggle,  clampedPercentage);

				if (clampedPercentage !== 100) {
					APB_background.appendChild(APB);
				}

				const marks = document.createElement('div');
				marks.addClass('marks');

				var numberOfSections;

				if (this.settings.APB_autoMarksToggle){
					numberOfSections = numberOfValidColors;
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
				filledBar.appendChild(APB_completed);
				
				if (this.settings.APB_endcapToggle && clampedPercentage > 0 && clampedPercentage < 100){
					// ======= Create round end mask for inverse progress bar =======
					const dpr = window.devicePixelRatio || 1; // Get device pixel ratio
					const mask = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
					mask.setAttribute('class', 'progressBar-mask');
					mask.setAttribute('width', `${(this.settings.APB_height / 2)}`); // 1 unit wide
					mask.setAttribute('height', `${this.settings.APB_height}`);    // 2 units tall
					mask.setAttribute('viewBox', `0 0 ${(this.settings.APB_height / 2)} ${this.settings.APB_height}`);
					mask.style.position = 'absolute';
					mask.style.top = '0';
					mask.style.right = `-${1 / dpr}px`; // Nudge right to close the 1-pixel gap
					mask.style.width = `${(this.settings.APB_height + 0.5) / 2}px`;
					mask.style.height = `${this.settings.APB_height}px`;

					// Generate a unique ID for the mask to avoid conflicts
					const uniqueId = `round-end-mask-${Math.random().toString(36).substring(2, 9)}`;

					// mask.style.pointerEvents = 'none';	
					mask.innerHTML = `
						<defs>
							<mask id="${uniqueId}">
							<rect x="0" y="-1" width="${(this.settings.APB_height + 10.5) / 2}" height="${this.settings.APB_height + 3}" fill="white"/>
							<circle cx="0" cy="${this.settings.APB_height / 2}" r="${this.settings.APB_height / 2}" fill="black"/>
							</mask>
						</defs>
						<rect x="0" y="-1" width="${(this.settings.APB_height + 10.5) / 2}" height="${this.settings.APB_height +3}" fill="${this.settings.APB_colorBarBackground}" mask="url(#${uniqueId})"/>
						`;
						filledBar.appendChild(mask);
						// console.log(mask.outerHTML)
				}
						
				APB_background.appendChild(APB);
			
				if (clampedPercentage !== 100) {
					APB_background.style.overflow ='hidden';
				}
			
				if (clampedPercentage < 100) {
					if (useGradient) {			
						if (validColors.length === 0) validColors.push(this.settings.APB_fallbackColor);
						if (validColors.length === 1) {
							// Fallback for fewer than 2 valid colors: use a solid color
							const fallbackColor = validColors[0] || this.settings.APB_fallbackColor; // Use first valid color or default to APB_fallbackColor
							APB_background.style.backgroundColor = fallbackColor;
							filledBar.style.backgroundImage = '';
						} else {		
							const colorStops = validColors.join(', ');
						
							if (gradientType) {
								filledBar.style.backgroundImage = `linear-gradient(to right, ${colorStops})`;
								APB_background.style.backgroundImage = '';
							} else {
								filledBar.style.backgroundImage = '';
								APB_background.style.backgroundImage = `linear-gradient(to right, ${colorStops})`;		
							}
						}
					} else {
						// Stepped color based on which segment clampedPercentage falls into
						const sectionSize = 100 / numberOfValidColors;
						const sectionIndex = Math.min(Math.floor(clampedPercentage / sectionSize), numberOfValidColors - 1);
						filledBar.style.backgroundColor = numberOfValidColors > 0 ? validColors[sectionIndex] : this.settings.APB_fallbackColor;
						APB_background.style.backgroundImage = '';
					}
				} else {
					// Completed Progress Bar	
					APB.style.backgroundColor = this.settings.APB_colorBarCompleted;
					if (this.settings.APB_completedToggle) {
						APB_completed.addClass('progressBar-completed');
						APB_completed.style.color = this.settings.APB_completedColor;
						APB_completed.textContent ='COMPLETED';
					}						
					filledBar.style.backgroundImage = '';
					APB_background.style.backgroundColor = clampedPercentage === 100 ? this.settings.APB_colorBarCompleted : colors[0];
				}

				APB_background.style.backgroundSize = '100% 100%';
				APB_background.style.backgroundRepeat = 'no-repeat';

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
				APB_container.appendChild(APB_subtask);
				
				el.appendChild(APB_container);

				// Check if in dashboard and hide bullet
				const editorView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (editorView) {
					const container = editorView.contentEl;
					const isDashboard = container.querySelector('.dashboard') !== null;
					const listItem = el.closest('li') as HTMLLIElement | null;
					if (listItem && isDashboard && !listItem.classList.contains('apb-list-item')) {
						listItem.classList.add('apb-list-item');
					}
				}
		  	});
		};

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

		// Use let for both descText and segments
        let descText: string;
        let segments: { text: string; isHighlighted: boolean; isNewLine?: boolean }[];

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
const setting = new Setting(containerEl).setName('Light & dark').setHeading();
const heading = setting.settingEl.querySelector('.setting-item-name');
if (heading) {heading.addClass('header-highlight');}


/************ Light & Dark Quick Apply *************/
descText = 'These two options %%(Light & Dark)%% will change %%ALL%% the color settings below to their respective defaults. (Templates and all other settings will remain unchanged).<br>Note: once selected, all previous colors will be lost forever and can not be retrieved.'
segments = this.splitTextIntoSegments(descText);

new Setting(containerEl)
	.setName('Apply all light & dark color defaults (excluding templates)')
	.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
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

		this.plugin.settings.APB_colorBoxShadow = DEFAULT_SETTINGS.APB_colorLightBoxShadow as string;			
		this.plugin.settings.APB_colorTaskText = DEFAULT_SETTINGS.APB_colorLightTaskText as string;
		this.plugin.settings.APB_colorTaskBackground = DEFAULT_SETTINGS.APB_colorLightTaskBackground as string;
		this.plugin.settings.APB_colorSubTaskText = DEFAULT_SETTINGS.APB_colorLightSubTaskText as string;
		this.plugin.settings.APB_colorSubTaskCompletedText = DEFAULT_SETTINGS.APB_colorLightSubTaskCompletedText as string;

		await this.plugin.saveSettings();
		this.display();
	}))
	.addButton((button) =>
		button.setIcon('moon').setTooltip('Reset to dark default')
		.onClick(async() => {
			this.plugin.settings.APB_marksColor = DEFAULT_SETTINGS.APB_marksColor as string;			
			this.plugin.settings.APB_titleColor = DEFAULT_SETTINGS.APB_titleColor as string;
			this.plugin.settings.APB_percentageColor = DEFAULT_SETTINGS.APB_percentageColor as string;
			this.plugin.settings.APB_fractionColor = DEFAULT_SETTINGS.APB_fractionColor as string;
			this.plugin.settings.APB_colorBorder = DEFAULT_SETTINGS.APB_colorBorder as string;
			this.plugin.settings.APB_colorBackground = DEFAULT_SETTINGS.APB_colorBackground as string;
			this.plugin.settings.APB_colorBarCompleted = DEFAULT_SETTINGS.APB_colorBarCompleted as string;
			this.plugin.settings.APB_colorBarBackground = DEFAULT_SETTINGS.APB_colorBarBackground as string;
			this.plugin.settings.APB_completedColor = DEFAULT_SETTINGS.APB_completedColor as string;
			this.plugin.settings.APB_overageColor = DEFAULT_SETTINGS.APB_overageColor as string;

			this.plugin.settings.APB_colorBoxShadow = DEFAULT_SETTINGS.APB_colorBoxShadow as string;
			this.plugin.settings.APB_colorTaskText = DEFAULT_SETTINGS.APB_colorTaskText as string;
			this.plugin.settings.APB_colorTaskBackground = DEFAULT_SETTINGS.APB_colorTaskBackground as string;
			this.plugin.settings.APB_colorSubTaskText = DEFAULT_SETTINGS.APB_colorSubTaskText as string;
			this.plugin.settings.APB_colorSubTaskCompletedText = DEFAULT_SETTINGS.APB_colorSubTaskCompletedText as string;			

			await this.plugin.saveSettings();
			this.display();
		})
	);

/************ SECTION Demo Progress Bar *************/
const setting2 = new Setting(containerEl).setName('Demonstration progress bar').setHeading();
const heading2 = setting2.settingEl.querySelector('.setting-item-name');
if (heading2) {heading2.addClass('header-highlight');}

new Setting(containerEl)
	.setDesc('Any changes you make to this settings page will be instantly reflected in the demonstration progress bar below.  Use it as a guide when making your decisions. Note that template colors will not be shown in this demo.')

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

	let boxShadowInset = this.plugin.settings.APB_boxShadowInsetToggle ? ' inset ' : '';

	if (this.plugin.settings.APB_boxShadowToggle) {
		if (this.plugin.settings.APB_boxShadowTypeToggle) {
			progressBarContainer.style.boxShadow = this.plugin.settings.APB_hOffset + 'px ' + this.plugin.settings.APB_vOffset + 'px ' + this.plugin.settings.APB_blur + 'px ' + this.plugin.settings.APB_colorBoxShadow + boxShadowInset;
		} else {
			progressBarContainer.style.boxShadow = '0px 0px ' + this.plugin.settings.APB_blur + 'px ' + this.plugin.settings.APB_colorBoxShadow + boxShadowInset;
		}
	} else {
		progressBarContainer.style.boxShadow = '';
	}

	// DemoBar Text Container
	const progressBarTextContainer = containerEl.createEl('div');
	progressBarTextContainer.addClass('progressBar-text-container');

	// DemoBar BarBackground container
	const progressBarBackground = containerEl.createEl('div');
	progressBarBackground.addClass('progressBar-background');

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
		progressbar.style.width = `${100 - clampedPercentage}%`;
	} else {
		progressBarContainer.style.width = `${numericWidth}px`;
		progressBarBackground.style.width = `${String(numericWidth - 12)}px`; // -12 for 5px padding and for 1px border
		progressbar.style.width = `${100 - clampedPercentage}%`;
	}
	progressbar.style.background = this.plugin.settings.APB_colorBarBackground;
	progressBarContainer.style.margin = '17px';
	progressbar.style.height = `${this.plugin.settings.APB_height}px`;

	this.setEndCaps(progressBarBackground, progressbar, this.plugin.settings.APB_endcapToggle, clampedPercentage);
	
	// Create progressBar-filled (filled portion)
	const filledBar = document.createElement('div');
	filledBar.className = 'progressBar-filled';
	filledBar.style.position = 'relative';
	filledBar.style.width = `${clampedPercentage}%`; // e.g. 75%
	filledBar.style.height = `${this.plugin.settings.APB_height}px`;
	progressBarBackground.appendChild(filledBar);

	if (this.plugin.settings.APB_endcapToggle && clampedPercentage > 0 && clampedPercentage < 100){
		// ======= Create round end mask for inverse progress bar =======
		const dpr = window.devicePixelRatio || 1; // Get device pixel ratio
		const mask = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
		mask.setAttribute('class', 'progressBar-mask');
		mask.setAttribute('width', `${(this.plugin.settings.APB_height / 2)}`); // 1 unit wide
		mask.setAttribute('height', `${this.plugin.settings.APB_height}`);    // 2 units tall
		mask.setAttribute('viewBox', `0 0 ${(this.plugin.settings.APB_height / 2)} ${this.plugin.settings.APB_height}`);
		mask.style.position = 'absolute';
		mask.style.top = '0';
		mask.style.right = `-${1 / dpr}px`; // Nudge right to close the 1-pixel gap
		mask.style.width = `${(this.plugin.settings.APB_height + 0.5) / 2}px`;
		mask.style.height = `${this.plugin.settings.APB_height}px`;

		mask.innerHTML = `
			<defs>
				<mask id="round-end-mask-demo">
				<rect x="0" y="-1" width="${(this.plugin.settings.APB_height + 10.5) / 2}" height="${this.plugin.settings.APB_height + 3}" fill="white"/>
				<circle cx="0" cy="${this.plugin.settings.APB_height / 2}" r="${this.plugin.settings.APB_height / 2}" fill="black"/>
				</mask>
			</defs>
			<rect x="0" y="-1" width="${(this.plugin.settings.APB_height + 10.5) / 2}" height="${this.plugin.settings.APB_height +3}" fill="${this.plugin.settings.APB_colorBarBackground}" mask="url(#round-end-mask-demo)"/>
			`;
			filledBar.appendChild(mask);
	// console.log(mask.outerHTML)
	}

	progressBarBackground.appendChild(progressbar);

	if (clampedPercentage !== 100) {
		progressBarBackground.style.overflow ='hidden';
	}

	// Setup stepped, gradient or completed progress bar colors
	const templateName = 'defaultTemplate';
	const template = templateName ? this.plugin.settings.templates.find(t => t.name.toLowerCase() === templateName.toLowerCase()) : null;
	const useGradient = template ? template.gradient : (this.plugin.settings.defaultTemplate?.gradient ?? true);
	const gradientType = template ? template.gradientType : (this.plugin.settings.defaultTemplate?.gradientType ?? false);
	const colors = this.plugin.settings.defaultTemplate?.colors ?? ["#ff0000", "#00ff00"];
	const validColors = colors.filter(c => c && c !== '#000000').slice(0, 5);
	const numberOfValidColors = validColors.length;
	
	if (clampedPercentage < 100) {
		if (useGradient) {			
			if (validColors.length === 0) validColors.push(this.plugin.settings.APB_fallbackColor);
			if (validColors.length === 1) {
				// Fallback for fewer than 2 valid colors: use a solid color
				const fallbackColor = validColors[0] || this.plugin.settings.APB_fallbackColor; // Use first valid color or default to APB_fallbackColor
				progressBarBackground.style.backgroundColor = fallbackColor;
				filledBar.style.backgroundImage = '';
			} else {		
				const colorStops = validColors.join(', ');
			
				if (gradientType) {
					filledBar.style.backgroundImage = `linear-gradient(to right, ${colorStops})`;
					progressBarBackground.style.backgroundImage = '';
				} else {
					filledBar.style.backgroundImage = '';
					progressBarBackground.style.backgroundImage = `linear-gradient(to right, ${colorStops})`;		
				}
			}
		} else {
			// Stepped color based on which segment clampedPercentage falls into
			const sectionSize = 100 / numberOfValidColors;
			const sectionIndex = Math.min(Math.floor(clampedPercentage / sectionSize), numberOfValidColors - 1);
			filledBar.style.backgroundColor = numberOfValidColors > 0 ? validColors[sectionIndex] : this.plugin.settings.APB_fallbackColor;
			progressBarBackground.style.backgroundImage = '';
		}
	} else {
		// Completed Progress Bar
		const completed = containerEl.createEl('div');
		completed.addClass('progressBar-completed');
		if (this.plugin.settings.APB_completedToggle) {
			completed.style.color = this.plugin.settings.APB_completedColor;

			if (this.plugin.settings.APB_progressBarPercentage == 100) {
				completed.textContent = 'COMPLETED';
				completed.style.position = 'absolute';
				completed.style.top = '50%';
				completed.style.left = '50%';
				completed.style.transform = 'translate(-50%, -50%)';
				completed.style.whiteSpace = 'nowrap';
			}
		}
		filledBar.style.backgroundImage = '';
		filledBar.appendChild(completed);
		progressBarBackground.style.backgroundColor = clampedPercentage === 100 ? this.plugin.settings.APB_colorBarCompleted : colors[0];
	}

	progressBarBackground.style.backgroundSize = '100% 100%';
	progressBarBackground.style.backgroundRepeat = 'no-repeat';

	const marks = containerEl.createEl('div');
	marks.addClass('marks');
	;
	var numberOfSections;

	if (this.plugin.settings.APB_autoMarksToggle){
		numberOfSections = numberOfValidColors;
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


	/************ SECTION Progress Bar *************/
	const setting3 = new Setting(containerEl).setName('Progress bar').setHeading();
	const heading3 = setting3.settingEl.querySelector('.setting-item-name');
	if (heading3) {heading3.addClass('header-highlight');}

	/************ Default Title *************/
	descText = 'Set the default title of a new progress bar. If you change this, the %%Title%% will be automatically changed in the example code block at the top of the settings for easy copy and pasting later on.'
	segments = this.splitTextIntoSegments(descText);
	new Setting(containerEl)
		.setName('Default title')
		.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
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

descText = 'Set the default %%Total%% of a new progress bar. If you change this, the %%Total%% will be automatically changed in the example code block above for easy copy and pasting later on.'
segments = this.splitTextIntoSegments(descText);
new Setting(containerEl)
	.setName('Default total')
	.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
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
	descText = 'Set the percentage for the demonstration progress bar above. This will also update the %%Value%% parameter in the Example Code at the top of the settings. Once you are satisfied with all other settings, you will likely want to set this back to 0.'
	segments = this.splitTextIntoSegments(descText);
	new Setting(containerEl)
		.setName('Progress percentage')
		.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
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
					this.setEndCaps(progressBarBackground, progressbar, this.plugin.settings.APB_endcapToggle, this.plugin.settings.APB_progressBarPercentage); 
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
			'When toggled on, your progress bar will automatically assign equally spaced vertical marks based on how many colors your progress bar template (or default template) uses.<br>Note: if the bar reaches 100% or the bar has only one color or is a gradient, no marks will be displayed automatically.  (toggle off to override this behavior)',
			'APB_autoMarksToggle');

		if (!this.plugin.settings.APB_autoMarksToggle) {
			/************ Manual Marks *************/
			this.createSliderSetting(containerEl, 'Number of marks', 'Manually override the number of evenly spaced marks along the gradient progress bar regardless of the number of colors used.',
			'APB_manualMarks', 1, 4, 1 );
		}

		/************ Section Mark Color *************/
		this.createColorPickerSetting(containerEl, 'Section mark color', 'Select the color of the section %%Marks%%.<br>Note: The color will be set to 50% transparency, allowing the progress bar\'s color to blend and influence the final appearance.',
			'APB_marksColor', DEFAULT_SETTINGS.APB_marksLightColor as string, DEFAULT_SETTINGS.APB_marksColor as string);

		/************ Bar Section Mark Width *************/
		this.createSliderSetting(containerEl, 'Section mark width', 'Set the width of the section mark lines on the progress bar from a range of 1 to 5 pixels.<br>(See demonstration progress bar above)',
			'APB_marksWidth', 1, 5, 1 );
		}

	/************ SECTION Text *************/
	const setting5 = new Setting(containerEl).setName('Text').setHeading();
	const heading5 = setting5.settingEl.querySelector('.setting-item-name');
	if (heading5) {heading5.addClass('header-highlight');}

	/************ Show Title *************/
	this.createToggleSetting(containerEl, 'Show title text',
		'When toggled on, the %%Title%% text will be displayed above the progress bar.<br>(See demonstration progress bar above)',
		'APB_titleToggle');

	/************ Title Color *************/
	this.createColorPickerSetting(containerEl, 'Title text color', 'Select the color of the %%Title%% text.',
		'APB_titleColor', DEFAULT_SETTINGS.APB_titleLightColor as string, DEFAULT_SETTINGS.APB_titleColor as string);

	/************ Show Percentage *************/
	this.createToggleSetting(containerEl, 'Show percentage text',
		'When toggled on, the %%Percentage%% text will be displayed above the progress bar<br>(See demonstration progress bar above)',
		'APB_percentageToggle');

	/************ Percentage Color *************/
	this.createColorPickerSetting(containerEl, 'Percentage text color', 'Select the color of the %%Percentage%% text.',
		'APB_percentageColor', DEFAULT_SETTINGS.APB_percentageLightColor as string, DEFAULT_SETTINGS.APB_percentageColor as string);

	/************ Show Fraction *************/
	this.createToggleSetting(containerEl, 'Show fraction text (value/total)',
		'When toggled on, the fraction text %%(Value/Total)%% will be displayed above the progress bar.<br>(See demonstration progress bar above)',
		'APB_fractionToggle');

	/************ Fraction Color *************/
	this.createColorPickerSetting(containerEl, 'Fraction text color', 'Select the color of the %%Fraction%% text.',
		'APB_fractionColor', DEFAULT_SETTINGS.APB_fractionLightColor as string, DEFAULT_SETTINGS.APB_fractionColor as string);

	/************ Show Completed *************/
	this.createToggleSetting(containerEl, 'Show completed text',
		'When toggled on, the word %%COMPLETED%% will be displayed on the progress bar when it reaches 100%.<br>(See demonstration progress bar above)',
		'APB_completedToggle');

	/************ Completed Color *************/
	this.createColorPickerSetting(containerEl, 'Completed text color', 'Select the color of the %%Completed%% text.',
		'APB_completedColor', DEFAULT_SETTINGS.APB_completedLightColor as string, DEFAULT_SETTINGS.APB_completedColor as string);

	/************ SECTION Override Container *************/	
	const setting7 = new Setting(containerEl).setName('Override error').setHeading();
	const heading7 = setting7.settingEl.querySelector('.setting-item-name');
	if (heading7) {heading7.addClass('header-highlight');}

	/************ Overage Percentage *************/
	this.createToggleSetting(containerEl, 'Override large value error',
		'When toggled on, you will not get an error when the %%Value%% is greater than the %%Total%%',
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



	/************ SECTION Box Shadow *************/	
	const setting9 = new Setting(containerEl).setName('Box shadow').setHeading();
	const heading9 = setting9.settingEl.querySelector('.setting-item-name');
	if (heading9) {heading9.addClass('header-highlight');}


	/************ Box-shadow Toggle *************/
	this.createToggleSetting(containerEl, 'Box-shadow',
		'When toggled on, a box-shadow will be displayed around the progress bar container.',
		'APB_boxShadowToggle');

	if (this.plugin.settings.APB_boxShadowToggle) {

		/************ Box-shadow Type Toggle *************/
		this.createToggleSetting(containerEl, 'Box-shadow type',
			'When toggled on, a box-shadow will be displayed to the lower right of the progress bar container.  When toggled off, a glow shadow will be shown around the progress bar container.',
			'APB_boxShadowTypeToggle');

		if (this.plugin.settings.APB_boxShadowTypeToggle) {
			/************ Box-shadow H-offset *************/
			this.createSliderSetting(containerEl, 'H-offset', 'Set the %%horizontal%% offset of the box-shadow from a range of 1 to 5 pixels.  (See demonstration progress bar above)',
				'APB_hOffset', 0, 5, 1 );

			/************ Box-shadow V-offset *************/
			this.createSliderSetting(containerEl, 'V-offset', 'Set the %%vertical%% offset of the box-shadow from a range of 1 to 5 pixels.  (See demonstration progress bar above)',
				'APB_vOffset', 0, 5, 1 );
		}

		/************ Box-shadow Blur *************/
		this.createSliderSetting(containerEl, 'Blur', 'Set the %%blur%% of the %%box-shadow%% from a range of 0 to 5 pixels.  %%(See demonstration progress bar above)%%',
			'APB_blur', 0, 5, 1 );
		
		/************ Box-shadow Inset Toggle *************/
		this.createToggleSetting(containerEl, 'Inset',
			'When toggled on, it will be displayed as an inner shadow.  When toggled off, an outer shadow will be shown instead.',
			'APB_boxShadowInsetToggle');

		/************ Box-shadow Color *************/
		this.createColorPickerSetting(containerEl, 'Box-shadow color', 'Select the color of the container\'s box-shadow.',
			'APB_colorBoxShadow', DEFAULT_SETTINGS.APB_colorLightBoxShadow as string, DEFAULT_SETTINGS.APB_colorBoxShadow as string);
	}


	/************ SECTION Progress Bar Color *************/
	const setting10 = new Setting(containerEl).setName('Progress bar color').setHeading();
	const heading10 = setting10.settingEl.querySelector('.setting-item-name');
	if (heading10) {heading10.addClass('header-highlight');}

	/************ Completed Color *************/
	this.createColorPickerSetting(containerEl, 'Completed color', 'Select the color the entire progress bar will use when it reaches 100% completion.',
		'APB_colorBarCompleted', DEFAULT_SETTINGS.APB_colorLightBarCompleted as string, DEFAULT_SETTINGS.APB_colorBarCompleted as string);

	/************ Bar Background Color *************/
	this.createColorPickerSetting(containerEl, 'Bar background color', 'This color will be used for the progress bar\'s background, representing the remaining percentage.',
		'APB_colorBarBackground', DEFAULT_SETTINGS.APB_colorLightBarBackground as string, DEFAULT_SETTINGS.APB_colorBarBackground as string);



	/************ SECTION Tasks *************/	
	const setting11 = new Setting(containerEl).setName('Tasks').setHeading();
	const heading11 = setting11.settingEl.querySelector('.setting-item-name');
	if (heading11) {heading11.addClass('header-highlight');}

	/************ Allow Tasks *************/
	this.createToggleSetting(containerEl, 'Enable task linking',
		'When %%toggled on%%, you will be able to automatically update progress bars by using matching tags in the progress bar\'s title and tasks.  See documentation for full details.',
		'APB_allowTasksToggle');

	if (this.plugin.settings.APB_allowTasksToggle) {
		/************ Task Text Color *************/
		this.createColorPickerSetting(containerEl, 'Task text color', 'Choose the %%text%% color for task badges.',
			'APB_colorTaskText', DEFAULT_SETTINGS.APB_colorLightTaskText as string, DEFAULT_SETTINGS.APB_colorTaskText as string);

		/************ Task Background Color *************/
		this.createColorPickerSetting(containerEl, 'Task background color', 'Choose the %%background%% color for task badges.',
			'APB_colorTaskBackground', DEFAULT_SETTINGS.APB_colorLightTaskBackground as string, DEFAULT_SETTINGS.APB_colorTaskBackground as string);


		/************ Allow Sub Tasks *************/
		this.createToggleSetting(containerEl, 'Enable sub-task linking',
			'When %%toggled on%%, you will be able to automatically see your subtask status under the progerss bar.<br>See documentation for full details.',
			'APB_allowSubTasksToggle');

		if (this.plugin.settings.APB_allowSubTasksToggle) {
			/************ Sub Task Color *************/
			this.createColorPickerSetting(containerEl, 'Sub task color', 'Choose the %%text%% color for the sub task shown under your progress bar.',
				'APB_colorSubTaskText', DEFAULT_SETTINGS.APB_colorLightSubTaskText as string, DEFAULT_SETTINGS.APB_colorSubTaskText as string);

			/************ Sub Task Completed Color *************/
			this.createColorPickerSetting(containerEl, 'Sub task completed color', 'Choose the %%completed text%% color for the sub task shown under your progress bar.',
				'APB_colorSubTaskCompletedText', DEFAULT_SETTINGS.APB_colorLightSubTaskCompletedText as string, DEFAULT_SETTINGS.APB_colorSubTaskCompletedText as string);		
		}
	}



/************ SECTION Templates *************/
const setting12 = new Setting(containerEl).setName('Templates').setHeading();
const heading12 = setting12.settingEl.querySelector('.setting-item-name');
if (heading12) {heading12.addClass('header-highlight');}

descText = 'Create a template with custom gradient or stepped colors.<br>Note that %%color pickers%% with a value of %%#000000%% (%%pure black%%) will be ignored.<br>The %%default template%% is applied to all progress bars that do %%not%% have a custom template assigned.<br>(See documentation for full details)'
segments = this.splitTextIntoSegments(descText);

new Setting(containerEl)
    .setName('Add new template')
	.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
	.addButton(button => button
	.setButtonText('Add template')
	.setTooltip('Create a new template')
	.onClick(async () => {
		const templateCount = this.plugin.settings.templates.length;
		this.plugin.settings.templates.push({
			name: 'New Template ' + (templateCount + 1),
			gradient: false,
			gradientType: false,
			colors: ['#000000', '#000000', '#000000', '#000000', '#000000'],
		});
		await this.plugin.saveSettings();
		this.display();
	}));

	const rowContainer = containerEl.createDiv({ cls: 'settings-row-container' });
	const headersRow = rowContainer.createDiv({ cls: 'settings-row-headers' });

	const headers = ['Template Name', '|', 'Gradient Toggle', '|', 'Gradient Type Toggle', '|',  'Color 1 - 5', '|',  '3 Color Presets'];
	headers.forEach((header, index) => {
		headersRow.createEl('span', {
			text: header,
			cls: ['settings-row-header', (header === 'Gradient Toggle' || header === 'Gradient Type Toggle') ? 'gradient-header' : '']
		});
	});

	// Render Default template row (non-editable, non-movable, non-deletable)
	const defaultSetting = new Setting(containerEl)
	.setClass('default-setting-row')

  defaultSetting.addExtraButton((extra) => {
	extra
	  .setIcon('lock') // lock icon to indicate non-deletable default template
	  .setTooltip('Default template (non-deletable)')
	  .extraSettingsEl.createEl('span', {
		text: 'Default',
		cls: 'setting-item-name',
		attr: { style: 'flex: 1; padding: 4px 8px; color: #888888;' }
	  });
  });

	// Gradient toggle
	defaultSetting.addToggle((toggle) => {
	toggle
		.setValue(this.plugin.settings.defaultTemplate.gradient)
		.setTooltip('Enable gradient')
		.onChange(async (value) => {
		this.plugin.settings.defaultTemplate.gradient = value;
		await this.plugin.saveSettings();
		this.display();
		});
	});

	// Gradient type toggle
	defaultSetting.addToggle((toggle) => {
	toggle
		.setValue(this.plugin.settings.defaultTemplate.gradientType)
		.setTooltip('Gradient type: (off) Linear / (on) Color-mix')
		.onChange(async (value) => {
		this.plugin.settings.defaultTemplate.gradientType = value;
		await this.plugin.saveSettings();
		this.display();
		});
	});

	// Up to 5 color pickers
	for (let i = 0; i < 5; i++) {
		defaultSetting.addColorPicker((color) => {
			color
			.setValue(this.plugin.settings.defaultTemplate.colors[i] || '#000000')
			.onChange(async (value) => {
				this.plugin.settings.defaultTemplate.colors[i] = value;
				await this.plugin.saveSettings();
				this.display();
			});
		});		
	}
	
	// Light colors Default
	defaultSetting.addButton((button) => {
		button
		.setIcon('sun')
		.setTooltip('Reset to light default')
		.onClick(async () => {
			this.plugin.settings.defaultTemplate.colors = [...this.plugin.settings.defaultLightColors];
			await this.plugin.saveSettings();
			this.display();
		});
	});

	// Dark colors Default
	defaultSetting.addButton((button) => {
		button
		.setIcon('moon')
		.setTooltip('Reset to dark default')
		.onClick(async () => {
			this.plugin.settings.defaultTemplate.colors = [...this.plugin.settings.defaultDarkColors];
			await this.plugin.saveSettings();
			this.display();
		});
	});

	// Rainbow colors Default
	defaultSetting.addButton((button) => {
		button
		.setIcon('rainbow')
		.setTooltip('Reset to rainbow default')
		.onClick(async () => {
			this.plugin.settings.defaultTemplate.colors = [...this.plugin.settings.defaultRainbowColors];
			await this.plugin.saveSettings();
			this.display();
		});
	});
	
	// padding to align default with template controls
	defaultSetting.settingEl.createDiv({ cls: 'spacer-button' });

    // Render each template as a row
    this.plugin.settings.templates.forEach((template, index) => {
      const setting = new Setting(containerEl)
        .setClass('template-setting-row')
		.setName(`${index + 1}`);

	// Template name input
	setting.addText((text: TextComponent) => {
		text
			.setPlaceholder('Template name')
			.setValue(template.name)
			.onChange(async (value) => {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(async () => {
					const trimmedValue = value.trim() || 'Unnamed';
					let newName = trimmedValue;
					// Check if the name is unique (case-insensitive), excluding the current template
					const isNameTaken = this.plugin.settings.templates
						.filter((_, i) => i !== index) // Exclude current template
						.some(t => t.name.toLowerCase() === trimmedValue.toLowerCase());
					
					// If name is taken or matches defaultTemplate, append a number
					if (isNameTaken || trimmedValue.toLowerCase() === this.plugin.settings.defaultTemplate.name.toLowerCase()) {
						let suffix = 2;
						while (
							this.plugin.settings.templates.some((t, i) => i !== index && t.name.toLowerCase() === `${trimmedValue} ${suffix}`.toLowerCase()) ||
							`${trimmedValue} ${suffix}`.toLowerCase() === this.plugin.settings.defaultTemplate.name.toLowerCase()
						) {
							suffix++;
						}
						newName = `${trimmedValue} ${suffix}`;
					}

					this.plugin.settings.templates[index].name = newName;
					await this.plugin.saveSettings();
					this.display();
				}, 1000);
			});
		text.inputEl.style.flex = '1';
	});

	// Gradient toggle
	setting.addToggle((toggle: ToggleComponent) => {
	toggle
		.setValue(template.gradient)
		.setTooltip('Enable gradient')
		.onChange(async value => {
			this.plugin.settings.templates[index].gradient = value;
			await this.plugin.saveSettings();
			this.display();
		});
	});

	// Gradient type toggle
	setting.addToggle((toggle: ToggleComponent) => {
	toggle
		.setValue(template.gradientType)
		.setTooltip('Gradient type: (off) Linear / (on) Color-mix')
		.onChange(async value => {
			this.plugin.settings.templates[index].gradientType = value;
			await this.plugin.saveSettings();
			this.display();
		});
	});

	// Up to 5 color pickers
	for (let i = 0; i < 5; i++) {
	setting.addColorPicker((color: ColorComponent) => {
		color
		.setValue(template.colors[i] || '#000000')
		.onChange(async value => {
			this.plugin.settings.templates[index].colors[i] = value;
			await this.plugin.saveSettings();
			this.display();
		});
	});
	}

	// Light colors Default
	setting.addButton((button) => {
	button
		.setIcon('sun')
		.setTooltip('Reset to light default')
		.onClick(async () => {			
			this.plugin.settings.templates[index].colors = [...this.plugin.settings.defaultLightColors];
			await this.plugin.saveSettings();
			this.display();
		});
	});

	// Dark colors Default
	setting.addButton((button) => {
	button
		.setIcon('moon')
		.setTooltip('Reset to dark default')
		.onClick(async () => {			
			this.plugin.settings.templates[index].colors = [...this.plugin.settings.defaultDarkColors];
			await this.plugin.saveSettings();
			this.display();
		});
	});

	// Rainbow colors Default
	setting.addButton((button) => {
	button
		.setIcon('rainbow')
		.setTooltip('Reset to rainbow default')
		.onClick(async () => {			
			this.plugin.settings.templates[index].colors = [...this.plugin.settings.defaultRainbowColors];
			await this.plugin.saveSettings();
			this.display();
		});
	});

	// Move up button
	setting.addButton((button: ButtonComponent) => {
	button
		.setIcon('arrow-up')
		.setTooltip('Move up')
		.setClass('subtle-button')
		.setDisabled(index === 0)
		.onClick(async () => {
			if (index > 0) {
				const temp = this.plugin.settings.templates[index];
				this.plugin.settings.templates[index] = this.plugin.settings.templates[index - 1];
				this.plugin.settings.templates[index - 1] = temp;
				await this.plugin.saveSettings();
				this.display();
			}
		});
	});

	// Move down button
	setting.addButton((button: ButtonComponent) => {
	button
		.setIcon('arrow-down')
		.setTooltip('Move down')
		.setClass('subtle-button')
		.setDisabled(index === this.plugin.settings.templates.length - 1)
		.onClick(async () => {
			if (index < this.plugin.settings.templates.length - 1) {
				const temp = this.plugin.settings.templates[index];
				this.plugin.settings.templates[index] = this.plugin.settings.templates[index + 1];
				this.plugin.settings.templates[index + 1] = temp;
				await this.plugin.saveSettings();
				this.display();
			}
		});
	});

	// Delete button
	setting.addButton((button: ButtonComponent) => {
	button
		.setIcon('trash')
		.setTooltip('Delete template')
		.setClass('subtle-button')
		.onClick(async () => {
			this.plugin.settings.templates.splice(index, 1);
			await this.plugin.saveSettings();
			this.display();
		});
	});
});



	return;
}

/************ setEndCaps Function *************/
setEndCaps(progressBarBackground: HTMLElement | null, progressbar: HTMLElement | null, endCap: boolean, clampedPercentage: number) {
	if (progressBarBackground && progressbar) {
	  	if (endCap) {
			progressBarBackground.style.borderRadius = '7px';
			if (clampedPercentage == 0) {
				progressbar.style.borderRadius = '7px'; // All sides rounded when percentage is not 0
			} else {
				progressbar.style.borderRadius = '0 7px 7px 0'; // Right side rounded when percentage is 0
			}
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
	const segments = this.splitTextIntoSegments(setDesc);
	const setting = new Setting(containerEl)
		.setName(setName)
		.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
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
	const segments = this.splitTextIntoSegments(setDesc);
	const setting = new Setting(containerEl)
		.setName(setName)
		.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
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


/************ Create a Slider with reset button Function *************/
createSliderSetting(
	containerEl: HTMLElement,
	setName: string,
	setDesc: string,
	settingKey: keyof ObsidianProgressBarsSettings,
	setMin: number,
	setMax: number,
	setStep: number	
) {
	const segments = this.splitTextIntoSegments(setDesc);
	const setting = new Setting(containerEl)
		.setName(setName)
		.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
		.addSlider((slider) => {			
			slider
				.setLimits(setMin, setMax, setStep)
				.setDynamicTooltip()				
				.setValue((this.plugin.settings[settingKey] as number) ?? DEFAULT_SETTINGS[settingKey])
				.onChange(async(value) =>  {
					(this.plugin.settings[settingKey] as number) = value;

					this.plugin.settings.APB_progressBarChange = true; /* maybe remove */
					await this.plugin.saveSettings();
					this.display();							
				})
			})			
		.addButton((button) =>
			button.setIcon('rotate-ccw').setTooltip('Reset to default')
			.onClick(async() => {					
				(this.plugin.settings[settingKey] as number) = DEFAULT_SETTINGS[settingKey] as number;
				
				this.plugin.settings.APB_progressBarChange = true; /* maybe remove */
				await this.plugin.saveSettings();
				this.display();
			})
		);
	}


	splitTextIntoSegments(descText: string): { text: string; isHighlighted: boolean; isNewLine?: boolean }[] {
		const regex = /%%([^%]*)%%|<br>/g;
		let segments: { text: string; isHighlighted: boolean; isNewLine?: boolean }[] = [];
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(descText)) !== null) {
			// Text before the match
			const before = descText.slice(lastIndex, match.index);
			if (before) {
				segments.push({ text: before, isHighlighted: false });
			}
			// Check if the match is a highlighted section or a <br>
			if (match[0] === '<br>') {
				segments.push({ text: '', isHighlighted: false, isNewLine: true });
			} else {
				const highlighted = match[1];
				segments.push({ text: highlighted, isHighlighted: true });
			}
			lastIndex = match.index + match[0].length;
		}

		// Add remaining text after the last match
		if (lastIndex < descText.length) {
			segments.push({ text: descText.slice(lastIndex), isHighlighted: false });
		}

		// If no segments, add the entire text as a single segment
		if (segments.length === 0) {
			segments.push({ text: descText, isHighlighted: false });
		}

		return segments;
	}

// New utility function to render segments
    private renderSegments(segments: { text: string; isHighlighted: boolean; isNewLine?: boolean }[], container: DocumentFragment): void {
        segments.forEach(segment => {
            if (segment.isNewLine) {
                container.appendChild(document.createElement('br'));
            } else {
                const span = container.createSpan();
                span.textContent = segment.text;
                if (segment.isHighlighted) {
                    span.addClass('highlight-text');
                }
            }
        });
    }
}


// Debounce function to limit frequent calls
function debounce(func: (...args: any[]) => void, wait: number) {
	let timeout: NodeJS.Timeout;
	return (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

function displayAPBError(el: HTMLElement, errorText: string): void {
	const APB_errorContainer = document.createElement('div');
	APB_errorContainer.addClass('error-container');
  
	const APB_errorMessage = document.createElement('div');
	APB_errorMessage.addClass('error-text-container');
	APB_errorMessage.createEl('span', { text: errorText });
  
	APB_errorContainer.appendChild(APB_errorMessage);
	el.appendChild(APB_errorContainer);
}