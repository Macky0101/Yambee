import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './Styles';

const ClasseurDetails = ({ route }) => {
  const { classeur } = route.params;

  const renderFiche = ({ item }) => (
    <View style={styles.ficheContainer}>
      <Text style={styles.ficheTitle}>{item.title}</Text>
      <Text style={styles.ficheContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{classeur['Libelle classeur']}</Text>
      <Text style={styles.description}>{classeur['Note classeur']}</Text>
      <FlatList
        data={classeur['fiches classeur']}
        renderItem={renderFiche}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.noFiches}>Pas de fiches disponibles</Text>}
      />
    </View>
  );
};

export default ClasseurDetails;


