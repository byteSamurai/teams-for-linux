const { app } = require('electron');
const config = require('./config')(app.getPath('userData'));
const certificate = require('./certificate');
const gotTheLock = app.requestSingleInstanceLock();
const mainAppWindow = require('./mainAppWindow');

global.config = config;

app.commandLine.appendSwitch('auth-server-whitelist', config.authServerWhitelist);
app.commandLine.appendSwitch('enable-ntlm-v2', config.ntlmV2enabled);
app.setAsDefaultProtocolClient('msteams');

if (!gotTheLock) {
	console.warn('App already running');
	app.quit();
} else {
	app.on('second-instance', mainAppWindow.onAppSecondInstance);
	app.on('ready', mainAppWindow.onAppReady);
	app.on('before-quit', () => console.log('before-quit'));
	app.on('quit', () => console.log('quit'));
	app.on('renderer-process-crashed', () => console.log('renderer-process-crashed'));
	app.on('will-quit', () => console.log('will-quit'));
	app.on('certificate-error', certificate.onAppCertificateError);
}
