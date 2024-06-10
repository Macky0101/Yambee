import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://bd-mcipme.org/bd-services/public/api';

const axiosInstance = axios.create({
    baseURL,
});

export const login = async (email, password, navigation) => {
    try {
        const response = await axiosInstance.post('/system/login', { email, password });       
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
};