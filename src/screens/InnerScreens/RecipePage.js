/* Summary of what this page achieves:

This page will allow the user to look through the entire recipe entries stored in our firebase firestore, which all come from the users in our app. It allows them to 
interact with the posts with three buttons, upvote, downvote, and favorite.

The upvote and downvote buttons are what increment or decrement the vote counter on a specific recipe and recipes rely on this vote count to be displayed in an organized
manner in our page. The top of the page would always be the highest count while the bottom would be the lowest.

The favorite button, would make sure that whatever recipe the user decided to favorite, would be underneath the user. This way, if the user wants to only view their favorite recipe,
the app only needs to check the users favorite list and retrieve the information from firebase firestore based on the recipe ids that were stored in this list.

The user also has a text field where as they input text, the recipes are automatically responding to the change in text and are filtered through to return the user the recipe they 
are searching for in our database. If there is none, they are returned a message, asking them to add an entry for us.


Improvements that could be made: The vote counter seems to have a simple logic error. We are able to make sure the user is only able to vote once, but the way the votes are being handled
                                 seem to be causing issues where if its the users first vote, it still applies the +2 or -2 respectively which could be caused from the asyncronous nature of
                                 the function. Making sure there is checks would allow this to possibly be fixed.

                                 The modal popup that occurs when the image is pressed also needs to be formatted a bit more to make sure all content is presented to the user.
                                 Maybe the most simplest solution would be to use the safeareaview library within this modal. But adjusting the style of the modal would also be 
                                 another method.

*/
import React, {useState, useEffect} from 'react';
import { Modal, StatusBar, TouchableOpacity, Image, StyleSheet, View, Text, TextInput, FlatList, ScrollView, VirtualizedList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { FIRESTORE_DB, FIREBASE_AUTH }  from '../../firebase'; // import FIRESTORE_DB
import BottomNavigationBar from '../components/BottomNavigatorBar';
import { collection, doc, getDocs, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
const RecipePage = () =>  { 
  const user = FIREBASE_AUTH.currentUser;  //this should get us our current user
  const database = FIRESTORE_DB;
  const uid = user.uid;


  const [modalVisible, setModalVisible] = useState(false); // state to control the visibility of the modal
  const [selectedRecipe, setSelectedRecipe] = useState(null); // state to hold the selected recipe
  const [showFavorites, setShowFavorites] = useState(false); //used so that user can toggle when they want to only view their favorites and search through them.

  const [userData, setUserData] = useState({}); // state to hold user data

  // Fetch user data from Firestore

  const fetchUserData = async () => {
    const userDoc = await getDoc(doc(database, "users", uid));
    setUserData(userDoc.data());
  }

  useEffect(() => {
    fetchUserData();
  }, []);


  useEffect(() => {
    let newFilteredRecipes = recipes;
    if (inputValue) {
      newFilteredRecipes = newFilteredRecipes.filter(recipe => recipe.name.toLowerCase().includes(inputValue.toLowerCase()));
    }
    if (showFavorites) {
      newFilteredRecipes = newFilteredRecipes.filter(recipe => userData.favorites.includes(recipe.id));
    }
    setFilteredRecipes(newFilteredRecipes);
  }, [showFavorites, recipes]);
  

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
      const fetchedRecipes = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setRecipes(fetchedRecipes);
      setFilteredRecipes(fetchedRecipes); // used to initialize our filter list to include all
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
    setUserData({...userData}); // update local.
  } else if (!userData.votes[id]) {
    // The user hasn't voted for this recipe yet
    // Increment the recipe's votes by 1 and set the user's vote to 'up'
    await updateDoc(recipeRef, {
      votes: recipeData.votes + 1
    });

    userData.votes[id] = 'up';
    await updateDoc(doc(database, "users", uid), { votes: userData.votes });
    setUserData({...userData}); //update local
  }

  // Fetch the updated recipe data
  const updatedRecipeDoc = await getDoc(recipeRef);
  const updatedRecipeData = updatedRecipeDoc.data();

  // Update the recipes and filteredRecipes state
  setRecipes(prevRecipes => prevRecipes.map(recipe => recipe.id === id ? {...recipe, votes: updatedRecipeData.votes} : recipe));
  setFilteredRecipes(prevFilteredRecipes => prevFilteredRecipes.map(recipe => recipe.id === id ? {...recipe, votes: updatedRecipeData.votes} : recipe));
}


// Function to handle downvote
const handleDownvote = async (id) => {
  const recipeRef = doc(FIRESTORE_DB, 'Recipes', id);

  // Fetch the latest user data from Firestore
  const userDoc = await getDoc(doc(database, "users", uid));
  let userData = userDoc.data();

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
    setUserData({...userData}); //update local
  } else if (!userData.votes[id]) {
    // The user hasn't voted for this recipe yet
    // Decrement the recipe's votes by 1 and set the user's vote to 'down'
    await updateDoc(recipeRef, {
      votes: recipeData.votes - 1
    });

    userData.votes[id] = 'down';
    await updateDoc(doc(database, "users", uid), { votes: userData.votes });
    setUserData({...userData}); //update local
  }

  // Fetch the updated recipe data
  const updatedRecipeDoc = await getDoc(recipeRef);
  const updatedRecipeData = updatedRecipeDoc.data();

  // Update the recipes and filteredRecipes state
  setRecipes(prevRecipes => prevRecipes.map(recipe => recipe.id === id ? {...recipe, votes: updatedRecipeData.votes} : recipe));
  setFilteredRecipes(prevFilteredRecipes => prevFilteredRecipes.map(recipe => recipe.id === id ? {...recipe, votes: updatedRecipeData.votes} : recipe));
}





