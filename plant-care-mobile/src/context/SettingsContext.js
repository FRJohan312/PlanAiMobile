import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@plantcare_settings';

const defaultSettings = {
    theme: 'dark', // 'dark' | 'light'
    fontSize: 'normal', // 'small' | 'normal' | 'large'
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem(SETTINGS_KEY);
            if (saved) {
                setSettings(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (newSettings) => {
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
    };

    const getColors = () => {
        if (settings.theme === 'light') {
            return {
                background: ['#f8fafc', '#e2e8f0', '#cbd5e1'],
                cardBg: 'rgba(0, 0, 0, 0.05)',
                text: '#1e293b',
                textSecondary: '#64748b',
                buttonBg: ['#10b981', '#059669'],
                userBubble: '#3b82f6',
                assistantBubble: 'rgba(0, 0, 0, 0.08)',
                userText: '#fff',
                assistantText: '#1e293b',
                border: 'rgba(0, 0, 0, 0.1)',
                inputBg: 'rgba(0, 0, 0, 0.05)',
                inputText: '#1e293b',
                placeholder: '#94a3b8',
            };
        } else {
            return {
                background: ['#0f172a', '#1e293b', '#334155'],
                cardBg: 'rgba(255, 255, 255, 0.05)',
                text: '#fff',
                textSecondary: '#94a3b8',
                buttonBg: ['#10b981', '#059669'],
                userBubble: '#3b82f6',
                assistantBubble: 'rgba(255, 255, 255, 0.95)',
                userText: '#fff',
                assistantText: '#1e293b',
                border: 'rgba(255, 255, 255, 0.1)',
                inputBg: 'rgba(255, 255, 255, 0.1)',
                inputText: '#fff',
                placeholder: '#64748b',
            };
        }
    };

    const getFontSizes = () => {
        const multiplier = settings.fontSize === 'small' ? 0.9 : settings.fontSize === 'large' ? 1.15 : 1;
        return {
            small: 12 * multiplier,
            normal: 15 * multiplier,
            medium: 18 * multiplier,
            large: 22 * multiplier,
            xlarge: 28 * multiplier,
            xxlarge: 42 * multiplier,
        };
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSetting,
                getColors,
                getFontSizes,
                loading,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};
