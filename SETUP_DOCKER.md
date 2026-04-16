# ✅ Frontend Listo en Docker

## 🚀 Estado Actual

Tu frontend está corriendo en **http://localhost:4000**

```
Frontend Docker: ✅ CORRIENDO
- Container ID: front-container  
- Puerto: 4000
- Servidor: Nginx (Alpine)
- Build: Next.js static export
```

## 🔗 Próximo Paso: CONECTAR BACKEND

El frontend ahora está listo, pero necesita conectarse a tu backend API.

### ¿Dónde está tu backend?

Abre `nginx.conf` (línea 8-10) y elige la opción correcta:

```nginx
location /api/ {
    # OPCIÓN A: Backend en localhost:8080 (Windows) - ACTUAL
    proxy_pass http://host.docker.internal:8080;
    
    # OPCIÓN B: Backend en localhost:80
    # proxy_pass http://host.docker.internal:80;
    
    # OPCIÓN C: Backend en otro puerto (ej: 3000)
    # proxy_pass http://host.docker.internal:3000;
    
    # OPCIÓN D: Backend en otro contenedor Docker
    # proxy_pass http://cms_nginx;
```

### Pasos:

1. **Edita `nginx.conf`**: Cambia la URL según dónde esté tu backend
2. **Reconstruye**: `npm run docker:build`
3. **Reinicia**: `npm run docker:run`
4. **Prueba**: Abre http://localhost:4000 en tu navegador

## 📊 Arquitechu Actual

```
┌─────────────────────┐
│   Tu Navegador      │
│  http://localhost:4000
└──────────┬──────────┘
           │
      ┌────▼────┐
      │ Nginx   │  (Docker Container)
      │ 4000:80 │
      └────┬────┘
    ┌──────┴──────────────────┐
    │                         │
    ▼  /api/...              ▼  /
┌──────────┐           ┌─────────┐
│ Backend  │           │Frontend │
│ :8080    │           │ Static  │
│(Windows) │           │ Assets  │
└──────────┘           └─────────┘
```

## 🔧 Configuración Actual

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `/api` (relativa, proxeada) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:4000` |
| Nginx Proxy | `http://host.docker.internal:8080` |
| Puerto Frontend | 4000 |
| Puerto Backend | :8080 (editable en nginx.conf) |

## 📝 Archivos Modificados/Creados

- ✅ `.env.docker` - Variables para Docker
- ✅ `nginx.conf` - Proxy configuration
- ✅ `Dockerfile` - Usa .env.docker durante build
- ✅ `BACKEND_CONFIG.md` - Guía detallada

## 🧪 Cómo Probar

1. Abre http://localhost:4000 en tu navegador
2. Abre DevTools (F12) → Network tab
3. Intenta hacer login
4. Deberías ver requests a `/api/v1/auth/login`
5. Si ves success: ✅ Funciona
6. Si ves error: 🔴 Verifica backend URL en nginx.conf

## 🆘 Si Get Network Error

1. **Verifica backend URL en `nginx.conf`:**
   ```bash
   # ¿Está en puerto 8080?
   proxy_pass http://host.docker.internal:8080;
   
   # ¿En otro puerto? Cámbialo (3000, 80, etc)
   ```

2. **Reconstruye Docker:**
   ```bash
   npm run docker:stop
   npm run docker:build
   npm run docker:run
   ```

3. **Verifica logs:**
   ```bash
   docker logs front-container
   ```

4. **Verifica backend:**
   ```bash
   # Desde tu Windows, verifica que backend está en puerto 8080
   curl http://localhost:8080/api/v1/health
   ```

## 💡 Notas Importantes

- El `.env.docker` se copia durante el **build**, no el `.env`
- Los cambios en `nginx.conf` requieren rebuild
- `localhost` dentro del Docker no es tu máquina - usa `host.docker.internal`
- Frontend y Backend pueden estar en puertos diferentes, Nginx los conecta

## 📚 Documentación Adicional

- [BACKEND_CONFIG.md](./BACKEND_CONFIG.md) - Configuración detallada 
- [README_FRONTEND.md](./README_FRONTEND.md) - Guía completa del proyecto
- [nginx.conf](./nginx.conf) - Configuración del proxy

---

**¿Listo?** Abre http://localhost:4000 e intenta hacer login. 🎉

