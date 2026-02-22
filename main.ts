import { App, Plugin, PluginSettingTab, Setting,  Notice, ButtonComponent, ColorComponent, ToggleComponent, TextComponent, TFile, MarkdownView, DropdownComponent } from 'obsidian';

const APB_PURE_BLACK = '#000000';
interface Template {
	name: string;
	gradient: boolean;
	gradientType: boolean;
	colors: string[]; // Array of up to 5 colors
	isColorPanelVisible: boolean;
	borderColor: string;
	backgroundColor: string;
	titleTextColor: string;
	percentageTextColor: string;
	fractionTextColor: string;
	completedTextColor: string;
	completedColor: string;
	barBackgroundColor: string;
	colorSubTaskText: string;
	colorSubTaskCompletedText: string;
	prefixValue: string;
	suffixValue: string;
	prefixTotal: string;
	suffixTotal: string;
	colorDates: string;
	colorDaysLeft: string;
	dateFormat: boolean;
	colorOverage: string;
	endcap: boolean;
	barHeight: number;
	manualMarks: number;
	[key: string]: string | boolean | string[] | number;
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
	APB_dateIncrement: number;
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
	/* Inline Edit Gear Settings */
	APB_inlineEditToggle: boolean;
	APB_inlineEditStepSize: number;
	APB_gearColor: string;
	APB_gearLightColor: string;
	APB_gearHoverColor: string;
	APB_gearHoverLightColor: string;
	APB_inlinePanelColor: string;
	APB_inlineButtonColor: string;
	APB_inlineTextColor: string;
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
	APB_TopMarginToggle: boolean;
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
	APB_autoTasksToggle: boolean;
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
	APB_isColorPanelVisible: boolean;
	[key: string]: string | string[] | Template | Template[] | number | boolean; // Added index signature
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
	APB_dateIncrement: 7,
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
	/* Inline Edit Gear Settings */
	APB_inlineEditToggle: false,
	APB_inlineEditStepSize: 1,
	APB_gearColor: '#24647f',
	APB_gearLightColor: '#796c72',
	APB_gearHoverColor: '#3db9d1',
	APB_gearHoverLightColor: '#bb3574',
	APB_inlinePanelColor: '#5e67ed',
	APB_inlineButtonColor: '#ffffff',
	APB_inlineTextColor: '#3f46b0',
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
	APB_TopMarginToggle: false,
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
	APB_autoTasksToggle: false,
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
	APB_colorDates: '#c1d7f9',
	APB_colorLightDates: '#5E4A45',
	APB_colorDaysLeft: '#7EEAEC',
	APB_colorLightDaysLeft: '#9E5542',
	/* Default Color Palettes */
	defaultLightColors: ['#278378', '#2baab9', '#4a32e2', '#7c328e', '#c11e49'], // old APB_color1Light to APB_color5Light
  	defaultDarkColors: ['#2978ef', '#8ec822', '#dfaa22', '#c84922', '#dd4a86'], // old APB_color1 to APB_color5
	defaultRainbowColors: ['#ff0000', '#eeff00', '#11ff00', '#7300ff', '#00e1ff'], // rainbow RYGPB
	/* Default Template */
	defaultTemplate: {
		name: 'Default',
		gradient: true,
		gradientType: false,
		colors: ['#2978ef', '#8ec822', '#dfaa22', '#c84922', '#dd4a86'], // Match old APB_color1 to APB_color5
		isColorPanelVisible: false,
		borderColor: '#474f62',
		backgroundColor: '#242a35',
		titleTextColor: '#8fa0ba',
		percentageTextColor: '#c1d7f9',
		fractionTextColor: '#8fa0ba',
		completedTextColor: '#c1d7f9',
		completedColor: '#576178',
		barBackgroundColor: '#3b4252',
		colorSubTaskText: '#8fa0ba',
		colorSubTaskCompletedText: '#6dd374',
		prefixValue: '',
		suffixValue: '',
		prefixTotal: '',
		suffixTotal: '',
		colorDates: '#c1d7f9',
		colorLightDates: '#5E4A45',
		colorDaysLeft: '#c1d7f9',
		colorLightDaysLeft: '#5E4A45',
		dateFormat: false,
		colorOverage: '#38edef',
		endcap: true,
		barHeight: 8,
		manualMarks: 3
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

		// Register a custom command to manually refresh
		this.addCommand({
			id: 'task-manual-refresh',
			name: 'Task manual refresh',

			callback: async () => {
				if (this.isUpdating || !this.settings.APB_allowTasksToggle) return;
				if (this.settings.APB_autoTasksToggle) return;

				new Notice('Processing Task Update ...', 2000);

				try {
					this.isUpdating = true;					
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

				const activeFile = this.app.workspace.getActiveFile();
				if (!activeFile) {
					new Notice('No active file to refresh', 2000);
					return;
				}
				// await this.processTaskUpdate(activeFile);
			}
		});

		// Command to calculate days since a start date
			this.addCommand({
			id: 'paste-date-code-block',
			name: 'Paste date code block',
			editorCallback: async (editor, view) => {
				editor.focus();
				// Ensure editor is valid
				if (!editor) {
					new Notice("No active editor found!");
					return;
				}

				// Get the current cursor position
				const cursor = editor.getCursor();

				// Get current date
				const currentDate = new Date();
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0');
				const day = String(currentDate.getDate()).padStart(2, '0');
				const formattedCurrentDate = `${year}-${month}-${day}`;

				// Add users prefered date increment to current date
				const weekLaterDate = new Date(formattedCurrentDate);
				const timeoutDays = Number(this.settings.APB_dateIncrement);
				if (isNaN(timeoutDays)) {
					new Notice('Error: APB_dateIncrement is not a valid number.'+this.settings.APB_dateIncrement);
					return;
				}
        		weekLaterDate.setDate(weekLaterDate.getDate() + timeoutDays);

				const newYear = weekLaterDate.getFullYear();
				const newMonth = String(weekLaterDate.getMonth() + 1).padStart(2, '0');
				const newDay = String(weekLaterDate.getDate()).padStart(2, '0');
				const newFormattedDate = `${newYear}-${newMonth}-${newDay}`;				
				const codeBlockText = `\`\`\`apb\n${this.settings.APB_title}: ${formattedCurrentDate}||${newFormattedDate}\n\`\`\``;

				// Calculate the new cursor position
				const lines = codeBlockText.split('\n');
				const newCursor = {
					line: cursor.line + lines.length - 1,
					ch: lines[lines.length - 1].length // Length of the last line
				};
				// Insert the code block text at the cursor position
				editor.replaceRange(codeBlockText, cursor);			
			
				// Ensure the cursor moves after the insertion
				setTimeout(() => {
					editor.setCursor(newCursor);
					editor.refresh();
				}, 0); // Zero-delay timeout ensures this runs after DOM updates
			
			},
		});


		// Register a custom command to manually sort grouped APB's
		this.addCommand({
			id: 'manual-sort',
			name: 'Manual sort',

			callback: async () => {
				const activeFile = this.app.workspace.getActiveFile();
				if (!activeFile) return;

				new Notice('Sorting Grouped Progress Bars ...', 2000);

				let content = await this.app.vault.read(activeFile);

				const apbRegex = /```apb\n([\s\S]*?)\n```/g;

				content = content.replace(apbRegex, (fullMatch, innerContent) => {

					const rows = innerContent.split('\n');
					if (rows.length === 0) return fullMatch;		

					// Extract rows excluding group header
					const header = rows[0];

					if (!/\[\[group\]\]/i.test(header)) return fullMatch;

					const sortMatch = header.match(/\[\[(asc|desc)\]\]/i);
					if (!sortMatch) return fullMatch;

					const sortDirection = sortMatch[1].toLowerCase();
					// console.log("Sort direction:", sortDirection);

					const progressRows = rows.slice(1);

					type ParsedRow = {
						row: string;
						percent: number;
					};

					const parsedRows: ParsedRow[] = progressRows.map((row: string) => {

						const normalMatch = row.match(/:\s*(\d+)\/(\d+)/);
						const dateMatch = row.match(/:\s*((19|20)\d{2}-\d{2}-\d{2})\|\|((19|20)\d{2}-\d{2}-\d{2})/);

						let percent = 0;

						if (normalMatch) {
							const current = parseInt(normalMatch[1], 10);
							const total = parseInt(normalMatch[2], 10);
							if (total > 0) percent = current / total;
						}

						else if (dateMatch) {
							const start = new Date(dateMatch[1]);
							const end = new Date(dateMatch[3]);
							const today = new Date();

							const MS_PER_DAY = 1000 * 60 * 60 * 24;

							const totalDays = Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);
							const elapsedDays = Math.floor((today.getTime() - start.getTime()) / MS_PER_DAY);


							if (totalDays !== 0) {
								percent = elapsedDays / totalDays;
							}
						}
						// console.log("Row:", row, "Percent:", percent);

						return { row, percent };
					});

					parsedRows.sort((a, b) => {
						return sortDirection === 'asc'
							? a.percent - b.percent
							: b.percent - a.percent;
					});

					const sortedRows = parsedRows.map(r => r.row);

					return `\`\`\`apb\n${header}\n${sortedRows.join('\n')}\n\`\`\``;
				});

				await this.app.vault.modify(activeFile, content);
				new Notice('Grouped Progress Bars Sorted ✓', 2000);
			}
		});


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
		if (this.settings.APB_allowTasksToggle && this.settings.APB_autoTasksToggle) {
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
		}

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
		
		// Added any custom task status characters
		const taskRegex = /(?:^|\n)([ \t]*)(?:-|\*|\d+\.) \[(.)\] (.+)$/gm;

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
					if (status.trim().toLowerCase() === 'x') {
						tagMap.get(currentTopTag).completed++;
					}
				}
			} else if (currentTopTag) {
				// Subtask: Count under currentTopTag, ignoring taskTag
				tagMap.get(currentTopTag).subTotal++;
				if (status.trim().toLowerCase() === 'x') {
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
			const taskTag = match[2].normalize('NFC');			
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
					// console.warn('tagSpan created:', { id: tagSpan.id, textContent: tagSpan.textContent, style: tagSpan.style.cssText, TAG: extractedTag });

					if (tagSpan.id == 'APB_tag') {
						tagSpan.style.color = 'rgba(255, 255, 255, 0.8)';
						tagSpan.style.background ='rgba(0, 0, 0, 0.4)';
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

// Helper to find template index by name
getTemplateIndexByName(name: string): number {
  return this.settings.templates.findIndex(template => 
    template.name && typeof template.name === 'string' && 
    template.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
}
 
// Helper to apply container styles
private applyContainerStyle(
    container: HTMLElement,
    property: 'border' | 'background', // Restrict to valid properties
    color: string,
    defaultValue: string,
    pureBlack: string
): void {
    container.style[property] = color !== pureBlack
        ? (property === 'border' ? `1px solid ${color}` : color)
        : defaultValue;
}

	renderProgressBar(source: string, el: HTMLElement) { {  	 	
		const groupRegex = /^\s*\[\[group\]\](?:([^{}\s][^{}]*))?(?:\s*\{([^}]+)\})?(?:\s*\[\[(asc|desc)\]\])?\s*$/i;

		const regex = new RegExp(
		//`^\\s*>?\\s*` + // allow optional ">" and spaces before the line for blockquote
		`^\\s*(?:>\\s*)*` +
		`(?:` +
			`(.+?)(?:#([\\p{L}\\p{N}\\p{Emoji}_-]+))?(?:~(\\d+)/(\\d+))?(?::\\s*(\\d+)/(\\d+))(?:\\{([^}]+)\\})?(?:\\s.*)?` +
			`|` +
			`([^:]+?):\\s*((19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))\\|\\|((19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))(?:\\{([^}]+)\\})?` +
		`)$`,
		'u'
		);

		// Split the source string into rows
		const rows = source.trim().split('\n');

		el.empty(); // Clear the default rendering

		let isGrouped = false;
		let groupTitle: string = ''
  		let groupTemplate: string = '';
		let titleExist = false;
		let startIndex = 0;
		if (rows.length > 0) {
			const rawHeader = rows[0];
			const groupMatch = rawHeader.match(groupRegex);

			if (groupMatch) {
				isGrouped = true;

				// Remove [[asc]] or [[desc]] from header before extracting title
				const cleanedHeader = rawHeader.replace(/\s*\[\[(asc|desc)\]\]\s*$/i, '');
				const titleMatch = cleanedHeader.match(/^\s*\[\[group\]\]([^{]*)/i);

				groupTitle = titleMatch?.[1]?.trim() || '';
				groupTemplate = groupMatch[2] || '';

				startIndex = 1;
			}

		}
  		
		let isValidTemplate = false;		
		if (groupTemplate && groupTemplate.trim() !== "") {			
			const matchedTemplate = this.settings.templates.find(t => t.name.toLowerCase() === groupTemplate.toLowerCase());
			
			isValidTemplate = !!matchedTemplate;
			
			if (!isValidTemplate) {
				displayAPBError(el, `APB_Error: Template "${groupTemplate}" not found`);
				// return;
			}
		}

	
		// Loop through each line
		rows.slice(startIndex).forEach(async (row, index) => {
			try {		
				const match: RegExpMatchArray | null = row.match(regex);

				let isProgressBarPattern = false;
				let isDatePattern = false;

				if (!match) {
					displayAPBError(el, `APB_Error: Invalid block format`);
					return;
				}
	 
			if (match[9] && match[13]) {
				isDatePattern = true;
			} else {
				isProgressBarPattern = true;
			}	

		const label: string = isDatePattern ? match[8] || '' : match[1] ? match[1].split('#')[0] || '' : '';
        const extractedTag: string = isDatePattern ? '' : match[2] || '';
        const templateName: string = isDatePattern ? match[17] || '' : match[7] || '';
        const startDateStr: string = isDatePattern ? match[9] : '';
        const endDateStr: string = isDatePattern ? match[13] : '';
        const subvalue: number = isDatePattern ? 0 : match[3] && !isNaN(parseInt(match[3], 10)) ? parseInt(match[3], 10) : 0;
        const subtotal: number = isDatePattern ? 0 : match[4] && !isNaN(parseInt(match[4], 10)) ? parseInt(match[4], 10) : 0;
        let current: number = isDatePattern ? 0 : match[5] && !isNaN(parseInt(match[5], 10)) ? parseInt(match[5], 10) : 0;
        let total: number = isDatePattern ? 0 : match[6] && !isNaN(parseInt(match[6], 10)) ? parseInt(match[6], 10) : 0;


		
	  
const APB_dates = document.createElement('div');
		if (isDatePattern) {
          	// Date pattern: yyyy-mm-dd||yyyy-mm-dd{template}
			// Validate dates
			const startDate = new Date(startDateStr);
			const endDate = new Date(endDateStr);
			if (
					isNaN(startDate.getTime()) ||
					isNaN(endDate.getTime()) ||
					startDateStr !== startDate.toISOString().split('T')[0] ||
					endDateStr !== endDate.toISOString().split('T')[0]
			) {
					new Notice('APB_Error: Invalid date format.');					
					isDatePattern = false;
					return;
			}

			// Calculate days since startDate (relative to current date)
			const currentDate = new Date();
			const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0');
				const day = String(currentDate.getDate()).padStart(2, '0');
				const formattedCurrentDate = `${year}-${month}-${day}`;

			const currentDateStr = currentDate.toISOString().split('T')[0];

			const normalizedCurrentDate = new Date(currentDateStr);
			// Normalize to remove time
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(0, 0, 0, 0);
			normalizedCurrentDate.setHours(0, 0, 0, 0);

			// Calculate days between dates
			const timeDifference = endDate.getTime() - startDate.getTime();
			const daysTotal = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

			// Calculate days left (endDate - currentDate)
			const daysLeftDiffTime = endDate.getTime() - normalizedCurrentDate.getTime();
			const daysLeft = Math.ceil(daysLeftDiffTime / (1000 * 60 * 60 * 24));

			current = daysTotal - daysLeft;
			total = daysTotal;

			// Add timeoutIdDate days to startDate
			const timeoutDays = Number(this.settings.APB_dateIncrement);
			if (isNaN(timeoutDays)) {
				new Notice('APB_Error: APB_dateIncrement is not a valid number.');
				return;
			}			
        } 

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

				if (index === 0 && this.settings.APB_TopMarginToggle) {
					APB_container.style.marginTop = '25px';
				} else {
					APB_container.style.marginTop = '7px';
				}

				// Set newTemplateName to be either defaultTemplate or templates[templateIndex]
				const templateIndex = this.getTemplateIndexByName(templateName);
				const newTemplateName = (!templateName.trim() || templateIndex === -1)
					? this.settings.defaultTemplate
					: this.settings.templates[templateIndex];

				this.applyContainerStyle(APB_container, 'border', newTemplateName.borderColor, '0px', APB_PURE_BLACK);
				this.applyContainerStyle(APB_container, 'background', newTemplateName.backgroundColor, 'transparent', APB_PURE_BLACK);
			
	// Determine group template
	let groupTemplateName = this.settings.defaultTemplate;
	if (groupTemplate && groupTemplate.trim()) {
		const groupTemplateIndex = this.getTemplateIndexByName(groupTemplate);
		if (groupTemplateIndex !== -1) {
			groupTemplateName = this.settings.templates[groupTemplateIndex];
		}
  	}

	if (isGrouped) {
		el.addClass('grouped-progress-bar');
		el.style.border = '1px solid ' + groupTemplateName.borderColor;
		el.style.background = groupTemplateName.backgroundColor;
		el.style.borderRadius = '7px';
		el.style.marginTop = '0px';
		el.style.padding = '5px !important';
	}

// If grouped, add a group title (optional)
  if (isGrouped && groupTitle && !titleExist) {
    el.createEl('div', {
      cls: 'progressBar-group-title',
      text: groupTitle,
      attr: { style: 'margin-left: 10px; font-weight: bold; color: ' + groupTemplateName.titleTextColor } // Match title color
    });
	titleExist = true;
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

				// APB_Dates Container
				const APB_datesContainer = document.createElement('div');
				APB_datesContainer.addClass('progressBar-dates-container');				

			if (isDatePattern) {
				let hasContent = false;
				const APB_dates = APB_datesContainer.createEl('div', { cls: 'progressBar-date' });
				APB_dates.style.width = '100%';
				APB_dates.style.display = 'flex';
				APB_dates.style.justifyContent = 'space-between';
				APB_dates.style.alignItems = 'center';

				let startDateFormated = 'YMD';
				let endDateFormated = 'YMD';
				if (newTemplateName.dateFormat) {
					startDateFormated = formatDate(startDateStr, 'MDY');
					endDateFormated = formatDate(endDateStr, 'MDY');
				} else {
					startDateFormated = formatDate(startDateStr, 'DMY');
					endDateFormated = formatDate(endDateStr, 'DMY');
				}

				if (typeof newTemplateName.colorDates === 'string' && newTemplateName.colorDates !== APB_PURE_BLACK) {
					APB_dates.style.color = newTemplateName.colorDates as string;
					APB_dates.createEl('span', { text: startDateFormated, cls: 'progressBar-date-start',attr: { style: `color: ${newTemplateName.colorDates}; text-align: left; flex: 0 1 auto;` } });
					hasContent = true;
				}
					
				if(typeof newTemplateName.colorDaysLeft === 'string' && newTemplateName.colorDaysLeft !== APB_PURE_BLACK) {
					const daysLeftNumber = total - current;
					let daysLeftText: string;
					
					if (daysLeftNumber === 0) {
						daysLeftText = 'today';
					} else if (daysLeftNumber === 1) {
						daysLeftText = '1 day left';
					} else if (daysLeftNumber > 1) {
						daysLeftText = `${daysLeftNumber} days left`;
					} else if (daysLeftNumber === -1) {
            			daysLeftText = '1 day ago';
					} else if (daysLeftNumber < 0) {
						daysLeftText = `${Math.abs(daysLeftNumber)} days ago`;
					} else {
						daysLeftText = `${daysLeftNumber} days left`; // Fallback
					}
					APB_dates.createEl('span', { text: daysLeftText, cls: 'progressBar-date-left', attr: { style: `color: ${newTemplateName.colorDaysLeft}; margin: auto; flex: 0 1 auto;` } });
					hasContent = true;				
				}

				// End date
				if (typeof newTemplateName.colorDates === 'string' &&  newTemplateName.colorDates !== APB_PURE_BLACK) {
					APB_dates.style.color = newTemplateName.colorDates as string;
					APB_dates.createEl('span', { text: endDateFormated, cls: 'progressBar-date-end',attr: { style: `color: ${newTemplateName.colorDates}; text-align: right; flex: 0 1 auto;` } });
					hasContent = true;
				}

				// Remove APB_dates if no content was added
				if (!hasContent) {
					APB_dates.remove();
				}
			
			}

				
				// APB_ BarBackground container
				const APB_background = document.createElement('div');
				APB_background.addClass('progressBar-background');

				if (clampedPercentage !== 100) {
					APB_background.style.overflow ='hidden';
				}				

				// APB_Title
				const APB_title = document.createElement('div');
				APB_title.addClass('progressBar-title');

				if (newTemplateName.titleTextColor !== APB_PURE_BLACK) {				

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
						// console.log("No ' + extractedTag + ' was found in APB_title: " + label);						
					}

					APB_title.createEl('span', { text: label });
					APB_title.style.color = newTemplateName.titleTextColor;
				}
				const APB_subtask = document.createElement('div');

				const isValidTag = await this.findMatchingTasks(extractedTag);
				if (isValidTag) {	
					// Sub Tasks
					if (this.settings.APB_allowTasksToggle && this.settings.APB_allowSubTasksToggle) {					
						if (subtotal !== null && subtotal !==0) {
							if (subvalue == subtotal) {
								APB_subtask.addClass('progressBar-subtask-completed');
								if (newTemplateName.colorSubTaskCompletedText && newTemplateName.colorSubTaskCompletedText !== APB_PURE_BLACK) {					
									APB_subtask.style.color = newTemplateName.colorSubTaskCompletedText as string;							
									APB_subtask.createEl('span', { text: 'Sub Tasks - ' + subvalue + '/' + subtotal + ' completed'});
								} else {
									newTemplateName.colorSubTaskCompletedText = APB_PURE_BLACK;
								}
							} else {
								APB_subtask.addClass('progressBar-subtask');
								if (newTemplateName.colorSubTaskText && newTemplateName.colorSubTaskText !== APB_PURE_BLACK) {
									APB_subtask.style.color = newTemplateName.colorSubTaskText as string;
									APB_subtask.createEl('span', { text: 'Sub Tasks - ' + subvalue + '/' + subtotal });
								} else {
									newTemplateName.colorSubTaskText = APB_PURE_BLACK;
								}
							}
						}					
					}
				}
				
				// APB_Percentage
				const APB_percentage = document.createElement('div');
				APB_percentage.addClass('progressBar-percentage');
				if (newTemplateName.percentageTextColor !== APB_PURE_BLACK) {
					if(this.settings.APB_overageToggle && overage > 0) {
						APB_percentage.createEl('span', { text: (overage+100)+'%' });
						APB_percentage.style.color = newTemplateName.colorOverage;
					} else {
						APB_percentage.createEl('span', { text: clampedPercentage+'%' });
						APB_percentage.style.color = newTemplateName.percentageTextColor;
					}

				}

				// APB_Value				
				const APB_value = document.createElement('div');
				APB_value.addClass('progressBar-value');
				if (newTemplateName.fractionTextColor !== APB_PURE_BLACK) {
					const prefixValue = newTemplateName.prefixValue ?? '';
					const suffixValue = newTemplateName.suffixValue ?? '';
					const prefixTotal = newTemplateName.prefixTotal ?? '';
					const suffixTotal = newTemplateName.suffixTotal ?? '';

					APB_value.createEl('span', { text: '('+prefixValue+current+suffixValue+'/'+prefixTotal+total+suffixTotal+')' });
					APB_value.style.color = newTemplateName.fractionTextColor
				}
				
				// APB_Completed
				const APB_completed = document.createElement('div');
				APB_completed.addClass('progressBar-completed');
				if (newTemplateName.completedTextColor !== APB_PURE_BLACK) {
					APB_completed.createEl('span', { text: '' });
				}		

				// Check if templateName is provided (not null, undefined, or empty string)
				let isValidTemplate = false;
				if (templateName && templateName.trim() !== "") {						
					const matchedTemplate = this.settings.templates.find(t => t.name.toLowerCase() === templateName.toLowerCase());

					isValidTemplate = !!matchedTemplate;

					if (!isValidTemplate) {
						displayAPBError(el, `APB_Error: Template "${templateName}" not found`);
						return;
					}
				}
				
				const useGradient = newTemplateName ? newTemplateName.gradient : false;
				const gradientType = newTemplateName ? newTemplateName.gradientType : false;
				const colors = newTemplateName && newTemplateName.colors ? Array.isArray(newTemplateName.colors) ? newTemplateName.colors : [newTemplateName.colors] : ["#ff0000", "#00ff00"] as string[];
				const validColors = colors.filter(c => c && c !== '#000000').slice(0, 5);		
				const numberOfValidColors = validColors.length;

				// Create progressBar-filled (filled portion)
				const filledBar = document.createElement('div');
				filledBar.className = 'progressBar-filled';
				filledBar.style.position = 'relative';
				filledBar.style.width = `${clampedPercentage}%`;
				filledBar.style.height = `${newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height}px`;
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
				
				APB.style.background = newTemplateName.barBackgroundColor;
				APB.style.height = `${newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height}px`;		

				this.settingsTab.setEndCaps(APB_background, APB, newTemplateName.endcap,  clampedPercentage);

				if (clampedPercentage !== 100) {
					APB_background.appendChild(APB);
				}

				const marks = document.createElement('div');
				marks.addClass('marks');

				var numberOfSections;

				if (this.settings.APB_autoMarksToggle) {
					numberOfSections = numberOfValidColors;
				} else {
					numberOfSections = this.settings.APB_manualMarks + 1;
				}
				
				if (newTemplateName.manualMarks >= 1 && newTemplateName.manualMarks <= 19) {
					numberOfSections = newTemplateName.manualMarks + 1;
				} else if (newTemplateName.manualMarks === 0) {
					numberOfSections = 0;
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
				
				if (newTemplateName.endcap && clampedPercentage > 0 && clampedPercentage < 100){
					// ======= Create round end mask for inverse progress bar =======
					const dpr = window.devicePixelRatio || 1; // Get device pixel ratio
					const mask = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
					mask.setAttribute('class', 'progressBar-mask');
					mask.setAttribute('width', `${(newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height) / 2}`); // 1 unit wide
					mask.setAttribute('height', `${newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height}`);    // 2 units tall
					mask.setAttribute('viewBox', `0 0 ${((newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height) / 2)} ${newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height}`);
					mask.style.position = 'absolute';
					mask.style.top = '0';
					mask.style.right = `-${1 / dpr}px`; // Nudge right to close the 1-pixel gap
					mask.style.width = `${((newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height )+ 0.5) / 2}px`;
					mask.style.height = `${newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height}px`;

					// Generate a unique ID for the mask to avoid conflicts
					const uniqueId = `round-end-mask-${Math.random().toString(36).substring(2, 9)}`;

					// mask.style.pointerEvents = 'none';	
					mask.innerHTML = `
						<defs>
							<mask id="${uniqueId}">
							<rect x="0" y="-1" width="${((newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height) + 10.5) / 2}" height="${(newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height) + 3}" fill="white"/>
							<circle cx="0" cy="${(newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height) / 2}" r="${(newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height) / 2}" fill="black"/>
							</mask>
						</defs>
						<rect x="0" y="-1" width="${((newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height) + 10.5) / 2}" height="${(newTemplateName.barHeight ?? DEFAULT_SETTINGS.APB_height) +3}" fill="${newTemplateName.barBackgroundColor}" mask="url(#${uniqueId})"/>
						`;
						filledBar.appendChild(mask);						
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
					APB.style.backgroundColor = newTemplateName.completedColor;
					if (newTemplateName.completedTextColor !== APB_PURE_BLACK) {
						APB_completed.addClass('progressBar-completed');
						APB_completed.style.color = newTemplateName.completedTextColor;
						APB_completed.textContent ='COMPLETED';
					}						
					filledBar.style.backgroundImage = '';
					if (newTemplateName.completedColor !== APB_PURE_BLACK) {
						APB_background.style.backgroundColor = clampedPercentage === 100 ? newTemplateName.completedColor : colors[0];
					}
				}

				APB_background.style.backgroundSize = '100% 100%';
				APB_background.style.backgroundRepeat = 'no-repeat';

				this.settings.APB_progressBarChange = true;
				APB_container.appendChild(APB_textContainer);
				
				if (newTemplateName.titleTextColor !== APB_PURE_BLACK) {
					APB_textContainer.appendChild(APB_title);
				}
				if (newTemplateName.percentageTextColor !== APB_PURE_BLACK) {
					APB_textContainer.appendChild(APB_percentage);
				}
				if (newTemplateName.fractionTextColor !== APB_PURE_BLACK) {
					APB_textContainer.appendChild(APB_value);
				}

				APB_container.appendChild(APB_background);
				APB_container.appendChild(APB_subtask);

				if (isDatePattern) {
					APB_container.appendChild(APB_datesContainer);
				}

				// Progress bar has NO tag 
				if (!extractedTag && this.settings.APB_inlineEditToggle) {

					// top margin if 1st progress bar in APB block has gear icon
					if(index == 0 && this.settings.APB_TopMarginToggle) {
						APB_container.style.marginTop = '25px';
					} else {
						APB_container.style.marginTop = '7px';
					}


					let contrastText: string;
					let contrastTextHover: string;

					// console.log(APB_container.style.background);
					if (APB_container.style.background !== 'transparent') {
							contrastText = getContrastTextColorRGB(APB_container.style.background, 0.3);
							contrastTextHover = getContrastTextColorRGB(APB_container.style.background, 0.5);
					} else {
							contrastText ='#999999';
							contrastTextHover ='#666666';
					}

				if (isProgressBarPattern) {
					// Settings gear button
					const settingsButton = document.createElement('button');
					settingsButton.className = 'progressBar-settings-button';
					settingsButton.innerHTML = `
					<svg class="settings-icon" width="16" height="16" viewBox="0 0 24 24" fill="`+contrastText+`" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-.97l2.03-1.63a.5.5 0 0 0 .11-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.39.96c-.51-.38-1.06-.7-1.65-.97l-.36-2.55a.5.5 0 0 0-.5-.41h-4a.5.5 0 0 0-.5.41l-.36 2.55c-.59.27-1.14.59-1.65.97l-2.39-.96a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .11.64l2.03 1.63c-.04.31-.07.65-.07.97s.03.66.07.97l-2.03 1.63a.5.5 0 0 0-.11.64l2 3.46a.5.5 0 0 0 .61.22l2.39-.96c.51.38 1.06.7 1.65.97l.36 2.55a.5.5 0 0 0 .5.41h4a.5.5 0 0 0 .5-.41l.36-2.55c.59-.27 1.14-.59 1.65-.97l2.39.96a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.11-.64l-2.03-1.63z"/>
					</svg>
					`;					
					settingsButton.style.backgroundColor = 'transparent';					
					settingsButton.style.border = '0px solid ' + 'transparent';
					settingsButton.style.display = 'inline-flex';
					settingsButton.style.alignItems = 'center';
					settingsButton.style.justifyContent = 'center';
					settingsButton.style.boxShadow = 'none';

					// Programmatically set gear hover color					
					const style = document.createElement('style');
					style.setAttribute('data-plugin', 'SvgIconPlugin');
					style.textContent = `
						.progressBar-settings-button:hover .settings-icon {
							fill: ${contrastTextHover};
						}
					`;
					document.head.appendChild(style);

					// Pop-up panel
					const panel = document.createElement('div');
					panel.className = 'progressBar-settings-panel';   
					panel.style.backgroundColor = this.settings.APB_inlinePanelColor;

					const input = document.createElement('input');
					input.type = 'number';
					input.value = current.toString();
					input.style.width = '60px';
					input.style.marginRight = '5px';
					input.style.border = 'none';
					input.style.boxShadow = 'none';

					const buttonContainer = document.createElement('div');
					buttonContainer.style.display = 'flex';
					buttonContainer.style.flexWrap = 'wrap';
					buttonContainer.style.gap = '5px';
					buttonContainer.style.margin = '3px';

					const incrementButton = document.createElement('button');
					incrementButton.textContent = '+' + this.settings.APB_inlineEditStepSize;
					incrementButton.style.backgroundColor = this.settings.APB_inlineButtonColor;
					incrementButton.style.color = this.settings.APB_inlineTextColor;

					const decrementButton = document.createElement('button');
					decrementButton.textContent = '−' + this.settings.APB_inlineEditStepSize;
					decrementButton.style.backgroundColor = this.settings.APB_inlineButtonColor;
					decrementButton.style.color = this.settings.APB_inlineTextColor;

					const applyButton = document.createElement('button');
					applyButton.textContent = 'Apply';
					applyButton.style.backgroundColor = this.settings.APB_inlineButtonColor;
					applyButton.style.color = this.settings.APB_inlineTextColor;

					const cancelButton = document.createElement('button');
					cancelButton.textContent = 'Cancel';
					cancelButton.style.backgroundColor = this.settings.APB_inlineButtonColor;
					cancelButton.style.color = this.settings.APB_inlineTextColor;

					incrementButton.addEventListener('click', (e) => {
						e.stopPropagation();
						const currentValue = parseInt(input.value);
						if (isNaN(currentValue)) {
							new Notice("Invalid progress value", 2000);
							return;
						}
						let newValue = currentValue + this.settings.APB_inlineEditStepSize;
						if (!this.settings.APB_overageToggle) {
							newValue = Math.min(Math.max(newValue, 0), total);
						}
						input.value = newValue.toString();
					});

					decrementButton.addEventListener('click', (e) => {
						e.stopPropagation();
						const currentValue = parseInt(input.value);
						if (isNaN(currentValue)) {
							new Notice("Invalid progress value", 2000);
							return;
						}
						const stepSize = this.settings.APB_inlineEditStepSize || 1;
						let newValue = currentValue - stepSize;
						newValue = Math.max(newValue, 0); // Prevent going below 0
						input.value = newValue.toString();
					});

					applyButton.addEventListener('click', async (e) => {
						e.stopPropagation();
						if (!this.settings.APB_allowTasksToggle) {
							new Notice('Task updates are disabled', 2000);
							return;
						}
						const activeFile = this.app.workspace.getActiveFile();
						if (!activeFile) {
							new Notice('No active file', 2000);
							return;
						}
						const newCurrent = parseInt(input.value);
						if (isNaN(newCurrent)) {
							new Notice('Invalid number', 2000);
							return;
						}
						await this.updateProgressValue(activeFile, index, newCurrent, total, row);
						panel.style.display = 'none';
					});

					cancelButton.addEventListener('click', (e) => {
						e.stopPropagation();
						panel.style.display = 'none';
					});

					// outside click handler
					const outsideClickHandler = (e: MouseEvent) => {
						const target = e.target as Node;
						if (!panel.contains(target) && !settingsButton.contains(target)) {
							panel.style.display = 'none';
						}
					};

					settingsButton.addEventListener('click', (e) => {
						e.stopPropagation();
						e.preventDefault();
						const isVisible = panel.style.display === 'flex';
						panel.style.display = isVisible ? 'none' : 'flex';
						if (!isVisible) {
							input.value = current.toString(); // Reset input on open
							input.focus();
							document.addEventListener('click', outsideClickHandler, { capture: true });
						} else {
							document.removeEventListener('click', outsideClickHandler, { capture: true });
						}
					});

					buttonContainer.appendChild(input);
					buttonContainer.appendChild(decrementButton);
					buttonContainer.appendChild(incrementButton);
					buttonContainer.appendChild(applyButton);
					buttonContainer.appendChild(cancelButton);
					
					panel.appendChild(buttonContainer);

					// Remove inline gear settings icon if embeded via wikilink
					const isEmbedded = el.closest('.markdown-embed') !== null;
					if (!isEmbedded) {
						APB_textContainer.appendChild(settingsButton);
					}

					APB_textContainer.appendChild(panel);
				}				
				
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
			}
			el.appendChild(APB_container);

			} catch (error) {
        console.error('Error in row processing:', error);
        displayAPBError(el, `APB_Error: Failed to render row: ${row}`);
      }
	});
		};
	}



async updateProgressValue(file: TFile, rowIndex: number, newCurrent: number, total: number, originalRow: string) {
	
	// Clamp newCurrent
	let clampedCurrent = newCurrent;
	if (!this.settings.APB_overageToggle) {
		clampedCurrent = Math.min(Math.max(newCurrent, 0), total);
	} else {
		clampedCurrent = Math.max(newCurrent, 0);
	}

	// Read file content
	const content = await this.app.vault.read(file);
	const rows = content.split('\n');

	// Find the row matching originalRow
    let targetRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
		// Normalize both lines by stripping all leading blockquote markers and spaces
		const normalizedFileRow = rows[i].replace(/^\s*(?:>\s*)+/, '').trim();
		const normalizedOriginal = originalRow.replace(/^\s*(?:>\s*)+/, '').trim();

		if (normalizedFileRow === normalizedOriginal) {
        targetRowIndex = i;
        break;
    	}
    }

	if (targetRowIndex === -1) {
        console.error("Could not find row matching originalRow:", originalRow);
        new Notice("Failed to update: Progress bar row not found", 2000);
        return;
    }

   	// Parse and update the row
    const rowToUpdate = rows[targetRowIndex];

	// Capture any leading blockquote markers (e.g. >> or >>>)
	const leadingQuotesMatch = rowToUpdate.match(/^[ \t]*(?:>[ \t]*)*/);
	const leadingQuotes = leadingQuotesMatch ? leadingQuotesMatch[0] : '';

	// Update the specific row
	if (rowIndex < rows.length) {
		// console.log("rowIndex:", rowIndex, "rows.length:", rows.length);
		const match = rowToUpdate.match(/^\s*(?:>\s*)*(.+?)(?:#([\p{L}\p{N}\p{Emoji}_-]+))?(?:~(\d+)\/(\d+))?(?::\s*(\d+)\/(\d+))(?:\{([^}]+)\})?(?:\s.*)?$/u);
		
		if (match) {
			const label = match[1] || '';
			const tag = match[2] ? `#${match[2]}` : '';
			const subvalue = match[3] || '';
			const subtotal = match[4] || '';
			const subtasks = subvalue && subtotal ? `~${subvalue}/${subtotal}` : '';
			const template = match[7] ? `{${match[7]}}` : '';

			// Build updated row, preserving blockquote prefix
			const newRow = `${leadingQuotes}${label}${tag}${subtasks}: ${clampedCurrent}/${total}${template}`;

			rows[targetRowIndex] = newRow;

			// Write updated content
			const newContent = rows.join('\n');
			
			try {
				await this.app.vault.modify(file, newContent);
				new Notice('APB Data Update ...', 2000);

				this.isUpdating = true;
				await this.updateProgress();
				new Notice('APB Data Update Completed', 2000);

				// console.log("File modified successfully");
				// const updatedContent = await this.app.vault.read(file);
				// console.log("Updated file content:", updatedContent);
			} catch (error) {
				console.error("File write failed:", error);
				new Notice("Failed to write to file: " + error.message, 2000);
			} finally {
			setTimeout(() => (this.isUpdating = false), 2000);
			}
		} else {
			console.error("Regex failed to match row:", rowToUpdate);
			new Notice("Failed to update: Invalid row format", 2000);
		}
	}
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
 	colorPickerContainers: Record<number, HTMLDivElement> = {};
	colorPickers: Record<string, ColorComponent> = {}; // Store color pickers by settingKey
	
	// Explicitly define the type of the event listener
    private copyButtonListener: (event: MouseEvent) => void;
	colorPickerContainer: HTMLDivElement;
	defaultColorPickerContainer: HTMLDivElement;

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


/************ SECTION Demo Progress Bar *************/
const setting2 = new Setting(containerEl).setName('Demonstration progress bar').setHeading();
const heading2 = setting2.settingEl.querySelector('.setting-item-name');
if (heading2) {heading2.addClass('header-highlight');}

new Setting(containerEl)
	.setDesc('Any changes you make to this settings page will be instantly reflected in the demonstration progress bar below.  Use it as a guide when making your decisions. Note that template colors will not be shown in this demo.')

	/************ Demo Progress Bar *************/
	const progressBarContainer = containerEl.createEl('div');
	progressBarContainer.addClass('progressBar-container');

	if (this.plugin.settings.defaultTemplate.borderColor !== APB_PURE_BLACK) {
		progressBarContainer.style.border = '1px solid'+ this.plugin.settings.defaultTemplate.borderColor;
	} else {
		progressBarContainer.style.border = '0px';
	}

	if (this.plugin.settings.defaultTemplate.backgroundColor !== APB_PURE_BLACK) {
		progressBarContainer.style.background = this.plugin.settings.defaultTemplate.backgroundColor;
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
	if (this.plugin.settings.defaultTemplate.titleTextColor !== APB_PURE_BLACK) {
		progressBarTitle.createEl('span', { text: this.plugin.settings.APB_title });
		progressBarTitle.style.color = this.plugin.settings.defaultTemplate.titleTextColor;
	}

	// DemoBar Percentage
	const progressBarPercentage = containerEl.createEl('div');
	progressBarPercentage.addClass('progressBar-percentage');
	if (this.plugin.settings.defaultTemplate.percentageTextColor !== APB_PURE_BLACK) {
		progressBarPercentage.createEl('span', { text: this.plugin.settings.APB_progressBarPercentage+'%' });
		progressBarPercentage.style.color = this.plugin.settings.defaultTemplate.percentageTextColor;
	}

	// DemoBar Value
	const progressBarValue = containerEl.createEl('div');
	progressBarValue.addClass('progressBar-value');
	const valueFromPercentageOfTotal = Math.floor((this.plugin.settings.APB_total/100) * this.plugin.settings.APB_progressBarPercentage);
	if (this.plugin.settings.defaultTemplate.fractionTextColor !== APB_PURE_BLACK) {
		const prefixValue = this.plugin.settings.defaultTemplate.prefixValue ?? '';
		const suffixValue = this.plugin.settings.defaultTemplate.suffixValue ?? '';
		const prefixTotal = this.plugin.settings.defaultTemplate.prefixTotal ?? '';
		const suffixTotal = this.plugin.settings.defaultTemplate.suffixTotal ?? '';
		
		progressBarValue.createEl('span', { text: '('+prefixValue+valueFromPercentageOfTotal+suffixValue+'/'+prefixTotal+this.plugin.settings.APB_total+suffixTotal+')' });
		progressBarValue.style.color = this.plugin.settings.defaultTemplate.fractionTextColor;
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
	progressbar.style.background = this.plugin.settings.defaultTemplate.barBackgroundColor;

	progressBarContainer.style.margin = '17px';
	progressbar.style.height = `${this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height}px`;

	this.setEndCaps(progressBarBackground, progressbar, this.plugin.settings.defaultTemplate.endcap, clampedPercentage);
	
	// Create progressBar-filled (filled portion)
	const filledBar = document.createElement('div');
	filledBar.className = 'progressBar-filled';
	filledBar.style.position = 'relative';
	filledBar.style.width = `${clampedPercentage}%`; // e.g. 75%
	filledBar.style.height = `${this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height}px`;
	progressBarBackground.appendChild(filledBar);

	if (this.plugin.settings.defaultTemplate.endcap && clampedPercentage > 0 && clampedPercentage < 100){
		// ======= Create round end mask for inverse progress bar =======
		const dpr = window.devicePixelRatio || 1; // Get device pixel ratio
		const mask = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
		mask.setAttribute('class', 'progressBar-mask');
		mask.setAttribute('width', `${((this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) / 2)}`); // 1 unit wide
		mask.setAttribute('height', `${this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height}`);    // 2 units tall
		mask.setAttribute('viewBox', `0 0 ${((this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) / 2)} ${this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height}`);
		mask.style.position = 'absolute';
		mask.style.top = '0';
		mask.style.right = `-${1 / dpr}px`; // Nudge right to close the 1-pixel gap
		mask.style.width = `${((this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) + 0.5) / 2}px`;
		mask.style.height = `${this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height}px`;

		mask.innerHTML = `
			<defs>
				<mask id="round-end-mask-demo">
				<rect x="0" y="-1" width="${((this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) + 10.5) / 2}" height="${(this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) + 3}" fill="white"/>
				<circle cx="0" cy="${(this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) / 2}" r="${(this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) / 2}" fill="black"/>
				</mask>
			</defs>
			<rect x="0" y="-1" width="${((this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) + 10.5) / 2}" height="${(this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height) +3}" fill="${this.plugin.settings.defaultTemplate.barBackgroundColor}" mask="url(#round-end-mask-demo)"/>
			`;
			filledBar.appendChild(mask);
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
		if (this.plugin.settings.defaultTemplate.completedTextColor !== APB_PURE_BLACK) {
			completed.style.color = this.plugin.settings.defaultTemplate.completedTextColor;

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
		if (this.plugin.settings.defaultTemplate.completedColor !== APB_PURE_BLACK) {
			progressBarBackground.style.backgroundColor = clampedPercentage === 100 ? this.plugin.settings.defaultTemplate.completedColor : colors[0];
		}
	}

	progressBarBackground.style.backgroundSize = '100% 100%';
	progressBarBackground.style.backgroundRepeat = 'no-repeat';

	const marks = containerEl.createEl('div');
	marks.addClass('marks');
	var numberOfSections;

	if (this.plugin.settings.APB_autoMarksToggle){
		numberOfSections = numberOfValidColors;
	} else {
		numberOfSections = this.plugin.settings.APB_manualMarks + 1;
	}
	
	const manualMarks = this.plugin.settings.defaultTemplate.manualMarks;
	if (manualMarks >= 1 && manualMarks <= 19) {
		numberOfSections = manualMarks + 1;
	} else if (manualMarks === 0) {
		numberOfSections = 0;
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
	if (this.plugin.settings.defaultTemplate.titleTextColor !== APB_PURE_BLACK) {
		progressBarTextContainer.appendChild(progressBarTitle);
	}
	if (this.plugin.settings.defaultTemplate.percentageTextColor !== APB_PURE_BLACK) {
		progressBarTextContainer.appendChild(progressBarPercentage);
	}
	if (this.plugin.settings.defaultTemplate.fractionTextColor !== APB_PURE_BLACK) {
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

	/************ Default Day Number *************/
let timeoutIdDate: ReturnType<typeof setTimeout>;

descText = 'Set the default %%date increment%% of a new date progress bar.'
segments = this.splitTextIntoSegments(descText);
new Setting(containerEl)
	.setName('Default date increment')
	.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
	.addText(text => text
		.setPlaceholder('7')
		.setValue (this.plugin.settings.APB_dateIncrement !== undefined ? String(this.plugin.settings.APB_dateIncrement) : String(DEFAULT_SETTINGS.APB_toAPB_dateIncrementtal))
		.onChange((value) => {
			clearTimeout(timeoutIdDate);
			timeoutIdDate = setTimeout(async() => {
				const parsedValue = parseInt(value, 10);

				if (parsedValue >= 1 && (!isNaN(parsedValue) && parsedValue === parseFloat(value))) {
					this.plugin.settings.APB_dateIncrement = parsedValue;
					await this.plugin.saveSettings();
					this.display();
				} else {						
					text.setValue(String(this.plugin.settings.APB_dateIncrement ?? DEFAULT_SETTINGS.APB_dateIncrement));

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
			this.plugin.settings.APB_dateIncrement = DEFAULT_SETTINGS.APB_dateIncrement as number;
			this.plugin.settings.APB_progressBarChange = true;
			await this.plugin.saveSettings();
			this.display();
		})
	);


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

		/************ Section Mark Color *************/
		this.createColorPickerSetting(containerEl, 'Section mark color', 'Select the color of the section %%Marks%%.<br>Note: The color will be set to 50% transparency, allowing the progress bar\'s color to blend and influence the final appearance.',
			'APB_marksColor', undefined, undefined, DEFAULT_SETTINGS.APB_marksLightColor as string, DEFAULT_SETTINGS.APB_marksColor as string);

		/************ Bar Section Mark Width *************/
		this.createSliderSetting(containerEl, 'Section mark width', 'Set the width of the section mark lines on the progress bar from a range of 1 to 5 pixels.<br>(See demonstration progress bar above)',
			'APB_marksWidth', 1, 5, 1 );
		}

	/************ SECTION Inline Edit *************/
	const setting6 = new Setting(containerEl).setName('Inline edit').setHeading();
	const heading6 = setting6.settingEl.querySelector('.setting-item-name');
	if (heading6) {heading6.addClass('header-highlight');}

	/************ Inline Edit *************/
	this.createToggleSetting(containerEl, 'Inline edit',
		'When toggled on, you will see a gear icon to the right of the progress bar\'s text which allows you to edit the value without editing the code block.<br>(See documentation for full details)',
		'APB_inlineEditToggle');

	if (this.plugin.settings.APB_inlineEditToggle) {																					
		/************ Step Size *************/
		this.createSliderSetting(containerEl, 'Step size', 'Set the step size for the increment and decrement buttons on the inline edit panel.<br>(See documentation for full details)',
			'APB_inlineEditStepSize', 1, 100, 1 );
	}

	/************ SECTION Override Container *************/	
	const setting7 = new Setting(containerEl).setName('Override error').setHeading();
	const heading7 = setting7.settingEl.querySelector('.setting-item-name');
	if (heading7) {heading7.addClass('header-highlight');}

	/************ Overage Percentage *************/
	this.createToggleSetting(containerEl, 'Override large value error',
		'When toggled on, you will not get an error when the %%Value%% is greater than the %%Total%%',
		'APB_overageToggle');
	
	/************ SECTION Progress Bar Container *************/	
	const setting8 = new Setting(containerEl).setName('Progress bar container').setHeading();
	const heading8 = setting8.settingEl.querySelector('.setting-item-name');
	if (heading8) {heading8.addClass('header-highlight');}
	
	/************ Top Margin *************/
	this.createToggleSetting(containerEl, 'Top margin',
		'When toggled on, the progress bar container will have a larger margin at the top to avoid text being obscured by the %%</>%% in the top right of the code block when you mouse over.',
		'APB_TopMarginToggle');


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
			'APB_colorBoxShadow', undefined, undefined, DEFAULT_SETTINGS.APB_colorLightBoxShadow as string, DEFAULT_SETTINGS.APB_colorBoxShadow as string);
	}


	/************ SECTION Tasks *************/
	const setting11 = new Setting(containerEl).setName('Tasks').setHeading();
	const heading11 = setting11.settingEl.querySelector('.setting-item-name');
	if (heading11) {heading11.addClass('header-highlight');}

	/************ Allow Tasks *************/
	this.createToggleSetting(containerEl, 'Enable task linking',
		'When %%toggled on%%, you will be able to automatically update progress bars by using matching tags in the progress bar\'s title and tasks.  See documentation for full details.',
		'APB_allowTasksToggle');

	if (this.plugin.settings.APB_allowTasksToggle) {
		/************ Auto Tasks *************/
		this.createToggleSetting(containerEl, 'Auto tasks',
			'When %%toggled on%%, tasks are automatically updated when it detects editing on the current page.  It is %%highly recommended%% that this is turned %%off%% and you use manually triggered updates instead using page switching or hotkey.  See documentation for full details.',
			'APB_autoTasksToggle');

		/************ Allow Sub Tasks *************/
		this.createToggleSetting(containerEl, 'Enable sub-task linking',
			'When %%toggled on%%, you will be able to automatically see your subtask status under the progerss bar.<br>See documentation for full details.',
			'APB_allowSubTasksToggle');
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
			isColorPanelVisible: false,
			borderColor: '#000000',
			backgroundColor: '#000000',
			titleTextColor: '#000000',
			percentageTextColor: '#000000',
			fractionTextColor: '#000000',
			completedTextColor: '#000000',
			completedColor: '#000000',
			barBackgroundColor: '#000000',
			colorSubTaskCompletedText: '#000000',
			colorSubTaskText: '#000000',
			prefixValue: '',
			suffixValue: '',
			prefixTotal: '',
			suffixTotal: '',
			colorDates: '#000000',
			colorDaysLeft: '#000000',
			dateFormat: false,
			colorOverage: '#000000',
			endcap: true,
			barHeight: 8,
			manualMarks: 3
		});
		await this.plugin.saveSettings();
		this.display();
	}));

	const rowContainer = containerEl.createDiv({ cls: 'settings-row-container' });
	const headersRow = rowContainer.createDiv({ cls: 'settings-row-headers' });

	const headers = ['Template Name', '|',  'Settings', '|', 'Gradient Toggle', '|', 'Gradient Type Toggle', '|',  'Color 1 - 5', '|',  '3 Color Presets', '|',  'Duplicate'];
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

  	// Gear Settings
	defaultSetting.addButton((button) => {
		button
		.setIcon('gear')
		.setTooltip('Edit Extended Settings')
		.setClass(this.plugin.settings.defaultTemplate.isColorPanelVisible ? 'active-default-gear' : 'inactive-gear')
		.onClick(async () => {
			this.collapseOtherPanels('default'); // Collapse other panels
			this.plugin.settings.defaultTemplate.isColorPanelVisible = !this.plugin.settings.defaultTemplate.isColorPanelVisible;
			await this.plugin.saveSettings();
			this.display();
			this.defaultContainerColorPickerPanel();
		});
	});

	// Create container for default color pickers
    this.defaultColorPickerContainer = containerEl.createDiv({
      	cls: 'default-container-color-picker-panel',
    });
    this.defaultContainerColorPickerPanel();

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
			.setValue(this.plugin.settings.defaultTemplate.colors[i] || APB_PURE_BLACK)
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
				}, 3000);
			});
		text.inputEl.style.flex = '1';	
		text.inputEl.style.minWidth = '150px';
	});


	// Gear Settings Button
    setting.addButton((button) =>
        button
        .setIcon('gear')
        .setTooltip('Edit Extended Settings')
		.setClass(this.plugin.settings.templates[index].isColorPanelVisible ? 'active-template-gear' : 'inactive-gear')
        .onClick(async () => {
			this.collapseOtherPanels(index); // Collapse other panels
            this.plugin.settings.templates[index].isColorPanelVisible = !this.plugin.settings.templates[index].isColorPanelVisible;
            await this.plugin.saveSettings();
			this.display();
            this.containerColorPickerPanel(index);
        }),
    );
     

    // Create container for color pickers
    this.colorPickerContainers[index] = containerEl.createDiv({
      	cls: 'container-color-picker-panel',
    });
    this.containerColorPickerPanel(index);
  


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
		.setValue(template.colors[i] || APB_PURE_BLACK)
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





	setting.addButton((button) => {
			button
			.setIcon('copy')
			.setTooltip('Duplicate this template')
			.setClass('subtle-button')	
			.onClick(async () => {

				// Hide all color panels
				this.plugin.settings.templates.forEach((t) => {
					t.isColorPanelVisible = false;
				});
				this.plugin.settings.defaultTemplate.isColorPanelVisible = false;

				// Find a unique template name
				let templateCount = this.plugin.settings.templates.length;
				let uniqueName = `${template.name} ${templateCount + 1}`;
				let suffix = templateCount + 1;
				const existingNames = new Set(this.plugin.settings.templates.map(t => t.name));
				while (existingNames.has(uniqueName)) {
					suffix++;
					uniqueName = `${template.name} ${suffix}`;
				}

				this.plugin.settings.templates.push({
					name: uniqueName,
					gradient: template.gradient,
					gradientType: template.gradientType,
					colors: [template.colors[0], template.colors[1], template.colors[2], template.colors[3], template.colors[4]],
					isColorPanelVisible: true,
					borderColor: template.borderColor,
					backgroundColor: template.backgroundColor,
					titleTextColor: template.titleTextColor,
					percentageTextColor: template.percentageTextColor,
					fractionTextColor: template.fractionTextColor,
					completedTextColor: template.completedTextColor,
					completedColor: template.completedColor,
					barBackgroundColor: template.barBackgroundColor,
					colorSubTaskCompletedText: template.colorSubTaskCompletedText,
					colorSubTaskText: template.colorSubTaskText,
					prefixValue: template.prefixValue,
					suffixValue: template.suffixValue,
					prefixTotal: template.prefixTotal,
					suffixTotal: template.suffixTotal,
					colorDates: template.colorDates,
					colorDaysLeft: template.colorDaysLeft,
					dateFormat: template.dateFormat,
					colorOverage: template.colorOverage,
					endcap: template.endcap,
					barHeight: template.barHeight,
					manualMarks: template.manualMarks
				});
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

defaultContainerColorPickerPanel(): void {
    const container = this.defaultColorPickerContainer;
    if (!container) return;

    // Clear existing content
    container.empty();

    // Show or hide based on template's settings
    const template = this.plugin.settings.defaultTemplate;
    container.style.display = template.isColorPanelVisible ? 'block' : 'none';

	if (template.isColorPanelVisible) {
		this.createColorPickerSetting(container, 'Default container border color', 'Choose the %%border%% color of the default progress bar container.',
				'default', undefined, 'borderColor', DEFAULT_SETTINGS.APB_colorLightBorder as string, DEFAULT_SETTINGS.APB_colorBorder as string);
		
		this.createColorPickerSetting(container, 'Default container background color', 'Choose the %%background%% color of the default progress bar container.',
				'default', undefined, 'backgroundColor', DEFAULT_SETTINGS.APB_colorLightBackground as string, DEFAULT_SETTINGS.APB_colorBackground as string);
	
		this.createColorPickerSetting(container, 'Default title text color', 'Choose the %%Title%% text color for the default template.',
				'default', undefined, 'titleTextColor', DEFAULT_SETTINGS.APB_titleLightColor as string, DEFAULT_SETTINGS.APB_titleColor as string);

		this.createColorPickerSetting(container, 'Default percentage text color', 'Choose the %%Percentage%% text color for the default template.',
				'default', undefined, 'percentageTextColor', DEFAULT_SETTINGS.APB_percentageLightColor as string, DEFAULT_SETTINGS.APB_percentageColor as string);
	
		this.createColorPickerSetting(container, 'Default fraction text color', 'Choose the %%Fraction%% text color for the default template.',
				'default', undefined, 'fractionTextColor', DEFAULT_SETTINGS.APB_fractionLightColor as string, DEFAULT_SETTINGS.APB_fractionColor as string);

		this.createColorPickerSetting(container, 'Default completed text color', 'Choose the %%Completed text%% color for the default template.',
				'default', undefined, 'completedTextColor', DEFAULT_SETTINGS.APB_completedLightColor as string, DEFAULT_SETTINGS.APB_completedColor as string);

		this.createColorPickerSetting(container, 'Default bar background color', 'Choose the %%Bar background%% color for the default template.  NOTE: this is the only color that can be set to pure black #000000 as it can not be transparent for the progress bar to work corectly',
				'default', undefined, 'barBackgroundColor', DEFAULT_SETTINGS.APB_colorLightBarBackground as string, DEFAULT_SETTINGS.APB_colorBarBackground as string);

		this.createColorPickerSetting(container, 'Default completed bar background color', 'Choose the %%Completed bar%% background color for the default template.',
				'default', undefined, 'completedColor', DEFAULT_SETTINGS.APB_colorLightBarCompleted as string, DEFAULT_SETTINGS.APB_colorBarCompleted as string);
	
		this.createColorPickerSetting(container, 'Default Sub task text color', 'Choose the %%text%% color for the sub task shown under your progress bar.',
				'default', undefined, 'colorSubTaskText', DEFAULT_SETTINGS.APB_colorLightSubTaskText as string, DEFAULT_SETTINGS.APB_colorSubTaskText as string);
		
		this.createColorPickerSetting(container, 'Default Sub task completed text color', 'Choose the %%completed text%% color for the sub task shown under your progress bar.',
				'default', undefined, 'colorSubTaskCompletedText', DEFAULT_SETTINGS.APB_colorLightSubTaskCompletedText as string, DEFAULT_SETTINGS.APB_colorSubTaskCompletedText as string);


	/************ Default Value Prefix *************/
	let descriptionText: string;
    let textSegments: { text: string; isHighlighted: boolean; isNewLine?: boolean }[];

	descriptionText = 'Set the default %%Value prefix%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Default value prefix')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your value prefix')
			.setValue(this.plugin.settings.defaultTemplate.prefixValue || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.defaultTemplate.prefixValue = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		});

	/************ Default Value Suffix *************/
	descriptionText = 'Set the default %%Value suffix%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Default value suffix')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your value suffix')
			.setValue(this.plugin.settings.defaultTemplate.suffixValue || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.defaultTemplate.suffixValue = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		});

		/************ Default Total Prefix *************/
	descriptionText = 'Set the default %%Total prefix%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Default total prefix')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your total prefix')
			.setValue(this.plugin.settings.defaultTemplate.prefixTotal || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.defaultTemplate.prefixTotal = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		});

	/************ Default Total Suffix *************/
	descriptionText = 'Set the default %%Total suffix%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Default total suffix')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your total suffix')
			.setValue(this.plugin.settings.defaultTemplate.suffixTotal || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.defaultTemplate.suffixTotal = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		});

		this.createColorPickerSetting(container, 'Default dates color', 'Choose the color for the dates shown under your progress bar.',
				'default', undefined, 'colorDates', DEFAULT_SETTINGS.APB_colorLightDates as string, DEFAULT_SETTINGS.APB_colorDates as string);
	
		this.createColorPickerSetting(container, 'Default days left color', 'Choose the color for the days left shown under your progress bar.',
				'default', undefined, 'colorDaysLeft', DEFAULT_SETTINGS.APB_colorLightDaysLeft as string, DEFAULT_SETTINGS.APB_colorDaysLeft as string);


		/************ Date Format *************/
		descriptionText = 'When toggled on, your dates will be in the format %%Dec 31, 2025%% when toggled off %%31 Dec 2025%% will be the format used.'
		textSegments = this.splitTextIntoSegments(descriptionText);
        new Setting(container)
            .setName('Default enable USA date format')
            .setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.defaultTemplate.dateFormat)
                .onChange(async (value) => {
                    this.plugin.settings.defaultTemplate.dateFormat = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show/hide radio buttons
                }));

		/************ Manual Marks *************/
		descriptionText = 'Manually override the number of evenly spaced marks along the progress bar.  Set to %%-1%% to use default automatically calculated value and %%0%% for no marks at all.'
		textSegments = this.splitTextIntoSegments(descriptionText);
		new Setting(container)
			.setName('Default number of marks')
			.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
			.addSlider((slider) => {
				slider
					.setLimits(-1, 19, 1)
					.setDynamicTooltip()				
					.setValue(this.plugin.settings.defaultTemplate.manualMarks ?? DEFAULT_SETTINGS.APB_manualMarks)
					.onChange(async(value) =>  {
						this.plugin.settings.defaultTemplate.manualMarks = value;
						this.plugin.settings.APB_progressBarChange = true;
						await this.plugin.saveSettings();
						this.display();				
					})
				})
				.addButton((button) =>
					button.setIcon('rotate-ccw').setTooltip('Reset to default')
					.onClick(async() => {
						this.plugin.settings.defaultTemplate.manualMarks = DEFAULT_SETTINGS.APB_manualMarks as number;
						this.plugin.settings.APB_progressBarChange = true;
						await this.plugin.saveSettings();
						this.display();					
					}));

		/************ endcap *************/
		descriptionText = 'When toggled on, the progress bar will have a %%round end cap%% and when toggled off it will have a %%square end cap%%.'
		textSegments = this.splitTextIntoSegments(descriptionText);
        new Setting(container)
            .setName('Default end caps style')
            .setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.defaultTemplate.endcap)
                .onChange(async (value) => {
                    this.plugin.settings.defaultTemplate.endcap = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show/hide radio buttons
                }));
				
		/************ Height *************/	
		descriptionText = 'Set the %%height%% of the progress bar in pixels.'
		textSegments = this.splitTextIntoSegments(descriptionText);
		new Setting(container)
			.setName('Default bar height')
			.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
			.addSlider((slider) => {		
				slider
					.setLimits(1, 15, 1)
					.setDynamicTooltip()				
					.setValue(this.plugin.settings.defaultTemplate.barHeight ?? DEFAULT_SETTINGS.APB_height)
					.onChange(async(value) =>  {
						this.plugin.settings.defaultTemplate.barHeight = value;
						// this.setEndCaps(progressBarBackground, progressbar, this.plugin.settings.defaultTemplate.endcap, this.plugin.settings.APB_progressBarPercentage); 
						this.plugin.settings.APB_progressBarChange = true;
						await this.plugin.saveSettings();
						this.display();				
					})
				})
				.addButton((button) =>
					button.setIcon('rotate-ccw').setTooltip('Reset to default')
					.onClick(async() => {
						this.plugin.settings.defaultTemplate.barHeight = DEFAULT_SETTINGS.APB_height as number;
						this.plugin.settings.APB_progressBarChange = true;
						await this.plugin.saveSettings();
						this.display();					
					})
				);

		this.createColorPickerSetting(container, 'Default overage percentage text color', 'Select the color of the %%Percentage%% text when it is greater than 100%.',
			'default', undefined, 'colorOverage', DEFAULT_SETTINGS.APB_overageLightColor as string, DEFAULT_SETTINGS.APB_overageColor as string);

		/************ Transfer default values to default template *************/
		const descText = 'All the above settings within the green border have been removed from standard settings and are now integrated into this default template.  Use this button to copy %%ALL pre v1.1.4%% values into this default template container settings.'
		const segments = this.splitTextIntoSegments(descText);

		new Setting(container)
			.setName('Transfer all your default settings to this default template')
			.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
			.addButton((button) =>
			button.setIcon('copy').setTooltip('Transfer default values')	
			.onClick(async() => {	
				// Set default template colors to old colors - with a APB_PURE_BLACK fallback color (and taking into account toggles)
				this.plugin.settings.defaultTemplate.borderColor = this.plugin.settings.APB_borderToggle ? this.plugin.settings.APB_colorBorder ?? APB_PURE_BLACK : APB_PURE_BLACK;
				this.plugin.settings.defaultTemplate.backgroundColor = this.plugin.settings.APB_backgroundToggle ? this.plugin.settings.APB_colorBackground ?? APB_PURE_BLACK : APB_PURE_BLACK;
				this.plugin.settings.defaultTemplate.titleTextColor = this.plugin.settings.APB_titleToggle ? this.plugin.settings.APB_titleColor ?? APB_PURE_BLACK : APB_PURE_BLACK;
				this.plugin.settings.defaultTemplate.percentageTextColor = this.plugin.settings.APB_percentageToggle ? this.plugin.settings.APB_percentageColor ?? APB_PURE_BLACK : APB_PURE_BLACK;
				this.plugin.settings.defaultTemplate.fractionTextColor = this.plugin.settings.APB_fractionToggle ? this.plugin.settings.APB_fractionColor ?? APB_PURE_BLACK : APB_PURE_BLACK;
				this.plugin.settings.defaultTemplate.completedTextColor = this.plugin.settings.APB_completedToggle ? this.plugin.settings.APB_completedColor ?? APB_PURE_BLACK : APB_PURE_BLACK;		
				this.plugin.settings.defaultTemplate.completedColor = this.plugin.settings.APB_colorBarCompleted ?? APB_PURE_BLACK;
				this.plugin.settings.defaultTemplate.barBackgroundColor = this.plugin.settings.APB_colorBarBackground ?? APB_PURE_BLACK;

				if (this.plugin.settings.APB_allowTasksToggle && this.plugin.settings.APB_allowSubTasksToggle) {
					this.plugin.settings.defaultTemplate.colorSubTaskText = this.plugin.settings.APB_colorSubTaskText ?? APB_PURE_BLACK;
					this.plugin.settings.defaultTemplate.colorSubTaskCompletedText = this.plugin.settings.APB_colorSubTaskCompletedText ?? APB_PURE_BLACK;
				} else {
					this.plugin.settings.defaultTemplate.colorSubTaskText = APB_PURE_BLACK;
					this.plugin.settings.defaultTemplate.colorSubTaskCompletedText = APB_PURE_BLACK;
				}

				await this.plugin.saveSettings();
				this.display();
			}));	

	}
	
}

