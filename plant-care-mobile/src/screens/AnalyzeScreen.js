import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { analyzePlant } from '../services/api';

const AnalyzeScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [userActions, setUserActions] = useState('');
    const [loading, setLoading] = useState(false);

    const pickImage = async (useCamera = false) => {
        try {
            let result;

            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permiso necesario',
                        'Se necesita permiso para acceder a la cámara',
                        [{ text: 'OK' }]
                    );
                    return;
                }

                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permiso necesario',
                        'Se necesita permiso para acceder a la galería',
                        [{ text: 'OK' }]
                    );
                    return;
                }

                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });
            }

            if (!result.canceled) {
                setImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const handleAnalyze = async () => {
        if (!image) {
            Alert.alert('Error', 'Por favor selecciona una imagen primero');
            return;
        }

        setLoading(true);

        try {
            const imageFile = {
                uri: image.uri,
                name: 'plant_image.jpg',
                type: 'image/jpeg',
            };

            const result = await analyzePlant(imageFile, userActions);

            setLoading(false);

            if (result.success) {
                navigation.navigate('Results', { results: result });
            } else {
                Alert.alert('Error', result.error || 'No se pudo analizar la planta');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error analyzing plant:', error);
            Alert.alert(
                'Error',
                error.message || 'No se pudo analizar la planta. Verifica la conexión con el backend.'
            );
        }
    };

    return (
        <LinearGradient
            colors={['#1a5f3a', '#2d8f5c', '#4ade80']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>📸 Analizar Planta</Text>
                        <Text style={styles.subtitle}>
                            Toma una foto o selecciona una de tu galería
                        </Text>
                    </View>

                    {/* Image Preview */}
                    <View style={styles.imageContainer}>
                        {image ? (
                            <Image source={{ uri: image.uri }} style={styles.image} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.placeholderEmoji}>🌿</Text>
                                <Text style={styles.placeholderText}>
                                    Sin imagen seleccionada
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Image Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.imageButton}
                            onPress={() => pickImage(true)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#10b981', '#059669']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonEmoji}>📷</Text>
                                <Text style={styles.buttonText}>Cámara</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.imageButton}
                            onPress={() => pickImage(false)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#3b82f6', '#2563eb']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonEmoji}>🖼️</Text>
                                <Text style={styles.buttonText}>Galería</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* User Actions Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>
                            ¿Cómo has cuidado tu planta? (Opcional)
                        </Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ej: La riego cada 3 días, está en interior con luz indirecta"
                            placeholderTextColor="#94a3b8"
                            value={userActions}
                            onChangeText={setUserActions}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    {/* Analyze Button */}
                    <TouchableOpacity
                        style={styles.analyzeButton}
                        onPress={handleAnalyze}
                        disabled={loading || !image}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={
                                loading || !image
                                    ? ['#94a3b8', '#64748b']
                                    : ['#f59e0b', '#d97706']
                            }
                            style={styles.analyzeGradient}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator color="#fff" size="small" />
                                    <Text style={styles.analyzeText}>Analizando...</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.analyzeEmoji}>🔍</Text>
                                    <Text style={styles.analyzeText}>Analizar Planta</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Tips */}
                    <View style={styles.tipsContainer}>
                        <Text style={styles.tipsTitle}>💡 Consejos para mejores resultados:</Text>
                        <Text style={styles.tipText}>• Toma la foto con buena iluminación</Text>
                        <Text style={styles.tipText}>• Captura la planta completa o las partes afectadas</Text>
                        <Text style={styles.tipText}>• Describe cómo la has estado cuidando</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#e0f2fe',
        textAlign: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 300,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderEmoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    placeholderText: {
        fontSize: 16,
        color: '#e0f2fe',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    imageButton: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonGradient: {
        padding: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonEmoji: {
        fontSize: 24,
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 15,
        fontSize: 14,
        color: '#1e293b',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    analyzeButton: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    analyzeGradient: {
        padding: 18,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    analyzeEmoji: {
        fontSize: 24,
        marginRight: 10,
    },
    analyzeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    tipsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 15,
        padding: 15,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    tipText: {
        fontSize: 14,
        color: '#e0f2fe',
        marginBottom: 5,
    },
});

export default AnalyzeScreen;
