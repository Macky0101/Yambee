// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import * as Location from 'expo-location';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Toast from 'react-native-toast-message';

// const columnMapping = {
//   col0: 'Region',
//   col1: 'Cercle',
//   col2: 'Code de regions',
//   col3: 'Coordonnees',
//   col4: 'Date de collecte',
//   col5: 'Attribution en couleur',
//   col6: 'Image',
//   col7: 'Nombre homme inscrit',
//   col8: 'Nombre femme inscrit',
//   col11: 'Prix unitaire',
//   col12: 'Nombre vendu',
//   col14: 'Premier trimestre',
//   col15: 'Deuxieme trimestre',
//   col16: 'Troisieme trimestre',
//   col19: 'Trimestres valides',
//   col20: 'Qr code',
//   col21: 'Localite',
// };

// const SavedDataScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { codeFeuille } = route.params || {};
//   const [savedData, setSavedData] = useState([]);
//   const [expandedItems, setExpandedItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [locationEnabled, setLocationEnabled] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await AsyncStorage.getItem('savedFormData');
//         const parsedData = data ? JSON.parse(data) : [];
//         const filteredData = parsedData.filter(item => item.codeFeuille === codeFeuille);
//         setSavedData(filteredData);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données enregistrées:', error);
//       }
//     };

//     fetchData();
//   }, [codeFeuille]);

//   useEffect(() => {
//     checkLocationEnabled();
//   }, []);

//   const checkLocationEnabled = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       setErrorMsg('L’autorisation d’accéder à l’emplacement a été refusée');
//       setLocationEnabled(false);
//       return;
//     }

//     setLocationEnabled(true);

//     try {
//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//     } catch (error) {
//       console.error('Erreur lors de la récupération de la position:', error);
//       setLocation(null);
//     }
//   };

//   const toggleItemExpansion = (index) => {
//     setExpandedItems((prevExpandedItems) => {
//       const expanded = [...prevExpandedItems];
//       expanded[index] = !expanded[index];
//       return expanded;
//     });
//   };

//   const handleItemPress = (index) => {
//     toggleItemExpansion(index);
//   };

//   const handleLongPress = (index) => {
//     Alert.alert(
//       "Confirmer la suppression",
//       "Êtes-vous sûr de vouloir supprimer cet enregistrement ?",
//       [
//         {
//           text: "Annuler",
//           style: "cancel"
//         },
//         {
//           text: "Supprimer",
//           onPress: () => deleteItem(index),
//           style: "destructive"
//         }
//       ],
//       { cancelable: true }
//     );
//   };

//   const deleteItem = async (index) => {
//     try {
//       const data = await AsyncStorage.getItem('savedFormData');
//       const parsedData = data ? JSON.parse(data) : [];
//       const itemToDelete = savedData[index];
//       const updatedData = parsedData.filter(item => item.id !== itemToDelete.id);
//       await AsyncStorage.setItem('savedFormData', JSON.stringify(updatedData));
//       setSavedData(updatedData.filter(item => item.codeFeuille === codeFeuille));
//     } catch (error) {
//       console.error('Erreur lors de la suppression de l\'enregistrement:', error);
//     }
//   };

//   const handleEditPress = (item) => {
//     navigation.navigate('FeuilleDetail', { codeFeuille: item.codeFeuille, formData: item });
//   };

//   const sendData = async () => {
//     console.log('Send data',sendData);
//     if (!locationEnabled) {
//       Alert.alert('Erreur', 'Veuillez activer votre position avant d\'envoyer les données.');
//       return;
//     }

//     setLoading(true);
//     setProgress(0);

//     // Destructuration de la position si elle est disponible
//     const { coords: { latitude, longitude } } = location;

//     // Simulation de l'envoi des données
//     const totalItems = savedData.length;
//     for (let i = 0; i < totalItems; i++) {
//       try {
//         // Simuler un appel API avec un délai
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // Ajout des coordonnées géographiques
//         const dataWithPosition = {
//           ...savedData[i],
//           latitude,
//           longitude,
//         };

//         // Simuler l'envoi des données à l'API
//         console.log('Envoi des données:', dataWithPosition);

//         // const response = await axios.post('https://example.com/api/data', dataWithPosition);

//         // Mettre à jour le pourcentage de progression
//         setProgress(((i + 1) / totalItems) * 100);

//         // Suppression de l'élément après l'envoi réussi
//         deleteItem(i);

//         // Affichage d'un message de succès
//         Toast.show({
//           type: 'success',
//           text1: 'Succès',
//           text2: 'Les données ont été envoyées avec succès.'
//         });
//       } catch (error) {
//         console.error('Erreur lors de l\'envoi des données:', error);
//       }
//     }

//     setLoading(false);
//   };

//   let text = 'Waiting..';
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
//   }

