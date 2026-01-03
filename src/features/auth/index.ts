/**
 * Index des features d'authentification
 * ====================================
 *
 * Point d'entrée unique pour tous les exports d'authentification.
 */

// Components
export { AuthLayout } from './components/AuthLayout';
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { ProgressBar } from './components/ProgressBar';
export { OtpModal } from './components/OtpModal';

// Hooks
export { useLogin, useRegister, useOtp } from './hooks/useAuthForm';

// Services
export * from './services/auth.service';

// Schemas
export * from './schemas/auth.schema';

// Types
export * from './types/auth.types';