/**
 * Hook d'authentification
 * =======================
 *
 * Gère la logique des formulaires d'authentification.
 * Aucune logique UI - expose une API simple pour les composants.
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { 
  loginSchema, 
  registerSchema, 
  otpSchema,
  step1Schema,
  step2Schema,
  step3Schema
} from '../schemas/auth.schema';
import { 
  loginUser, 
  registerOrganization, 
  verifyOtp, 
  resendOtp,
  fetchCountries 
} from '../services/auth.service';
import type { 
  LoginFormData, 
  RegisterFormData, 
  OtpFormData,
  Country,
  RegisterState 
} from '../types/auth.types';

// ═══════════════════════════════════════════════════════════════
// HOOK DE CONNEXION
// ═══════════════════════════════════════════════════════════════

export function useLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await loginUser(data);
      
      if (result.success) {
        toast.success('Connexion réussie');
        // TODO: Redirection vers le dashboard
        console.log('Connexion réussie:', result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

// ═══════════════════════════════════════════════════════════════
// HOOK D'INSCRIPTION
// ═══════════════════════════════════════════════════════════════

export function useRegister() {
  const [state, setState] = useState<RegisterState>({
    currentStep: 1,
    formData: {},
    isSubmitting: false,
    showOtpModal: false,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Formulaires pour chaque étape
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      organizationName: '',
      organizationType: undefined,
      country: '',
      organizationEmail: '',
      phone: '',
    },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
    },
  });

  const step3Form = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      document: undefined,
    },
  });

  // Chargement des pays
  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    };
    loadCountries();
  }, []);

  // Mise à jour du préfixe téléphonique
  useEffect(() => {
    const countryCode = step1Form.watch('country');
    if (countryCode && countries.length > 0) {
      const country = countries.find(c => c.cca2 === countryCode);
      setSelectedCountry(country || null);
      
      if (country?.idd) {
        const prefix = country.idd.root + (country.idd.suffixes?.[0] || '');
        const currentPhone = step1Form.getValues('phone');
        if (!currentPhone.startsWith(prefix)) {
          step1Form.setValue('phone', prefix);
        }
      }
    }
  }, [step1Form.watch('country'), countries]);

  const nextStep = async () => {
    let isValid = false;
    
    switch (state.currentStep) {
      case 1:
        isValid = await step1Form.trigger();
        if (isValid) {
          setState(prev => ({
            ...prev,
            formData: { ...prev.formData, ...step1Form.getValues() },
            currentStep: 2,
          }));
        }
        break;
      case 2:
        isValid = await step2Form.trigger();
        if (isValid) {
          setState(prev => ({
            ...prev,
            formData: { ...prev.formData, ...step2Form.getValues() },
            currentStep: 3,
          }));
        }
        break;
    }
  };

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
  };

  const submitRegistration = async () => {
    const step3Valid = await step3Form.trigger();
    if (!step3Valid) return;

    const finalData = {
      ...state.formData,
      ...step3Form.getValues(),
    } as RegisterFormData;

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const result = await registerOrganization(finalData);
      
      if (result.success) {
        toast.success('Inscription soumise avec succès');
        setState(prev => ({ 
          ...prev, 
          showOtpModal: true,
          isSubmitting: false 
        }));
      } else {
        toast.error(result.message);
        setState(prev => ({ ...prev, isSubmitting: false }));
      }
    } catch (error) {
      toast.error('Une erreur inattendue s\'est produite');
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return {
    state,
    countries,
    selectedCountry,
    step1Form,
    step2Form,
    step3Form,
    nextStep,
    prevStep,
    submitRegistration,
    closeOtpModal: () => setState(prev => ({ ...prev, showOtpModal: false })),
  };
}

// ═══════════════════════════════════════════════════════════════
// HOOK OTP
// ═══════════════════════════════════════════════════════════════

export function useOtp(onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

  // Countdown pour le renvoi
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: OtpFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await verifyOtp(data);
      
      if (result.success) {
        toast.success('Vérification réussie');
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      const result = await resendOtp();
      
      if (result.success) {
        toast.success('Code renvoyé avec succès');
        setCanResend(false);
        setCountdown(60);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erreur lors du renvoi du code');
    }
  };

  return {
    form,
    isSubmitting,
    canResend,
    countdown,
    onSubmit: form.handleSubmit(onSubmit),
    handleResend,
  };
}