import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


//This will be used as a way to have different "areas"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//end

//Stack is an instance to hold the different 'pages'
const Stack = createNativeStackNavigator();

//we need to import our made pages to add into stack
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignUp from './src/screens/SignUp'
import ForgotPassword from './src/screens/ForgotPage'


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator> 
        {/* we are making the top be the login, after authentication it will go elsewhere */}
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        {/*<Stack.Screen name="Forgot" component={ForgotPage} />*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
