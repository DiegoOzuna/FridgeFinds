//place holder for area where user will be able to search for recipes.
//These imports are to have our bottomnavigation bar be on screen
import React from 'react';
import { StatusBar } from 'react-native';
import { StyleSheet, View } from 'react-native';

import BottomNavigationBar from '../components/BottomNavigatorBar';
// end of imports for bottomnavigation bar

export class ShopList extends React.Component {
  
  //render is what "draws" our navigation bar on screen
  render(){
    return(
      // ~~~~~ Bottom Navigation ~~~~~ //
      <View style={styles.container}>
        <StatusBar style='auto'/>
        <BottomNavigationBar/>
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


export default ShopList
