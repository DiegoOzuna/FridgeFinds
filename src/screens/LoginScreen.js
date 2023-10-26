import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react' //this library allows us to keep user inputs
import { KeyboardAvoidingView, StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../firebase'

// the imports KeyboardAvoidingView, StyleSheet, TextInput, etc, are all imported for their properties which allow us to style them
const LoginScreen = () => {
    //These are used to keep the values of user input
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //This theoretically will allow us to have "loading icons" in future
    const [loading, setLoading] = useState(false)

    //navigation is used to transfer signed in user to new page
    const navigation = useNavigation()

    //new expo go requires auth to be in file and passed through functions
    const auth = FIREBASE_AUTH;

    //THIS IS A LISTENER, ONCE THE USERS STATE CHANGES TO SIGNED IN
    //THEY WILL BE REDIRECTED TO THE HOME PAGE
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                navigation.navigate("UserPage") //edit, removed "Home" and replaced with UserPage
            }
    })

    return unsubscribe //unsubscribe is used to stop pinging listener when user signs in.

}, [])

    //THIS FUNCTION IS USED TO CHECK EMAIL AND PASSWORD
    //AND CHECK AGAINST FIREBASE TO LOGIN, ELSE ERROR
    // Past versions of firebase used auth.signInWithEmailAndPassword(email, password)
    // but has since changed from this format. Now we call funciton directly, and pass auth
    const handleLogin = async () => {
        try{
            const userCredentials = await signInWithEmailAndPassword(auth,email,password);
            }
        catch (error){
            console.log(error)
        }
        finally{
            console.log('Success Login :)')
        }
    }


    return (
        <KeyboardAvoidingView
            style = {styles.container}
            behavior="padding"
        >
            <Text style = {styles.header}>Hello Again!
            </Text>
            <View style={styles.inputContainer}>
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
                    onPress={handleLogin}
                    style={styles.button} //format it to a button
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity //this is another instance of button
                    onPress={() => navigation.navigate('SignUp')} //when user clicks register, they will be redirected to other page.
                    style={[styles.button , styles.buttonOutline]} 
                >
                    <Text style={styles.buttonOutlineText}>Register</Text> 
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

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