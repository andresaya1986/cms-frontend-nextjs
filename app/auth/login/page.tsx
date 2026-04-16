import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Iniciar Sesión',
  description: 'Accede a tu cuenta',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <p className="text-center mt-6 text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
