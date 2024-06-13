import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { getFeuille } from '../../Services/AuthServices';

const ClasseurDetails = ({ route }) => {
  const { classeur } = route.params;
  const navigation = useNavigation();
  const [feuilles, setFeuilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storeClasseurDetails = async () => {
      try {
        await AsyncStorage.setItem(`classeur_${classeur['Id']}`, JSON.stringify(classeur));
      } catch (error) {
        console.error('Erreur lors du stockage des détails du classeur:', error);
      }
    };

    const fetchFeuilles = async () => {
      try {
        setLoading(true);
        const clp_structure = await AsyncStorage.getItem('clp_structure');
        const response = await getFeuille(classeur['Id'], clp_structure);
        console.log('Réponse des feuilles:', response);
        if (response && response.classeur) {
          setFeuilles(response.classeur);
          await AsyncStorage.setItem(`feuilles_${classeur['Id']}`, JSON.stringify(response.classeur));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des feuilles:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadLocalData = async () => {
      try {
        const storedFeuilles = await AsyncStorage.getItem(`feuilles_${classeur['Id']}`);
        if (storedFeuilles) {
          setFeuilles(JSON.parse(storedFeuilles));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données locales:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleConnectivityChange = (state) => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Connexion perdue',
          text2: 'Vous êtes hors connexion. Les données peuvent ne pas être à jour.'
        });
      } else {
        fetchFeuilles();
      }
    };

    storeClasseurDetails();
    NetInfo.fetch().then(handleConnectivityChange);
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    loadLocalData();

    return () => {
      unsubscribe();
    };
  }, [classeur]);

  const navigateToFeuilleDetail = (feuille) => {
    navigation.navigate('FeuilleDetail', { codeFeuille: feuille['Code_Feuille'] });
  };

  const renderFeuille = ({ item }) => (
    <TouchableOpacity
      style={styles.feuilleContainer}
      onPress={() => navigateToFeuilleDetail(item)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📄</Text> 
      </View>
      <View style={styles.feuilleContent}>
        <Text style={styles.libelleFeuille}>{item['Nom_Feuille']}</Text>
        <Text style={styles.dateInsertion}>{item['Date_Insertion']}</Text>
      </View>
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
      {feuilles.length === 0 ? (
        <Text>Aucune feuille disponible pour ce classeur</Text>
      ) : (
        <FlatList
          data={feuilles}
          renderItem={renderFeuille}
          keyExtractor={(item) => item['Code_Feuille']}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  libelleClasseur: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteClasseur: {
    marginBottom: 16,
  },
  feuilleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#dddddd',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  feuilleContent: {
    flex: 1,
    paddingVertical: 16,
  },
  libelleFeuille: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nomFeuille: {
    fontSize: 14,
    marginBottom: 2,
  },
  dateInsertion: {
    fontSize: 12,
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    flexGrow: 1,
  },
});

export default ClasseurDetails;


////////////////////////////////////////////////////////////////


// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getFeuille } from '../../Services/AuthServices';

// const ClasseurDetails = ({ route }) => {
//   const { classeur } = route.params;
//   const navigation = useNavigation();
//   const [feuilles, setFeuilles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeuilles = async () => {
//       try {
//         setLoading(true);
//         const clp_structure = await AsyncStorage.getItem('clp_structure');
//         const response = await getFeuille(classeur['Id'], clp_structure);
//         console.log('Réponse des feuilles:', response);
//         if (response && response.classeur) {
//           setFeuilles(response.classeur);
//         }
//       } catch (error) {
//         console.error('Erreur lors de la récupération des feuilles:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeuilles();
//   }, [classeur]);

//   const navigateToFeuilleDetail = (feuille) => {
//     navigation.navigate('FeuilleDetail', { feuille });
//   };

//   const renderFeuille = ({ item, index }) => (
//     <TouchableOpacity
//       style={[
//         styles.feuilleContainer,
//         index % 2 === 1 ? styles.feuilleContainerRight : null
//       ]}
//       onPress={() => navigateToFeuilleDetail(item)}
//     >
//       <View style={styles.fileIcon}>
//         <View style={styles.fileFold}></View>
//         {/* <Text style={styles.libelleFeuille}>{item['Libelle_Feuille']}</Text> */}
//         <Text style={styles.libelleFeuille}>{item['Nom_Feuille']}</Text>
//         <Text style={styles.dateInsertion}>{item['Date_Insertion']}</Text>
//       </View>
//     </TouchableOpacity>
//   );
  
  
  
  

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#405189" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.libelleClasseur}>{classeur['Libelle_classeur']}</Text>
//       <Text style={styles.noteClasseur}>{classeur['Note_classeur']}</Text>
//       {feuilles.length === 0 ? (
//         <Text>Aucune feuille disponible pour ce classeur</Text>
//       ) : (
//         <FlatList
//           data={feuilles}
//           renderItem={renderFeuille}
//           keyExtractor={(item) => item['Code_Feuille']}
//           contentContainerStyle={styles.flatListContainer}
//           numColumns={2}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#F5F5F5',
//   },
//   libelleClasseur: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   noteClasseur: {
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   flatListContainer: {
//     paddingBottom: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   feuilleContainer: {
//     flex: 1,
//     maxWidth: '50%',
//     margin: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   feuilleContainerRight: {
//     marginRight: 0,
//   },
//   fileIcon: {
//     width: '100%',
//     aspectRatio: 0.75, // Adjust this to maintain the aspect ratio
//     backgroundColor: '#e3eafc',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     padding: 5,
//   },
//   fileLabel: {
//     fontSize: 10,
//     color: '#405189',
//     textAlign: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   fileFold: {
//     width: '30%',
//     height: '30%',
//     backgroundColor: '#b0c4de',
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     borderTopRightRadius: 10,
//   },
//   libelleFeuille: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   nomFeuille: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   dateInsertion: {
//     fontSize: 12,
//     color: '#757575',
//     textAlign: 'center',
//   },
// });





// export default ClasseurDetails;
