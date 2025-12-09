# 🚀 Guía de Inicio Rápido - PlantCare Mobile

## Pasos para ejecutar la aplicación

### 1. Abrir el proyecto
```bash
cd plant-care-mobile
```

### 2. Configurar la IP del backend

**IMPORTANTE**: Edita `src/services/api.js` en la línea 6:

```javascript
const API_BASE_URL = 'http://TU_IP_LOCAL:8000';
```

Para encontrar tu IP:
- **Windows**: `ipconfig` → busca IPv4
- **Mac/Linux**: `ifconfig` → busca inet

Ejemplo: `http://192.168.1.10:8000`

### 3. Iniciar el backend

En otra terminal:
```bash
cd ../plant-care-ai-backend
venv\Scripts\activate
python main.py
```

### 4. Iniciar la app móvil

```bash
npm start
```

### 5. Escanear QR con Expo Go

1. Descarga **Expo Go** desde Play Store/App Store
2. Escanea el QR que aparece en la terminal
3. ¡Listo! La app se abrirá en tu teléfono

## ⚠️ Troubleshooting

### Error de conexión
- Verifica que backend y móvil estén en la misma WiFi
- Confirma que el backend esté corriendo en `http://TU_IP:8000`
- Prueba acceder a `http://TU_IP:8000/docs` desde el navegador del teléfono

### No se puede tomar fotos
- Da permisos de cámara a Expo Go en la configuración del teléfono

### Gemini API no disponible
- Usa el chat en lugar del análisis de imágenes
- Verifica las API keys en el archivo `.env` del backend

## 📱 Funcionalidades

✅ Análisis de plantas con foto
✅ Chat con IA sobre cuidado de plantas
✅ Diagnóstico y recomendaciones personalizadas
✅ Interfaz moderna con gradientes

---

**¿Dudas?** Revisa el [README completo](README.md)
