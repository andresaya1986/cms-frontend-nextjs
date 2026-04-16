import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Registrarse',
  description: 'Crea una nueva cuenta',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <RegisterForm />
        <p className="text-center mt-6 text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
