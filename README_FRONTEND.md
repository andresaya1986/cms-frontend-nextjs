# 🚀 Intranet Frontend

Frontend Next.js para la plataforma de intranet. Incluye autenticación, gestión de posts, social features y comentarios.

## 📋 Requisitos

- Node.js >= 18.x
- npm >= 9.x o yarn >= 3.x

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── posts/          # Componentes de posts
│   ├── social/         # Componentes sociales
│   └── Navbar.tsx      # Barra de navegación
├── context/            # Context API (AuthContext)
├── hooks/              # Custom hooks (useAuth, usePosts, useSocial)
├── lib/
│   ├── api-client.ts   # Cliente Axios configurado
│   └── config.ts       # Configuración centralizada
├── services/           # Servicios de API
│   ├── authService.ts
│   ├── postsService.ts
│   ├── socialService.ts
│   └── commentsService.ts
└── types/              # Tipos TypeScript

app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout con AuthProvider
├── auth/                       # Rutas de autenticación
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── verify-email/page.tsx
└── (authenticated)/            # Rutas protegidas
    ├── dashboard/page.tsx
    ├── posts/page.tsx
    └── profile/page.tsx
```

## ⚙️ Instalación

### 1. Clonar repositorio
```bash
git clone <repo-url>
cd intranet-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de ambiente

Copiar `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Configurar las siguientes variables:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=v1

# App Configuration
NEXT_PUBLIC_APP_NAME=Intranet
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_SOCIAL=true
NEXT_PUBLIC_ENABLE_COMMENTS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=false

# Timeouts
NEXT_PUBLIC_API_TIMEOUT=30000

# Logging
NEXT_PUBLIC_LOG_LEVEL=info
```

## 🚀 Desarrollo

### Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para producción
```bash
npm run build
npm run start
```

### Linting y formato
```bash
npm run lint
npm run format
```

## 🔐 Autenticación

### Flujo de Login
1. Usuario navega a `/auth/login`
2. Ingresa email y contraseña
3. Se envía petición a `POST /api/v1/auth/login`
4. Se recibe token JWT y se guarda en `localStorage`
5. AuthProvider carga datos del usuario
6. Se redirige a `/dashboard`

### Flujo de Registro
1. Usuario navega a `/auth/register`
2. Completa formulario con email, username, password, nombre y apellido
3. Se envía petición a `POST /api/v1/auth/register`
4. Se recibe token JWT
5. Se carga el usuario y redirige a `/dashboard`

### Rutas Protegidas
- Las rutas bajo `app/(authenticated)/` requieren autenticación
- Si no hay token válido, redirigen a `/auth/login`
- El layout verifica automáticamente si el usuario está autenticado

## 📚 API Services

### AuthService
```typescript
import authService from '@/services/authService';

// Login
const response = await authService.login({ email, password });

// Register
const response = await authService.register({ email, username, password });

// Get current user
const user = await authService.me();

// Logout
authService.logout();
```

### PostsService
```typescript
import postsService from '@/services/postsService';

// Get posts list
const posts = await postsService.getPostsList(page, pageSize);

// Get post by slug
const post = await postsService.getPostBySlug(slug);

// Create post
const newPost = await postsService.createPost({ title, content, excerpt });

// Update post
const updated = await postsService.updatePost(id, { title, content });

// Delete post
await postsService.deletePost(id);
```

### SocialService
```typescript
import socialService from '@/services/socialService';

// Follow user
await socialService.followUser(userId);

// Like post
await socialService.likePost(postId);

// Get feed
const feed = await socialService.getFeed(page, pageSize);

// Get user profile
const profile = await socialService.getUserProfile(username);
```

### CommentsService
```typescript
import commentsService from '@/services/commentsService';

// Get comments
const comments = await commentsService.getComments(postId);

// Create comment
const comment = await commentsService.createComment(postId, { content });

// Delete comment
await commentsService.deleteComment(commentId);
```

## 🪝 Custom Hooks

### useAuth
```typescript
import { useAuth } from '@/context/AuthContext';

const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();
```

### usePosts
```typescript
import { usePosts } from '@/hooks/usePosts';

const { posts, isLoading, error, fetchPosts, createPost, deletePost } = usePosts();
```

### useSocial
```typescript
import { useSocial } from '@/hooks/useSocial';

const { isLoading, error, followUser, likePost, getFeed } = useSocial();
```

## 📦 Dependencias principales

- **next**: Framework React
- **react**: Librería UI
- **axios**: Cliente HTTP
- **typescript**: Tipado estático

## 🐛 Troubleshooting

### Error: "API unreachable"
- Verificar que el backend esté corriendo en `http://localhost:8080`
- Comprobar la variable `NEXT_PUBLIC_API_URL` en `.env.local`

### Error: "Token expired"
- El token JWT ha expirado, el usuario debe volver a iniciar sesión
- Implementar refresh token automático (TODO)

### Error: "CORS"
- Verificar que el backend permita CORS desde `http://localhost:3000`

## 📝 TODO

- [ ] Implementar refresh token automático
- [ ] Agregar carga de imágenes para posts
- [ ] Implementar paginación mejorada
- [ ] Agregar notificaciones push
- [ ] Crear componentes de post individual
- [ ] Implementar búsqueda de posts
- [ ] Agregar filtros y categorías
- [ ] Mejorar UX con skeleton loaders

## 📄 Licencia

MIT
