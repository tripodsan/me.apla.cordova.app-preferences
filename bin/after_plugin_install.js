'use strict';

module.exports = function () {
	var Q = require('q'),
		path = require('path'),
		fs = require("./lib/filesystem")(Q, require('fs'), path),
		settings = require("./lib/settings")(fs, path),
		android = require("./lib/android")(fs, path, require('elementtree'), require('cordova-lib/src/cordova/util'), require('cordova-lib').configparser),
		ios = require("./lib/ios")(Q, fs, path, require('plist'), require('xcode'));

    return settings.get()
		.then(function (config) {
			return Q.all([
				android.afterPluginInstall(config),
				// ios.afterPluginInstall(config) // not implemented for iOS
			]);
		})
		.catch(function(err) {
			if (err.code === 'NEXIST') {
				console.log("app-settings.json not found: creating a sample file");
				return settings.create();
			}

			throw err;
		});
};
