import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://demo-swedd.org/api';

const axiosInstance = axios.create({
    baseURL,
});

export const login = async (email, password, navigation) => {
    try {
        const response = await axiosInstance.post('', { email, password });       
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
};


export const ListClasseur = async () => {
    try {
      const response = await axiosInstance.get(`/classeur.php?classeur=true`);
      console.log('Liste des Classeur:', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
