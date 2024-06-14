import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const columnMapping = {
  col0: 'Region',
  col1: 'Cercle',
  col2: 'Code de regions',
  col3: 'Coordonnees',
  col4: 'Date de collecte',
  col5: 'Attribution en couleur',
  col6: 'Image',
  col7: 'Nombre homme inscrit',
  col8: 'Nombre femme inscrit',
  col11: 'Prix unitaire',
  col12: 'Nombre vendu',
  col14: 'Premier trimestre',
  col15: 'Deuxieme trimestre',
  col16: 'Troisieme trimestre',
  col19: 'Trimestres valides',
  col20: 'Qr code',
  col21: 'Localite',
};

const SavedDataScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { codeFeuille } = route.params || {};
  const [savedData, setSavedData] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('savedFormData');
        const parsedData = data ? JSON.parse(data) : [];
        const filteredData = parsedData.filter(item => item.codeFeuille === codeFeuille);
        setSavedData(filteredData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données enregistrées:', error);
      }
    };

    fetchData();
  }, [codeFeuille]);

  const toggleItemExpansion = (index) => {
    setExpandedItems((prevExpandedItems) => {
      const expanded = [...prevExpandedItems];
      expanded[index] = !expanded[index];
      return expanded;
    });
  };

  const handleItemPress = (index) => {
    toggleItemExpansion(index);
  };

  const handleLongPress = (index) => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cet enregistrement ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => deleteItem(index),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const deleteItem = async (index) => {
    try {
      const updatedData = [...savedData];
      updatedData.splice(index, 1);
      setSavedData(updatedData);
      await AsyncStorage.setItem('savedFormData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'enregistrement:', error);
    }
  };

  const handleEditPress = (item) => {
    navigation.navigate('FeuilleDetail', { codeFeuille: item.codeFeuille, formData: item });
  };

  


  return (
    <View style={styles.container}>
      <FlatList
        data={savedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleItemPress(index)}
            onLongPress={() => handleLongPress(index)}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.itemText}>
                Données du {moment(item.date).format('DD/MM/YYYY HH:mm')}
              </Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => toggleItemExpansion(index)}>
                  <Icon name={expandedItems[index] ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEditPress(item)}>
                  <Icon name="edit" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            {expandedItems[index] && (
              <View style={styles.detailsContainer}>
                {Object.entries(item)
                .filter(([key]) => key !== 'codeFeuille')
                .map(([key, value]) => (
                  <View key={key} style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>{columnMapping[key]}:</Text>
                    <Text style={styles.fieldValue}>{value}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  detailsContainer: {
    marginTop: 10,
  },
  fieldContainer: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    color: 'blue',
  },
  fieldValue: {
    color: 'green',
  },
});

export default SavedDataScreen;
