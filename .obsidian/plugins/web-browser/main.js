/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MyPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/header_bar.ts
var HeaderBar = class {
  constructor(parent) {
    this.onSearchBarEnterListener = new Array();
    parent.addClass("web-browser-header-bar");
    parent.removeChild(parent.children[1]);
    this.searchBar = document.createElement("input");
    this.searchBar.type = "text";
    this.searchBar.placeholder = "使用必应搜索或输入网址";
    this.searchBar.addClass("web-browser-search-bar");
    parent.appendChild(this.searchBar);
    this.searchBar.addEventListener("keydown", (event) => {
      if (!event) {
        var event = window.event;
      }
      if (event.key === "Enter") {
        for (var listener of this.onSearchBarEnterListener) {
          listener(this.searchBar.value);
        }
      }
    }, false);
  }
  addOnSearchBarEnterListener(listener) {
    this.onSearchBarEnterListener.push(listener);
  }
  setSearchBarUrl(url) {
    this.searchBar.value = url;
  }
  focus() {
    this.searchBar.focus();
  }
};

// src/web_browser_view.ts
var import_obsidian = require("obsidian");
var import_electron = require("electron");
var WEB_BROWSER_VIEW_ID = "web-browser-view";
var WebBrowserView = class extends import_obsidian.ItemView {
  constructor() {
    super(...arguments);
    this.currentTitle = "New tab";
  }
  static spawnWebBrowserView(newLeaf, state) {
    app.workspace.getLeaf(newLeaf).setViewState({ type: WEB_BROWSER_VIEW_ID, active: true, state });
  }
  getDisplayText() {
    return this.currentTitle;
  }
  getViewType() {
    return WEB_BROWSER_VIEW_ID;
  }
  async onOpen() {
    this.navigation = true;
    this.contentEl.empty();
    this.headerBar = new HeaderBar(this.headerEl.children[2]);
    this.favicon = document.createElement("img");
    this.favicon.width = 16;
    this.favicon.height = 16;
    this.frame = document.createElement("webview");
    this.frame.setAttribute("allowpopups", "");
    this.frame.addClass("web-browser-frame");
    this.contentEl.addClass("web-browser-view-content");
    this.contentEl.appendChild(this.frame);
    this.headerBar.addOnSearchBarEnterListener((url) => {
      this.navigate(url);
    });
    this.frame.addEventListener("dom-ready", (event) => {
      let webContents = import_electron.remote.webContents.fromId(this.frame.getWebContentsId());
      webContents.setWindowOpenHandler((event2) => {
        WebBrowserView.spawnWebBrowserView(true, { url: event2.url });
      });
      webContents.on("before-input-event", (event2, input) => {
        if (input.type !== "keyDown") {
          return;
        }
        const emulatedKeyboardEvent = new KeyboardEvent("keydown", {
          code: input.code,
          key: input.key,
          shiftKey: input.shift,
          altKey: input.alt,
          ctrlKey: input.control,
          metaKey: input.meta,
          repeat: input.isAutoRepeat
        });
        activeDocument.body.dispatchEvent(emulatedKeyboardEvent);
      });
    });
    this.frame.addEventListener("focus", (event) => {
      app.workspace.setActiveLeaf(this.leaf);
    });
    this.frame.addEventListener("page-favicon-updated", (event) => {
      this.favicon.src = event.favicons[0];
      this.leaf.tabHeaderInnerIconEl.empty();
      this.leaf.tabHeaderInnerIconEl.appendChild(this.favicon);
    });
    this.frame.addEventListener("page-title-updated", (event) => {
      this.leaf.tabHeaderInnerTitleEl.innerText = event.title;
      this.currentTitle = event.title;
    });
    this.frame.addEventListener("will-navigate", (event) => {
      this.navigate(event.url, true, false);
    });
    this.frame.addEventListener("did-navigate-in-page", (event) => {
      this.navigate(event.url, true, false);
    });
    this.frame.addEventListener("new-window", (event) => {
      console.log("Trying to open new window at url: " + event.url);
      event.preventDefault();
    });
  }
  async setState(state, result) {
    this.navigate(state.url, false);
  }
  getState() {
    return { url: this.currentUrl };
  }
  navigate(url, addToHistory = true, updateWebView = true) {
    var _a, _b, _c;
    if (url === "") {
      return;
    }
    if (addToHistory) {
      if (((_c = (_b = (_a = this.leaf.history.backHistory.last()) == null ? void 0 : _a.state) == null ? void 0 : _b.state) == null ? void 0 : _c.url) !== this.currentUrl) {
        this.leaf.history.backHistory.push({
          state: {
            type: WEB_BROWSER_VIEW_ID,
            state: this.getState()
          },
          title: this.currentTitle,
          icon: "search"
        });
        this.headerEl.children[1].children[0].setAttribute("aria-disabled", "false");
      }
    }
    var urlRegEx = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#?&//=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/g;
    if (urlRegEx.test(url)) {
      let first7 = url.slice(0, 7).toLowerCase();
      let first8 = url.slice(0, 8).toLowerCase();
      if (!(first7 === "http://" || first7 === "file://" || first8 === "https://")) {
        url = "https://" + url;
      }
    } else if (!(url.slice(0, 7) === "file://") || !/\.htm(l)?$/g.test(url)) {
      url = "https://cn.bing.com/search?q=" + url;
    }
    this.currentUrl = url;
    this.headerBar.setSearchBarUrl(url);
    if (updateWebView) {
      this.frame.setAttribute("src", url);
    }
    app.workspace.requestSaveLayout();
  }
};

// src/hooks.ts
var FunctionHooks = class {
  static onload() {
    FunctionHooks.ogWindow$Open = window.open;
    window.open = (url, target, features) => {
      let urlString = "";
      if (typeof url === "string") {
        urlString = url;
      } else if (url instanceof URL) {
        urlString = url.toString();
      }
      if (urlString === "about:blank" && features || !urlString.startsWith("http://") && !urlString.startsWith("https://") && !urlString.startsWith("file://")) {
        return FunctionHooks.ogWindow$Open.call(window, url, target, features);
      }
      WebBrowserView.spawnWebBrowserView(true, { url: urlString });
      return null;
    };
  }
  static onunload() {
    window.open = FunctionHooks.ogWindow$Open;
  }
};

// src/web_browser_file_view.ts
var import_obsidian2 = require("obsidian");
var HTML_FILE_EXTENSIONS = ["html", "htm"];
var WEB_BROWSER_FILE_VIEW_ID = "web-browser-file-view";
var WebBrowserFileView = class extends import_obsidian2.FileView {
  constructor(leaf) {
    super(leaf);
  }
  async onLoadFile(file) {
    const adapter = this.app.vault.adapter;
    const urlString = "file:///" + (adapter.getBasePath() + "/" + file.path).toString().replace(/\s/g, "%20");
    WebBrowserView.spawnWebBrowserView(true, { url: urlString });
    if (this.leaf)
      this.leaf.detach();
  }
  onunload() {
  }
  canAcceptExtension(extension) {
    return HTML_FILE_EXTENSIONS.includes(extension);
  }
  getViewType() {
    return WEB_BROWSER_FILE_VIEW_ID;
  }
};

