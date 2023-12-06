import { useNavigation } from '@react-navigation/core'; //added to have other pages be navigated to.

import React from 'react';
import { View, Text, Pressable, StatusBar} from 'react-native';
import AppIcon from './AppIcons';


const BottomNavigationBar = (props) => {
    const { screenText, changeText } = props;
    const iconHeight = 25;
    const iconWidth = 25;

    const navigation = useNavigation() //<- allows us to use our navigation stack in our app,

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
            <Pressable onPress={() => navigation.navigate('UserPage')} style={styles.IconBehave}
            android_ripple={{borderless:true, radius:20}}>
              <AppIcon name="FridgeFindsFridge" height={iconHeight} width={iconWidth} style={styles.IconBehave}/>
            </Pressable>

            {/*Notebook Button (Middle)*/}
            <Pressable onPress={() => navigation.navigate('RecipePage')} style={styles.IconBehave}
            android_ripple={{borderless:true, radius:20}}>
              <AppIcon name="FridgeFindsNotebook" height={iconHeight} width={iconWidth} style={styles.IconBehave}/>
            </Pressable>

            {/*Chef Hat Button (Right)*/}
            <Pressable onPress={() => navigation.navigate('ShopListPage')} style={styles.IconBehave}
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
    container: {
      flex: 1,
      backgroundColor: '#fff', // Background color of the app.,
      color: '#3ac78b',
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'fixed',
      bottom: 0,
      width: '100%'
    },
  
    // ~~~~~ Bottom Navigation Bar Variables ~~~~~ //
    NavText: {
      position: 'absolute',
      top: -35,
      left: -230,
      padding: 50,
    },
    
    NavContainer: {
      position: 'absolute', // We absolultely want it at the bottom of the screen.
      alignItems: 'center', // Center of screen.
      bottom: 5, // Bottom Margin.
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