import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from './../../constants/Colors'
import { getLocalStorage } from './../../service/Storage';
import { useRouter } from 'expo-router';
import Icons from 'react-native-vector-icons/Ionicons';
import { getAuth, signOut } from 'firebase/auth';


export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Menu options
  const Menu = [
    {
      id: 1,
      name: 'Add New Medication',
      icon: 'add-circle',
      path: '/add-new-medication'
    },
    {
      id: 5,
      name: 'My Medication',
      icon: 'medkit',
      path: '(tabs)'
    },
    {
      id: 2,
      name: 'History',
      icon: 'time',
      path: '/(tabs)/History'
    },
    {
      id: 3,
      name: 'Logout',
      icon: 'log-out',
      path: '/logout'
    }
  ];

  // Fetch user details
  useEffect(() => {
    const GetUser = async () => {
      const userData = await getLocalStorage('userDetail');
      setUser(userData);
    };
    GetUser();
  }, []);

  const auth = getAuth();

const onPressMenu = async (menu) => {
  if (menu.name === 'Logout') {
    try {
      await signOut(auth); // Firebase sign-out
      console.log('User signed out');
      
      // Optionally, clear local storage if you store user data
      // await AsyncStorage.removeItem('userDetail'); (React Native)
      // localStorage.removeItem('userDetail'); (Web)

      // Redirect to login screen
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  } else {
    router.push(menu.path);
  }
};


  return (
    <View style={{
      padding: 25,
      backgroundColor: 'white',
      height: '100%'
    }}>
      {/* Profile Info */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image source={require("./../../assets/images/smiley.png")}
          style={{
            width:100,
            height:100
          }} />
        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 24,
          marginTop: 6,
          fontWeight: 'bold'
        }}>
          {user?.displayName}
        </Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 16,
          color: Colors.GRAY
        }}>
          {user?.email}
        </Text>
      </View>

      {/* Menu List */}
      <FlatList
        data={Menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
              gap: 10
            }}
          >
            <Icons
              name={item.icon}
              size={30}
              color={Colors.PRIMARY}
              style={{
                padding: 10,
                backgroundColor: Colors.LIGHT_PRIMARY,
                borderRadius: 10
              }}
            />
            <Text style={{
              fontFamily: 'outfit',
              fontSize: 20
            }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
