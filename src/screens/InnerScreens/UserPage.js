//place holder for area where user's current ingredients are
//These imports are to have our bottomnavigation bar be on screen
import React from 'react';
import { StatusBar, Text, TextInput, FlatList, TouchableOpacity,Alert } from 'react-native';
import { StyleSheet, View } from 'react-native';

import BottomNavigationBar from '../components/BottomNavigatorBar';
// end of imports for bottomnavigation bar

import { FIREBASE_AUTH } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/core'



//HAD TO CONVERT CLASS COMPONENT TO FUNCTIONAL COMPONENT AS IT IS ONLY WAY TO USE HOOKS TO SIGN USER OUT.

const UserPage = () => {
  const navigation = useNavigation();  //const points to navigate stack
  const [name, onChangeText] = React.useState(0);
  
  //handlesignout signs out user and redirects back to login
  const handleSignOut = () => {
    signOut(FIREBASE_AUTH).then(() => {
      console.log('User signed out!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  let addRecipe= item => {
    database().ref('/fridgelist').push({
      name: item
    });
  };
 

  const handleSubmit = () => {
    console.log('redirecting to AddeRecipePopup');
    navigation.reset({
      index: 0,
      routes: [{ name: 'AddRecipePage' }],
    });
    
   // Alert.alert('Item saved successfully');
    console.log('After redirecting to AddeRecipePopup');
  };

  const handleSearch = () => {
    console.log('redirecting to SearchPage');
    navigation.reset({
      index: 0,
      routes: [{ name: 'SearchPage' }],
    });
    
   // Alert.alert('Item saved successfully');
    console.log('After redirecting to SearchPage');
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.screenText, {alignSelf: 'flex-start'}]}>myFridge</Text>
      <TouchableOpacity
        style = {[styles.button, styles.signOutBtn]}
        onPress={handleSignOut}>
        <Text style = {[styles.displayText, styles.signoutTxt]}>Sign Out</Text>
      </TouchableOpacity>
      <StatusBar style='auto'/>
      <View style={styles.topLeftContainer}>
        <TouchableOpacity
        style = {styles.button}
        onPress={handleSearch}>
          <Text style = {styles.displayText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style = {[styles.button, {marginLeft: '5%'}]}
        onPress={handleSubmit}>
          <Text style = {styles.displayText}>Add Ingredient</Text>
        </TouchableOpacity>
      </View>
      <BottomNavigationBar/>
      
    </View>

    
  );

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
   // flexDirection:'row',
    alignItems: 'center',
    direction:'inherit',
    backgroundColor: '#fff', // Background color of the app.,
    color: '#3ac78b'
  },

  topLeftContainer:{
    flexDirection:'row',
    justifyContent: 'flex-start',
   // width: '60%',
    alignItems: 'flex-start',
    direction:'inherit',
    flexWrap:'nowrap',
    marginTop:10,
  //  marginRight:100,
  },

  middleContainer: { 
    backgroundColor: '#fff',
    borderRadius:10,
    marginHorizontal:20,
    marginVertical:10,
    padding: 5,
  },
  button: {
    backgroundColor: '#62d2a2',
    width: '45%',
    padding: 5,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',

  },
  buttonText: {
    color: '#fff',
    fontSize: 16

  },
  displayText: {
    alignItems: 'flex-start',
    backgroundColor: '#62d2a2',
    color: '#fff',
    fontSize: 16

  },

// Screen Title ~~~~~~~~~~~~~~~~~~~~~~~~~~
  screenText: {
    fontSize: 50,
    color: '#34785a',
    fontWeight: '900',
    marginLeft: '2%',
  },

// Signout Button
  signOutBtn: {
    backgroundColor: '#dcdedd',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '3%',
    right: '4%',
    paddingHorizontal: '1%',
    paddingVertical: '2%',
    borderRadius: 10,
    width: '30%'
  },

  signoutTxt: {
    backgroundColor: '#dcdedd',
    color: '#fff',
  },
});

export default UserPage;

