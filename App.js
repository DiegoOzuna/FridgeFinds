// Imports from React and React Native.
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

// Custom Imports
import BottomNavigationBar from './components/BottomNavigatorBar'; // The Bottom Navigatiion Bar Component
import { container } from './styles/styles';


// Changed it to class instead of a function -> N1
export default class App extends React.Component{
  
  // ~~~~~ Bottom Navigation ~~~~~ //
  constructor(props){
    super(props);
    this.state = {
      // The text in the top right of the screen
      screenText: "Welcome, User"
    };
  }
  
  // This changes the text for each button.
  changeText = (text) => {
    console.log(text + ' has been pressed')
    this.setState({
      screenText: text
    });
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  
  render(){
    return(


      // ~~~~~ Bottom Navigation ~~~~~ //
      <View style={container}>
        <StatusBar style='auto'/>
        <BottomNavigationBar screenText={this.state.screenText} changeText={this.changeText}/>
      </View>
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    );
  }
}

const styles = StyleSheet.create({
  
});