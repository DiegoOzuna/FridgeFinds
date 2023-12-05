import React, {useState, useEffect} from 'react';
import { Modal, StatusBar, TouchableOpacity, Image, StyleSheet, View, Text, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { FIRESTORE_DB, FIREBASE_AUTH }  from '../../firebase'; // import FIRESTORE_DB
import BottomNavigationBar from '../components/BottomNavigatorBar';
import { collection, doc, getDocs, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const RecipePage = () =>  { 
  const user = FIREBASE_AUTH.currentUser;  //this should get us our current user
  const database = FIRESTORE_DB;
  const uid = user.uid;


  const [modalVisible, setModalVisible] = useState(false); // state to control the visibility of the modal
  const [selectedRecipe, setSelectedRecipe] = useState(null); // state to hold the selected recipe

  const [userData, setUserData] = useState({}); // state to hold user data

  // Fetch user data from Firestore

  const fetchUserData = async () => {
    const userDoc = await getDoc(doc(database, "users", uid));
    setUserData(userDoc.data());
  }

  useEffect(() => {
    fetchUserData();
  }, []);


  const [inputValue, setInputValue] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]); //state to hold recipes filtered by user
  const [recipes, setRecipes] = useState([]); // state to hold recipes
  const navigation = useNavigation();  //const points to navigate stack

  const addItem = async () => {
    navigation.navigate("RecipeForm")
  }

  // Fetch recipes from Firestore
  useEffect(() => {
    const fetchData = async () => {
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'Recipes'));
    setRecipes(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setFilteredRecipes(recipes); // This is to initialize our filtered list without accidentally messing original data.
  }
  fetchData();
}, []);

// Function to handle upvote
const handleUpvote = async (id) => {
  const recipeRef = doc(FIRESTORE_DB, 'Recipes', id);

  // Fetch the latest user data from Firestore
  const userDoc = await getDoc(doc(database, "users", uid));
  let userData = userDoc.data();


  const recipeDoc = await getDoc(recipeRef);
  const recipeData = recipeDoc.data();

  if (userData.votes[id] === 'down') {
    // The user has downvoted this recipe before
    // Increment the recipe's votes by 2 and change the user's vote to 'up'
    await updateDoc(recipeRef, {
      votes: recipeData.votes + 2
    });

    userData.votes[id] = 'up';
    await updateDoc(doc(database, "users", uid), { votes: userData.votes });
  } else if (!userData.votes[id]) {
    // The user hasn't voted for this recipe yet
    // Increment the recipe's votes by 1 and set the user's vote to 'up'
    await updateDoc(recipeRef, {
      votes: recipeData.votes + 1
    });

    userData.votes[id] = 'up';
    await updateDoc(doc(database, "users", uid), { votes: userData.votes });
    fetchUserData();
  }
}

// Function to handle downvote
const handleDownvote = async (id) => {
  const recipeRef = doc(FIRESTORE_DB, 'Recipes', id);

  // Fetch the latest user data from Firestore
  const userDoc = await getDoc(doc(database, "users", uid));
  let userData = userDoc.data();

  // Initialize votes as an empty object if it doesn't exist
  if (!userData.votes) {
    userData.votes = {};
  }

  const recipeDoc = await getDoc(recipeRef);
  const recipeData = recipeDoc.data();

  if (userData.votes[id] === 'up') {
    // The user has upvoted this recipe before
    // Decrement the recipe's votes by 2 and change the user's vote to 'down'
    await updateDoc(recipeRef, {
      votes: recipeData.votes - 2
    });

    userData.votes[id] = 'down';
    await updateDoc(doc(database, "users", uid), { votes: userData.votes });
  } else if (!userData.votes[id]) {
    // The user hasn't voted for this recipe yet
    // Decrement the recipe's votes by 1 and set the user's vote to 'down'
    await updateDoc(recipeRef, {
      votes: recipeData.votes - 1
    });

    userData.votes[id] = 'down';
    await updateDoc(doc(database, "users", uid), { votes: userData.votes });
    fetchUserData();
  }
}





  return(
    <View style={styles.container}>
      <View style = {styles.top}>
      <StatusBar style='auto'/>
        <TextInput
          style={styles.input}
          placeholder='Search for a Recipe'
          value={inputValue}
          onChangeText={text => {
            setInputValue(text);
            if (text) {
              setFilteredRecipes(recipes.filter(recipe => recipe.name.toLowerCase().includes(text.toLowerCase())));
            } else {
              setFilteredRecipes(recipes);
            }
          }}
        />
        <TouchableOpacity
          style = {styles.addBtn}
          onPress={addItem}>
          <Text style={[styles.addButtonText, {marginLeft: -1}]}> + </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style = {styles.listContainer}
        itemStyle = {styles.listItems}
        data={filteredRecipes.sort((a, b) => b.votes - a.votes)} // sort by votes
        renderItem={({item}) => (
        <View style = {styles.itemContainer}>
          <TouchableOpacity onPress={() => {setSelectedRecipe(item); setModalVisible(true);}}>
            <Image source={{uri: item.imageUrl}} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.voteBtn, styles.upvoteBtn]} onPress={() => handleUpvote(item.id)}>
            <Icon name="arrow-up" size={30} color={userData.votes[item.id] === 'up' ? "green" : "black"} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.voteBtn, styles.downvoteBtn]} onPress={() => handleDownvote(item.id)}>
            <Icon name="arrow-down" size={30} color={userData.votes[item.id] === 'down' ? "red" : "black"} />
          </TouchableOpacity>
          <Text style={styles.recipeName}>{item.name}</Text>
          <Text style={styles.votesCount}>{item.votes}</Text>
          
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Ingredients:</Text>
              {selectedRecipe?.ingredients.names.map((name, index) => (
                <Text key={index} style={styles.modalText}>
                  {name}, Amount: {selectedRecipe.ingredients.amounts[index]}, Type: {selectedRecipe.ingredients.types[index]}
                </Text>
              ))}
              <Text style={styles.modalText}>
                Steps:
                {selectedRecipe?.steps.map((step, index) => (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Text>
                      {index + 1}. {step}
                    </Text>
                  </View>
                ))}
              </Text>

              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Recipe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
          </View>)}
        keyExtractor={(item, index) => index.toString()} 
        ListEmptyComponent={<Text style={styles.notif}>No recipes found. Please consider adding an entry for this recipe :)</Text>}
        />
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
  },

  notif:{
    fontSize:20,
    justifyContent: "center",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white", // white background for the modal content
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  top:{
    paddingTop:'5%',
    flexDirection:'row',
  },
  //display of our add button
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

  recipeName:{
    fontSize: 25,
  },

  votesCount:{
    fontSize: 10
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
  image: {
    width: 100, // specify the width
    height: 100, // specify the height
    borderColor: 'green',
    borderWidth: 2,
  },
});

export default RecipePage
