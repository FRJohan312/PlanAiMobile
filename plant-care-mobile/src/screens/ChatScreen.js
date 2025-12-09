import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Image,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { sendChatMessage, analyzePlant } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const CHAT_HISTORY_KEY = '@plantcare_chat_history';

const ChatScreen = ({ navigation }) => {
    const { getColors, getFontSizes } = useSettings();
    const colors = getColors();
    const fonts = getFontSizes();

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: '¡Hola! 👋 Soy PlantCare AI, tu asistente personal de plantas.\n\n¿Cómo puedo ayudarte hoy?\n\n💬 Hazme cualquier pregunta sobre plantas\n📸 O envía una foto para análisis completo',
            type: 'text',
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const scrollViewRef = useRef();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadChatHistory();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        saveChatHistory();
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadChatHistory = async () => {
        try {
            const savedHistory = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                if (parsedHistory.length > 1) {
                    setMessages(parsedHistory);
                }
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const saveChatHistory = async () => {
        try {
            await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    };

    const clearChatHistory = () => {
        Alert.alert(
            '🗑️ Limpiar Conversación',
            '¿Borrar todo el historial?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Borrar',
                    style: 'destructive',
                    onPress: async () => {
                        const initialMessage = {
                            role: 'assistant',
                            content: '¡Hola! 👋 Soy PlantCare AI, tu asistente personal de plantas.\n\n¿Cómo puedo ayudarte hoy?\n\n💬 Hazme cualquier pregunta sobre plantas\n📸 O envía una foto para análisis completo',
                            type: 'text',
                        };
                        setMessages([initialMessage]);
                        await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
                    },
                },
            ]
        );
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const pickImage = async (useCamera = false) => {
        try {
            let result;

            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permiso necesario', 'Necesitamos acceso a tu cámara');
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
                    Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería');
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
                setSelectedImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const handleSendImage = async () => {
        if (!selectedImage) return;

        const userDescription = inputText.trim() || 'Sin descripción';
        setInputText('');

        const userMessage = {
            role: 'user',
            content: userDescription,
            type: 'image',
            image: selectedImage.uri,
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setSelectedImage(null);
        setLoading(true);

        try {
            const imageFile = {
                uri: selectedImage.uri,
                name: 'plant_image.jpg',
                type: 'image/jpeg',
            };

            const result = await analyzePlant(imageFile, userDescription);
            setLoading(false);

            if (result.success) {
                let responseText = `🔍 **Identificación**\n${result.plant_name || 'No identificada'}`;

                if (result.scientific_name) {
                    responseText += `\n_(${result.scientific_name})_`;
                }

                if (result.health_score !== undefined) {
                    const healthEmoji = result.health_score >= 8 ? '💚' : result.health_score >= 6 ? '🟡' : '❤️';
                    responseText += `\n\n${healthEmoji} **Salud:** ${result.health_score}/10`;
                }

                if (result.diagnosis) {
                    responseText += `\n\n🩺 **Diagnóstico**\n`;
                    if (typeof result.diagnosis === 'string') {
                        responseText += result.diagnosis;
                    } else {
                        if (result.diagnosis.summary) {
                            responseText += result.diagnosis.summary;
                        }
                        if (result.diagnosis.visual_problems) {
                            responseText += `\n\n🔍 ${result.diagnosis.visual_problems}`;
                        }
                    }
                }

                if (result.recommendations && result.recommendations.length > 0) {
                    responseText += `\n\n💡 **Recomendaciones**\n`;
                    result.recommendations.forEach((rec, i) => {
                        responseText += `${i + 1}. ${rec}\n`;
                    });
                }

                const assistantMessage = {
                    role: 'assistant',
                    content: responseText,
                    type: 'analysis',
                    analysisData: result,
                };

                setMessages([...newMessages, assistantMessage]);
            } else {
                setMessages([
                    ...newMessages,
                    {
                        role: 'assistant',
                        content: '❌ No se pudo analizar la imagen. Por favor, intenta de nuevo.',
                        type: 'text',
                    },
                ]);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error analyzing plant:', error);
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: '❌ Error al conectar con el servidor. Verifica tu conexión.',
                    type: 'text',
                },
            ]);
        }
    };

    const handleSendText = async () => {
        if (!inputText.trim()) return;

        const userMessage = inputText.trim();
        setInputText('');

        const newMessages = [
            ...messages,
            { role: 'user', content: userMessage, type: 'text' },
        ];
        setMessages(newMessages);
        setLoading(true);

        try {
            const history = newMessages.slice(1).map(msg => ({
                role: msg.role,
                content: msg.content,
            }));

            const response = await sendChatMessage(userMessage, history);
            setLoading(false);

            if (response.success) {
                setMessages([
                    ...newMessages,
                    { role: 'assistant', content: response.response, type: 'text' },
                ]);
            } else {
                setMessages([
                    ...newMessages,
                    {
                        role: 'assistant',
                        content: '❌ Error al procesar tu mensaje. Intenta de nuevo.',
                        type: 'text',
                    },
                ]);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error sending message:', error);
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: '❌ No se pudo conectar con el servidor.',
                    type: 'text',
                },
            ]);
        }
    };

    const handleSend = () => {
        if (selectedImage) {
            handleSendImage();
        } else {
            handleSendText();
        }
    };

    const renderMessage = (message, index) => {
        const isUser = message.role === 'user';

        return (
            <View
                key={index}
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
                ]}
            >
                {!isUser && (
                    <View style={[styles.avatarContainer, { backgroundColor: colors.cardBg }]}>
                        <Text style={styles.avatar}>🌿</Text>
                    </View>
                )}

                <View
                    style={[
                        styles.messageBubble,
                        {
                            backgroundColor: isUser ? colors.userBubble : colors.assistantBubble,
                        },
                    ]}
                >
                    {message.image && (
                        <Image source={{ uri: message.image }} style={styles.messageImage} />
                    )}

                    <Text
                        style={[
                            styles.messageText,
                            {
                                color: isUser ? colors.userText : colors.assistantText,
                                fontSize: fonts.normal,
                            },
                        ]}
                    >
                        {message.content}
                    </Text>
                </View>

                {isUser && (
                    <View style={[styles.avatarContainer, { backgroundColor: colors.cardBg }]}>
                        <Text style={styles.avatar}>👤</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <LinearGradient colors={colors.background} style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Header */}
                <Animated.View style={[styles.header, { opacity: fadeAnim, borderBottomColor: colors.border }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={[styles.backButton, { backgroundColor: colors.cardBg }]}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={[styles.headerTitle, { color: colors.text, fontSize: fonts.medium }]}>
                            PlantCare AI
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: fonts.small }]}>
                            Asistente Inteligente 🌱
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.clearButton, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}
                        onPress={clearChatHistory}
                    >
                        <Text style={styles.clearButtonIcon}>🗑️</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    onContentSizeChange={scrollToBottom}
                >
                    {messages.map((message, index) => renderMessage(message, index))}

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <View style={[styles.loadingBubble, { backgroundColor: colors.assistantBubble }]}>
                                <ActivityIndicator color={colors.buttonBg[0]} size="small" />
                                <Text style={[styles.loadingText, { color: colors.assistantText, fontSize: fonts.small }]}>
                                    Analizando...
                                </Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Image Preview */}
                {selectedImage && (
                    <View style={[styles.imagePreviewContainer, { borderTopColor: colors.border }]}>
                        <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => setSelectedImage(null)}
                        >
                            <Text style={styles.removeImageText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Input Area */}
                <View style={[styles.inputArea, { borderTopColor: colors.border, backgroundColor: colors.cardBg }]}>
                    <View style={styles.inputRow}>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: colors.inputBg }]}
                            onPress={() => pickImage(false)}
                        >
                            <Text style={styles.iconButtonText}>🖼️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: colors.inputBg }]}
                            onPress={() => pickImage(true)}
                        >
                            <Text style={styles.iconButtonText}>📷</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.inputBg,
                                    color: colors.inputText,
                                    fontSize: fonts.normal,
                                },
                            ]}
                            placeholder={selectedImage ? 'Describe tu planta...' : 'Escribe tu pregunta...'}
                            placeholderTextColor={colors.placeholder}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />

                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled,
                            ]}
                            onPress={handleSend}
                            disabled={loading || (!inputText.trim() && !selectedImage)}
                        >
                            <LinearGradient
                                colors={
                                    loading || (!inputText.trim() && !selectedImage)
                                        ? ['#475569', '#334155']
                                        : colors.buttonBg
                                }
                                style={styles.sendGradient}
                            >
                                <Text style={styles.sendIcon}>{selectedImage ? '📤' : '💬'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Actions */}
                    <ScrollView
                        horizontal
                        style={styles.quickActions}
                        contentContainerStyle={styles.quickActionsContent}
                        showsHorizontalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={[styles.quickAction, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                            onPress={() => setInputText('¿Cómo cuido una suculenta')}
                        >
                            <Text style={[styles.quickActionText, { color: colors.buttonBg[0], fontSize: fonts.small - 1 }]}>
                                🌵 Suculentas
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickAction, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                            onPress={() => setInputText('¿Por qué se ponen amarillas las hojas?')}
                        >
                            <Text style={[styles.quickActionText, { color: colors.buttonBg[0], fontSize: fonts.small - 1 }]}>
                                🍂 Hojas amarillas
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickAction, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                            onPress={() => setInputText('¿Cada cuánto regar?')}
                        >
                            <Text style={[styles.quickActionText, { color: colors.buttonBg[0], fontSize: fonts.small - 1 }]}>
                                💧 Riego
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickAction, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                            onPress={() => pickImage(true)}
                        >
                            <Text style={[styles.quickActionText, { color: colors.buttonBg[0], fontSize: fonts.small - 1 }]}>
                                📸 Analizar foto
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 24,
        color: '#fff',
    },
    headerCenter: {
        flex: 1,
        marginHorizontal: 15,
    },
    headerTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtitle: {
        textAlign: 'center',
        marginTop: 2,
    },
    clearButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonIcon: {
        fontSize: 20,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 15,
        paddingBottom: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-end',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    assistantMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
    },
    avatar: {
        fontSize: 20,
    },
    messageBubble: {
        maxWidth: '70%',
        padding: 12,
        borderRadius: 18,
    },
    messageImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 8,
    },
    messageText: {
        lineHeight: 22,
    },
    loadingContainer: {
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    loadingBubble: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 18,
        alignItems: 'center',
    },
    loadingText: {
        marginLeft: 10,
    },
    imagePreviewContainer: {
        padding: 15,
        position: 'relative',
        borderTopWidth: 1,
    },
    imagePreview: {
        width: '100%',
        height: 150,
        borderRadius: 15,
    },
    removeImageButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputArea: {
        borderTopWidth: 1,
    },
    inputRow: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'flex-end',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    iconButtonText: {
        fontSize: 22,
    },
    input: {
        flex: 1,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendIcon: {
        fontSize: 20,
    },
    quickActions: {
        maxHeight: 50,
    },
    quickActionsContent: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    quickAction: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    quickActionText: {
        fontWeight: '600',
    },
});

export default ChatScreen;
