import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from './../../configs/FirebaseConfig'
import { toast } from 'react-toastify';
import { setLocalStorage } from '../../service/Storage';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [userName, setUserName] = useState();

    const OnCreateAccount = () => {
        if (!email || !password || !userName) {
            if (Platform.OS === "web") {
                toast.error('Please fill all details');
            } else {
                ToastAndroid.show("Please fill all details", ToastAndroid.BOTTOM);
            }
            return;
        }

        if (password.length <= 5) {
            if (Platform.OS === "web") {
                toast.error('Password must be at least 6 characters');
            } else {
                ToastAndroid.show("Password must be at least 6 characters", ToastAndroid.BOTTOM);
            }
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;

                // Update profile with displayName
                await updateProfile(user, { displayName: userName });

                // Save user locally
                await setLocalStorage('userDetail', user);

                console.log(user);
                router.push('(tabs)');
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                    if (Platform.OS === 'web') {
                        toast.error('Email already exists');
                    } else {
                        ToastAndroid.show("Email already exists", ToastAndroid.SHORT);
                    }
                } else {
                    console.error("Sign up error:", error.message);
                }
            });
    };

    return (
        <View style={{ padding: 25 }}>
            <Text style={styles.textHeader}>Create New Account</Text>

            <View style={{ marginTop: 25 }}>
                <Text>Full Name</Text>
                <TextInput
                    placeholder='Full Name'
                    onChangeText={(value) => setUserName(value)}
                    style={styles.textInput}
                />
            </View>

            <View style={{ marginTop: 25 }}>
                <Text>Email</Text>
                <TextInput
                    placeholder='Email'
                    style={styles.textInput}
                    onChangeText={(value) => setEmail(value)}
                />
            </View>

            <View style={{ marginTop: 25 }}>
                <Text>Password</Text>
                <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    style={styles.textInput}
                    onChangeText={(value) => setPassword(value)}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={OnCreateAccount}>
                <Text style={{ fontSize: 17, color: 'white', textAlign: 'center' }}>
                    Create Account
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCreate} onPress={() => router.push('login/signIn')}>
                <Text style={{ fontSize: 17, color: Colors.PRIMARY, textAlign: 'center' }}>
                    Already have account? Sign In
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    textHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 15
    },
    subText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10,
        color: Colors.GRAY
    },
    textInput: {
        padding: 10,
        borderWidth: 1,
        fontSize: 17,
        borderRadius: 10,
        marginTop: 5,
        backgroundColor: 'white'
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        marginTop: 35
    },
    buttonCreate: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: Colors.PRIMARY
    }
});
