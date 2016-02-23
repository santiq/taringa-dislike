var self = require("sdk/self");
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
        include: "*.taringa.net",
		attachTo: ["top", "frame"],
        contentScriptWhen: "ready",
        contentScriptFile: self.data.url("content_n_jquery.js"),
});
