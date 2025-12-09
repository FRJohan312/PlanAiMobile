import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettings } from '../context/SettingsContext';

const HomeScreen = ({ navigation }) => {
    const { getColors, getFontSizes } = useSettings();
    const colors = getColors();
    const fonts = getFontSizes();

    const handleStartChat = () => {
        navigation.navigate('Chat');
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient colors={colors.background} style={styles.gradient}>
                {/* Settings Button */}
                <TouchableOpacity
                    style={[styles.settingsButton, { backgroundColor: colors.cardBg }]}
                    onPress={handleSettings}
                    activeOpacity={0.7}
                >
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>

                {/* Logo y Título */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🌿</Text>
                    <Text style={[styles.title, { color: colors.text, fontSize: fonts.xxlarge }]}>
                        PlantCare AI
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: fonts.normal }]}>
                        Tu asistente personal de plantas
                    </Text>
                </View>

                {/* Botón Principal Grande */}
                <View style={styles.mainContent}>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStartChat}
                        activeOpacity={0.8}
                    >
                        <LinearGradient colors={colors.buttonBg} style={styles.buttonGradient}>
                            <Text style={styles.buttonIcon}>💬</Text>
                            <Text style={[styles.buttonText, { fontSize: fonts.xlarge }]}>Comenzar</Text>
                            <Text style={[styles.buttonSubtext, { fontSize: fonts.small }]}>
                                Analiza • Pregunta • Aprende
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Features */}
                    <View style={styles.features}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📸</Text>
                            <Text style={[styles.featureText, { color: colors.textSecondary, fontSize: fonts.small - 1 }]}>
                                Análisis de fotos
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>💡</Text>
                            <Text style={[styles.featureText, { color: colors.textSecondary, fontSize: fonts.small - 1 }]}>
                                Consejos expertos
                            </Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🔍</Text>
                            <Text style={[styles.featureText, { color: colors.textSecondary, fontSize: fonts.small - 1 }]}>
                                Identificación
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary, fontSize: fonts.small - 1 }]}>
                        Hecho por Johan Gómez y Tomas Mejia
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'space-between',
    },
    settingsButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    settingsIcon: {
        fontSize: 28,
    },
    header: {
        alignItems: 'center',
        paddingTop: 80,
    },
    logo: {
        fontSize: 120,
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {},
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    startButton: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 15,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        marginBottom: 50,
    },
    buttonGradient: {
        paddingVertical: 30,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    buttonIcon: {
        fontSize: 50,
        marginBottom: 10,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    buttonSubtext: {
        color: 'rgba(255, 255, 255, 0.9)',
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: 400,
    },
    featureItem: {
        alignItems: 'center',
        flex: 1,
    },
    featureIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    featureText: {
        textAlign: 'center',
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    footerText: {},
});

export default HomeScreen;
