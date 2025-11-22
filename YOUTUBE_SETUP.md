# 🎬 Guía de Integración con YouTube API

## ✅ Archivos Creados/Modificados

### 1. **Servicio de YouTube** (`lib/youtube-service.ts`)
- Integración completa con YouTube Data API v3
- Obtiene estadísticas del canal en tiempo real
- Carga los últimos vídeos del canal
- Incluye datos de fallback para desarrollo sin API
- Funciones de formato y conversión de URLs

### 2. **Componentes**

#### `components/youtube-stats.tsx`
- Muestra suscriptores, vistas totales y número de vídeos
- Obtiene datos reales del canal de YouTube
- Formatea números grandes (245K, 12M, etc.)

#### `components/youtube-videos.tsx`
- Galería de vídeos recientes
- Miniaturas de YouTube
- Enlace directo a cada vídeo
- Fechas formateadas en español
- Efectos hover profesionales

### 3. **Página Principal** (`app/page.tsx`)
- Integrada con datos reales de YouTube
- Muestra estadísticas del canal en el hero
- Galería de últimos vídeos

## 🔑 Obtener Credenciales de YouTube

### Paso 1: Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto:
   - Click en el selector de proyectos
   - Click en "Nuevo proyecto"
   - Nombre: "PecinoGP"
   - Click en "Crear"

### Paso 2: Habilitar YouTube Data API v3

1. En el menú lateral, busca "APIs y servicios"
2. Click en "Biblioteca"
3. Busca "YouTube Data API v3"
4. Click en el resultado
5. Click en "Habilitar"

### Paso 3: Crear Credenciales

1. En "APIs y servicios" → "Credenciales"
2. Click en "Crear credenciales"
3. Selecciona "Clave de API"
4. Se creará tu API Key automáticamente
5. Copia la clave

### Paso 4: Obtener el Channel ID

1. Ve a tu canal de YouTube
2. Click en tu icono de perfil → "Canal"
3. En la URL: `youtube.com/@CHANNEL_ID`
4. O en Configuración → "Información del canal"
5. Copia tu "ID de canal" (ej: UC1234567890abcdef)

## 🔧 Configurar Variables de Entorno

1. Abre `.env.local` en la raíz del proyecto
2. Reemplaza los valores:

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyD_XXXXXXXXXXXXX
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxx
```

## 📋 Variables Disponibles

En tu código puedes usar:

```typescript
import { 
  getChannelStats, 
  getLatestVideos,
  formatNumber,
  formatDate 
} from "@/lib/youtube-service"

// Obtener estadísticas del canal
const stats = await getChannelStats()
// { subscriberCount: "245000", viewCount: "12500000", videoCount: "156" }

// Obtener últimos N vídeos
const videos = await getLatestVideos(6)
// Array de vídeos con id, title, thumbnail, description, etc.
```

## 📊 Datos en Tiempo Real

✅ Suscriptores actualizados  
✅ Número total de vídeos  
✅ Vistas totales del canal  
✅ Últimos vídeos publicados  
✅ Miniaturas originales de YouTube  
✅ Descripción de vídeos  
✅ Fechas de publicación  

## 🚀 Testing

1. Reinicia el servidor de desarrollo: `pnpm dev`
2. Abre tu navegador en `http://localhost:3000`
3. Deberías ver:
   - Estadísticas actualizadas de YouTube en el hero
   - Galería de vídeos con miniaturas reales
   - Enlaces funcionales a YouTube

## 🔄 Caché y Actualización

- Los datos se cachean por 1 hora (3600 segundos)
- Para actualizar antes, reinicia el servidor
- En producción, los datos se revalidan automáticamente cada hora

## 🐛 Solución de Problemas

### "No aparecen los vídeos"
1. Verifica que tu API Key sea correcta
2. Verifica que tu Channel ID sea correcto
3. Revisa la consola del navegador (F12)
4. Reinicia el servidor: `pnpm dev`

### "403 Forbidden"
- Tu API Key no tiene permisos
- Asegúrate de haber habilitado YouTube Data API v3 en Google Cloud

### "404 Not Found"
- Tu Channel ID es incorrecto
- Obtén el Channel ID correctamente desde YouTube

## 📝 Notas de Desarrollo

- Si no configuras las variables de entorno, se usan datos de fallback
- Los datos de fallback son placeholders para testing
- En producción, siempre tendrás datos reales
- El caché mejora el rendimiento de la web

## 🔒 Seguridad

✅ Las claves son públicas (NEXT_PUBLIC_) pero seguras  
✅ No se pueden hacer operaciones maliciosas con solo lectura  
✅ Google Cloud controla los límites de uso  
✅ Se recomienda establecer restricciones en la consola si tienes tráfico alto  

---

**¡Tu web ahora conecta con YouTube en tiempo real! 🎬**
