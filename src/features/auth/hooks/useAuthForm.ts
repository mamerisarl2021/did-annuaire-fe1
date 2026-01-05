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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginSchema, otpSchema, step1Schema, step2Schema } from '../schemas/auth.schema';
import {
  loginUser,
  registerOrganization,
  verifyOtp,
  resendOtp,
  fetchCountries,
} from '../services/auth.service';
import type {
  LoginFormData,
  RegisterFormData,
  OtpFormData,
  Country,
  RegisterState,
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
    } catch {
      toast.error("Une erreur inattendue s'est produite");
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
  const router = useRouter();
  const [state, setState] = useState<RegisterState>({
    currentStep: 1,
    formData: {},
    isSubmitting: false,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Formulaires pour chaque étape (2 étapes maintenant)
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      organizationName: '',
      organizationType: undefined,
      country: '',
      address: '',
      organizationEmail: '',
      phone: '',
      domains: [],
      activityDocument: undefined,
    },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
      adminFunction: '',
      authorizationDocument: undefined,
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

  // Mise à jour du préfixe téléphonique quand le pays change
  useEffect(() => {
    const subscription = step1Form.watch((value, { name }) => {
      if (name === 'country' && value.country && countries.length > 0) {
        const country = countries.find((c) => c.cca2 === value.country);
        setSelectedCountry(country || null);

        if (country?.idd) {
          const prefix = country.idd.root + (country.idd.suffixes?.[0] || '');
          const currentPhone = step1Form.getValues('phone');
          // Ne met à jour que si le champ est vide ou contient encore l'ancien préfixe
          if (!currentPhone || currentPhone.length < 5) {
            step1Form.setValue('phone', prefix);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [step1Form, countries]);

  const nextStep = async () => {
    if (state.currentStep === 1) {
      const isValid = await step1Form.trigger();
      if (isValid) {
        setState((prev) => ({
          ...prev,
          formData: { ...prev.formData, ...step1Form.getValues() },
          currentStep: 2,
        }));
      }
    }
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
    }));
  };

  const submitRegistration = async () => {
    const step2Valid = await step2Form.trigger();
    if (!step2Valid) return;

    const finalData = {
      ...state.formData,
      ...step2Form.getValues(),
    } as RegisterFormData;

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const result = await registerOrganization(finalData);

      if (result.success) {
        toast.success('Inscription soumise avec succès');

        // Redirection vers la page de statut avec l'ID de l'organisation
        const organizationId = result.data?.organizationId || 'mock-org-id';
        router.push(`/organization/status/${organizationId}`);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return {
    state,
    countries,
    selectedCountry,
    step1Form,
    step2Form,
    nextStep,
    prevStep,
    submitRegistration,
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
    } catch {
      toast.error("Une erreur inattendue s'est produite");
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
    } catch {
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
