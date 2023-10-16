import React from 'react';
import { StatusBar } from 'react-native';
import { StyleSheet, View } from 'react-native';

import BottomNavigationBar from './components/BottomNavigatorBar';


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
      <View style={styles.container}>
        <StatusBar style='auto'/>
        <BottomNavigationBar screenText={this.state.screenText} changeText={this.changeText}/>
      </View>
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Background color of the app.,
    color: '#3ac78b',
    alignItems: 'center'
  }
});