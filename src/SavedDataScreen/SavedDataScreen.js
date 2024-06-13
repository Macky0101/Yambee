import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SavedDataScreen = () => {
  const [savedData, setSavedData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem('savedFormData');
        if (data) {
          setSavedData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données enregistrées:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (index) => {
    try {
      const updatedData = savedData.filter((_, i) => i !== index);
      setSavedData(updatedData);
      await AsyncStorage.setItem('savedFormData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  };

  const handleEdit = (item) => {
    navigation.navigate('FeuilleDetail', { formData: item });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Données Enregistrées</Text>
      <FlatList
        data={savedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.dataContainer}>
            {Object.keys(item).map((key) => (
              <Text key={key}>
                <Text style={styles.fieldLabel}>{key}:</Text> {item[key]}
              </Text>
            ))}
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Icon name="edit" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Icon name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dataContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  fieldLabel: {
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default SavedDataScreen;
