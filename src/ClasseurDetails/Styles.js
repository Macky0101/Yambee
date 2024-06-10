import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 16,
          backgroundColor: '#f8f8f8',
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 16,
        },
        description: {
          fontSize: 16,
          color: '#666666',
          marginBottom: 16,
        },
        ficheContainer: {
          padding: 16,
          marginBottom: 16,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          elevation: 2,
        },
        ficheTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 8,
        },
        ficheContent: {
          fontSize: 14,
          color: '#666666',
        },
        noFiches: {
          fontSize: 16,
          textAlign: 'center',
          color: '#666666',
          marginTop: 20,
        },
});
export default styles;