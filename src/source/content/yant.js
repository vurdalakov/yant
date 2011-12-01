var yant =
{
	m_preferences: null,

	load: function()
	{
                this.m_preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yant.");

		gBrowser.removeEventListener("NewTab", BrowserOpenTab, false);
		
		window.BrowserOpenTab = yant.openNewTab;
		gBrowser.addEventListener("NewTab", yant.openNewTab, false);
	},
	
	openTab: function(aEvent, url, focus)
	{
		var tab = gBrowser.addTab(url);
		gBrowser.selectedTab = tab;

		if (focus)
		{
			if (gURLBar)
			{
				setTimeout(function() { gURLBar.select(); }, 0);
			}
		}

		if (aEvent)
		{
			aEvent.stopPropagation();
		}

		return tab;
	},

	openNewTab: function(aEvent)
	{
		var url = null;
		var focus = this.m_preferences.getBoolPref("focus");
		
		switch (this.m_preferences.getIntPref("mode"))
		{
			case 0:
				url = gHomeButton.getHomePage().split("|")[0];
				break;
			case 1:
				url = this.m_preferences.getCharPref("url");
				break;
			case 2:
				focus = true;
				break;
		}

		return yant.openTab(aEvent, url, focus);
	},

	openEmptyTab: function(aEvent)
	{
		return this.openTab(aEvent, null, true);
	}
}

window.addEventListener("load", yant.load, false);
