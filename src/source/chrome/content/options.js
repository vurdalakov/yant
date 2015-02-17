var vurdalakovYant_options =
{
	onLoad: function()
	{
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var url = prefs.getCharPref("browser.startup.homepage");
		
		var elem = document.getElementById("homepage");
		elem.value = url;
		elem.href = url;

		vurdalakovYant_options.onUrlChange();
	},
	
	openPreferences: function()
	{
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var win = wm.getMostRecentWindow("Browser:Preferences");

		if (win)
		{
			win.focus();
		}
		else
		{
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			var features = "chrome,titlebar,toolbar,centerscreen,";
            try
            {
                var instantApply = prefs.getBoolPref("browser.preferences.instantApply", false);
                features += instantApply ? "dialog=no" : "modal";
            }
            catch (e)
            {
                features += "modal";
            }
			
			window.openDialog("chrome://browser/content/preferences/preferences.xul", "Preferences", features);
		}
	},
	
	onUseCurrentPage: function()
	{
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIWebNavigation)
			.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			.rootTreeItem
			.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIDOMWindow);

		var url = mainWindow.getBrowser().selectedBrowser.contentWindow.location.href;
		
		var elem = document.getElementById("url");
		elem.value = url;
	},
	
	onUrlChange: function()
	{
		var elem = document.getElementById("url");
		var url = elem.value;
		
		elem = document.getElementById("open");
		elem.href = url;
	},
	
	onAbout: function()
	{
		window.openDialog("chrome://yant/content/about.xul", "About", "chrome,titlebar,toolbar,centerscreen,modal");
	}
}
