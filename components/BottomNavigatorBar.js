// Imports from React and React Native
import React from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';

// Custom Imports
import { container } from '../styles/styles'; // Imports the container style key.
import AppIcon from './AppIcons';

const BottomNavigationBar = (props) => {
    const { screenText, changeText } = props;
    const iconHeight = 25;
    const iconWidth = 25;
    return(
        <View style={container}>

        {/* ~~~~~ Button Text ~~~~~ */}
        <View style={styles.NavText}>
          <Text style={{color:'#3ac78b', fontSize: 30}}>{screenText}</Text>
          <StatusBar style='light'/>
        </View>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~ */}
        

        {/*Bottom Navigation Bar*/}
        <View style={styles.NavContainer}>
          {/*Holds the actual bar, with three buttons*/}
          <View style={styles.NavBar}>

            {/*Fridge Button (Left)*/}
            <Pressable onPress={() => changeText('Fridge')} style={styles.IconBehave}
            android_ripple={{borderless:true, radius:20}}>
              <AppIcon name="FridgeFindsFridge" height={iconHeight} width={iconWidth} style={styles.IconBehave}/>
            </Pressable>

            {/*Notebook Button (Middle)*/}
            <Pressable onPress={() => changeText('List')} style={styles.IconBehave}
            android_ripple={{borderless:true, radius:20}}>
              <AppIcon name="FridgeFindsNotebook" height={iconHeight} width={iconWidth} style={styles.IconBehave}/>
            </Pressable>

            {/*Chef Hat Button (Right)*/}
            <Pressable onPress={() => changeText('Cook')} style={styles.IconBehave}
            android_ripple={{borderless:true, radius:20}}>
              <AppIcon name="FridgeFindsChefHat" height={iconHeight} width={iconWidth} style={styles.IconBehave}/>
            </Pressable>

          </View>
        </View>
        {/*~~~~~~~~~~~~~~*/}
        </View>
    );
};

const styles = {
    NavText: {
      position: 'absolute',
      top: -35,
      left: -230,
      padding: 50,
    },
  
    // ~~~~~ Bottom Navigation Bar Variables ~~~~~ //
    NavContainer: {
      position: 'absolute', // We absolultely want it at the bottom of the screen.
      alignItems: 'center', // Center of screen.
      bottom: 20 // Bottom Margin.
    },
  
    NavBar: {
      flexDirection: 'row', // Makes the items align left to right.
      backgroundColor: '#e6e6e6', 
      width: '90%', // Percentage so it grows and shrinks with the screen.
      justifyContent: 'space-evenly', // The items will be space away from each other evenly
      borderRadius: 40 // Gives a round edge on the bar
    },
  
    IconBehave: { // Variable to edit the Icon
      padding: 5
    },
  
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  
  };

export default BottomNavigationBar;