containerColorPickerPanel(templateIndex: number): void {
    const container = this.colorPickerContainers[templateIndex];
    if (!container) return;

    // Clear existing content
    container.empty();

    // Show or hide based on template's settings
    const template = this.plugin.settings.templates[templateIndex];
    container.style.display = template.isColorPanelVisible ? 'block' : 'none';

	if (template.isColorPanelVisible) {
		this.createColorPickerSetting(container, 'Container border color', 'Choose the %%border%% color of the %%progress bar%% container.',
				'templates', templateIndex, 'borderColor', this.plugin.settings.defaultTemplate?.borderColor as string, APB_PURE_BLACK as string);

		this.createColorPickerSetting(container, 'Container background color', 'Choose the %%background%% color of the %%progress bar%% container.',
				'templates', templateIndex, 'backgroundColor', this.plugin.settings.defaultTemplate?.backgroundColor as string, APB_PURE_BLACK as string);

		this.createColorPickerSetting(container, 'Container title text color', 'Choose the %%Title%% text color for this template.',
				'templates', templateIndex, 'titleTextColor', this.plugin.settings.defaultTemplate?.titleTextColor as string, APB_PURE_BLACK as string);

		this.createColorPickerSetting(container, 'Container percentage text color', 'Choose the %%Percentage%% text color for this template.',
				'templates', templateIndex, 'percentageTextColor', this.plugin.settings.defaultTemplate?.percentageTextColor as string, APB_PURE_BLACK as string);
	
		this.createColorPickerSetting(container, 'Container fraction text color', 'Choose the %%Fraction%% text color for this template.',
				'templates', templateIndex, 'fractionTextColor', this.plugin.settings.defaultTemplate?.fractionTextColor as string, APB_PURE_BLACK as string);

		this.createColorPickerSetting(container, 'Container completed text color', 'Choose the %%Completed%% text color for this template.',
				'templates', templateIndex, 'completedTextColor', this.plugin.settings.defaultTemplate?.completedTextColor as string, APB_PURE_BLACK as string);

		this.createColorPickerSetting(container, 'Bar background color', 'Choose the %%Background Bar%% color for this template.  NOTE: this is the only color that can be set to pure black #000000 as it can not be transparent for the progress bar to work corectly',
				'templates', templateIndex, 'barBackgroundColor', this.plugin.settings.defaultTemplate?.barBackgroundColor as string, APB_PURE_BLACK as string);

		this.createColorPickerSetting(container, 'Completed bar color', 'Choose the %%Completed%% bar color for this template.',
				'templates', templateIndex, 'completedColor', this.plugin.settings.defaultTemplate?.completedColor as string, APB_PURE_BLACK as string);
		
		this.createColorPickerSetting(container, 'Sub task color', 'Choose the %%text%% color for the sub task shown under your progress bar.',
				'templates', templateIndex, 'colorSubTaskText', this.plugin.settings.defaultTemplate?.colorSubTaskText as string, APB_PURE_BLACK as string);
		
		this.createColorPickerSetting(container, 'Sub task completed color', 'Choose the %%completed text%% color for the sub task shown under your progress bar.',
				'templates', templateIndex, 'colorSubTaskCompletedText', this.plugin.settings.defaultTemplate?.colorSubTaskCompletedText as string, APB_PURE_BLACK as string);
  
	
	/************ Template ValuePrefix *************/
	let descriptionText: string;
    let textSegments: { text: string; isHighlighted: boolean; isNewLine?: boolean }[];

	descriptionText = 'Set this templates %%Value prefix%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Value prefix')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your value prefix')
			.setValue(this.plugin.settings.templates[templateIndex].prefixValue || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.templates[templateIndex].prefixValue = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		});

	/************ Template Value Suffix *************/
	descriptionText = 'Set this templates %%Value suffix%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Value suffix')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your value suffix')
			.setValue(this.plugin.settings.templates[templateIndex].suffixValue || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.templates[templateIndex].suffixValue = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		});

		/************ Template Total Prefix *************/
		descriptionText = 'Set this templates %%Total prefix%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Total prefix')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your total prefix')
			.setValue(this.plugin.settings.templates[templateIndex].prefixTotal || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.templates[templateIndex].prefixTotal = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		});

	/************ Template Total Suffix *************/
	descriptionText = 'Set this templates %%Total suffix%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Total suffix')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addText(text => {
			let debounceTimeout: ReturnType<typeof setTimeout>;							
			text
			.setPlaceholder('Enter your total suffix')
			.setValue(this.plugin.settings.templates[templateIndex].suffixTotal || '')
			.onChange((value) => {
				clearTimeout(debounceTimeout);

				debounceTimeout = setTimeout(async() => {		
					this.plugin.settings.templates[templateIndex].suffixTotal = value;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();
				}, 2000);
			})
		});

	this.createColorPickerSetting(container, 'Dates color', 'Choose the color for the dates shown under your progress bar.',
			'templates', templateIndex, 'colorDates', this.plugin.settings.defaultTemplate?.colorDates as string, APB_PURE_BLACK as string);

	this.createColorPickerSetting(container, 'Days Left color', 'Choose the color for the days left shown under your progress bar.',
			'templates', templateIndex, 'colorDaysLeft', this.plugin.settings.defaultTemplate?.colorDaysLeft as string, APB_PURE_BLACK as string);
	
	/************ Date Format *************/
	descriptionText = 'When toggled on, your dates will be in the format %%Dec 31, 2025%% when toggled off %%31 Dec 2025%% will be the format used.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Enable USA date format')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.templates[templateIndex].dateFormat)
			.onChange(async (value) => {
				this.plugin.settings.templates[templateIndex].dateFormat = value;
				await this.plugin.saveSettings();
				this.display(); // Refresh to show/hide radio buttons
			}));
	
	/************ Manual Marks *************/
	descriptionText = 'Manually override the number of evenly spaced marks along the progress bar.  Set to %%-1%% to use default automatically calculated value and %%0%% for no marks at all.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Number of marks')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addSlider((slider) => {		
			slider
				.setLimits(-1, 19, 1)
				.setDynamicTooltip()				
				.setValue(this.plugin.settings.templates[templateIndex].manualMarks ?? DEFAULT_SETTINGS.APB_manualMarks)
				.onChange(async(value) =>  {
					this.plugin.settings.templates[templateIndex].manualMarks = value;
					// this.setEndCaps(progressBarBackground, progressbar, this.plugin.settings.defaultTemplate.endcap, this.plugin.settings.APB_progressBarPercentage); 
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();				
				})
			})
			.addButton((button) =>
				button.setIcon('rotate-ccw').setTooltip('Reset to default')
				.onClick(async() => {
					this.plugin.settings.templates[templateIndex].manualMarks = DEFAULT_SETTINGS.APB_manualMarks as number;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();					
				}));
	
	/************ endcap *************/
	descriptionText = 'When toggled on, the progress bar will have a %%round end cap%% and when toggled off it will have a %%square end cap%%.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('End caps style')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addToggle(toggle => toggle
			.setValue(this.plugin.settings.templates[templateIndex].endcap)
			.onChange(async (value) => {
				this.plugin.settings.templates[templateIndex].endcap = value;
				await this.plugin.saveSettings();
				this.display(); // Refresh to show/hide radio buttons
			}));

	/************ bar Height *************/	
	descriptionText = 'Set the height of the progress bar in pixels.'
	textSegments = this.splitTextIntoSegments(descriptionText);
	new Setting(container)
		.setName('Bar height')
		.setDesc(createFragment(frag => this.renderSegments(textSegments, frag)))
		.addSlider((slider) => {		
			slider
				.setLimits(1, 15, 1)
				.setDynamicTooltip()				
				.setValue(this.plugin.settings.templates[templateIndex].barHeight ?? DEFAULT_SETTINGS.APB_height)
				.onChange(async(value) =>  {
					this.plugin.settings.templates[templateIndex].barHeight = value;
					// this.setEndCaps(progressBarBackground, progressbar, this.plugin.settings.defaultTemplate.endcap, this.plugin.settings.APB_progressBarPercentage); 
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();				
				})
			})
			.addButton((button) =>
				button.setIcon('rotate-ccw').setTooltip('Reset to default')
				.onClick(async() => {
					this.plugin.settings.templates[templateIndex].barHeight = DEFAULT_SETTINGS.APB_height as number;
					this.plugin.settings.APB_progressBarChange = true;
					await this.plugin.saveSettings();
					this.display();					
				}));

	this.createColorPickerSetting(container, 'Overage percentage text color', 'Select the color of the %%Percentage%% text when it is greater than 100%.',
			'templates', templateIndex, 'colorOverage', this.plugin.settings.defaultTemplate?.colorOverage ?? APB_PURE_BLACK as string, APB_PURE_BLACK as string);

	}
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
addColorResetButtonsForSettings(
    setting: Setting,
    colorSettingKey: string, // Changed to string for nested keys
    defaultLightColor: string,
    defaultDarkColor: string,
	index?: number
) {
	// Use different icons for templates vs defaultTemplate
	const lightIcon = index !== undefined ? 'paintbrush' : 'sun';
	const darkIcon = index !== undefined ? 'rotate-ccw' : 'moon';

	const lightTooltip = index !== undefined ? 'Reset to default template color' : 'Reset to light default';
	const darkTooltip = index !== undefined ? 'Reset to pure black' : 'Reset to dark default';

    setting.addButton((button: ButtonComponent) => {
        this.addColorResetButton(button, lightIcon, lightTooltip, 
            colorSettingKey, defaultLightColor, this.colorPickers[colorSettingKey]);
    });

    setting.addButton((button: ButtonComponent) => {
        this.addColorResetButton(button, darkIcon, darkTooltip, 
            colorSettingKey, defaultDarkColor, this.colorPickers[colorSettingKey]);
    });
}

