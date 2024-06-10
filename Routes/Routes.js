import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../src/LoginPage/LoginPage';
import HomePage from '../src/HomePage/HomePage';

const Stack = createStackNavigator();

const Routes = () => {
  const [initialRoute, setInitialRoute] = useState('LoginPage');

  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
          name="LoginPage" 
          component={LoginPage} 
        //   options={{ title: 'Connexion' }} 
         options={{ headerShown: false }}
        />
         <Stack.Screen 
          name="HomePage" 
          component={HomePage} 
          options={{ title: 'Home' }} 
        //  options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
