import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { create } from 'react-test-renderer';
import locationPermissionsScreen from './src/screens/LocationPermissionsScreen';
import homeScreen from './src/screens/HomeScreen';
import searchScreen from './src/screens/SearchScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Location Permissions" component={locationPermissionsScreen} options={{headerShown:false}} />
        <Stack.Screen name="Home" component={homeScreen} options={{headerShown:false}} />
        <Stack.Screen name="Search" component={searchScreen} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