/************ Create a color reset button Function *************/
addColorResetButton(
    button: ButtonComponent,
    icon: string,
    tooltip: string,
    colorSettingKey: string,
    defaultColor: string,
	colorPicker: ColorComponent | undefined
) {
    button
        .setIcon(icon)
        .setTooltip(tooltip)
        .onClick(async () => {
            this.setSettingValue(colorSettingKey, defaultColor);
			if (colorPicker) {
				colorPicker.setValue(defaultColor); // Update color picker UI
			}
            await this.plugin.saveSettings();
            this.display();
        });
}


/************ Create a colorPicker with light/dark buttons Function *************/
createColorPickerSetting(
	containerEl: HTMLElement,
	setName: string,
	setDesc: string,
	settingKey: string,
	index?: number,
	settingName?: string,
	defaultLightColor?: string,
	defaultDarkColor?: string
) {
	const segments = this.splitTextIntoSegments(setDesc);
	const setting = new Setting(containerEl)
		.setName(setName)
		.setDesc(createFragment(frag => this.renderSegments(segments, frag)))
		.addColorPicker((colorPicker: ColorComponent) => {
                this.colorPickers[settingKey] = colorPicker; // Store color picker
                const value = index !== undefined && settingName
                    ? (this.plugin.settings.templates[index][settingName] as string) || APB_PURE_BLACK
                    : settingName
                    ? (this.plugin.settings.defaultTemplate[settingName] as string) || APB_PURE_BLACK
                    : (this.plugin.settings[settingKey] as string) || APB_PURE_BLACK;
                colorPicker
                    .setValue(value)
                    .onChange(async (value: string) => {
                        if (index !== undefined && settingName) {
                            this.plugin.settings.templates[index][settingName] = value;
                        } else if (settingName) {
                            this.plugin.settings.defaultTemplate[settingName] = value;
                        } else {
                            this.plugin.settings[settingKey] = value;
                        }
                        await this.plugin.saveSettings();
                        this.display();
            });
        });
	this.addColorResetButtonsForSettings(setting, settingKey, defaultLightColor || '#ffffff', defaultDarkColor || '#000000', index);
}

