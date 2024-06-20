import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { ListClasseur } from '../../Services/AuthServices';
import styles from './Styles';
import { MaterialIcons } from '@expo/vector-icons';

const HomePage = () => {
  const [classeurs, setClasseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const navigation = useNavigation();

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const fetchData = async () => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Connexion perdue',
        text2: 'Vous êtes hors connexion.',
      });
    }

    try {
      const clp_structure = await AsyncStorage.getItem('clp_structure');
      if (!clp_structure) {
        throw new Error('clp_structure non trouvé dans AsyncStorage');
      }

      if (netInfo.isConnected) {
        const data = await ListClasseur(clp_structure);
        if (data && data.classeur) {
          setClasseurs(data.classeur);
          await AsyncStorage.setItem('classeurs', JSON.stringify(data.classeur));
        }
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

  useFocusEffect(() => {
    fetchData();
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#405189" />
      </View>
    );
  }

  const renderClasseurs = () => {
    const filteredClasseurs = classeurs.filter(item => 
      item['Libelle classeur'].toLowerCase().includes(searchText.toLowerCase())
    );

    if (filteredClasseurs.length === 0) {
      return <Text style={styles.emptyMessage}>Aucun classeur disponible</Text>;
    }

    return filteredClasseurs.map((item) => (
      <TouchableOpacity
        key={item.Id}
        style={styles.classeurContainer}
        onPress={() => navigation.navigate('ClasseurDetails', { classeur: item })}
      >
        <View style={styles.classeur}>
          <View style={styles.folderIcon}>
            <View style={[styles.folderTop, { backgroundColor: item['Couleur classeur'] }]} />
            <View style={[styles.folderBody]}>
              <View style={styles.folderContent}>
                <Text style={styles.classeurTitle} ellipsizeMode="tail">
                  {item['Libelle classeur']}
                </Text>
                <Text style={styles.statistic}>Feuilles: {item['Nombre feuille']}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.searchbar}
          placeholder="Rechercher un classeur..."
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderClasseurs()}
      </ScrollView>
    </View>
  );
};

export default HomePage;
