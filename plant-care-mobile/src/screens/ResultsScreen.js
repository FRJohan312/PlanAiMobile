import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ResultsScreen = ({ route, navigation }) => {
    const { results } = route.params;

    const getHealthColor = (score) => {
        if (score >= 8) return '#10b981';
        if (score >= 6) return '#f59e0b';
        return '#ef4444';
    };

    const getHealthEmoji = (score) => {
        if (score >= 8) return '💚';
        if (score >= 6) return '🟡';
        return '❤️';
    };

    // Función para renderizar el diagnóstico correctamente
    const renderDiagnosis = (diagnosis) => {
        // Si es string, retornarlo directamente
        if (typeof diagnosis === 'string') {
            return <Text style={styles.diagnosisText}>{diagnosis}</Text>;
        }

        // Si es objeto, renderizar cada parte
        if (typeof diagnosis === 'object' && diagnosis !== null) {
            return (
                <>
                    {diagnosis.summary && (
                        <Text style={styles.diagnosisText}>
                            {diagnosis.summary}
                        </Text>
                    )}

                    {diagnosis.visual_problems && (
                        <>
                            <Text style={[styles.diagnosisSubtitle, { marginTop: 15 }]}>
                                🔍 Problemas Visuales:
                            </Text>
                            <Text style={styles.diagnosisText}>
                                {diagnosis.visual_problems}
                            </Text>
                        </>
                    )}

                    {diagnosis.identified_issues && diagnosis.identified_issues.length > 0 && (
                        <>
                            <Text style={[styles.diagnosisSubtitle, { marginTop: 15 }]}>
                                ⚠️ Problemas Identificados:
                            </Text>
                            {diagnosis.identified_issues.map((issue, index) => (
                                <View key={index} style={styles.recommendationItem}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.diagnosisText}>{issue}</Text>
                                </View>
                            ))}
                        </>
                    )}
                </>
            );
        }

        return null;
    };

    return (
        <LinearGradient
            colors={['#1a5f3a', '#2d8f5c', '#4ade80']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>🌿 Resultados del Análisis</Text>
                </View>

                {/* Plant Identification */}
                {results.plant_name && (
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                            style={styles.cardGradient}
                        >
                            <Text style={styles.cardEmoji}>🔍</Text>
                            <Text style={styles.cardTitle}>Identificación</Text>
                            <Text style={styles.plantName}>{results.plant_name}</Text>
                            {results.scientific_name && (
                                <Text style={styles.scientificName}>
                                    ({results.scientific_name})
                                </Text>
                            )}
                            {results.confidence && (
                                <Text style={styles.confidence}>
                                    Confianza: {(results.confidence * 100).toFixed(1)}%
                                </Text>
                            )}
                        </LinearGradient>
                    </View>
                )}

                {/* Health Score */}
                {results.health_score !== undefined && (
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                            style={styles.cardGradient}
                        >
                            <Text style={styles.cardEmoji}>
                                {getHealthEmoji(results.health_score)}
                            </Text>
                            <Text style={styles.cardTitle}>Estado de Salud</Text>
                            <View style={styles.healthScoreContainer}>
                                <Text
                                    style={[
                                        styles.healthScore,
                                        { color: getHealthColor(results.health_score) },
                                    ]}
                                >
                                    {results.health_score}/10
                                </Text>
                            </View>
                            <View style={styles.healthBar}>
                                <View
                                    style={[
                                        styles.healthBarFill,
                                        {
                                            width: `${results.health_score * 10}%`,
                                            backgroundColor: getHealthColor(results.health_score),
                                        },
                                    ]}
                                />
                            </View>
                        </LinearGradient>
                    </View>
                )}

                {/* Diagnosis */}
                {results.diagnosis && (
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                            style={styles.cardGradient}
                        >
                            <Text style={styles.cardEmoji}>🩺</Text>
                            <Text style={styles.cardTitle}>Diagnóstico</Text>
                            {renderDiagnosis(results.diagnosis)}
                        </LinearGradient>
                    </View>
                )}

                {/* Recommendations */}
                {results.recommendations && results.recommendations.length > 0 && (
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                            style={styles.cardGradient}
                        >
                            <Text style={styles.cardEmoji}>💡</Text>
                            <Text style={styles.cardTitle}>Recomendaciones</Text>
                            {results.recommendations.map((rec, index) => (
                                <View key={index} style={styles.recommendationItem}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.recommendationText}>{rec}</Text>
                                </View>
                            ))}
                        </LinearGradient>
                    </View>
                )}

                {/* Final Response */}
                {results.final_response && (
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                            style={styles.cardGradient}
                        >
                            <Text style={styles.cardEmoji}>📝</Text>
                            <Text style={styles.cardTitle}>Análisis Completo</Text>
                            <Text style={styles.responseText}>{results.final_response}</Text>
                        </LinearGradient>
                    </View>
                )}

                {/* Action Buttons */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Analyze')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#10b981', '#059669']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>📸 Analizar otra planta</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Home')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>🏠 Volver al inicio</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
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
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    card: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    cardGradient: {
        padding: 20,
    },
    cardEmoji: {
        fontSize: 36,
        textAlign: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15,
    },
    plantName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    scientificName: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#e0f2fe',
        textAlign: 'center',
        marginBottom: 10,
    },
    confidence: {
        fontSize: 14,
        color: '#e0f2fe',
        textAlign: 'center',
    },
    healthScoreContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    healthScore: {
        fontSize: 48,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    healthBar: {
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 10,
        overflow: 'hidden',
    },
    healthBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    diagnosisText: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 24,
    },
    diagnosisSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    recommendationItem: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 16,
        color: '#fff',
        marginRight: 8,
        marginTop: 2,
    },
    recommendationText: {
        flex: 1,
        fontSize: 15,
        color: '#fff',
        lineHeight: 22,
    },
    responseText: {
        fontSize: 15,
        color: '#fff',
        lineHeight: 24,
    },
    button: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonGradient: {
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default ResultsScreen;
