import axios from 'axios';

// Configuración de la API
// IMPORTANTE: Cambiar por tu IP local cuando ejecutes en dispositivo físico
// Para encontrar tu IP: Windows -> ipconfig | Mac/Linux -> ifconfig
const API_BASE_URL = 'http://10.43.31.249:8000/';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 segundos para análisis de imágenes
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Verifica el estado del backend
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

/**
 * Obtiene las capacidades disponibles del backend
 */
export const getCapabilities = async () => {
  try {
    const response = await api.get('/api/capabilities');
    return response.data;
  } catch (error) {
    console.error('Error getting capabilities:', error);
    throw error;
  }
};

/**
 * Analiza una imagen de planta
 * @param {Object} imageFile - Objeto de imagen con uri, name, type
 * @param {string} userActions - Descripción de acciones del usuario
 */
export const analyzePlant = async (imageFile, userActions = '') => {
  try {
    const formData = new FormData();

    // Añadir imagen
    formData.append('image', {
      uri: imageFile.uri,
      name: imageFile.name || 'plant_image.jpg',
      type: imageFile.type || 'image/jpeg',
    });

    // Añadir acciones del usuario
    formData.append('user_actions', userActions);

    const response = await api.post('/api/analyze-plant', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error analyzing plant:', error.response?.data || error.message);

    // Manejar errores específicos
    if (error.response?.status === 503) {
      throw new Error('El análisis de imágenes no está disponible en este momento. Intenta usar el chat.');
    }

    throw error;
  }
};

/**
 * Envía un mensaje al chat
 * @param {string} message - Mensaje del usuario
 * @param {Array} history - Historial de mensajes previos
 */
export const sendChatMessage = async (message, history = []) => {
  try {
    const response = await api.post('/api/chat', {
      message,
      history,
    });

    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export default api;
