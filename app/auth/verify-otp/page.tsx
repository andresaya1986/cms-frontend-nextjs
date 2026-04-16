import { Suspense } from 'react';
import { VerifyOTPContent } from '@/components/auth/VerifyOTPContent';

export const metadata = {
  title: 'Verificar Código',
  description: 'Verifica tu código OTP para activar tu cuenta',
};

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div>Cargando...</div>}>
          <VerifyOTPContent />
        </Suspense>
      </div>
    </div>
  );
}
