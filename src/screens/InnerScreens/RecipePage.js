//place holder for area where user's current ingredients are
//These imports are to have our bottomnavigation bar be on screen
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';

import { StyleSheet, TextInput, View, Keyboard, Button, Text,ActivityIndicator } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import BottomNavigationBar from '../components/BottomNavigatorBar';
import Search from '../components/Search';
import List from  '../components/List';
// end of imports for bottomnavigation bar



const RecipePage = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [fakeData, setFakeData] = useState();

  // get data from the fake api endpoint
  useEffect(() => {
    const getData = async () => {
      const apiResponse = await fetch(
        "https://my-json-server.typicode.com/kevintomas1995/logRocket_searchBar/languages"
      );
      const data = await apiResponse.json();
      setFakeData(data);
    };
    getData();
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar style='auto'/>
      <View style={styles.topLeftContainer}>
 
      </View>
 
      {!clicked && <Text style={styles.title}>Programming Languages</Text>}
      <Search
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />
      { (

          <List
            searchPhrase={searchPhrase}
            data={fakeData}
            setClicked={setClicked}
          />

      )}
      <BottomNavigationBar/>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Background color of the app.,
    color: '#3ac78b',
    alignItems: 'center'
  }
});

export default RecipePage
