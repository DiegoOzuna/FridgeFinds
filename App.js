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
import SignUp from './src/screens/SignUp';
import ForgotPassword from './src/screens/ForgotPage';

//these will be imports for our "inner pages"
import UserPage from './src/screens/InnerScreens/UserPage';
import ShopListPage from './src/screens/InnerScreens/ShopListPage';
import RecipePage from './src/screens/InnerScreens/RecipePage';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator> 
        {/* we are making the top be the login, after authentication it will go elsewhere */}
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        {/*<Stack.Screen name="Forgot" component={ForgotPage} />*/}

        <Stack.Screen options={{headerShown: false, animation: 'default'}} name="UserPage" component={UserPage} /> 
        <Stack.Screen options={{headerShown: false, animation: 'default'}} name="RecipePage" component={RecipePage} /> 
        <Stack.Screen options={{headerShown: false, animation: 'default'}} name="ShopListPage" component={ShopListPage} /> 
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
