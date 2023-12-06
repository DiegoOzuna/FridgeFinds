//place holder for area where user will be able to search for recipes.
//These imports are to have our bottomnavigation bar be on screen
import React, {useState, useEffect} from 'react';
import { StatusBar, TouchableOpacity, VirtualizedList } from 'react-native';
import { StyleSheet, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Touchable, FlatList } from 'react-native';
import { FIRESTORE_DB } from '../../firebase';  //database in our app
import { FIREBASE_AUTH } from '../../firebase';


import BottomNavigationBar from '../components/BottomNavigatorBar';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from '@firebase/firestore';


const ShopList = () =>  { 
  const user = FIREBASE_AUTH.currentUser;  //this should get us our current user
  const database = FIRESTORE_DB;
  const uid = user.uid;

  const [inputValue, setInputValue] = useState('');
  const [groceryList, setGroceryList] = useState([]);

  //Get the document reference
  const docRef = doc(database,"users",uid);

  const [checkedItems, setCheckedItems] = useState({});
  

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

   const getGroceryList = async () => {
      if(docRef) {
        const docSnap = await getDoc(docRef);
        const grocerylist = docSnap.get("grocerylist");
        console.log(grocerylist); // This will print the array
      }
    };

    const getItemCount = () => groceryList.length;

    const renderItem = ({item, index}) => {
      const isChecked = checkedItems[index];

      return(
        <View style={styles.itemContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={isChecked}
            onPress={() => toggleCheckbox(index)}
          />
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={[styles.listItems, isChecked ? styles.checkedItemText: null]}>{item}</Text>
        </View>
        <TouchableOpacity style={styles.rmvBtn} onPress={() => removeItem(item)}>
          <View style={styles.whiteLine}/>
        </TouchableOpacity>
      </View>
      );
    };

  // Code for Checkboxes
    const Checkbox = ({ checked, onPress }) => (
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {checked ? (
            <Text style={{ marginRight: 8, fontSize: 30}}>☒</Text>
          ) : (
            <Text style={{ marginRight: 8, fontSize: 30}}>☐</Text> 
          )}
        </View>
      </TouchableOpacity>
    );

    const toggleCheckbox = (index) => {
      setCheckedItems({
        ...checkedItems,
        [index]: !checkedItems[index],
      });
    };
  

    return(
      <SafeAreaView style={styles.container}>
        <Text style={[styles.screenText, {alignSelf: 'flex-start'}]}>Groceries</Text>
        <View style = {[styles.top, {marginTop: '-13.1%'}]}>
        <StatusBar style='auto'/>
          <TextInput
            style={styles.input}
            placeholder='Add Item to list'
            value={inputValue}
            onChangeText={text => setInputValue(text)} />
          <TouchableOpacity
            style = {styles.addBtn}
            onPress={addItem}>
            <Text style={[styles.addButtonText, {marginLeft: -1}]}> + </Text>
          </TouchableOpacity>
        </View>

        <VirtualizedList
          style = {styles.listContainer}
          itemStyle = {styles.listItems}
          data={groceryList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          getItemCount={getItemCount}
          getItem={(data, index) => data[index]} />



        <BottomNavigationBar/>
      </SafeAreaView>
      
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
// Add Btn
  addBtn: {
    backgroundColor: '#8addb9',
    borderRadius:25,
    width:50,
    height:50,
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
  },

// Remove Btn
  rmvBtn: {
    backgroundColor: 'red',
    borderRadius:25,
    width:25,
    height:25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  whiteLine: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#fff',
    marginTop: -1,
  },

// Grocery List Container
  listContainer: {
    width: '95%',
    paddingLeft: '1%',
    paddingTop: '1%',
  },

  itemContainer:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //borderBottomWidth: 1,
    //borderBottomColor: '#ccc',   Use both of these for when we do sections!!!
  },

  checkboxContainer: {
    marginRight: 10,
  },

  itemTextContainer: {
    flex: 1,
  },

  checkedItemText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },

  listItems:{
    fontWeight: 'bold',
    paddingLeft: '2%',
    fontSize: 20,
    paddingTop: '0.3%',
  },

// Input Bar
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 30,
    marginBottom: 10,
    padding: 10,
  },

// Add Btn ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  addBtn: {
    backgroundColor: '#8addb9',
    borderRadius: 15,
    width:50,
    height:50,
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 50,
    lineHeight: 54,
    paddingRight: 1,
    textAlignVertical: 'center',
  },

// Screen Title ~~~~~~~~~~~~~~~~~~~~~~~~~~
  screenText: {
    fontSize: 50,
    color: '#34785a',
    fontWeight: '900',
    marginLeft: '2%',
  },

});


export default ShopList
