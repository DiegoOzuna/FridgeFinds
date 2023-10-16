// From Katlyn

import React, {useState} from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';

// For the Bottom Navigation Bar, it is the icons.
import Icon from 'react-native-ico-material-design';


const BottomNavigationBar = (props) => {
    const { screenText, changeText } = props;
    const iconHeight = 25;
    const iconWidth = 25;
    return(
        <View style={styles.container}>

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
            android_ripple={{borderless:true, radius:50}}>
              <Icon name="shopping-cart" height={iconHeight} width={iconWidth} color='black'/>
            </Pressable>

            {/*Notebook Button (Middle)*/}
            <Pressable onPress={() => changeText('List')} style={styles.IconBehave}
            android_ripple={{borderless:true, radius:50}}>
              <Icon name="show-menu-button" height={iconHeight} width={iconWidth} color='black'/>
            </Pressable>

            {/*Chef Hat Button (Right)*/}
            <Pressable onPress={() => changeText('Cook')} style={styles.IconBehave}
            android_ripple={{borderless:true, radius:50}}>
              <Icon name="user-account-box" height={iconHeight} width={iconWidth} color='black'/>
            </Pressable>

          </View>
        </View>
        {/*~~~~~~~~~~~~~~*/}
        </View>
    );
};

const styles = {
    container: {
      flex: 1,
      backgroundColor: '#fff', // Background color of the app.,
      color: '#3ac78b',
      alignItems: 'center'
    },
  
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
      padding: 10
    },
  
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  
  };

export default BottomNavigationBar;