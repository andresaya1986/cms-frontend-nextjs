// Configuración de la aplicación basada en variables de ambiente
export const appConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    version: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Intranet',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  features: {
    enableSocial: process.env.NEXT_PUBLIC_ENABLE_SOCIAL === 'true',
    enableComments: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  },
  logging: {
    level: (process.env.NEXT_PUBLIC_LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
  },
};

export type AppConfig = typeof appConfig;
