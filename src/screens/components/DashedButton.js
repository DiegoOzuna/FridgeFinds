import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const DashedButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.dashedBorder}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dashedBorder: {
    borderWidth: 1,
    borderColor: 'grey', // Change the border color as needed
    borderStyle: 'dashed',
    borderRadius: 5,
    paddingVertical: 90,
    paddingHorizontal: 50,
  },
  buttonText: {
    fontSize: 16,
    color: 'black', // Change the text color as needed
  },
});

export default DashedButton;