//   return (
//     <View style={styles.container}>
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text style={styles.progressText}>{`Envoi en cours: ${Math.round(progress)}%`}</Text>
//         </View>
//       )}
//       <FlatList
//         data={savedData}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item, index }) => (
//           <TouchableOpacity
//             style={styles.itemContainer}
//             onPress={() => handleItemPress(index)}
//             onLongPress={() => handleLongPress(index)}
//           >
//             <View style={styles.headerContainer}>
//               <Text style={styles.itemText}>
//                 {`${columnMapping.col0}: ${item.col0}`}
//               </Text>
//               <View style={styles.actionButtons}>
//                 <TouchableOpacity onPress={() => toggleItemExpansion(index)}>
//                   <Icon name={expandedItems[index] ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="black" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleEditPress(item)}>
//                   <Icon name="edit" size={24} color="black" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             {expandedItems[index] && (
//               <View style={styles.detailsContainer}>
//                 {Object.entries(item)
//                 .filter(([key]) => key !== 'codeFeuille')
//                 .filter(([key]) => key !== 'id')
//                 .map(([key, value]) => (
//                   <View key={key} style={styles.fieldContainer}>
//                     <Text style={styles.fieldLabel}>{columnMapping[key]}:</Text>
//                     <Text style={styles.fieldValue}>{value}</Text>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </TouchableOpacity>
//         )}
//       />
//       <TouchableOpacity style={styles.sendButton} onPress={sendData}>
//         <Text style={styles.sendButtonText}>Envoyer les données</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   progressText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#fff',
//   },
//   itemContainer: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   itemText: {
//     fontSize: 16,
//     flex: 1,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//   },
//   detailsContainer: {
//     marginTop: 10,
//   },
//   fieldContainer: {
//     marginBottom: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   fieldLabel: {
//     fontWeight: 'bold',
//     marginRight: 5,
//     color: 'blue',
//   },
//   fieldValue: {
//     color: 'green',
//   },
//   sendButton: {
//     backgroundColor: '#009900',
//     padding: 15,
//     alignItems: 'center',
//     borderRadius: 5,
//     marginTop: 20,
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });

// export default SavedDataScreen;









import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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

  useEffect(() => {
    checkLocationEnabled();
  }, []);

  const checkLocationEnabled = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('L’autorisation d’accéder à l’emplacement a été refusée');
      setLocationEnabled(false);
      return;
    }

    setLocationEnabled(true);

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      setLocation(null);
    }
  };

  const toggleItemExpansion = (index) => {
    setExpandedItems(prevExpandedItems => {
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
      const data = await AsyncStorage.getItem('savedFormData');
      const parsedData = data ? JSON.parse(data) : [];
      const itemToDelete = savedData[index];
      const updatedData = parsedData.filter(item => item.id !== itemToDelete.id);
      await AsyncStorage.setItem('savedFormData', JSON.stringify(updatedData));
      const filteredData = updatedData.filter(item => item.codeFeuille === codeFeuille);
      setSavedData(filteredData);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'enregistrement:', error);
    }
  };

  const handleEditPress = (item) => {
    navigation.navigate('FeuilleDetail', { codeFeuille: item.codeFeuille, formData: item });
  };

  const sendData = async () => {
    if (!locationEnabled) {
      Alert.alert('Erreur', 'Veuillez activer votre position avant d\'envoyer les données.');
      return;
    }

    setLoading(true);
    setProgress(0);

    const { coords: { latitude, longitude } } = location;
    const totalItems = savedData.length;

    for (let i = 0; i < totalItems; i++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { id, ...dataWithoutId } = savedData[i]; // Exclure l'ID des données envoyées
        const dataWithPosition = {
          ...dataWithoutId,
          LG: longitude,
          LT: latitude,
        };

        // Préparation des données à envoyer
        const postData = {
          'Table Feuille': 'your_table_name',  // Remplacez par le nom de votre table
          'Colonne': Object.keys(dataWithPosition),
          'Type': Object.keys(dataWithPosition).map(key => typeof dataWithPosition[key]), // Assurez-vous que les types sont corrects
          'login': 'user_login', // Remplacez par le login de l'utilisateur
          'Date_Insertion': new Date().toISOString(),
          'LG': longitude,
          'LT': latitude,
          ...dataWithPosition,
        };

        console.log('Données à envoyer:', postData);

        const response = await axios.post('https://demo-swedd.org/api/InsertionFormulaire.php', postData);

        console.log('Réponse de l\'API:', response.data);

        // Vérifier si la réponse de l'API contient une erreur
        if (response.status === 200 && response.data.error === undefined) {
          deleteItem(i);

          Toast.show({
            type: 'success',
            text1: 'Succès',
            text2: 'Les données ont été envoyées avec succès.'
          });
        } else {
          // Si la réponse de l'API contient une erreur, arrêter le processus et afficher une alerte
          throw new Error(response.data.error || 'Erreur lors de l\'envoi des données');
        }

        // Mettre à jour la progression
        setProgress(((i + 1) / totalItems) * 100);
      } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);

        // Afficher une alerte pour informer l'utilisateur de l'erreur
        Alert.alert(
          'Erreur',
          error.message || 'Une erreur est survenue lors de l\'envoi des données. Veuillez réessayer plus tard.',
          [{ text: 'OK' }]
        );

        // Arrêter l'envoi des données et réinitialiser l'état de chargement
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.progressText}>{`Envoi en cours: ${Math.round(progress)}%`}</Text>
        </View>
      )}
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
                {`${columnMapping.col0}: ${item.col0}`}
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
                  .filter(([key]) => key !== 'id')
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
      <TouchableOpacity style={styles.sendButton} onPress={sendData}>
        <Text style={styles.sendButtonText}>Envoyer les données</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
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
  sendButton: {
    backgroundColor: '#009900',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SavedDataScreen;
