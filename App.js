import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Routes from './Routes/Routes';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      <Routes />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}
