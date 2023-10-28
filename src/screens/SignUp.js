
import React, { useEffect, useState } from 'react' //this library allows us to keep user inputs
import { KeyboardAvoidingView, StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebase'

import { FIRESTORE_DB } from '../firebase' //allows us to reference to the database of our app
import {doc, setDoc} from 'firebase/firestore'; //allows us to actually utilize functions of the database

// the imports KeyboardAvoidingView, StyleSheet, TextInput, etc, are all imported for their properties which allow us to style them
const SignUp = () => {
    //These are used to keep the values of user input
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //we need auth constant
    const auth = FIREBASE_AUTH;
    //firestore constant
    const database = FIRESTORE_DB;

    //THE FOLLOWING IS THE LOGIC FOR THE DATA TO GO INTO OUR FIREBASE
    const handleSignUp = async () => {
        try{
            const userCredentials = await createUserWithEmailAndPassword(auth,email,password); //makes new user and inputs to authentication service
            const userDoc = doc(database, "users", userCredentials.user.uid);                  //initialize database holder using users ID
            await setDoc(userDoc,{           //each users info will be stored just in case. This also allows us to sync future user data.
                name: name,
                email: email,
            });
            }
        catch (error){
            console.log(error)
        }
        finally{
            console.log('Creation Success :)')
        }
    } //this is just for us to see in terminal that user info was passed
   

    return (
        <KeyboardAvoidingView
            style = {styles.container}
            behavior="padding"
        >
            <Text style = {styles.header}>Sign Up!
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder = "Enter your name" 
                    //this makes the input box have a grayed out text "enter your name" for user to know what is being filled in
                    value = { name }
                    //grabs user input in this field and sets into variable name
                    onChangeText={text=>setName(text)}
                    style = {styles.input}
                />
                <TextInput
                    placeholder = "Enter your email" 
                    //this makes the input box have a grayed out text "email" for user to know what is being filled in
                    value = { email }
                    //grabs user input in this field and sets into variable email
                    onChangeText={text=>setEmail(text)}
                    style = {styles.input}
                />
                <TextInput
                    placeholder = "Enter your password" 
                    //this makes the input box have a grayed out text "Password" for user to know what is being filled in
                    value = { password }
                    //grabs user input in this field and sets into variable password
                    onChangeText={ text=>setPassword(text) }
                    style = {styles.input}
                    secureTextEntry  //<- this line makes the input turn to circles when typed
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity //this makes a touchable object
                    onPress={handleSignUp}
                    style={styles.button} //format it to a button
                >
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    },

    header:{
        fontWeight: '900',
        fontSize: 30,
    },

    inputContainer : {
        width: '80%'
    },

    input: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius:10,
        marginTop:5,
    },

    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:40,
    },
    button: {
        backgroundColor: '#62d2a2',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'

    },

    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#62d2a2',
        borderWidth: 2,
    },

    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },

    buttonOutlineText: {
        color: '#62d2a2',
        fontWeight: '700',
        fontSize: 16,
    },
})

