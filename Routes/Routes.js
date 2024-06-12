import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../src/LoginPage/LoginPage';
import HomePage from '../src/HomePage/HomePage';
import ClasseurDetails from '../src/ClasseurDetails/ClasseurDetails';
import LoadingScreen from '../src/LoadingScreen/LoadingScreen'; 

const Stack = createStackNavigator();

const Routes = () => {
  const [initialRoute, setInitialRoute] = useState(null); // Par défaut, pas de route initiale définie

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userInfoJSON = await AsyncStorage.getItem('user');
        if (userInfoJSON) {
          const userInfo = JSON.parse(userInfoJSON);
          if (userInfo && userInfo.clp_id) {
            setInitialRoute('HomePage');
            // setInitialRoute('LoginPage');

          } else {
            setInitialRoute('LoginPage');
          }
        } else {
          setInitialRoute('LoginPage');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut de connexion:', error);
        setInitialRoute('LoginPage');
      }
    };

    checkLoginStatus();
  }, []);

  if (initialRoute === null) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
          name="LoginPage" 
          component={LoginPage} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="HomePage" 
          component={HomePage} 
          options={{ title: 'Classeur' }} 
          // options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ClasseurDetails" 
          component={ClasseurDetails} 
          options={{ title: 'Feuilles' }} 
          // options={{ headerShown: false }}

        />
         <Stack.Screen 
          name="LoadingScreen" 
          component={LoadingScreen} 
          options={{ headerShown: false }}

        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
