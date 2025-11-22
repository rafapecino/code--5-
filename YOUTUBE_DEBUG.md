# Guía de Depuración - Estadísticas de YouTube

## ¿Qué hacer si no se ven las estadísticas?

### Paso 1: Verificar las Variables de Entorno

Abre `.env.local` y verifica que tengas:

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSyACk5shkOR3keaMk4OdKMOWMjQiTD9OgeI
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UCSvr3yH2NkqlAHfuRDphz4g
```

**Notas importantes:**
- La API Key NO puede estar vacía
- El Channel ID NO puede estar vacío
- Los valores deben ser exactos

### Paso 2: Revisar la Consola del Navegador

1. Abre tu web en `http://localhost:3000`
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña "Console"
4. Busca mensajes como:
   - `"Fetching YouTube stats for channel: UCS..."`
   - `"Successfully fetched YouTube stats: {...}"`
   - Errores en rojo

### Paso 3: Revisar los Logs del Servidor

1. Busca la terminal donde corre `pnpm dev`
2. Deberías ver logs similares a:
   ```
   Fetching YouTube stats for channel: UCSvr3yH2NkqlAHfuRDphz4g
   Successfully fetched YouTube stats: { 
     subscriberCount: '245000',
     viewCount: '12500000',
     videoCount: '156'
   }
   ```

### Paso 4: Validar las Credenciales

**Si ves este error:**
```
Error fetching channel stats: 401
```
→ Tu API Key es inválida

**Si ves este error:**
```
Error fetching channel stats: 403
```
→ No tienes permisos. Asegúrate de:
- Haber habilitado YouTube Data API v3
- No tener restricciones en la API Key

**Si ves este error:**
```
Error fetching channel stats: 404
```
→ Tu Channel ID es incorrecto

### Paso 5: Obtener Nuevas Credenciales

Si nada funciona, obtén nuevas credenciales:

1. Ve a https://console.cloud.google.com
2. Crea un nuevo proyecto
3. Habilita YouTube Data API v3
4. Crea una nueva API Key
5. Copia el Channel ID de YouTube
6. Actualiza `.env.local`
7. Reinicia: `pnpm dev`

### Paso 6: Datos de Fallback

Si todo lo anterior falla, el sistema mostrará datos por defecto:
- Suscriptores: 245K+
- Vídeos: 156
- Vistas: 12.5M

Esto significa que las credenciales no funcionan, pero la web sigue funcionando.

## 🔍 Checklist de Depuración

- [ ] `.env.local` tiene API Key y Channel ID
- [ ] API Key está correctamente copiada
- [ ] Channel ID está correctamente copiado
- [ ] YouTube Data API v3 está habilitada en Google Cloud
- [ ] Los logs del servidor muestran "Successfully fetched"
- [ ] No hay errores en la consola del navegador
- [ ] Las credenciales coinciden con el proyecto de Google Cloud

## 📊 Ejemplo de Respuesta Correcta

En la consola deberías ver algo así:

```javascript
{
  subscriberCount: "245000",
  viewCount: "12500000",
  videoCount: "156"
}
```

Y en la web deberías ver:
- **245K** Suscriptores
- **156** Vídeos
- **12.5M** Vistas

## 🆘 Última Opción

Si nada funciona, ejecuta esto en la terminal:

```bash
# Elimina el caché
rm -rf .next

# Reinicia el servidor
pnpm dev
```

**En Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force .next
pnpm dev
```

¡Esto debería resolver el problema! 🚀
