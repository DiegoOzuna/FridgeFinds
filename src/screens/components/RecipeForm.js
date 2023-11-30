import React, { useState } from 'react';
import { ScrollView, View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';  // Import the Dropdown component

const RecipeForm = () => {
  const [ingredient, setIngredient] = useState([{ item: '', amount: '', type: '' }]); //Add a state for ingredients
  const [recipe, setRecipe] = useState([]);
  const [steps, setSteps] = useState([{ step: '', number: 1 }]);  // Add a new state for steps

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

  const handleSubmit = () => {  //This will make sure that all data that was inputted will be formatted properly and stored in firebase firestore
    setRecipe(ingredient);
    setIngredient([{ item: '', amount: '', type: '' }]);  // Reset the form
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}> Add Your Recipe :) </Text>
        {ingredient.map((input, index) => (
          <View style={styles.listContainer} key={index}>
            <View style={styles.ingredientCell}>
              <TextInput style={styles.descBox}
                name="item"
                placeholder="Ingredient"
                onChangeText={(value) => ihandleChange(value, 'item', index)}
              />
              <TextInput style={styles.descBox}
                name="amount"
                placeholder="Amount"
                onChangeText={(value) => ihandleChange(value, 'amount', index)}
              />
              <Dropdown
                style={styles.type}
                data={typeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select an item"
                value={input.type}  // Use the type property of the current input as the value prop
                onChange={(item) => ihandleChange(item.value, 'type', index)}
              />
            </View>
          </View>
        ))}
        <Button style={styles.button} title="Add Ingredient" onPress={ihandleAdd} />

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
        
        <Button style={styles.button} title="Add Step" onPress={shandleAdd} />
        <Button style={styles.button} title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#3ac78b',
    alignItems: 'center',
    paddingTop: '10%'
  },

  listContainer: {
    width: '95%',
  },

  ingredientCell:{
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    marginVertical: 15,
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
    height: 30,  // Adjust the height
  },

  title:{
    fontSize: 40,
    color: '#3ac78b'
  },

  button: {
    marginTop: 20,  // Add top margin to the buttons
  },
});  

export default RecipeForm;
