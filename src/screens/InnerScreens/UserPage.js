//place holder for area where user's current ingredients are
//These imports are to have our bottomnavigation bar be on screen as well as other components
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  SectionList,
  StatusBar,
} from 'react-native';

import BottomNavigationBar from '../components/BottomNavigatorBar';
// end of imports for bottomnavigation bar

import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/core'


//HAD TO CONVERT CLASS COMPONENT TO FUNCTIONAL COMPONENT AS IT IS ONLY WAY TO USE HOOKS TO SIGN USER OUT.
const UserPage = () => {
  const navigation = useNavigation();  //const points to navigate stack
 
  //Improved signout by properly having an auth listener to redirect user if they pressed on sign out.
  //This also allows us to have the proper user.uid to store user info.
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if(user){
      const uid = user.uid;
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
    });
  }});



  //handlesignout signs out user and redirects back to login
  const handleSignOut = () => {
    signOut(FIREBASE_AUTH).then(() => {
      console.log('User signed out!');
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