const handleFavorite = async (id) => {
  const userRef = doc(database, "users", uid);

  // Fetch the latest user data from Firestore
  const userDoc = await getDoc(userRef);
  let userData = userDoc.data();

  if (userData.favorites.includes(id)) {
    // The user has already favorited this recipe
    // Remove the recipe from the favorites list
    userData.favorites = userData.favorites.filter(recipeId => recipeId !== id);
  } else {
    // The user hasn't favorited this recipe yet
    // Add the recipe to the favorites list
    userData.favorites.push(id);
  }

  // Update the user's favorites list in Firestore
  await updateDoc(userRef, { favorites: userData.favorites });
  setUserData({...userData});
}






  return(
    <SafeAreaView style={styles.container}>
      <Text style={[styles.screenText, {alignSelf: 'flex-start'}]}>Recipes</Text>
      <View style = {[styles.top, {marginTop: -35}]}>
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

      <TouchableOpacity 
        style = {styles.showFavoritesButton} 
        onPress={() => setShowFavorites(!showFavorites)}>
        <Text style={styles.showFavoritesButtonTxt}>{showFavorites ? "Show All" : "Show Favorites Only"}</Text>
      </TouchableOpacity>

    <VirtualizedList
      
        style = {[styles.listContainer, {marginBottom: 75}]}
        itemStyle = {styles.listItems}
        data={filteredRecipes.sort((a, b) => b.votes - a.votes)} // sort by votes
        renderItem={({item}) => (
        <View style = {styles.itemContainer}>

          {/* Upvote/Downvote Arrows/ votecount */}
          <View style = {styles.voteContainer}>
            <TouchableOpacity style={styles.voteBtn} onPress={() => handleUpvote(item.id)}>
              <Icon name="arrow-up" size={30} color={userData.votes[item.id] === 'up' ? "green" : "black"} />
            </TouchableOpacity>
            <Text style={styles.votesCount}>{item.votes}</Text>
            <TouchableOpacity style={styles.voteBtn} onPress={() => handleDownvote(item.id)}>
              <Icon name="arrow-down" size={30} color={userData.votes[item.id] === 'down' ? "red" : "black"} />
            </TouchableOpacity>
          </View>
          
          {/* Recipe Name & Image */}
          <View style = {styles.recipesContainer}>
            <TouchableOpacity 
              styles={styles.touchContainer}
              onPress={() => {setSelectedRecipe(item); setModalVisible(true);}}>
              <Image source={{uri: item.imageUrl}} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text numberOfLines={4} ellipsizeMode="tail" style={styles.recipeName}>{item.name}</Text>
            </View>
          </View>
          
          {/* Fav Heart */}
          <View style={styles.heartIcon}>
            <TouchableOpacity  style={styles.heartBtn} onPress={() => handleFavorite(item.id)}>
              <Icon name="heart" size={30} color={userData.favorites.includes(item.id) ? "red" : "gray"} />
            </TouchableOpacity>
          </View>

          
          
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
        getItemCount={() => filteredRecipes.length}
        getItem={(data, index) => data[index]}
        ListEmptyComponent={<Text style={styles.notif}>No recipes found. Please consider adding an entry for this recipe :)</Text>}
        />
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
    paddingTop:'1%',
    flexDirection:'row',
  },

// Screen Title ~~~~~~~~~~~~~~~~~~~~~~~~~~
  screenText: {
    fontSize: 50,
    color: '#34785a',
    fontWeight: '900',
    marginLeft: '2%',
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

// Show Favorites Btn ~~~~~~~~~~~~~~~~~~~~
  showFavoritesButton: {
    backgroundColor: '#8addb9',
    borderRadius: 3,
    width: '96%',
    alignItems: 'center',
  },

  showFavoritesButtonTxt: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 30,
    paddingRight: 1,
    textAlignVertical: 'center',
  },

// Flatlist Container
  listContainer: {
    width: '100%',
    paddingLeft: '1%',
    paddingRight: '1%',
    paddingTop: '5%',
  },

  itemContainer:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '2%',
  },

// Recipe Name 
  recipesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 3,
  },

  touchContainer: {
    marginRight: 10
  },

  textContainer: {
    flexShrink: 1,
    flexBasis: '50%',
  },

  recipeName:{
    fontSize: 25,
    textAlign: 'left',
    marginHorizontal: 5,
    maxWidth: '70%',
  },

// Upvote/Downvote Arrow ~~~~~~~~~~~~~~~~~~~~~~~~~~  
  voteContainer:{
    flexDirection:'column',
    justifyContent: 'flex-start',
    marginLeft: '3%',
  },

  voteBtn: {
    alignSelf: 'flex-start',
  },

// Fav Heart & Count ~~~~~~~~~~~~~~~~~~~~~~~~  
  heartIcon: {
    flexDirection:'column',
    alignItems: 'center',
    //marginLeft: 5,
  },

  heartBtn: {
    marginBottom: 1,
  },

  votesCount:{
    fontSize: 10,
    paddingLeft: 12
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

// Recipe Image ~~~~~~~~~~~~~~~~~
  image: {
    width: 100, // specify the width
    height: 100, // specify the height
    borderColor: 'grey',
    borderWidth: 2,
  },

  // This doesn't do anything?
  // listItems:{
  //   fontWeight: 'bold',
  // },

  // Note: This isn't place anywhere
    // rmvBtn: {
    //   backgroundColor: 'red',
    //   borderRadius:25,
    //   width:30,
    //   height:30,
    //   marginLeft: 10,
    // },

});

export default RecipePage
