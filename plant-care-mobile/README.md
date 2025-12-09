# 🌱 PlantCare Mobile - React Native con Expo Go

Aplicación móvil para Android del sistema PlantCare AI, construida con React Native y Expo Go.

## 📱 Características

- ✅ **Análisis de Plantas**: Captura fotos y obtén diagnóstico instantáneo
- ✅ **Chat con IA**: Pregunta sobre cuidado de plantas
- ✅ **Interfaz Moderna**: Diseño con gradientes y animaciones
- ✅ **Multiplataforma**: Compatible con Android e iOS

## 🚀 Inicio Rápido

### Pre-requisitos

1. **Node.js 16+** instalado
2. **Expo Go** app instalada en tu teléfono ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
3. **Backend PlantCare AI** ejecutándose (ver `../plant-care-ai-backend/README.md`)

### Instalación

```bash
# Navegar a la carpeta del proyecto
cd plant-care-mobile

# Instalar dependencias (ya instaladas si seguiste el proceso de creación)
npm install

# Iniciar el servidor de desarrollo
npm start
```

### Configurar IP del Backend

**IMPORTANTE**: Antes de ejecutar la app en tu dispositivo físico, debes configurar la IP de tu computadora.

1. **Encontrar tu IP local**:
   - **Windows**: Abre PowerShell y ejecuta `ipconfig`, busca "IPv4 Address"
   - **Mac/Linux**: Ejecuta `ifconfig`, busca "inet"
   - Ejemplo: `192.168.1.10`

2. **Actualizar el archivo API**:
   - Abre `src/services/api.js`
   - Cambia la línea 6: `const API_BASE_URL = 'http://192.168.1.10:8000';`
   - Reemplaza `192.168.1.10` con tu IP local

3. **Verificar que el backend esté corriendo**:
   ```bash
   # En otra terminal, navega al backend
   cd ../plant-care-ai-backend
   
   # Activa el entorno virtual
   venv\Scripts\activate
   
   # Inicia el backend
   python main.py
   ```

### Ejecutar la App

1. Ejecuta `npm start` en la carpeta `plant-care-mobile`
2. Escanea el QR con la app **Expo Go** en tu teléfono
3. Asegúrate de estar en la **misma red WiFi** que tu computadora
4. ¡Listo! 🎉

## 📂 Estructura del Proyecto

```
plant-care-mobile/
├── App.js                      # Punto de entrada con navegación
├── src/
│   ├── screens/               # Pantallas de la app
│   │   ├── HomeScreen.js      # Pantalla principal
│   │   ├── AnalyzeScreen.js   # Análisis de plantas
│   │   ├── ResultsScreen.js   # Resultados del análisis
│   │   └── ChatScreen.js      # Chat con IA
│   ├── services/              # Servicios
│   │   └── api.js             # Cliente API
│   └── components/            # Componentes reutilizables (futuro)
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

## 🎨 Pantallas

### 1. Home Screen (Inicio)
- Muestra las funcionalidades disponibles
- Estado del backend
- Navegación a análisis y chat

### 2. Analyze Screen (Análisis)
- Captura de foto con cámara
- Selección desde galería
- Campo de descripción de cuidados
- Envío para análisis

### 3. Results Screen (Resultados)
- Identificación de la planta
- Puntuación de salud (1-10)
- Diagnóstico completo
- Recomendaciones personalizadas

### 4. Chat Screen (Chat)
- Conversación con IA
- Historial de mensajes
- Respuestas basadas en RAG
- Prompts rápidos

## 🛠️ Tecnologías

- **React Native** - Framework móvil
- **Expo** - Herramientas y servicios
- **React Navigation** - Navegación entre pantallas
- **Expo Image Picker** - Captura/selección de imágenes
- **Expo Linear Gradient** - Gradientes
- **Axios** - Cliente HTTP

## 🐛 Troubleshooting

### La app no conecta con el backend

**Problema**: Error de conexión o timeout

**Soluciones**:
1. Verifica que el backend esté corriendo (`http://TU_IP:8000/docs`)
2. Asegúrate de haber cambiado la IP en `src/services/api.js`
3. Verifica que tu teléfono y PC estén en la **misma red WiFi**
4. Desactiva el firewall temporalmente o permite el puerto 8000
5. Intenta acceder a `http://TU_IP:8000/api/health` desde el navegador del teléfono

### Error al capturar foto

**Problema**: No se puede acceder a la cámara

**Soluciones**:
1. Asegúrate de dar permisos de cámara a Expo Go
2. En Android: Settings → Apps → Expo Go → Permissions → Cámara
3. Reinicia la app de Expo Go

### El análisis de imágenes no está disponible

**Problema**: Mensaje "image_analysis_unavailable"

**Soluciones**:
1. Verifica que el backend tenga configurado `GEMINI_API_KEY` en el `.env`
2. Revisa los logs del backend para ver si hay errores de API
3. Usa el chat para hacer preguntas sobre plantas mientras tanto

### Expo Go no carga el QR

**Problema**: El QR no se escanea

**Soluciones**:
1. Asegúrate de usar la app oficial **Expo Go** (no otra app de QR)
2. Verifica que estés en la misma red WiFi
3. Intenta usar el modo Tunnel: `npx expo start --tunnel`
4. Ingresa la URL manualmente en Expo Go

## 📖 Uso de la App

### Analizar una Planta

1. Toca "Analizar Planta" en la pantalla principal
2. Captura una foto con cámara o selecciona de galería
3. (Opcional) Describe cómo has cuidado la planta
4. Toca "Analizar Planta"
5. Espera 5-10 segundos
6. ¡Revisa los resultados! 🌿

### Usar el Chat

1. Toca "Chat con IA" en la pantalla principal
2. Escribe tu pregunta sobre plantas
3. O toca un prompt rápido
4. Recibe respuestas inteligentes basadas en la base de conocimiento

## 🔧 Desarrollo

### Agregar una nueva pantalla

1. Crea el archivo en `src/screens/NuevaPantalla.js`
2. Importa en `App.js`
3. Agrega la ruta en el `Stack.Navigator`

### Modificar estilos

Los estilos están en cada componente usando `StyleSheet`. Los colores principales son:
- Verde oscuro: `#1a5f3a`
- Verde medio: `#2d8f5c`
- Verde claro: `#4ade80`
- Azul: `#3b82f6`
- Naranja: `#f59e0b`

### Hot Reload

Expo tiene hot reload automático. Guarda los cambios y la app se actualizará automáticamente.

## 📝 Scripts Disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run android    # Abre en emulador Android (requiere Android Studio)
npm run ios        # Abre en simulador iOS (requiere Xcode, solo Mac)
```

## 🚢 Build para Producción

Para crear un APK/IPA para distribución:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 📄 Licencia

MIT License - Ver [../LICENSE](../LICENSE)

## 🙏 Agradecimientos

- Proyecto Final - Introducción a la Inteligencia Artificial
- React Native & Expo
- Google Gemini API
- Plant.id API

---

**¿Necesitas ayuda?** Revisa el [README principal](../README.md) o abre un issue.

**⭐ Si te gusta el proyecto, compártelo!**
