//place holder for area
import { StatusBar, TouchableOpacity } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Touchable, FlatList } from 'react-native';
import React, {useState, useEffect} from 'react';
import BottomNavigationBar from '../components/BottomNavigatorBar';
import { useNavigation } from '@react-navigation/core'

const RecipePage = () =>  { 
  const [inputValue, setInputValue] = useState('');
  const navigation = useNavigation();  //const points to navigate stack

  const addItem = async () => {
    navigation.navigate("RecipeForm")
    }



    return(
      <View style={styles.container}>
        <View style = {styles.top}>
        <StatusBar style='auto'/>
        <TextInput
          style={styles.input}
          placeholder='Add item to list'
          value={inputValue}
          onChangeText={text => setInputValue(text)} />
        <TouchableOpacity
        style = {styles.addBtn}
        onPress={addItem}
        />
        </View>
        <FlatList
          style = {styles.listContainer}
          itemStyle = {styles.listItems}
          renderItem={({item}) => (
          <View style = {styles.itemContainer}>
          <TouchableOpacity style = {styles.rmvBtn} onPress={() => removeItem(item)}>
          </TouchableOpacity>
          <Text style={styles.listItems}>{item}</Text>
          </View>)}
          keyExtractor={(item, index) => index.toString()} />
        <BottomNavigationBar/>
      </View>
      
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Background color of the app.,
    color: '#3ac78b',
    alignItems: 'center'
  },

  top:{
    paddingTop:'5%',
    flexDirection:'row',
  },
  //display of our add button
  addBtn: {
    backgroundColor: '#8addb9',
    borderRadius:25,
    width:50,
    height:50,
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
  },

  rmvBtn: {
    backgroundColor: 'red',
    borderRadius:25,
    width:30,
    height:30,
    marginLeft: 10,
  },

  listContainer: {
    width: '95%',
    paddingLeft: '10%',
    paddingTop: '10%',
  },

  itemContainer:{
    flexDirection:'row',
  },

  listItems:{
    fontWeight: 'bold',
    paddingLeft: '10%'
  },

  // Display of input bar
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 30,
    marginBottom: 10,
    padding: 10,
  },

});

export default RecipePage
