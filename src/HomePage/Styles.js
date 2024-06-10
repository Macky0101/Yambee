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
      textAlign: 'center',
    },
    classeurContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 16,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      elevation: 2,
    },
    colorIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 16,
    },
    classeurTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default styles