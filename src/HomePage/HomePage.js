import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { ListClasseur } from '../../Services/AuthServices';
import styles from './Styles';

const HomePage = () => {
  const [classeurs, setClasseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Connexion internet',
          text2: 'Vous êtes hors connexion.',
          position: 'bottom',
        });
      }

      try {
        if (netInfo.isConnected) {
          const data = await ListClasseur();
          setClasseurs(data.classeur);
          await AsyncStorage.setItem('classeurs', JSON.stringify(data.classeur));
        } else {
          const storedClasseurs = await AsyncStorage.getItem('classeurs');
          if (storedClasseurs) {
            setClasseurs(JSON.parse(storedClasseurs));
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des classeurs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderClasseur = ({ item }) => (
    <TouchableOpacity
      style={styles.classeurContainer}
      onPress={() => navigation.navigate('ClasseurDetails', { classeur: item })}
    >
      <View style={[styles.colorIndicator, { backgroundColor: item['Couleur classeur'] }]} />
      <Text style={styles.classeurTitle}>{item['Libelle classeur']}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#405189" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={classeurs}
        renderItem={renderClasseur}
        keyExtractor={(item) => item.Id.toString()}
      />
    </View>
  );
};

export default HomePage;
