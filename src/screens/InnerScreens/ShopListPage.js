//place holder for area where user will be able to search for recipes.
//These imports are to have our bottomnavigation bar be on screen
import React, {useState, useEffect} from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import { StyleSheet, View} from 'react-native';

import { Text, TextInput, Touchable, FlatList } from 'react-native';
import { FIRESTORE_DB } from '../../firebase';  //database in our app
import { FIREBASE_AUTH } from '../../firebase';


import BottomNavigationBar from '../components/BottomNavigatorBar';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from '@firebase/firestore';
// end of imports for bottomnavigation bar

const ShopList = () =>  { 
  const user = FIREBASE_AUTH.currentUser;  //this should get us our current user
  const database = FIRESTORE_DB;
  const uid = user.uid;

  const [inputValue, setInputValue] = useState('');
  const [groceryList, setGroceryList] = useState([]);

  //Get the document reference
  const docRef = doc(database,"users",uid);


  function fetchData(docRef) {
    // Use the get method to fetch the data once
    getDoc(docRef).then((snapshot) => {
      const data = snapshot.data();
      if(data && data.grocerylist){
        setGroceryList(data.grocerylist);
      }
    }).catch((error) => {
      console.log(error);
    });
  }


  useEffect(() => {
    // Loads the grocery list from Firestore on component mount
    if(docRef) {
      fetchData(docRef) //
    }
  }, []); // no dependency
  
    const addItem = async () => {
      if(inputValue && docRef){
        await updateDoc(docRef, {
          grocerylist: arrayUnion(inputValue),
        });
        setInputValue('');
        fetchData(docRef);
      }
    };

    const removeItem = async (item) => {
      if(docRef){
        await updateDoc(docRef, {
          grocerylist: arrayRemove(item),
        });
        fetchData(docRef)
      }
    };

   /* const getGroceryList = async () => {
      if(docRef) {
        const docSnap = await getDoc(docRef);
        const grocerylist = docSnap.get("grocerylist");
        console.log(grocerylist); // This will print the array
      }
    }
  */

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
          data={groceryList}
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


export default ShopList
