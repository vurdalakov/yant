var yant =
{
	m_preferences: null,

	load: function ()
	{
                this.m_preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("yant.");

		gBrowser.removeEventListener("NewTab", BrowserOpenTab, false);
		
		window.BrowserOpenTab = yant.openNewTab;
		gBrowser.addEventListener("NewTab", yant.openNewTab, false);
	},

	openNewTab: function (aEvent)
	{
		var url = null;
		
		switch (this.m_preferences.getIntPref("mode"))
		{
			case 0:
				url = gHomeButton.getHomePage().split("|")[0];
				break;
			case 1:
				url = this.m_preferences.getCharPref("url");
				break;
		}

		var tab = gBrowser.addTab(url);
		gBrowser.selectedTab = tab;

		if (this.m_preferences.getBoolPref("focus"))
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

	openEmptyTab: function (aEvent)
	{
		var tab = gBrowser.addTab();
		gBrowser.selectedTab = tab;

		if (aEvent)
		{
			aEvent.stopPropagation();
		}

		return tab;
	}
}

window.addEventListener("load", yant.load, false);
