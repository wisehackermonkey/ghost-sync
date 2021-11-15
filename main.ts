import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	normalizePath,
	TFolder,
	Menu,
	Vault,
	TFile
} from 'obsidian';
import SyncService from "./SyncService"
import postHelpers from "./postHelpers"
import { CreatePost } from "./CreatePost"
import Post from "./post"
require('dotenv').config()

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	ghostContentApiKey: string;
	ghostAdminApiKey: string;
	baseUrl: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	ghostContentApiKey: "22444f78447824223cefc48062",
	baseUrl: "https://demo.ghost.io",
	ghostAdminApiKey: "2244...32e32:2244...32e32"
}
function resolve_tfolder(app: App, folder_str: string): TFolder {
	folder_str = normalizePath(folder_str);

	const folder = app.vault.getAbstractFileByPath(folder_str);
	if (!folder) {
		throw new Error(`Folder "${folder_str}" doesn't exist`);
	}
	if (!(folder instanceof TFolder)) {
		throw new Error(`${folder_str} is a file, not a folder`);
	}

	return folder;
}
export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		new Notice('Pluggin: Ghost Sync Loaded');
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

				new Notice('Ghost Sync: Initializing');
				let apiKey = this.settings.ghostContentApiKey
				let baseUrl = this.settings.baseUrl
				new Notice(`Using Ghost Content Api key:${apiKey}`);
				new Notice(`Using Ghost Url:${baseUrl}`);

				let result = await SyncService(this.app, apiKey, baseUrl)
				new Notice("Ghost Sync: Finished Sync!");

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
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item
						.setTitle("GhostSync: Upload ⬆️")
						.setIcon("document")
						.onClick(async () => {
							new Notice(file.path);
						});
					console.log(item)
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item
						.setTitle("GhostSync: Upload ⬆️")
						.setIcon("document")
						.onClick(async () => {
							new Notice(view.file.path);
							let selectedPage = this.app.workspace.getActiveFile()
							let { path, basename, name, unsafeCachedData } = selectedPage
							console.log(postHelpers.schemaParse(unsafeCachedData))
							console.log(postHelpers.schemaStringify({
								"version": "1.0",
								"title": "Ghost Sync Test Post",
								"url": "https://oran.ghost.io/ghost-sync-test-post/",
								"public": true,
								"image": "https://t3.ftcdn.net/jpg/02/92/15/64/360_F_292156404_ypLsZWQiPXfTsYiYF8FNqz58TXr4uhkj.jpg"
							}))
							// console.log(selectedPage)
							// console.log(path,"\n",basename,"\n",name,"\n",unsafeCachedData)
						});
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item
						.setTitle("GhostSync: Create New Post🧾")
						.setIcon("document")
						.onClick(async () => {
							new Notice("Creating Post");
							let apiKey = this.settings.ghostAdminApiKey
							let url = this.settings.baseUrl
							const onSubmit = (title: string, image: string) => {
								let post = {
									data: "wow it works",
									url: url || "",
									title: title,
									apiKey: apiKey,
								}
								new Notice(JSON.stringify(post))

								Post.uploadPost(post)
							};
			
							new CreatePost(this.app, "Name of post", onSubmit).open();
						});
				});
			})
		);

		// this.addCommand({
		// 	id: "insert-link",
		// 	name: "Insert link",
		// 	editorCallback: (editor: Editor) => {
		// 	  const selectedText = editor.getSelection();

		// 	  const onSubmit = (text: string, url: string) => {
		// 		editor.replaceSelection(`[${text}](${url})`);
		// 	  };

		// 	  new CreatePost(this.app, selectedText, onSubmit).open();
		// 	},
		//   });

		// this.addCommand({
		// 	id: "create-post",
		// 	name: "Create New Post",
		// 	editorCallback: (editor: Editor) => {

		// 		const onSubmit = (text: string, url: string) => {
		// 			editor.replaceSelection(`[${text}](${url})`);
		// 		};

		// 		new CreatePost(this.app, "Name of post", onSubmit).open();
		// 	},
		// });
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
					this.plugin.settings.ghostContentApiKey = value.trim();
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
						this.plugin.settings.baseUrl = value.trim();
						await this.plugin.saveSettings();
					}));
					
		new Setting(containerEl)
		.setName('Ghost Admin Api Key')
		.setDesc('Required for (posting)')
		.addText(text => text
			.setPlaceholder('2244...32e32:2244...32e32')
			.setValue(this.plugin.settings.baseUrl)
			.onChange(async (value) => {
				console.log('baseUrl: ' + value);
				this.plugin.settings.ghostAdminApiKey = value.trim();
				await this.plugin.saveSettings();
			}));
	}
}


export class InsertLinkModal extends Modal {
	linkText: string;
	linkUrl: string;

	onSubmit: (linkText: string, linkUrl: string) => void;

	constructor(
		app: App,
		defaultLinkText: string,
		onSubmit: (linkText: string, linkUrl: string) => void
	) {
		super(app);
		this.linkText = defaultLinkText;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h1", { text: "Insert link" });

		new Setting(contentEl).setName("Link text").addText((text) =>
			text.setValue(this.linkText).onChange((value) => {
				this.linkText = value;
			})
		);

		new Setting(contentEl).setName("Link URL").addText((text) =>
			text.setValue(this.linkUrl).onChange((value) => {
				this.linkUrl = value;
			})
		);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Insert")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.linkText, this.linkUrl);
				})
		);
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}