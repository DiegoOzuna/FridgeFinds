import React from 'react';
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



let addItem = item => {
  database().ref('/items').push({
    name: item
  });
};

export default function AddItem (){
 const [name, onChangeText] = React.useState(0);


const  handleSubmit = () => {
  //  addItem(name);
    Alert.alert('Item saved successfully');
  };
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Add Item</Text>
        <TextInput style={styles.itemInput} onChangeText={text => onChangeText(text)} />
        <TouchableHighlight
          style={styles.button}
          underlayColor="white"
          onPress={handleSubmit}
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
    fontSize: 25,
    textAlign: 'center'
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