// src/main.ts
var MyPlugin = class extends import_obsidian3.Plugin {
  async onload() {
    await this.loadSettings();
    this.registerView(WEB_BROWSER_VIEW_ID, (leaf) => new WebBrowserView(leaf));
    this.registerView(WEB_BROWSER_FILE_VIEW_ID, (leaf) => new WebBrowserFileView(leaf));
    try {
      this.registerExtensions(HTML_FILE_EXTENSIONS, WEB_BROWSER_FILE_VIEW_ID);
    } catch (error) {
      new import_obsidian3.Notice(`File extensions ${HTML_FILE_EXTENSIONS} had been registered by other plugin!`);
    }
    FunctionHooks.onload();
    this.onLayoutChangeEventRef = this.app.workspace.on("layout-change", () => {
      var activeView = this.app.workspace.getActiveViewOfType(import_obsidian3.ItemView);
      if (activeView) {
        if (activeView.contentEl.children[0].hasClass("empty-state")) {
          if (!activeView.headerEl.children[2].hasClass("web-browser-header-bar")) {
            var headerBar = new HeaderBar(activeView.headerEl.children[2]);
            headerBar.focus();
            headerBar.addOnSearchBarEnterListener((url) => {
              WebBrowserView.spawnWebBrowserView(false, { url });
            });
          }
        }
      }
    });
  }
  onunload() {
    var _a;
    this.app.workspace.detachLeavesOfType(WEB_BROWSER_VIEW_ID);
    FunctionHooks.onunload();
    this.app.workspace.offref(this.onLayoutChangeEventRef);
    var searchBars = document.getElementsByClassName("web-browser-search-bar");
    while (searchBars.length > 0) {
      (_a = searchBars[0].parentElement) == null ? void 0 : _a.removeChild(searchBars[0]);
    }
  }
  async loadSettings() {
  }
  async saveSettings() {
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL2hlYWRlcl9iYXIudHMiLCAic3JjL3dlYl9icm93c2VyX3ZpZXcudHMiLCAic3JjL2hvb2tzLnRzIiwgInNyYy93ZWJfYnJvd3Nlcl9maWxlX3ZpZXcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IEV2ZW50UmVmLCBJdGVtVmlldywgTm90aWNlLCBQbHVnaW4gfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IEhlYWRlckJhciB9IGZyb20gXCIuL2hlYWRlcl9iYXJcIjtcbmltcG9ydCB7IEZ1bmN0aW9uSG9va3MgfSBmcm9tIFwiLi9ob29rc1wiO1xuaW1wb3J0IHsgV2ViQnJvd3NlclZpZXcsIFdFQl9CUk9XU0VSX1ZJRVdfSUQgfSBmcm9tIFwiLi93ZWJfYnJvd3Nlcl92aWV3XCI7XG5pbXBvcnQgeyBIVE1MX0ZJTEVfRVhURU5TSU9OUywgV0VCX0JST1dTRVJfRklMRV9WSUVXX0lELCBXZWJCcm93c2VyRmlsZVZpZXcgfSBmcm9tIFwiLi93ZWJfYnJvd3Nlcl9maWxlX3ZpZXdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXlQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuXHRwcml2YXRlIG9uTGF5b3V0Q2hhbmdlRXZlbnRSZWY6IEV2ZW50UmVmO1xuXG5cdGFzeW5jIG9ubG9hZCgpIHtcblx0XHRhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuXG5cdFx0dGhpcy5yZWdpc3RlclZpZXcoV0VCX0JST1dTRVJfVklFV19JRCwgKGxlYWYpID0+IG5ldyBXZWJCcm93c2VyVmlldyhsZWFmKSk7XG5cblx0XHQvLyBGZWF0dXJlIHRvIHN1cHBvcnQgaHRtbC9odG0gZmlsZXMuXG5cdFx0dGhpcy5yZWdpc3RlclZpZXcoV0VCX0JST1dTRVJfRklMRV9WSUVXX0lELCAobGVhZikgPT4gbmV3IFdlYkJyb3dzZXJGaWxlVmlldyhsZWFmKSk7XG5cblx0XHR0cnkge1xuXHRcdFx0dGhpcy5yZWdpc3RlckV4dGVuc2lvbnMoSFRNTF9GSUxFX0VYVEVOU0lPTlMsIFdFQl9CUk9XU0VSX0ZJTEVfVklFV19JRCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdG5ldyBOb3RpY2UoYEZpbGUgZXh0ZW5zaW9ucyAke0hUTUxfRklMRV9FWFRFTlNJT05TfSBoYWQgYmVlbiByZWdpc3RlcmVkIGJ5IG90aGVyIHBsdWdpbiFgKTtcblx0XHR9XG5cblx0XHRGdW5jdGlvbkhvb2tzLm9ubG9hZCgpO1xuXG5cdFx0Ly8gQWRkIGhlYWRlciBiYXIgdG8gXCJOZXcgdGFiXCIgdmlldy5cblx0XHR0aGlzLm9uTGF5b3V0Q2hhbmdlRXZlbnRSZWYgPSB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJsYXlvdXQtY2hhbmdlXCIsICgpID0+IHtcblx0XHRcdHZhciBhY3RpdmVWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoSXRlbVZpZXcpO1xuXHRcdFx0aWYgKGFjdGl2ZVZpZXcpIHtcblx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIHZpZXcgaXMgYSBcIk5ldyB0YWJcIiB2aWV3LiBJIGRvbid0IHRoaW5rIHRoaXMgY2xhc3MgaXMgdXNlZCBlbHNld2hlcmUuIEkgc3VyZSBob3BlIG5vdC5cblx0XHRcdFx0aWYgKGFjdGl2ZVZpZXcuY29udGVudEVsLmNoaWxkcmVuWzBdLmhhc0NsYXNzKFwiZW1wdHktc3RhdGVcIikpIHtcblx0XHRcdFx0XHQvLyBDaGVjayBpZiB0aGUgXCJOZXcgdGFiXCIgdmlldyBoYXMgYWxyZWFkeSBiZWVuIHByb2Nlc3NlZCBhbmQgaGFzIGEgaGVhZGVyIGJhciBhbHJlYWR5LlxuXHRcdFx0XHRcdGlmICghYWN0aXZlVmlldy5oZWFkZXJFbC5jaGlsZHJlblsyXS5oYXNDbGFzcyhcIndlYi1icm93c2VyLWhlYWRlci1iYXJcIikpIHtcblx0XHRcdFx0XHRcdHZhciBoZWFkZXJCYXIgPSBuZXcgSGVhZGVyQmFyKGFjdGl2ZVZpZXcuaGVhZGVyRWwuY2hpbGRyZW5bMl0pO1xuXHRcdFx0XHRcdFx0Ly8gRm9jdXMgb24gY3VycmVudCBpbnB1dEVsXG5cdFx0XHRcdFx0XHRoZWFkZXJCYXIuZm9jdXMoKTtcblx0XHRcdFx0XHRcdGhlYWRlckJhci5hZGRPblNlYXJjaEJhckVudGVyTGlzdGVuZXIoKHVybDogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFdlYkJyb3dzZXJWaWV3LnNwYXduV2ViQnJvd3NlclZpZXcoZmFsc2UsIHsgdXJsIH0pO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRvbnVubG9hZCgpIHtcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2UuZGV0YWNoTGVhdmVzT2ZUeXBlKFdFQl9CUk9XU0VSX1ZJRVdfSUQpO1xuXHRcdEZ1bmN0aW9uSG9va3Mub251bmxvYWQoKTtcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub2ZmcmVmKHRoaXMub25MYXlvdXRDaGFuZ2VFdmVudFJlZik7XG5cblx0XHQvLyBDbGVhbiB1cCBoZWFkZXIgYmFyIGFkZGVkIHRvIFwiTmV3IHRhYlwiIHZpZXdzIHdoZW4gcGx1Z2luIGlzIGRpc2FibGVkLlxuXHRcdHZhciBzZWFyY2hCYXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIndlYi1icm93c2VyLXNlYXJjaC1iYXJcIik7XG5cdFx0d2hpbGUgKHNlYXJjaEJhcnMubGVuZ3RoID4gMCkge1xuXHRcdFx0c2VhcmNoQmFyc1swXS5wYXJlbnRFbGVtZW50Py5yZW1vdmVDaGlsZChzZWFyY2hCYXJzWzBdKTtcblx0XHR9XG5cdH1cblxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG5cdH1cblxuXHRhc3luYyBzYXZlU2V0dGluZ3MoKSB7XG5cdH1cbn1cbiIsICJleHBvcnQgY2xhc3MgSGVhZGVyQmFyIHtcbiAgICBwcml2YXRlIHNlYXJjaEJhcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIG9uU2VhcmNoQmFyRW50ZXJMaXN0ZW5lciA9IG5ldyBBcnJheTwodXJsOiBzdHJpbmcpID0+IHZvaWQ+O1xuXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBFbGVtZW50KSB7XG4gICAgICAgIC8vIENTUyBjbGFzcyByZW1vdmVzIHRoZSBncmFkaWVudCBhdCB0aGUgcmlnaHQgb2YgdGhlIGhlYWRlciBiYXIuXG4gICAgICAgIHBhcmVudC5hZGRDbGFzcyhcIndlYi1icm93c2VyLWhlYWRlci1iYXJcIik7XG4gICAgICAgIC8vIFJlbW92ZSBkZWZhdWx0IHRpdGxlIGZyb20gaGVhZGVyIGJhci5cbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5jaGlsZHJlblsxXSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHNlYXJjaCBiYXIgaW4gaGVhZGVyIGJhci5cbiAgICAgICAgdGhpcy5zZWFyY2hCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIHRoaXMuc2VhcmNoQmFyLnR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgdGhpcy5zZWFyY2hCYXIucGxhY2Vob2xkZXIgPSBcIlNlYXJjaCB3aXRoIER1Y2tEdWNrR28gb3IgZW50ZXIgYWRkcmVzc1wiXG4gICAgICAgIHRoaXMuc2VhcmNoQmFyLmFkZENsYXNzKFwid2ViLWJyb3dzZXItc2VhcmNoLWJhclwiKTtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuc2VhcmNoQmFyKTtcblxuICAgICAgICB0aGlzLnNlYXJjaEJhci5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQpIHsgdmFyIGV2ZW50ID0gd2luZG93LmV2ZW50IGFzIEtleWJvYXJkRXZlbnQ7IH1cbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGxpc3RlbmVyIG9mIHRoaXMub25TZWFyY2hCYXJFbnRlckxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMuc2VhcmNoQmFyLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBhZGRPblNlYXJjaEJhckVudGVyTGlzdGVuZXIobGlzdGVuZXI6ICh1cmw6IHN0cmluZykgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLm9uU2VhcmNoQmFyRW50ZXJMaXN0ZW5lci5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICBzZXRTZWFyY2hCYXJVcmwodXJsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hCYXIudmFsdWUgPSB1cmw7XG4gICAgfVxuXG5cdGZvY3VzKCkge1xuXHRcdHRoaXMuc2VhcmNoQmFyLmZvY3VzKCk7XG5cdH1cbn1cbiIsICJpbXBvcnQgeyBGaWxlVmlldywgSXRlbVZpZXcsIFRGaWxlLCBWaWV3U3RhdGVSZXN1bHQgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IEhlYWRlckJhciB9IGZyb20gXCIuL2hlYWRlcl9iYXJcIjtcbmltcG9ydCB7IHJlbW90ZSB9IGZyb20gXCJlbGVjdHJvblwiO1xuXG5leHBvcnQgY29uc3QgV0VCX0JST1dTRVJfVklFV19JRCA9IFwid2ViLWJyb3dzZXItdmlld1wiO1xuXG5leHBvcnQgY2xhc3MgV2ViQnJvd3NlclZpZXcgZXh0ZW5kcyBJdGVtVmlldyB7XG4gICAgcHJpdmF0ZSBjdXJyZW50VXJsOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjdXJyZW50VGl0bGU6IHN0cmluZyA9IFwiTmV3IHRhYlwiO1xuXG4gICAgcHJpdmF0ZSBoZWFkZXJCYXI6IEhlYWRlckJhcjtcbiAgICBwcml2YXRlIGZhdmljb246IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQ7XG5cbiAgICBzdGF0aWMgc3Bhd25XZWJCcm93c2VyVmlldyhuZXdMZWFmOiBib29sZWFuLCBzdGF0ZTogV2ViQnJvd3NlclZpZXdTdGF0ZSkge1xuICAgICAgICBhcHAud29ya3NwYWNlLmdldExlYWYobmV3TGVhZikuc2V0Vmlld1N0YXRlKHsgdHlwZTogV0VCX0JST1dTRVJfVklFV19JRCwgYWN0aXZlOiB0cnVlLCBzdGF0ZSB9KTtcbiAgICB9XG5cbiAgICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGl0bGU7XG4gICAgfVxuXG4gICAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFdFQl9CUk9XU0VSX1ZJRVdfSUQ7XG4gICAgfVxuXG4gICAgYXN5bmMgb25PcGVuKCkge1xuICAgICAgICAvLyBBbGxvdyB2aWV3cyB0byByZXBsYWNlIHRoaXMgdmlld3MuXG4gICAgICAgIHRoaXMubmF2aWdhdGlvbiA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcblxuICAgICAgICAvLyBDcmVhdGUgc2VhcmNoIGJhciBpbiB0aGUgaGVhZGVyIGJhci5cbiAgICAgICAgdGhpcy5oZWFkZXJCYXIgPSBuZXcgSGVhZGVyQmFyKHRoaXMuaGVhZGVyRWwuY2hpbGRyZW5bMl0pO1xuXG4gICAgICAgIC8vIENyZWF0ZSBmYXZpY29uIGltYWdlIGVsZW1lbnQuXG4gICAgICAgIHRoaXMuZmF2aWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIikgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICAgICAgdGhpcy5mYXZpY29uLndpZHRoID0gMTY7XG4gICAgICAgIHRoaXMuZmF2aWNvbi5oZWlnaHQgPSAxNjtcblxuICAgICAgICAvLyBDcmVhdGUgbWFpbiB3ZWIgdmlldyBmcmFtZSB0aGF0IGRpc3BsYXlzIHRoZSB3ZWJzaXRlLlxuICAgICAgICB0aGlzLmZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIndlYnZpZXdcIikgYXMgSFRNTElGcmFtZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMuZnJhbWUuc2V0QXR0cmlidXRlKFwiYWxsb3dwb3B1cHNcIiwgXCJcIik7XG4gICAgICAgIC8vIENTUyBjbGFzc2VzIG1ha2VzIGZyYW1lIGZpbGwgdGhlIGVudGlyZSB0YWIncyBjb250ZW50IHNwYWNlLlxuICAgICAgICB0aGlzLmZyYW1lLmFkZENsYXNzKFwid2ViLWJyb3dzZXItZnJhbWVcIik7XG4gICAgICAgIHRoaXMuY29udGVudEVsLmFkZENsYXNzKFwid2ViLWJyb3dzZXItdmlldy1jb250ZW50XCIpO1xuICAgICAgICB0aGlzLmNvbnRlbnRFbC5hcHBlbmRDaGlsZCh0aGlzLmZyYW1lKTtcblxuICAgICAgICB0aGlzLmhlYWRlckJhci5hZGRPblNlYXJjaEJhckVudGVyTGlzdGVuZXIoKHVybDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRlKHVybCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcihcImRvbS1yZWFkeVwiLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgbGV0IHdlYkNvbnRlbnRzID0gcmVtb3RlLndlYkNvbnRlbnRzLmZyb21JZCh0aGlzLmZyYW1lLmdldFdlYkNvbnRlbnRzSWQoKSk7XG5cbiAgICAgICAgICAgIC8vIE9wZW4gbmV3IGJyb3dzZXIgdGFiIGlmIHRoZSB3ZWIgdmlldyByZXF1ZXN0cyBpdC5cbiAgICAgICAgICAgIHdlYkNvbnRlbnRzLnNldFdpbmRvd09wZW5IYW5kbGVyKChldmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgV2ViQnJvd3NlclZpZXcuc3Bhd25XZWJCcm93c2VyVmlldyh0cnVlLCB7IHVybDogZXZlbnQudXJsIH0pO1xuICAgICAgICAgICAgfSk7XG5cblx0XHRcdC8vIEZvciBnZXR0aW5nIGtleWJvYXJkIGV2ZW50IGZyb20gd2Vidmlld1xuXHRcdFx0d2ViQ29udGVudHMub24oJ2JlZm9yZS1pbnB1dC1ldmVudCcsIChldmVudDogYW55LCBpbnB1dDogYW55KSA9PiB7XG5cdFx0XHRcdGlmIChpbnB1dC50eXBlICE9PSAna2V5RG93bicpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDcmVhdGUgYSBmYWtlIEtleWJvYXJkRXZlbnQgZnJvbSB0aGUgZGF0YSBwcm92aWRlZFxuXHRcdFx0XHRjb25zdCBlbXVsYXRlZEtleWJvYXJkRXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHtcblx0XHRcdFx0XHRjb2RlOiBpbnB1dC5jb2RlLFxuXHRcdFx0XHRcdGtleTogaW5wdXQua2V5LFxuXHRcdFx0XHRcdHNoaWZ0S2V5OiBpbnB1dC5zaGlmdCxcblx0XHRcdFx0XHRhbHRLZXk6IGlucHV0LmFsdCxcblx0XHRcdFx0XHRjdHJsS2V5OiBpbnB1dC5jb250cm9sLFxuXHRcdFx0XHRcdG1ldGFLZXk6IGlucHV0Lm1ldGEsXG5cdFx0XHRcdFx0cmVwZWF0OiBpbnB1dC5pc0F1dG9SZXBlYXRcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gVE9ETyBEZXRlY3QgcHJlc3NlZCBob3RrZXlzIGlmIGV4aXN0cyBpbiBkZWZhdWx0IGhvdGtleXMgbGlzdFxuXHRcdFx0XHQvLyBJZiBzbywgcHJldmVudCBkZWZhdWx0IGFuZCBleGVjdXRlIHRoZSBob3RrZXlcblx0XHRcdFx0Ly8gSWYgbm90LCBzZW5kIHRoZSBldmVudCB0byB0aGUgd2Vidmlld1xuXHRcdFx0XHRhY3RpdmVEb2N1bWVudC5ib2R5LmRpc3BhdGNoRXZlbnQoZW11bGF0ZWRLZXlib2FyZEV2ZW50KTtcblx0XHRcdH0pO1xuICAgICAgICB9KTtcblxuXHRcdC8vIFdoZW4gZm9jdXMgc2V0IGN1cnJlbnQgbGVhZiBhY3RpdmU7XG5cdFx0dGhpcy5mcmFtZS5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKGV2ZW50OiBhbnkpID0+IHtcblx0XHRcdGFwcC53b3Jrc3BhY2Uuc2V0QWN0aXZlTGVhZih0aGlzLmxlYWYpO1xuXHRcdH0pO1xuXG4gICAgICAgIHRoaXMuZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2UtZmF2aWNvbi11cGRhdGVkXCIsIChldmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZhdmljb24uc3JjID0gZXZlbnQuZmF2aWNvbnNbMF07XG4gICAgICAgICAgICB0aGlzLmxlYWYudGFiSGVhZGVySW5uZXJJY29uRWwuZW1wdHkoKTtcbiAgICAgICAgICAgIHRoaXMubGVhZi50YWJIZWFkZXJJbm5lckljb25FbC5hcHBlbmRDaGlsZCh0aGlzLmZhdmljb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlLXRpdGxlLXVwZGF0ZWRcIiwgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgIHRoaXMubGVhZi50YWJIZWFkZXJJbm5lclRpdGxlRWwuaW5uZXJUZXh0ID0gZXZlbnQudGl0bGU7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUaXRsZSA9IGV2ZW50LnRpdGxlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aWxsLW5hdmlnYXRlXCIsIChldmVudDogYW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5hdmlnYXRlKGV2ZW50LnVybCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJkaWQtbmF2aWdhdGUtaW4tcGFnZVwiLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZShldmVudC51cmwsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5mcmFtZS5hZGRFdmVudExpc3RlbmVyKFwibmV3LXdpbmRvd1wiLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUcnlpbmcgdG8gb3BlbiBuZXcgd2luZG93IGF0IHVybDogXCIgKyBldmVudC51cmwpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2V0U3RhdGUoc3RhdGU6IFdlYkJyb3dzZXJWaWV3U3RhdGUsIHJlc3VsdDogVmlld1N0YXRlUmVzdWx0KSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGUoc3RhdGUudXJsLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZ2V0U3RhdGUoKTogV2ViQnJvd3NlclZpZXdTdGF0ZSB7XG4gICAgICAgIHJldHVybiB7IHVybDogdGhpcy5jdXJyZW50VXJsIH07XG4gICAgfVxuXG4gICAgbmF2aWdhdGUodXJsOiBzdHJpbmcsIGFkZFRvSGlzdG9yeTogYm9vbGVhbiA9IHRydWUsIHVwZGF0ZVdlYlZpZXc6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh1cmwgPT09IFwiXCIpIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgaWYgKGFkZFRvSGlzdG9yeSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGVhZi5oaXN0b3J5LmJhY2tIaXN0b3J5Lmxhc3QoKT8uc3RhdGU/LnN0YXRlPy51cmwgIT09IHRoaXMuY3VycmVudFVybCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGVhZi5oaXN0b3J5LmJhY2tIaXN0b3J5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogV0VCX0JST1dTRVJfVklFV19JRCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiB0aGlzLmdldFN0YXRlKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuY3VycmVudFRpdGxlLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBcInNlYXJjaFwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gRW5hYmxlIHRoZSBhcnJvdyBoaWdobGlnaHQgb24gdGhlIGJhY2sgYXJyb3cgYmVjYXVzZSB0aGVyZSdzIG5vdyBiYWNrIGhpc3RvcnkuXG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJFbC5jaGlsZHJlblsxXS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWRpc2FibGVkXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXHRcdC8vIFN1cHBvcnQgYm90aCBodHRwOi8vIGFuZCBodHRwczovL1xuXHRcdC8vIFRPRE86ID9TaG91bGQgd2Ugc3VwcG9ydCBMb2NhbGhvc3Q/XG5cdFx0Ly8gQW5kIHRoZSBiZWZvcmUgb25lIGlzIDogL1stYS16QS1aMC05QDolX1xcKy5+Iz8mLy89XXsyLDI1Nn1cXC5bYS16XXsyLDR9XFxiKFxcL1stYS16QS1aMC05QDolX1xcKy5+Iz8mLy89XSopPy9naTsgd2hpY2ggd2lsbCBvbmx5IG1hdGNoIGBibGFibGEuYmxhYmxhYFxuXHRcdC8vIFN1cHBvcnQgMTkyLjE2OC4wLjEgZm9yIHNvbWUgbG9jYWwgc29mdHdhcmUgc2VydmVyLCBhbmQgbG9jYWxob3N0XG4gICAgICAgIHZhciB1cmxSZWdFeCA9IC9eKGh0dHBzPzpcXC9cXC8pPyh3d3dcXC4pP1stYS16QS1aMC05QDolLl9cXCt+Iz8mLy89XXsxLDI1Nn1cXC5bYS16QS1aMC05KCldezEsNn1cXGIoWy1hLXpBLVowLTkoKUA6JV9cXCsufiM/Ji8vPV0qKSQvZztcbiAgICAgICAgaWYgKHVybFJlZ0V4LnRlc3QodXJsKSkge1xuICAgICAgICAgICAgbGV0IGZpcnN0NyA9IHVybC5zbGljZSgwLCA3KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgbGV0IGZpcnN0OCA9IHVybC5zbGljZSgwLCA4KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKCEoZmlyc3Q3ID09PSBcImh0dHA6Ly9cIiB8fCBmaXJzdDcgPT09IFwiZmlsZTovL1wiIHx8IGZpcnN0OCA9PT0gXCJodHRwczovL1wiKSkge1xuICAgICAgICAgICAgICAgIHVybCA9IFwiaHR0cHM6Ly9cIiArIHVybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCEodXJsLnNsaWNlKDAsIDcpID09PSBcImZpbGU6Ly9cIikgfHwgISgvXFwuaHRtKGwpPyQvZy50ZXN0KHVybCkpKSB7XG5cdFx0XHQvLyBJZiB1cmwgaXMgbm90IGEgdmFsaWQgRklMRSB1cmwsIHNlYXJjaCBpdCB3aXRoIHNlYXJjaCBlbmdpbmUuXG5cdFx0XHQvLyBUT0RPOiBTdXBwb3J0IG90aGVyIHNlYXJjaCBlbmdpbmVzLlxuXHRcdFx0dXJsID0gXCJodHRwczovL2R1Y2tkdWNrZ28uY29tLz9xPVwiICsgdXJsO1xuXHRcdH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSB1cmw7XG4gICAgICAgIHRoaXMuaGVhZGVyQmFyLnNldFNlYXJjaEJhclVybCh1cmwpO1xuICAgICAgICBpZiAodXBkYXRlV2ViVmlldykge1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgdXJsKTtcbiAgICAgICAgfVxuICAgICAgICBhcHAud29ya3NwYWNlLnJlcXVlc3RTYXZlTGF5b3V0KCk7XG4gICAgfVxufVxuXG5jbGFzcyBXZWJCcm93c2VyVmlld1N0YXRlIHtcbiAgICB1cmw6IHN0cmluZztcbn1cbiIsICJpbXBvcnQgeyBXZWJCcm93c2VyVmlldyB9IGZyb20gXCIuL3dlYl9icm93c2VyX3ZpZXdcIjtcblxuLy8gVE9ETzogQ2hhbmdlIHRoaXMgd2hvbGUgdGhpbmcgdG8gdXNlIGh0dHBzOi8vZ2l0aHViLmNvbS9wamVieS9tb25rZXktYXJvdW5kIGluc3RlYWQuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25Ib29rcyB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgb2dXaW5kb3ckT3BlbjogKHVybD86IHN0cmluZyB8IFVSTCwgdGFyZ2V0Pzogc3RyaW5nLCBmZWF0dXJlcz86IHN0cmluZykgPT4gV2luZG93UHJveHkgfCBudWxsO1xuXG4gICAgc3RhdGljIG9ubG9hZCgpIHtcbiAgICAgICAgRnVuY3Rpb25Ib29rcy5vZ1dpbmRvdyRPcGVuID0gd2luZG93Lm9wZW47XG4gICAgICAgIHdpbmRvdy5vcGVuID0gKHVybD86IHN0cmluZyB8IFVSTCwgdGFyZ2V0Pzogc3RyaW5nLCBmZWF0dXJlcz86IHN0cmluZyk6IFdpbmRvd1Byb3h5IHwgbnVsbCA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBDcmVhdGUgc2V0dGluZyBmb3Igd2hldGhlciB0byBvcGVuIGV4dGVybmFsIGxpbmtzIG91dHNpZGUgb2YgT2JzaWRpYW4gb3Igbm90LlxuICAgICAgICAgICAgLy8gcmV0dXJuIEZ1bmN0aW9uSG9va3Mub2dXaW5kb3ckT3Blbi5jYWxsKHdpbmRvdywgdXJsLCB0YXJnZXQsIGZlYXR1cmVzKTtcblxuICAgICAgICAgICAgbGV0IHVybFN0cmluZzogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgdXJsU3RyaW5nID0gdXJsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1cmwgaW5zdGFuY2VvZiBVUkwpIHtcbiAgICAgICAgICAgICAgICB1cmxTdHJpbmcgPSB1cmwudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gMS4gQWxsb3dzIE9ic2lkaWFuIHRvIG9wZW4gYSBwb3B1cCB3aW5kb3cgaWYgdXJsIGlzIFwiYWJvdXQ6YmxhbmtcIiBhbmQgZmVhdHVyZXMgaXMgbm90IG51bGxcbiAgICAgICAgICAgIC8vIFRPRE86IFRoZXJlIG1pZ2h0IGJlIGEgYmV0dGVyIHdheSB0byBkZXRlY3QgaWYgaXQncyBhIHBvcHVwIHdpbmRvdy5cbiAgICAgICAgICAgIC8vIDIuIFBlcmZvcm0gZGVmYXVsdCBiZWhhdmlvciBpZiB0aGUgdXJsIGlzbid0IFwiaHR0cDovL1wiIG9yIFwiaHR0cHM6Ly9cIlxuICAgICAgICAgICAgLy8gVE9ETzogQ2hhbmdlIHRvIGBpc1dlYlVyaSgpYCB3aGVuIEkgY2hhbmdlIHRvIHVzZSB0aGUgdmFsaWQtdXJsIGxpYnJhcnkuXG4gICAgICAgICAgICBpZiAoKHVybFN0cmluZyA9PT0gXCJhYm91dDpibGFua1wiICYmIGZlYXR1cmVzKSB8fCAoIXVybFN0cmluZy5zdGFydHNXaXRoKFwiaHR0cDovL1wiKSAmJiAhdXJsU3RyaW5nLnN0YXJ0c1dpdGgoXCJodHRwczovL1wiKSAmJiAhdXJsU3RyaW5nLnN0YXJ0c1dpdGgoXCJmaWxlOi8vXCIpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbkhvb2tzLm9nV2luZG93JE9wZW4uY2FsbCh3aW5kb3csIHVybCwgdGFyZ2V0LCBmZWF0dXJlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE86IE9wZW4gZXh0ZXJuYWwgbGluayBpbiBjdXJyZW50IGxlYWYgd2hlbiBtZXRhIGtleSBpc24ndCBiZWluZyBoZWxkIGRvd24uXG4gICAgICAgICAgICBXZWJCcm93c2VyVmlldy5zcGF3bldlYkJyb3dzZXJWaWV3KHRydWUsIHsgdXJsOiB1cmxTdHJpbmcgfSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBvbnVubG9hZCgpIHtcbiAgICAgICAgLy8gQ2xlYW4gdXAgb3VyIGhhY2tpbmVzcyB3aGVuIHRoZSBwbHVnaW4gaXMgZGlzYWJsZWQuXG4gICAgICAgIHdpbmRvdy5vcGVuID0gRnVuY3Rpb25Ib29rcy5vZ1dpbmRvdyRPcGVuO1xuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBGaWxlU3lzdGVtQWRhcHRlciwgRmlsZVZpZXcsIFRGaWxlLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBXZWJCcm93c2VyVmlldyB9IGZyb20gXCIuL3dlYl9icm93c2VyX3ZpZXdcIjtcblxuZXhwb3J0IGNvbnN0IEhUTUxfRklMRV9FWFRFTlNJT05TID0gW1wiaHRtbFwiLFwiaHRtXCJdO1xuZXhwb3J0IGNvbnN0IFdFQl9CUk9XU0VSX0ZJTEVfVklFV19JRCA9IFwid2ViLWJyb3dzZXItZmlsZS12aWV3XCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJCcm93c2VyRmlsZVZpZXcgZXh0ZW5kcyBGaWxlVmlldyB7XG5cdGFsbG93Tm9GaWxlOiBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvcihsZWFmOiBXb3Jrc3BhY2VMZWFmKSB7XG5cdFx0c3VwZXIobGVhZik7XG5cdH1cblxuXHRhc3luYyBvbkxvYWRGaWxlKGZpbGU6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG5cdFx0Y29uc3QgYWRhcHRlciA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgYXMgRmlsZVN5c3RlbUFkYXB0ZXI7XG5cdFx0Y29uc3QgdXJsU3RyaW5nID0gXCJmaWxlOi8vL1wiICsgKGFkYXB0ZXIuZ2V0QmFzZVBhdGgoKSArIFwiL1wiICsgZmlsZS5wYXRoKS50b1N0cmluZygpLnJlcGxhY2UoL1xccy9nLCBcIiUyMFwiKTtcblx0XHRXZWJCcm93c2VyVmlldy5zcGF3bldlYkJyb3dzZXJWaWV3KHRydWUsIHsgdXJsOiB1cmxTdHJpbmcgfSk7XG5cdFx0aWYodGhpcy5sZWFmKSB0aGlzLmxlYWYuZGV0YWNoKCk7XG5cdH1cblxuXHRvbnVubG9hZCgpOiB2b2lkIHtcblx0fVxuXG5cdGNhbkFjY2VwdEV4dGVuc2lvbihleHRlbnNpb246IHN0cmluZykge1xuXHRcdHJldHVybiBIVE1MX0ZJTEVfRVhURU5TSU9OUy5pbmNsdWRlcyhleHRlbnNpb24pO1xuXHR9XG5cblx0Z2V0Vmlld1R5cGUoKSB7XG5cdFx0cmV0dXJuIFdFQl9CUk9XU0VSX0ZJTEVfVklFV19JRDtcblx0fVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUFtRDs7O0FDQTVDLElBQU0sWUFBTixNQUFnQjtBQUFBLEVBSW5CLFlBQVksUUFBaUI7QUFGN0IsU0FBUSwyQkFBMkIsSUFBSTtBQUluQyxXQUFPLFNBQVMsd0JBQXdCO0FBRXhDLFdBQU8sWUFBWSxPQUFPLFNBQVMsRUFBRTtBQUdyQyxTQUFLLFlBQVksU0FBUyxjQUFjLE9BQU87QUFDL0MsU0FBSyxVQUFVLE9BQU87QUFDdEIsU0FBSyxVQUFVLGNBQWM7QUFDN0IsU0FBSyxVQUFVLFNBQVMsd0JBQXdCO0FBQ2hELFdBQU8sWUFBWSxLQUFLLFNBQVM7QUFFakMsU0FBSyxVQUFVLGlCQUFpQixXQUFXLENBQUMsVUFBeUI7QUFDakUsVUFBSSxDQUFDLE9BQU87QUFBRSxZQUFJLFFBQVEsT0FBTztBQUFBLE1BQXdCO0FBQ3pELFVBQUksTUFBTSxRQUFRLFNBQVM7QUFDdkIsaUJBQVMsWUFBWSxLQUFLLDBCQUEwQjtBQUNoRCxtQkFBUyxLQUFLLFVBQVUsS0FBSztBQUFBLFFBQ2pDO0FBQUEsTUFDSjtBQUFBLElBQ0osR0FBRyxLQUFLO0FBQUEsRUFDWjtBQUFBLEVBRUEsNEJBQTRCLFVBQWlDO0FBQ3pELFNBQUsseUJBQXlCLEtBQUssUUFBUTtBQUFBLEVBQy9DO0FBQUEsRUFFQSxnQkFBZ0IsS0FBYTtBQUN6QixTQUFLLFVBQVUsUUFBUTtBQUFBLEVBQzNCO0FBQUEsRUFFSCxRQUFRO0FBQ1AsU0FBSyxVQUFVLE1BQU07QUFBQSxFQUN0QjtBQUNEOzs7QUN0Q0Esc0JBQTJEO0FBRTNELHNCQUF1QjtBQUVoQixJQUFNLHNCQUFzQjtBQUU1QixJQUFNLGlCQUFOLGNBQTZCLHlCQUFTO0FBQUEsRUFBdEM7QUFBQTtBQUVILFNBQVEsZUFBdUI7QUFBQTtBQUFBLEVBTS9CLE9BQU8sb0JBQW9CLFNBQWtCLE9BQTRCO0FBQ3JFLFFBQUksVUFBVSxRQUFRLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQkFBcUIsUUFBUSxNQUFNLE1BQU0sQ0FBQztBQUFBLEVBQ2xHO0FBQUEsRUFFQSxpQkFBeUI7QUFDckIsV0FBTyxLQUFLO0FBQUEsRUFDaEI7QUFBQSxFQUVBLGNBQXNCO0FBQ2xCLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFQSxNQUFNLFNBQVM7QUFFWCxTQUFLLGFBQWE7QUFFbEIsU0FBSyxVQUFVLE1BQU07QUFHckIsU0FBSyxZQUFZLElBQUksVUFBVSxLQUFLLFNBQVMsU0FBUyxFQUFFO0FBR3hELFNBQUssVUFBVSxTQUFTLGNBQWMsS0FBSztBQUMzQyxTQUFLLFFBQVEsUUFBUTtBQUNyQixTQUFLLFFBQVEsU0FBUztBQUd0QixTQUFLLFFBQVEsU0FBUyxjQUFjLFNBQVM7QUFDN0MsU0FBSyxNQUFNLGFBQWEsZUFBZSxFQUFFO0FBRXpDLFNBQUssTUFBTSxTQUFTLG1CQUFtQjtBQUN2QyxTQUFLLFVBQVUsU0FBUywwQkFBMEI7QUFDbEQsU0FBSyxVQUFVLFlBQVksS0FBSyxLQUFLO0FBRXJDLFNBQUssVUFBVSw0QkFBNEIsQ0FBQyxRQUFnQjtBQUN4RCxXQUFLLFNBQVMsR0FBRztBQUFBLElBQ3JCLENBQUM7QUFFRCxTQUFLLE1BQU0saUJBQWlCLGFBQWEsQ0FBQyxVQUFlO0FBRXJELFVBQUksY0FBYyx1QkFBTyxZQUFZLE9BQU8sS0FBSyxNQUFNLGlCQUFpQixDQUFDO0FBR3pFLGtCQUFZLHFCQUFxQixDQUFDLFdBQWU7QUFDN0MsdUJBQWUsb0JBQW9CLE1BQU0sRUFBRSxLQUFLLE9BQU0sSUFBSSxDQUFDO0FBQUEsTUFDL0QsQ0FBQztBQUdWLGtCQUFZLEdBQUcsc0JBQXNCLENBQUMsUUFBWSxVQUFlO0FBQ2hFLFlBQUksTUFBTSxTQUFTLFdBQVc7QUFDN0I7QUFBQSxRQUNEO0FBR0EsY0FBTSx3QkFBd0IsSUFBSSxjQUFjLFdBQVc7QUFBQSxVQUMxRCxNQUFNLE1BQU07QUFBQSxVQUNaLEtBQUssTUFBTTtBQUFBLFVBQ1gsVUFBVSxNQUFNO0FBQUEsVUFDaEIsUUFBUSxNQUFNO0FBQUEsVUFDZCxTQUFTLE1BQU07QUFBQSxVQUNmLFNBQVMsTUFBTTtBQUFBLFVBQ2YsUUFBUSxNQUFNO0FBQUEsUUFDZixDQUFDO0FBS0QsdUJBQWUsS0FBSyxjQUFjLHFCQUFxQjtBQUFBLE1BQ3hELENBQUM7QUFBQSxJQUNJLENBQUM7QUFHUCxTQUFLLE1BQU0saUJBQWlCLFNBQVMsQ0FBQyxVQUFlO0FBQ3BELFVBQUksVUFBVSxjQUFjLEtBQUssSUFBSTtBQUFBLElBQ3RDLENBQUM7QUFFSyxTQUFLLE1BQU0saUJBQWlCLHdCQUF3QixDQUFDLFVBQWU7QUFDaEUsV0FBSyxRQUFRLE1BQU0sTUFBTSxTQUFTO0FBQ2xDLFdBQUssS0FBSyxxQkFBcUIsTUFBTTtBQUNyQyxXQUFLLEtBQUsscUJBQXFCLFlBQVksS0FBSyxPQUFPO0FBQUEsSUFDM0QsQ0FBQztBQUVELFNBQUssTUFBTSxpQkFBaUIsc0JBQXNCLENBQUMsVUFBZTtBQUM5RCxXQUFLLEtBQUssc0JBQXNCLFlBQVksTUFBTTtBQUNsRCxXQUFLLGVBQWUsTUFBTTtBQUFBLElBQzlCLENBQUM7QUFFRCxTQUFLLE1BQU0saUJBQWlCLGlCQUFpQixDQUFDLFVBQWU7QUFDekQsV0FBSyxTQUFTLE1BQU0sS0FBSyxNQUFNLEtBQUs7QUFBQSxJQUN4QyxDQUFDO0FBRUQsU0FBSyxNQUFNLGlCQUFpQix3QkFBd0IsQ0FBQyxVQUFlO0FBQ2hFLFdBQUssU0FBUyxNQUFNLEtBQUssTUFBTSxLQUFLO0FBQUEsSUFDeEMsQ0FBQztBQUVELFNBQUssTUFBTSxpQkFBaUIsY0FBYyxDQUFDLFVBQWU7QUFDdEQsY0FBUSxJQUFJLHVDQUF1QyxNQUFNLEdBQUc7QUFDNUQsWUFBTSxlQUFlO0FBQUEsSUFDekIsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUVBLE1BQU0sU0FBUyxPQUE0QixRQUF5QjtBQUNoRSxTQUFLLFNBQVMsTUFBTSxLQUFLLEtBQUs7QUFBQSxFQUNsQztBQUFBLEVBRUEsV0FBZ0M7QUFDNUIsV0FBTyxFQUFFLEtBQUssS0FBSyxXQUFXO0FBQUEsRUFDbEM7QUFBQSxFQUVBLFNBQVMsS0FBYSxlQUF3QixNQUFNLGdCQUF5QixNQUFNO0FBM0h2RjtBQTRIUSxRQUFJLFFBQVEsSUFBSTtBQUFFO0FBQUEsSUFBUTtBQUUxQixRQUFJLGNBQWM7QUFDZCxVQUFJLHdCQUFLLEtBQUssUUFBUSxZQUFZLEtBQUssTUFBbkMsbUJBQXNDLFVBQXRDLG1CQUE2QyxVQUE3QyxtQkFBb0QsU0FBUSxLQUFLLFlBQVk7QUFDN0UsYUFBSyxLQUFLLFFBQVEsWUFBWSxLQUFLO0FBQUEsVUFDL0IsT0FBTztBQUFBLFlBQ0gsTUFBTTtBQUFBLFlBQ04sT0FBTyxLQUFLLFNBQVM7QUFBQSxVQUN6QjtBQUFBLFVBQ0EsT0FBTyxLQUFLO0FBQUEsVUFDWixNQUFNO0FBQUEsUUFDVixDQUFDO0FBRUQsYUFBSyxTQUFTLFNBQVMsR0FBRyxTQUFTLEdBQUcsYUFBYSxpQkFBaUIsT0FBTztBQUFBLE1BQy9FO0FBQUEsSUFDSjtBQU1BLFFBQUksV0FBVztBQUNmLFFBQUksU0FBUyxLQUFLLEdBQUcsR0FBRztBQUNwQixVQUFJLFNBQVMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFLFlBQVk7QUFDekMsVUFBSSxTQUFTLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRSxZQUFZO0FBQ3pDLFVBQUksQ0FBRSxZQUFXLGFBQWEsV0FBVyxhQUFhLFdBQVcsYUFBYTtBQUMxRSxjQUFNLGFBQWE7QUFBQSxNQUN2QjtBQUFBLElBQ0osV0FBVSxDQUFFLEtBQUksTUFBTSxHQUFHLENBQUMsTUFBTSxjQUFjLENBQUUsY0FBYyxLQUFLLEdBQUcsR0FBSTtBQUcvRSxZQUFNLCtCQUErQjtBQUFBLElBQ3RDO0FBRU0sU0FBSyxhQUFhO0FBQ2xCLFNBQUssVUFBVSxnQkFBZ0IsR0FBRztBQUNsQyxRQUFJLGVBQWU7QUFDZixXQUFLLE1BQU0sYUFBYSxPQUFPLEdBQUc7QUFBQSxJQUN0QztBQUNBLFFBQUksVUFBVSxrQkFBa0I7QUFBQSxFQUNwQztBQUNKOzs7QUNsS08sSUFBTSxnQkFBTixNQUFvQjtBQUFBLEVBR3ZCLE9BQU8sU0FBUztBQUNaLGtCQUFjLGdCQUFnQixPQUFPO0FBQ3JDLFdBQU8sT0FBTyxDQUFDLEtBQW9CLFFBQWlCLGFBQTBDO0FBSTFGLFVBQUksWUFBb0I7QUFDeEIsVUFBSSxPQUFPLFFBQVEsVUFBVTtBQUN6QixvQkFBWTtBQUFBLE1BQ2hCLFdBQVcsZUFBZSxLQUFLO0FBQzNCLG9CQUFZLElBQUksU0FBUztBQUFBLE1BQzdCO0FBTUEsVUFBSyxjQUFjLGlCQUFpQixZQUFjLENBQUMsVUFBVSxXQUFXLFNBQVMsS0FBSyxDQUFDLFVBQVUsV0FBVyxVQUFVLEtBQUssQ0FBQyxVQUFVLFdBQVcsU0FBUyxHQUFJO0FBQzFKLGVBQU8sY0FBYyxjQUFjLEtBQUssUUFBUSxLQUFLLFFBQVEsUUFBUTtBQUFBLE1BQ3pFO0FBR0EscUJBQWUsb0JBQW9CLE1BQU0sRUFBRSxLQUFLLFVBQVUsQ0FBQztBQUMzRCxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFBQSxFQUVBLE9BQU8sV0FBVztBQUVkLFdBQU8sT0FBTyxjQUFjO0FBQUEsRUFDaEM7QUFDSjs7O0FDckNBLHVCQUFrRTtBQUczRCxJQUFNLHVCQUF1QixDQUFDLFFBQU8sS0FBSztBQUMxQyxJQUFNLDJCQUEyQjtBQUVqQyxJQUFNLHFCQUFOLGNBQWlDLDBCQUFTO0FBQUEsRUFHaEQsWUFBWSxNQUFxQjtBQUNoQyxVQUFNLElBQUk7QUFBQSxFQUNYO0FBQUEsRUFFQSxNQUFNLFdBQVcsTUFBNEI7QUFDNUMsVUFBTSxVQUFVLEtBQUssSUFBSSxNQUFNO0FBQy9CLFVBQU0sWUFBWSxhQUFjLFNBQVEsWUFBWSxJQUFJLE1BQU0sS0FBSyxNQUFNLFNBQVMsRUFBRSxRQUFRLE9BQU8sS0FBSztBQUN4RyxtQkFBZSxvQkFBb0IsTUFBTSxFQUFFLEtBQUssVUFBVSxDQUFDO0FBQzNELFFBQUcsS0FBSztBQUFNLFdBQUssS0FBSyxPQUFPO0FBQUEsRUFDaEM7QUFBQSxFQUVBLFdBQWlCO0FBQUEsRUFDakI7QUFBQSxFQUVBLG1CQUFtQixXQUFtQjtBQUNyQyxXQUFPLHFCQUFxQixTQUFTLFNBQVM7QUFBQSxFQUMvQztBQUFBLEVBRUEsY0FBYztBQUNiLFdBQU87QUFBQSxFQUNSO0FBQ0Q7OztBSnhCQSxJQUFxQixXQUFyQixjQUFzQyx3QkFBTztBQUFBLEVBRzVDLE1BQU0sU0FBUztBQUNkLFVBQU0sS0FBSyxhQUFhO0FBRXhCLFNBQUssYUFBYSxxQkFBcUIsQ0FBQyxTQUFTLElBQUksZUFBZSxJQUFJLENBQUM7QUFHekUsU0FBSyxhQUFhLDBCQUEwQixDQUFDLFNBQVMsSUFBSSxtQkFBbUIsSUFBSSxDQUFDO0FBRWxGLFFBQUk7QUFDSCxXQUFLLG1CQUFtQixzQkFBc0Isd0JBQXdCO0FBQUEsSUFDdkUsU0FBUyxPQUFQO0FBQ0QsVUFBSSx3QkFBTyxtQkFBbUIsMkRBQTJEO0FBQUEsSUFDMUY7QUFFQSxrQkFBYyxPQUFPO0FBR3JCLFNBQUsseUJBQXlCLEtBQUssSUFBSSxVQUFVLEdBQUcsaUJBQWlCLE1BQU07QUFDMUUsVUFBSSxhQUFhLEtBQUssSUFBSSxVQUFVLG9CQUFvQix5QkFBUTtBQUNoRSxVQUFJLFlBQVk7QUFFZixZQUFJLFdBQVcsVUFBVSxTQUFTLEdBQUcsU0FBUyxhQUFhLEdBQUc7QUFFN0QsY0FBSSxDQUFDLFdBQVcsU0FBUyxTQUFTLEdBQUcsU0FBUyx3QkFBd0IsR0FBRztBQUN4RSxnQkFBSSxZQUFZLElBQUksVUFBVSxXQUFXLFNBQVMsU0FBUyxFQUFFO0FBRTdELHNCQUFVLE1BQU07QUFDaEIsc0JBQVUsNEJBQTRCLENBQUMsUUFBZ0I7QUFDdEQsNkJBQWUsb0JBQW9CLE9BQU8sRUFBRSxJQUFJLENBQUM7QUFBQSxZQUNsRCxDQUFDO0FBQUEsVUFDRjtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsSUFDRCxDQUFDO0FBQUEsRUFDRjtBQUFBLEVBRUEsV0FBVztBQTdDWjtBQThDRSxTQUFLLElBQUksVUFBVSxtQkFBbUIsbUJBQW1CO0FBQ3pELGtCQUFjLFNBQVM7QUFDdkIsU0FBSyxJQUFJLFVBQVUsT0FBTyxLQUFLLHNCQUFzQjtBQUdyRCxRQUFJLGFBQWEsU0FBUyx1QkFBdUIsd0JBQXdCO0FBQ3pFLFdBQU8sV0FBVyxTQUFTLEdBQUc7QUFDN0IsdUJBQVcsR0FBRyxrQkFBZCxtQkFBNkIsWUFBWSxXQUFXO0FBQUEsSUFDckQ7QUFBQSxFQUNEO0FBQUEsRUFFQSxNQUFNLGVBQWU7QUFBQSxFQUNyQjtBQUFBLEVBRUEsTUFBTSxlQUFlO0FBQUEsRUFDckI7QUFDRDsiLAogICJuYW1lcyI6IFtdCn0K
