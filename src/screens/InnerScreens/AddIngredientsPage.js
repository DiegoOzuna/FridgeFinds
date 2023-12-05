import React, {useState, useEffect} from 'react';
//import FormButton from '../components/FormButton';
import BottomNavigationBar from '../components/BottomNavigatorBar';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { FIREBASE_AUTH } from '../../firebase';
import { FIRESTORE_DB } from '../../firebase';  //database in our app
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from '@firebase/firestore';



let addItem = item => {
  database().ref('/items').push({
    name: item
  });
};

export default function AddItem (){

  const user = FIREBASE_AUTH.currentUser;  //this should get us our current user
  const database = FIRESTORE_DB;
  const uid = user.uid;

  const [inputValue, setInputValue] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);

   //Get the document reference
   const docRef = doc(database,"users",uid);


  function fetchData(docRef) {
    // Use the get method to fetch the data once
    getDoc(docRef).then((snapshot) => {
      const data = snapshot.data();
      if(data && data.myIngredients){
        setIngredientsList(data.myIngredients);
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
          myIngredients: arrayUnion(inputValue),
        });
        setInputValue('');
        fetchData(docRef);
      }
    };

    



 const [name, onChangeText] = React.useState(0);


    return (
      <View style={styles.main}>
        <Text style={styles.title}>Add Item</Text>
        <TextInput
          style={styles.itemInput}
          placeholder='Add item to list'
          value={inputValue}
          onChangeText={text => setInputValue(text)} />
        <TouchableHighlight
          style={styles.button}
          underlayColor="white"
          onPress={addItem}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableHighlight>
        <BottomNavigationBar/>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
       // flexDirection:'row',
        alignItems: 'center',
        direction:'inherit',
        backgroundColor: '#fff', // Background color of the app.,
        color: '#3ac78b'
      },
      button: {
        backgroundColor: '#62d2a2',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    
      },
      buttonText: {
        color: '#fff',
        fontSize: 16
    
      },
  main: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
    color: '#3ac78b'
  },
  title: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: 'center',
    color: '#34785a',
    fontWeight: '900',
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    color: '#333333'
  }
});