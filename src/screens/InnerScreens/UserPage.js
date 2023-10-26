//place holder for area where user's current ingredients are
//These imports are to have our bottomnavigation bar be on screen
import React from 'react';
import { StatusBar, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, View } from 'react-native';

import BottomNavigationBar from '../components/BottomNavigatorBar';
// end of imports for bottomnavigation bar

import { FIREBASE_AUTH } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/core'


//HAD TO CONVERT CLASS COMPONENT TO FUNCTIONAL COMPONENT AS IT IS ONLY WAY TO USE HOOKS TO SIGN USER OUT.
const UserPage = () => {
  const navigation = useNavigation();  //const points to navigate stack

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


  return (
    <View style={styles.container}>
      <StatusBar style='auto'/>
      <View style={styles.topLeftContainer}>
        <TouchableOpacity
        style = {styles.button}
        onPress={handleSignOut}>
        <Text style = {styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <BottomNavigationBar/>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color of the app.,
    color: '#3ac78b'
  },

  topLeftContainer:{
    width: '60%',
    alignItems: 'flex-start',
    marginTop:40,
    marginRight:130,
  },

  button: {
    backgroundColor: '#62d2a2',
    width: '40%',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center'

  },
  buttonText: {
    color: '#fff',
    fontSize: 16

  },
});

export default UserPage;
