# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Intranet! Este documento proporciona directrices para contribuir al proyecto.

## 📋 Antes de empezar

1. **Fork** el repositorio
2. **Clona** tu fork localmente
3. **Crea una rama** para tu feature: `git checkout -b feature/mi-feature`
4. **Commita** tus cambios: `git commit -am 'Añade nueva feature'`
5. **Haz push** a la rama: `git push origin feature/mi-feature`
6. **Abre un Pull Request**

## 🛠️ Development Setup

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/intranet-frontend.git
cd intranet-frontend

# Instalar dependencias
npm install

# Crear rama de feature
git checkout -b feature/mi-cambio

# Hacer cambios...

# Ejecutar linter
npm run lint

# Hacer commit
git add .
git commit -m "feat: descripción clara del cambio"

# Hacer push
git push origin feature/mi-cambio
```

## 📝 Commit Messages

Usar [Conventional Commits](https://www.conventionalcommits.org/) para mensajes consistentes:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

**Tipos comunes:**
- `feat:` - Nueva feature
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato/estilo
- `refactor:` - Refactorización de código
- `perf:` - Mejoras de performance
- `test:` - Añadir/actualizar tests
- `chore:` - Cambios en dependencias, build, etc.

**Ejemplos:**
```
feat(auth): añadir recuperación de contraseña
fix(posts): corregir bug en paginación
docs: actualizar instrucciones de setup
```

## 🧹 Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Type Checking
```bash
npm run type-check
```

## ✅ Checklist antes de hacer PR

- [ ] Mi código sigue el estilo del proyecto
- [ ] He actualizado la documentación si es necesario
- [ ] He añadido tests para nuevas features
- [ ] Mis cambios no rompen tests existentes
- [ ] He ejecutado `npm run lint` sin problemas
- [ ] Mis commits tienen mensajes claros y descriptivos
- [ ] Mi rama está actualizada con `main`

## 🎯 Directrices de Código

### Componentes React
```typescript
// ✅ Buen ejemplo
interface MyComponentProps {
  title: string;
  onClose?: () => void;
}

export function MyComponent({ title, onClose }: MyComponentProps) {
  return (
    <div className="component">
      <h1>{title}</h1>
      {onClose && <button onClick={onClose}>Cerrar</button>}
    </div>
  );
}

// ❌ No hacer
export default class MyComponent extends React.Component {
  render() {
    return <div className="component">...</div>;
  }
}
```

### TypeScript
```typescript
// ✅ Usar tipos explícitos
function calculateSum(a: number, b: number): number {
  return a + b;
}

// ✅ Usar interfaces/types
interface User {
  id: string;
  name: string;
}

// ❌ No usar any
function myFunction(data: any) {}
```

### Async/Await
```typescript
// ✅ Usar async/await
async function fetchUser(id: string) {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
}

// ❌ Evitar callbacks anidados
function fetchUser(id, callback) {
  apiClient.get(`/users/${id}`, (err, data) => {
    callback(err, data);
  });
}
```

## 📚 Estructura de carpetas

Mantener la estructura existente:
- `src/components/` - Componentes React
- `src/services/` - Servicios de API
- `src/hooks/` - Custom hooks
- `src/types/` - Tipos TypeScript
- `src/lib/` - Utilidades
- `app/` - Páginas Next.js

## 🐛 Reportar Bugs

Si encuentras un bug, por favor:

1. **Verifica** que no haya sido reportado ya
2. **Describe** claramente el problema
3. **Incluye** pasos para reproducir
4. **Menciona** tu navegador/ambiente

**Template:**
```
**Descripción del bug:**
Descripción clara del problema

**Pasos para reproducir:**
1. Hacer esto
2. Hacer aquello
3. Ver error

**Comportamiento esperado:**
Qué debería pasar

**Capturas de pantalla:**
Si aplica, include screenshots

**Ambiente:**
- OS: [e.g. Windows 10]
- Navegador: [e.g. Chrome]
- Versión Node: [e.g. 18.0.0]
```

## 💡 Sugerencias de Features

¿Tienes una idea para una nueva feature?

1. **Abre un Issue** con la etiqueta `enhancement`
2. **Describe** el caso de uso
3. **Explica** cómo te beneficiaría
4. **Sugiere** la implementación si tienes ideas

## 📜 License

Al contribuir, aceptas que tus contribuciones estarán bajo la misma licencia del proyecto (MIT).

## 🎉 ¡Gracias!

Tu contribución hace que Intranet sea mejor. ¡Apreciamos tu tiempo y esfuerzo!

Si tienes preguntas, no dudes en abrir una Issue o contactar a los mantenedores.
