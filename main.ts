import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import SyncService from "./SyncService"
require('dotenv').config()

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	ghostContentApiKey: string;
	baseUrl: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	ghostContentApiKey: "",
	baseUrl: "https://demo.ghost.io"
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Ghost Blog Sync', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.addCommand({
			id: "ghost-sync-init",
			name: "Init",
			callback: async () => {
				// new SampleModal(this.app).open();
				new Notice('Ghost Sync: Initializing');
				new Notice('Ghost Sync: Pasted current blog post');
				let apiKey  = this.settings.ghostContentApiKey
				let baseUrl  = this.settings.baseUrl
				let result = await SyncService(apiKey,baseUrl)
				new Notice("done");
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'ghost-sync-update',
			name: 'Update',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				new Notice('Ghost Sync: Pasted current blog post');
				editor.replaceSelection("works")

			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for Ghost Blog Sync' });
		containerEl.createEl('h3', { text: 'This app allows for syncing (download only currently) all posts from your ghost blog!' });


		new Setting(containerEl)
			.setName('Ghost Content API key')
			.setDesc('example: dd0235ab7a7db900270842123a')
			.addText(text => text
				.setPlaceholder('dd0235ab7a7db900270842123a')
				.setValue(this.plugin.settings.ghostContentApiKey)
				.onChange(async (value) => {
					console.log('ghostContentApiKey: ' + value);
					this.plugin.settings.ghostContentApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Ghost Website Url')
			.setDesc('example: https://demo.ghost.io')
			.addText(text => text
				.setPlaceholder('https://demo.ghost.io')
				.setValue(this.plugin.settings.baseUrl)
				.onChange(async (value) => {
					console.log('baseUrl: ' + value);
					this.plugin.settings.baseUrl = value;
					await this.plugin.saveSettings();
				}));
	}
}
c