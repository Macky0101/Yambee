import axios from 'axios';

const baseURL = 'https://demo-swedd.org/api';

const axiosInstance = axios.create({
    baseURL,
});

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post('/login.php', { login: email, pass: password });
        console.log('response', response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
};

export const ListClasseur = async (clp_structure) => {
    try {
        const response = await axiosInstance.get(`/classeur.php?Partenaire=${clp_structure}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des classeurs:', error);
        throw error;
    }
};




export const getFeuille = async (classeurId, clp_structure) => {
  try {
    const response = await axios.get(`https://demo-swedd.org/api/feuille.php`, {
      params: {
        Classeur: classeurId,
        Partenaire: clp_structure,
      },
    });

    return response.data; 
  } catch (error) {
    console.error('Erreur lors de la récupération de la feuille:', error);
    throw error; 
  }
};



export const getFormulaire = async (codeFeuille) => {
  try {
      const response = await axios.get(`${baseURL}/classeurfiche.php`, {
          params: {
              code_feuille: codeFeuille,
          },
      });
      return response.data;
  } catch (error) {
      console.error('Erreur lors de la récupération du formulaire:', error);
      throw error;
  }
};