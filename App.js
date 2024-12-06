import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './components/login';
import HomeScreen from './components/homeOficial';
import ListaDoctores from './components/verDoctores';
import CrearCita from './components/crearCita';
import VerMisCitas from './components/verMisCitas';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login" screenOptions={{
        headerShown: false,
      }}>

        <Stack.Screen name="login" component={LoginScreen} options={{}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{}} />
        <Stack.Screen name="ListaDoctores" component={ListaDoctores} />
        <Stack.Screen name="CrearCita" component={CrearCita} />
        <Stack.Screen name="verMisCitas" component={VerMisCitas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