// Helper to get nested setting value
getSettingValue(settingKey: string): string {
    const keyParts = settingKey.split('.');
    if (keyParts[0] === 'templates' && keyParts.length >= 3) {
        const templateIndex = parseInt(keyParts[1]);
        if (templateIndex >= 0 && templateIndex < this.plugin.settings.templates.length) {
            if (keyParts[2] === 'colors' && keyParts[3]) {
                const colorIndex = parseInt(keyParts[3]);
                return this.plugin.settings.templates[templateIndex].colors[colorIndex] || '#ffffff';
            }
            return (this.plugin.settings.templates[templateIndex][keyParts[2]] as string) || '#ffffff';
        }
    }
    return '#ffffff';
}

// Helper to set nested setting value
setSettingValue(settingKey: string, value: string): void {
    const keyParts = settingKey.split('.');
    if (keyParts[0] === 'templates' && keyParts.length >= 3) {
        const templateIndex = parseInt(keyParts[1]);
        if (templateIndex >= 0 && templateIndex < this.plugin.settings.templates.length) {
            if (keyParts[2] === 'colors' && keyParts[3]) {
                const colorIndex = parseInt(keyParts[3]);
                this.plugin.settings.templates[templateIndex].colors[colorIndex] = value;
            } else {
                this.plugin.settings.templates[templateIndex][keyParts[2]] = value;
            }
        }
    }
}


