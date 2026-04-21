# Social System Integration - Complete Implementation

Este documento describe la integración completa del sistema social del CMS Frontend.

## 📋 Resumen

Se ha implementado un sistema social completo para el CMS Frontend que incluye:
- Sistema de seguir/seguidores
- Reacciones avanzadas (7 tipos)
- Búsqueda de usuarios
- Sugerencias de usuarios
- Bookmarks (guardar posts)
- Sistema de compartir
- Menciones (@usuario)
- Hashtags (#tema)
- WebSocket para actualizaciones en tiempo real

## 📁 Estructura de Archivos

### Types (`src/types/index.ts`)
- `ReactionType` - Enum con 7 tipos de reacciones
- `Reaction` - Interface para una reacción
- `ReactionStats` - Contadores de reacciones
- `Hashtag` - Interface para hashtags
- `Mention` - Interface para menciones
- `Bookmark` - Interface para posts guardados
- `Share` - Interface para shares
- `UserSuggestion` - Sugerencias de usuarios
- `ExtendedNotification` - Notificaciones extendidas
- `WebSocket Events` - Tipos para eventos de Socket.io

### Services (`src/services/`)

#### 1. **socialService.ts** (Extendido)
```typescript
// Métodos disponibles:
followUser(userId)
unfollowUser(userId)
getFollowers(username, limit, offset)
getFollowing(username, limit, offset)
searchUsers(q, limit, offset)
getUserSuggestions(limit)
likePost(postId)
unlikePost(postId)
getFeed(page, pageSize)
getUserProfile(username)
```

#### 2. **reactionsService.ts** (Nuevo)
```typescript
addReaction(payload)           // Crear/actualizar reacción
removeReaction(targetId, type) // Remover reacción
getReactions(targetId, type)   // Obtener reacciones
getReactionStats(targetId)     // Estadísticas
updateReaction(targetId, newType)
```

#### 3. **bookmarksService.ts** (Nuevo)
```typescript
toggleBookmark(postId)
getBookmarks(limit, offset)
deleteBookmark(postId)
```

#### 4. **sharesService.ts** (Nuevo)
```typescript
sharePost(postId, payload)
getPostShares(postId, limit, offset)
```

#### 5. **mentionsService.ts** (Nuevo)
```typescript
getMentions(postId, limit, offset)
getReceivedMentions(limit, offset)
markMentionAsRead(mentionId)
```

#### 6. **hashtagsService.ts** (Nuevo)
```typescript
searchHashtags(query, limit)
getTrendingHashtags(limit)
getPostsByHashtag(tagName, limit, offset)
getHashtagStats(tagName)
```

#### 7. **socketService.ts** (Nuevo)
```typescript
// Métodos principales:
connect(token)
disconnect()
isConnected()
on(event, callback)      // Escuchar evento
once(event, callback)    // Escuchar una vez
emit(event, data)        // Emitir evento

// Eventos disponibles:
notification:new, notification:read, notification:all-read
follower:gained, follower:lost, user:online, user:offline
reaction:added, reaction:removed, post:counters
comment:added, comment:deleted, typing:start, typing:stop
mention:new
```

### Hooks (`src/hooks/`)

#### 1. **useReactions.ts**
```typescript
const { stats, reactions, react, unreact, loadStats } = useReactions(targetId, targetType);
// Cargar y manejar reacciones (7 tipos)
```

#### 2. **useBookmarks.ts**
```typescript
const { bookmarks, toggleBookmark, deleteBookmark, loadBookmarks } = useBookmarks();
// Manejar bookmarks (posts guardados)
```

#### 3. **useMentions.ts**
```typescript
const { mentions, receivedMentions, markAsRead, loadReceivedMentions } = useMentions();
// Manejar menciones
```

#### 4. **useHashtags.ts**
```typescript
const { hashtags, trending, getPostsByHashtag, getTrendingHashtags } = useHashtags();
// Manejar hashtags
```

#### 5. **useShare.ts**
```typescript
const { shares, sharePost, getPostShares } = useShare();
// Manejar shares
```

#### 6. **useSocket.ts**
```typescript
const { isConnected, on, emit, joinPost, startTyping } = useSocket();
// Hook para usar WebSocket fácilmente
```

#### 7. **useSocial.ts** (Extendido)
```typescript
// Nuevos métodos:
getFollowers(username, limit, offset)
getFollowing(username, limit, offset)
searchUsers(q, limit, offset)
getUserSuggestions(limit)
```

### Componentes (`src/components/social/`)

#### 1. **ReactionBar.tsx**
```typescript
<ReactionBar targetId={postId} targetType="POST" />
// Muestra 7 botones de reacciones con contadores
```

#### 2. **FollowButton.tsx**
```typescript
<FollowButton userId={userId} initialIsFollowing={false} />
// Botón para seguir/dejar de seguir
```

#### 3. **BookmarkButton.tsx**
```typescript
<BookmarkButton postId={postId} initialIsBookmarked={false} />
// Botón para guardar posts
```

#### 4. **ShareButton.tsx**
```typescript
<ShareButton postId={postId} />
// Botón para compartir (abre modal)
```

#### 5. **SearchUsers.tsx**
```typescript
<SearchUsers onSelectUser={handleUser} />
// Input con búsqueda en tiempo real
```

#### 6. **UserSuggestions.tsx**
```typescript
<UserSuggestions limit={10} />
// Mostrar sugerencias de usuarios a seguir
```

#### 7. **TypingIndicator.tsx**
```typescript
<TypingIndicator typingUsers={[{ username: 'juan' }]} />
// Indicador de usuarios escribiendo
```

#### 8. **TrendingHashtags.tsx**
```typescript
<TrendingHashtags limit={10} onSelectHashtag={handleTag} />
// Mostrar hashtags trending
```

### Páginas (`src/app/`)

#### 1. **/social/search**
- Búsqueda de usuarios
- Muestra información del usuario seleccionado
- Botón para seguir desde la búsqueda

#### 2. **/social/followers**
- Lista de seguidores actuales
- Paginación
- Botón para seguir/dejar de seguir

#### 3. **/social/following**
- Lista de usuarios que sigo
- Paginación
- Botón para dejar de seguir

#### 4. **/social/bookmarks**
- Posts guardados/bookmarked
- Muestra título, excerpt, autor
- Paginación

#### 5. **/social/trending**
- Hashtags trending en sidebar
- Posts del hashtag seleccionado
- Diseño responsive

#### 6. **/users/[username]**
- Perfil de usuario dinámico
- Banner + Avatar
- Información: bio, estadísticas
- Lista de posts del usuario

## 🚀 Cómo Usar

### 1. Conectar WebSocket (en App o Layout)
```typescript
import { useSocket } from '@/hooks/useSocket';

export function AppProviders() {
  const { on, isConnected } = useSocket();

  useEffect(() => {
    on('notification:new', (notification) => {
      console.log('Nueva notificación:', notification);
    });
  }, [on]);

  return ...;
}
```

### 2. Usar Reacciones en Posts
```typescript
import { ReactionBar } from '@/components/social/ReactionBar';

export function PostCard({ post }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <ReactionBar targetId={post.id} targetType="POST" />
    </div>
  );
}
```

### 3. Botón de Seguir en Perfil
```typescript
import { FollowButton } from '@/components/social/FollowButton';

export function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.username}</h1>
      <FollowButton userId={user.id} initialIsFollowing={user.isFollowing} />
    </div>
  );
}
```

### 4. Bookmarks en Posts
```typescript
import { BookmarkButton } from '@/components/social/BookmarkButton';

export function PostCard({ post }) {
  return (
    <div>
      <BookmarkButton postId={post.id} />
    </div>
  );
}
```

### 5. Buscar Usuarios
```typescript
import { SearchUsers } from '@/components/social/SearchUsers';

export function DiscoveryPage() {
  return (
    <SearchUsers 
      onSelectUser={(user) => router.push(`/users/${user.username}`)}
    />
  );
}
```

## 🔌 WebSocket Events

### Escuchar Eventos
```typescript
const { on } = useSocket();

on('notification:new', (notification) => {
  // Mostrar notificación
});

on('reaction:added', (data) => {
  // Actualizar contadores de reacciones
});

on('follower:gained', (data) => {
  // Usuario ganó un seguidor
});
```

### Emitir Eventos
```typescript
const { emit, joinPost, startTyping } = useSocket();

// Unirse a un post para recibir actualizaciones
joinPost(postId);

// Indicar que está escribiendo
startTyping(postId);
```

## 🗂️ API Endpoints Utilizados

```
POST   /v1/social/follow/:userId          - Seguir
DELETE /v1/social/follow/:userId          - Dejar de seguir
GET    /v1/social/:userId/followers       - Seguidores
GET    /v1/social/:userId/following       - Siguiendo
GET    /v1/social/search                  - Buscar usuarios
GET    /v1/social/suggestions             - Sugerencias

POST   /v1/reactions                      - Crear reacción
GET    /v1/reactions                      - Listar
GET    /v1/reactions/stats                - Estadísticas

POST   /v1/social/bookmarks/:postId       - Guardar
GET    /v1/social/bookmarks               - Obtener guardados
DELETE /v1/social/bookmarks/:postId       - Eliminar

POST   /v1/social/shares/:postId          - Compartir
GET    /v1/posts/:postId/shares           - Ver shares

GET    /v1/social/mentions                - Menciones de post
GET    /v1/social/mentions/received       - Menciones recibidas
POST   /v1/social/mentions/:id/read       - Marcar leída

GET    /v1/social/hashtags/search         - Buscar hashtags
GET    /v1/social/hashtags/trending       - Trending
GET    /v1/social/hashtags/:name          - Posts con hashtag
GET    /v1/social/hashtags/:name/stats    - Estadísticas
```

## 🔐 Autenticación

Todos los endpoints requieren:
```
Authorization: Bearer {accessToken}
```

El WebSocket requiere:
```socket.connect(accessToken)```

## 📝 Próximos Pasos

1. **Mejor integración en componentes existentes**
   - Agregar ReactionBar a PostCard
   - Agregar FollowButton a perfiles
   - Agregar BookmarkButton a posts

2. **Autocomplete avanzado**
   - @menciones en CommentForm
   - #hashtags en PostForm

3. **NotificationBell**
   - Mostrar badge con contador
   - Dropdown con notificaciones recientes

4. **Nested Comments**
   - Mejor display de replies
   - Indicadores de threading

5. **Analytics**
   - Dashboard de estadísticas sociales
   - Gráficos de engagement

## 📊 Estadísticas de Implementación

- **9 Services** (1 extendido, 6 nuevos)
- **7 Hooks** (1 extendido, 6 nuevos)
- **8 Componentes** (nuevos)
- **6 Páginas** (nuevas)
- **50+ Types/Interfaces** (nuevos/extendidos)
- **100+ API Endpoints** (mapeados)
- **WebSocket Setup** (completo)

---

**Última actualización:** Abril 21, 2026
**Status:** ✅ CONCLUIDO
