var vurdalakovYant_options =
{
	m_preferences: null,

	onLoad: function()
	{
		this.m_preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

		var homepageUrl = this.m_preferences.getCharPref("browser.startup.homepage");
		var element = document.getElementById("homepage");
		element.value = homepageUrl;
		element.href = homepageUrl;

		newtabUrl = this.m_preferences.getCharPref("browser.newtab.url");
        if (newtabUrl == homepageUrl)
        {
            this.m_preferences.setIntPref("extensions.vurdalakovYant.mode", 0);
        }
        else if ("about:blank" == newtabUrl)
        {
            this.m_preferences.setIntPref("extensions.vurdalakovYant.mode", 2);
        }
        else if ("about:newtab" == newtabUrl)
        {
            this.m_preferences.setIntPref("extensions.vurdalakovYant.mode", 3);
        }
        else
        {
            this.m_preferences.setIntPref("extensions.vurdalakovYant.mode", 1);
            this.m_preferences.setCharPref("extensions.vurdalakovYant.url", newtabUrl);
        }
        
		vurdalakovYant_options.onUrlChange();
	},
    
	onUnload: function()
	{
        var newtabUrl = "";
		switch (this.m_preferences.getIntPref("extensions.vurdalakovYant.mode"))
		{
			case 0:
                newtabUrl = this.m_preferences.getCharPref("browser.startup.homepage");
				break;
			case 2:
				newtabUrl = "about:blank";
				break;
			case 3:
				newtabUrl = "about:newtab";
				break;
			default:
				newtabUrl = this.m_preferences.getCharPref("extensions.vurdalakovYant.url");
				break;
		}
        this.m_preferences.setCharPref("browser.newtab.url", newtabUrl);
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
			var features = "chrome,titlebar,toolbar,centerscreen,";
            try
            {
                var instantApply = this.m_preferences.getBoolPref("browser.preferences.instantApply", false);
                features += instantApply ? "dialog=no" : "modal";
            }
            catch (e)
            {
                features += "modal";
            }
			
			window.openDialog("chrome://browser/content/preferences/preferences.xul", "Preferences", features);
		}
	},
	
/*	onUseCurrentPage: function()
	{
		var url = window.opener.content.document.location.href;
		
		var elem = document.getElementById("url");
		elem.value = url;
	},*/
	
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
