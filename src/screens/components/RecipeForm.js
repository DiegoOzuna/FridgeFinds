import React, { useState } from 'react';
import { ScrollView, View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';  // Import the Dropdown component

const RecipeForm = () => {
  const [inputs, setInputs] = useState([{ item: '', amount: '', type: '' }]);
  const [recipe, setRecipe] = useState([]);

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

  const handleChange = (value, name, index) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][name] = value;
    setInputs(updatedInputs);
  };

  const handleAddInput = () => {
    setInputs([...inputs, { item: '', amount: '', type: '' }]);
  };

  const handleSubmit = () => {
    setRecipe(inputs);
    setInputs([{ item: '', amount: '', type: '' }]);  // Reset the form
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}> Add Your Recipe :) </Text>
        {inputs.map((input, index) => (
          <View style={styles.listContainer} key={index}>
            <View style={styles.ingredientCell}>
              <TextInput style={styles.input}
                name="item"
                placeholder="Ingredient"
                onChangeText={(value) => handleChange(value, 'item', index)}
              />
              <TextInput style={styles.amount}
                name="amount"
                placeholder="Amount"
                onChangeText={(value) => handleChange(value, 'amount', index)}
              />
              <Dropdown
                style={styles.type}
                data={typeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select an item"
                value={input.type}  // Use the type property of the current input as the value prop
                onChange={(item) => handleChange(item.value, 'type', index)}
              />
            </View>
          </View>
        ))}
        <Button style={styles.button} title="Add Ingredient" onPress={handleAddInput} />
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

  input: {
    flex: 1,  // Use flex to adjust the width
    height: 30,  // Adjust the height
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },

  amount: {
    flex: 1,  // Use flex to adjust the width
    height: 30,  // Adjust the height
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
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
