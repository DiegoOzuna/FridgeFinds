/*
    This file adds the custom icons.
    Note: For now it doesn't allow to change color, it would need different implementation
    (specifically react-native-svg libraries).

    As an extra, I can re-create the icons for a dark mode if we implement it.
*/

// Imports from React and React Native
import React from 'react';
import { Image, View } from 'react-native';

const AppIcon = ({name, height, width, style}) =>{
    let iconImage; // This declares iconImage without an initial value.

    switch(name){
        case 'FridgeFindsFridge':
            iconImage = require('../../../assets/icons/FridgeFindsFridge.png');
            break;
        case 'FridgeFindsChefHat':
            iconImage = require('../../../assets/icons/FridgeFindsChefHat.png');
            break;
        case 'FridgeFindsNotebook':
            iconImage = require('../../../assets/icons/FridgeFindsNotebook.png');
            break;
        default:
            // add error?
            break;
    }

    return(
        <View style={style}>
            <Image source={iconImage} style={{height: height, width: width}} />
        </View>
    );
};

export default AppIcon;