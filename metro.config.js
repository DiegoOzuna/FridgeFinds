const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;


/*This file is needed for our firebase to actually work properly
within the expo go native project */


/*Further note, it might be the case that the file does not
work, so you might need to do 

npx expo customize metro.config.js 
and then reinput this code into that file that is generated

*/
