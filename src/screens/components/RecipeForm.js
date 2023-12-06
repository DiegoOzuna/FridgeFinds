import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Image, ScrollView, View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';  // Import the Dropdown component
import * as ImagePicker from 'expo-image-picker'; //will allow user to choose a photo for recipe
import { FIREBASE_STORAGE } from '../../firebase'
import { FIRESTORE_DB } from '../../firebase';
import { ref, uploadBytes, deleteObject, getDownloadURL} from "firebase/storage";
import { useNavigation } from '@react-navigation/core';
import { collection, addDoc } from "firebase/firestore";
import DashedButton from './DashedButton';

const RecipeForm = () => {
  const navigation = useNavigation();
  const [ingredient, setIngredient] = useState([{ item: '', amount: '', type: '' }]); //Add a state for ingredients
  const [recipeName, setRecipeName] = useState(''); //will hold users recipe name
  const [steps, setSteps] = useState([{ step: '', number: 1 }]);  // Add a new state for steps
  const [image, setImage] = useState(null);  // Add a new state for the image URI
  const [imageRef, setImageRef] = useState(null);  // Add a new state for the image reference


  // Define the options for the dropdown menu
  const typeOptions = [
    {label: 'Count', value:'unit'},
    {label: 'Ounce', value:'oz'},
    {label: 'Fluid Ounce', value:'fl oz'},
    {label: 'gram', value: 'g'},
    {label: 'Kilogram', value: 'kg'},
    {label: 'Teaspoon', value: 'tsp'},
    {label: 'Tablespoon', value: 'tbsp'},
    {label: 'Cup', value: 'C'},
    {label: 'Quart', value: 'qt'},
    {label: 'Pound', value:'lb'},
    {label: 'Mililiter', value:'mL'},
    {label: 'Liter', value: 'L'},
    {label: 'Gallon', value: 'gal'},
    {label: 'Pint', value: 'pt'}
    // Add more options here...
  ];


  // Request permission to access the media library
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const ihandleChange = (value, name, index) => { //Making sure user input is being captured
    const updatedIngredients = [...ingredient];
    updatedIngredients[index][name] = value;
    setIngredient(updatedIngredients);
  };

  const shandleChange = (value, index) => {  // Making sure user input is being caputured
    const updatedSteps = [...steps];
    updatedSteps[index]['step'] = value;
    setSteps(updatedSteps);
  };

  const ihandleAdd = () => { //This makes sure that the ingredient is added into the ingredients array
    setIngredient([...ingredient, { item: '', amount: '', type: '' }]);
    console.log(ingredient)
  };

  const shandleAdd = () => {  // This makes sure that the step is added into the steps array
    setSteps([...steps, { step: '', number: steps.length + 1 }]);
  };

  const handleImageUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        if (imageRef) {
          // If there's an existing image, delete it from Firebase Storage
          try {
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Failed to delete image: ', error);
          }
        }
  
        setImage(result.assets[0].uri);
        const newImageRef = await uploadImage(result.assets[0].uri);
        setImageRef(newImageRef);
      }
    } catch (error) {
      console.error(error);
    }
  };
  



  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(FIREBASE_STORAGE, 'images/' + new Date().getTime());
    await uploadBytes(storageRef, blob);
  
    // Get the download URL of the image
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL; //return the download URL of the uploaded image
  };

  const handleSubmit = async () => {
    // Format the user input
    const ingredientNames = ingredient.map(i => i.item);
    const ingredientAmounts = ingredient.map(i => i.amount);
    const ingredientTypes = ingredient.map(i => i.type);
    const stepDescriptions = steps.map(s => s.step);
  
    // Add the recipe to Firestore
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, "Recipes"), {
        name: recipeName,
        ingredients: {
          names: ingredientNames,
          amounts: ingredientAmounts,
          types: ingredientTypes,
        },
        steps: stepDescriptions,
        imageUrl: imageRef, // store the download URL of the image
        votes: 0, //Initialize votes as 0
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  
    // Reset the form
    setIngredient([{ item: '', amount: '', type: '' }]);
    setSteps([{ step: '', number: 1 }]);
    setImage(null);
    setImageRef(null);
    setRecipeName('');

    //leave form now.
    navigation.goBack();
  };



  const handleExit = async () => {
    // Clear out all variables
    setIngredient([{ item: '', amount: '', type: '' }]);
    setSteps([{ step: '', number: 1 }]);
    setImage(null);
    setImageRef(null);
    setRecipeName('');
  
    // Delete the uploaded image from Firebase Storage
    if (imageRef) {
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Failed to delete image: ', error);
      }
      setImageRef(null);
    }
  
    // Navigate back to the previous screen
    navigation.goBack();
  };
  
  
  

  return (
  <KeyboardAvoidingView 
  style={{ flex: 1 }} 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView>
      <View style={styles.container}>

        {/* Cancel Button */}
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleExit}>
          <Text style={styles.cancelText}> CANCEL </Text>
        </TouchableOpacity>

        {/* Recipe Name Box */}
        <TextInput style={styles.recipeInput} placeholder="Recipe Name" onChangeText={setRecipeName}/>
        
        <Text style={styles.sectionText}>Ingredients</Text>

        {ingredient.map((input, index) => (
          <View style={styles.listContainer} key={index}>
            <View style={styles.ingredientCell}>

              <TextInput style={styles.amountInput}
                name="amount"
                placeholder="Amount"
                onChangeText={(value) => ihandleChange(value, 'amount', index)}
              />

              <Dropdown
                style={styles.type}
                data={typeOptions}
                labelField="label"
                valueField="value"
                placeholder="Unit"
                value={input.type}  // Use the type property of the current input as the value prop
                onChange={(item) => ihandleChange(item.value, 'type', index)}
              />

              <TextInput style={styles.descBox}
                name="item"
                placeholder="Ingredient"
                onChangeText={(value) => ihandleChange(value, 'item', index)}
              />
              
            </View>
          </View>
        ))}
        {/* Add Ingredient Button */}
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={ihandleAdd}>
          <Text style={styles.addButtonText}> Add Ingredient </Text>
        </TouchableOpacity>

        <Text style={styles.sectionText}>Instructions</Text>

        {steps.map((input, index) => (  // New map function for steps
          <View style={styles.listContainer} key={index}>
            <View style={styles.stepsCell}>
            <Text>Step {input.number}</Text>
            <TextInput
              multiline = {true}
              style = {styles.descBox}
              name="step"
              placeholder="Describe this step..."
              onChangeText={(value) => shandleChange(value, index)}
            />
          </View></View>
        ))}

        {/* Add Step Button */}
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={shandleAdd}>
          <Text style={styles.addButtonText}> Add Step </Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}  
        
        {/* Upload Image Button */}
        <DashedButton onPress = {handleImageUpload} text="Upload Image"/>
        

        {/* Submit Button */}
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={styles.submitText}> SUBMIT </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>   
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#3ac78b',
    alignItems: 'center',
    paddingTop: '10%',
    position: 'relative'
  },

  listContainer: {
    width: '95%',
  },

  ingredientCell:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    marginVertical: 10,
    width: '95%'
  },

  stepsCell:{
    marginBottom: 10,
    padding: 10,
    marginVertical: 15,
  },

  descBox:{
    flex: 1,
    borderColor: 'green',
    borderWidth: 1,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft:5,
  },

  type: {
    flex: 1,  // Use flex to adjust the width
    height: 20,  // Adjust the height
    marginHorizontal: 8,
    width: 'auto',
  },

  title:{
    fontSize: 40,
    color: '#3ac78b'
  },

  button: {
    marginTop: 5,  // Add top margin to the buttons
  },

  // Cancel Button
  cancelButton: {
    backgroundColor: 'red',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '1%',
    left: '2%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderRadius: 5,
  },
  cancelText: {
    color: '#fff',
    fontSize: 18,
  },

  // Recipe Name Input
  recipeInput: {
    width: '100%',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 20,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D4D4D4',
    paddingBottom: 12,
  },

  // Amount Input
  amountInput: {
    width: 70,
    fontSize: 16,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginRight: 10,
    textAlign: 'center',
    height: 20,
  },

  // Add Button
  addButton: {
    backgroundColor: '#3ac78b',
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    width: '50%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
  },

  // Submit Button
  submitButton: {
    backgroundColor: '#3ac78b',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '1%',
    right: '2%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderRadius: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
  },

  // Section Text
  sectionText: {
    width: '100%',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3ac78b',
    textAlign: 'left',
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 5,
  }, 
});  

export default RecipeForm;
