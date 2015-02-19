/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tracing
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function trace(msg)
{
    console.log(msg);
}

function traceObject(object)
{
    for (attribute in object)
    {
        trace(attribute + ": '" + object[attribute] + "'");
    }
}

function traceEntryPoint(name, data, reason)
{
    trace("============= " + name + "(data, " + reason + ")");
    trace("id:          '" + data.id + "'");
    trace("version:     '" + data.version + "'");
    trace("installPath: '" + data.installPath.path + "'");
    trace("resourceURI: '" + data.resourceURI.spec + "'");
    trace("oldVersion:  '" + data.oldVersion + "'");
    trace("newVersion:  '" + data.newVersion + "'");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Preferences
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PREF_BRANCH = "extensions.vurdalakovYant.";

function getPreferences(defaultBranch)
{
    var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    
    if (defaultBranch)
    {
        return prefService.getDefaultBranch(PREF_BRANCH);
    }
    else
    {
        return prefService.getBranch(PREF_BRANCH);
    }
}

function setDefaultPreferences()
{
    trace("setDefaultPreferences()");

    var preferences = getPreferences(true);

    preferences.setIntPref("mode", 0);
    preferences.setCharPref("url", "http://www.google.com/");
    preferences.setBoolPref("focus", false);

    trace("setDefaultPreferences OK");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getWindows()
{
    var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var windows = windowMediator.getEnumerator("navigator:browser");
    return windows;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main functionality
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setFocus(window, browser)
{
    trace("setFocus()");
    trace("window='" + window.document.URL + "'");

    browser.removeEventListener('load', arguments.callee, true);

    if (getPreferences(false).getBoolPref("focus"))
    {
        var bar = window.document.getElementById('urlbar');
        bar.select();
        trace("Location bar focused");
    }
    else
    {
        browser.focus();
        trace("Browser page focused");
    }
}

// Is called when a new tab is open
function onTabOpen(event)
{
    trace("onNewTab(" + event + ")");

    var window = this.ownerDocument.defaultView;

    if ('gBrowser' in window)
    {
        var browser = window.gBrowser.getBrowserForTab(event.originalTarget);

        browser.addEventListener('load', function() { setFocus(window, browser); }, true);
    }
}

// Adds listener to a browser window
function addEventListener(window)
{
    trace("addEventListener('" + window.document.URL + "')");

    if ('gBrowser' in window)
    {
        window.gBrowser.tabContainer.addEventListener("TabOpen", onTabOpen, false);
        trace("Listener added");
    }
}

// Removes listener from a browser window
function removeEventListener(window)
{
    trace("removeEventListener('" + window.document.URL + "')");

    if ('gBrowser' in window)
    {
        window.gBrowser.tabContainer.removeEventListener("TabOpen", onTabOpen, false);
        trace("Listener removed");
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Window watcher
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getWindowWatcher()
{
    var windowWatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
    return windowWatcher;
}

function onFirstWindowLoad(event)
{
    trace("onFirstWindowLoad()");

    var window = event.originalTarget.defaultView;

    window.removeEventListener('load', onFirstWindowLoad, false);

    trace("URL='" + window.document.URL + "'");
    
    if ('gBrowser' in window)
    {
        var browser = window.gBrowser.selectedTab.linkedBrowser;
        browser.addEventListener('load', function() { setFocus(window, browser); }, true);
    }
}

function onNewWindowLoad(window)
{
    trace("onNewWindowLoad('" + window.document.URL + "')");

    window.removeEventListener('load', arguments.callee, true);

    addEventListener(window);  
}

function windowWatcherObserver(startup)
{
    this.addEventListener = startup;

    this.observe = function(window, event, data)
    {
        trace("windowWatcherObserver.observe()");
        trace("windowWatcherObserver.observe('" + window.document.URL + "', '" + event + "')");

        //if (this.addEventListener)
        if (true)
        {
            trace("Startup, adding event listener");
            this.addEventListener = false;
            window.addEventListener('load', onFirstWindowLoad, false);
        }
        
        if ("domwindowopened" == event)
        {
            trace("domwindowopened, adding event listener");
            window.addEventListener('load', function(event) { onNewWindowLoad(window); }, true);
        }
    }
}

function registerWindowWatcherObserver(startup)
{
    trace("registerWindowWatcherObserver(" + startup + ")");

    this.observer = new windowWatcherObserver(startup);
    
    getWindowWatcher().registerNotification(this.observer);
}

function unregisterWindowWatcherObserver()
{
    trace("unregisterWindowWatcherObserver()");

    getWindowWatcher().unregisterNotification(this.observer);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bootstrap entry points
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Called when the extension needs to start itself up. This happens at application launch time or
// when the extension is enabled after being disabled (or after it has been shut down in order
// to install an update. As such, this can be called many times during the lifetime of the application.
// This is when your add-on should inject its UI, start up any tasks it may need running, and so forth.
function startup(data, reason)
{ 
    traceEntryPoint("startup", data, reason);
    
    setDefaultPreferences();

    // add listeners to existing browser windows
    var windows = getWindows();
    while (windows.hasMoreElements())
    {
        var window = windows.getNext();
        addEventListener(window);
    }

    // register new window notification
    registerWindowWatcherObserver(APP_STARTUP == reason);
}

// Called when the extension needs to shut itself down, such as when the application
// is quitting or when the extension is about to be upgraded or disabled.
// Any user interface that has been injected must be removed, tasks shut down, and objects disposed of.
function shutdown(data, reason)
{ 
    traceEntryPoint("shutdown", data, reason);
    
    // unregister new window notification
    unregisterWindowWatcherObserver();

    // remove listeners from existing browser windows
    var windows = getWindows();
    while (windows.hasMoreElements())
    {
        var window = windows.getNext();
        removeEventListener(window);
    }
}

// Your bootstrap script must include an install() function, which the application
// calls before the first call to startup() after the extension is installed, upgraded, or downgraded.
function install(data, reason)
{ 
    traceEntryPoint("install", data, reason);
}

// This function is called after the last call to shutdown() before a particular version
// of an extension is uninstalled. This will not be called if install() was never called.
function uninstall(data, reason)
{
    traceEntryPoint("uninstall", data, reason);
}
