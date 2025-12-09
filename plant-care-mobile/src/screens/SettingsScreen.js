import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettings } from '../context/SettingsContext';

const SettingsScreen = ({ navigation }) => {
    const { settings, updateSetting, getColors, getFontSizes } = useSettings();
    const colors = getColors();
    const fonts = getFontSizes();

    const renderOption = (title, options, currentValue, settingKey) => {
        return (
            <View style={[styles.section, { borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fonts.medium }]}>
                    {title}
                </Text>
                <View style={styles.optionsContainer}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.option,
                                {
                                    backgroundColor:
                                        currentValue === option.value ? colors.buttonBg[0] : colors.cardBg,
                                    borderColor: currentValue === option.value ? colors.buttonBg[0] : colors.border,
                                },
                            ]}
                            onPress={() => updateSetting(settingKey, option.value)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    {
                                        color: currentValue === option.value ? '#fff' : colors.text,
                                        fontSize: fonts.normal,
                                    },
                                ]}
                            >
                                {option.icon} {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <LinearGradient colors={colors.background} style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.backButton, { backgroundColor: colors.cardBg }]}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text, fontSize: fonts.large }]}>
                    Configuración
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Tema */}
                {renderOption(
                    '🌓 Tema',
                    [
                        { label: 'Oscuro', value: 'dark', icon: '🌙' },
                        { label: 'Claro', value: 'light', icon: '☀️' },
                    ],
                    settings.theme,
                    'theme'
                )}

                {/* Tamaño de Fuente */}
                {renderOption(
                    '📏 Tamaño de Texto',
                    [
                        { label: 'Pequeño', value: 'small', icon: '🔍' },
                        { label: 'Normal', value: 'normal', icon: '📄' },
                        { label: 'Grande', value: 'large', icon: '🔎' },
                    ],
                    settings.fontSize,
                    'fontSize'
                )}

                {/* Vista Previa */}
                <View style={[styles.section, { borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fonts.medium }]}>
                        👁️ Vista Previa
                    </Text>
                    <View style={[styles.preview, { backgroundColor: colors.cardBg }]}>
                        <Text style={[styles.previewTitle, { color: colors.text, fontSize: fonts.medium }]}>
                            PlantCare AI
                        </Text>
                        <Text style={[styles.previewText, { color: colors.textSecondary, fontSize: fonts.normal }]}>
                            Este es un ejemplo de cómo se verá el texto con tu configuración actual.
                        </Text>

                        {/* Message Preview */}
                        <View style={styles.messagesPreview}>
                            <View style={[styles.previewBubble, { backgroundColor: colors.userBubble }]}>
                                <Text style={[styles.previewBubbleText, { color: '#fff', fontSize: fonts.normal }]}>
                                    ¿Cómo cuido una suculenta?
                                </Text>
                            </View>
                            <View style={[styles.previewBubble, { backgroundColor: colors.assistantBubble }]}>
                                <Text style={[styles.previewBubbleText, { color: colors.assistantText, fontSize: fonts.normal }]}>
                                    Las suculentas necesitan luz indirecta y poco riego. ¡Perfecto para principiantes! 🌵
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Info */}
                <View style={styles.infoSection}>
                    <Text style={[styles.infoText, { color: colors.textSecondary, fontSize: fonts.small }]}>
                        Los cambios se aplican inmediatamente y se guardan automáticamente.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
    headerTitle: {
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 25,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 15,
    },
    optionsContainer: {
        gap: 10,
    },
    option: {
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
    },
    optionText: {
        fontWeight: '600',
        textAlign: 'center',
    },
    preview: {
        padding: 20,
        borderRadius: 12,
        marginTop: 10,
    },
    previewTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    previewText: {
        lineHeight: 22,
        marginBottom: 20,
    },
    messagesPreview: {
        gap: 10,
    },
    previewBubble: {
        padding: 12,
        borderRadius: 12,
        maxWidth: '80%',
    },
    previewBubbleText: {
        lineHeight: 20,
    },
    infoSection: {
        paddingHorizontal: 10,
    },
    infoText: {
        textAlign: 'center',
        lineHeight: 18,
    },
});

export default SettingsScreen;