// method to collapse all other panels
collapseOtherPanels(exceptIndex: number | 'default'): void {
	this.plugin.settings.templates.forEach((template, index) => {
			if (index !== exceptIndex) {
				template.isColorPanelVisible = false; // Close all template panels
			}
		});
	if (exceptIndex !== 'default') {
		this.plugin.settings.defaultTemplate.isColorPanelVisible = false; // Close defaultTemplate if not the target
	}
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

function  formatDate(dateString: string, format: 'DMY' | 'MDY' | 'YMD'): string {
    const date = new Date(dateString);

    // Validate date
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`);
    }

    switch (format) {
        case 'DMY':
            // Format: 31 Dec 2025
            return new Intl.DateTimeFormat('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(date);

		case 'MDY':
            // Format: Dec 31, 2025
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(date).replace(/(\d+),/, '$1,');

        // case 'MDY':
        //     // Format: Dec 31st 2025
        //     return new Intl.DateTimeFormat('en-GB', {
        //         day: 'numeric',
        //         month: 'short',
        //         year: 'numeric'
        //     }).format(date).replace(/(\d+)(?=,)/, (day) => {
        //         const num = parseInt(day);
        //         const suffix = num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th';
        //         return `${day}${suffix}`;
        //     });

		case 'YMD':
            // Format: 2025 Dec 31
            const parts = new Intl.DateTimeFormat('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).formatToParts(date);
            const year = parts.find(p => p.type === 'year')?.value;
            const month = parts.find(p => p.type === 'month')?.value;
            const day = parts.find(p => p.type === 'day')?.value;
            return `${year} ${month} ${day}`;

        // case 'YMD':
        //     // Format: 31/12/2025
        //     return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

        // case 'mmmddyyyy':
        //     // Format: Dec 31, 2025
        //     const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        //     return `${monthsShort[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;

        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}

function getContrastTextColorRGB(rgbInput: string, textOpacity: number = 1): string {
	// Parse rgb() or rgba() string
	const cleaned = rgbInput.replace(/rgb(a)?\(|\)/g, "").trim();
	const values = cleaned.split(/,\s*|\s+/).map(Number);

	// Validate RGB values
	if (values.length < 3 || values.length > 4 || values.some(isNaN) || values.slice(0, 3).some(v => v < 0 || v > 255)) {
		throw new Error("Invalid RGB/A format. Expected: rgb(r, g, b) or rgba(r, g, b, a) with r,g,b 0-255, a 0-1");
	}

	const [r, g, b] = values;

	// Normalize RGB values to 0-1 range
	const normalizedR = r / 255;
	const normalizedG = g / 255;
	const normalizedB = b / 255;

	// Calculate relative luminance (W3C formula)
	const luminance = 0.2126 * normalizedR + 0.7152 * normalizedG + 0.0722 * normalizedB;

	// Choose black or white based on luminance
	const textColor = luminance > 0.5 ? "#000000" : "#FFFFFF";

	// Apply opacity to text color (convert hex to rgba if textOpacity < 1)
	if (textOpacity < 1) {
		const hex = textColor.replace("#", "");
		const rHex = parseInt(hex.substring(0, 2), 16);
		const gHex = parseInt(hex.substring(2, 4), 16);
		const bHex = parseInt(hex.substring(4, 6), 16);
		return `rgba(${rHex}, ${gHex}, ${bHex}, ${textOpacity})`;
	}
	return textColor;
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