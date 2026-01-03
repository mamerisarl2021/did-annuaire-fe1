/**
 * Formulaire d'inscription
 * ========================
 *
 * Formulaire en 3 étapes pour l'inscription d'une organisation.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Upload, X, FileText, Building, User, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ProgressBar } from './ProgressBar';
import { OtpModal } from './OtpModal';
import { useRegister } from '../hooks/useAuthForm';

const organizationTypes = [
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'association', label: 'Association' },
  { value: 'collectivite', label: 'Collectivité territoriale' },
  { value: 'etablissement_public', label: 'Établissement public' },
  { value: 'autre', label: 'Autre' },
];

export function RegisterForm() {
  const {
    state,
    countries,
    selectedCountry,
    step1Form,
    step2Form,
    step3Form,
    nextStep,
    prevStep,
    submitRegistration,
    closeOtpModal,
  } = useRegister();

  const [dragActive, setDragActive] = useState(false);

  // Gestion du drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      step3Form.setValue('document', e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      step3Form.setValue('document', e.target.files[0]);
    }
  };

  const removeFile = () => {
    step3Form.setValue('document', undefined as unknown as File);
  };

  return (
    <>
      <div className="space-y-6">
        <ProgressBar currentStep={state.currentStep} totalSteps={3} />

        {/* Étape 1 - Organisation */}
        {state.currentStep === 1 && (
          <Form {...step1Form}>
            <form className="space-y-4">
              <FormField
                control={step1Form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="organizationName">Nom de l&apos;organisation</Label>
                    <FormControl>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          {...field}
                          id="organizationName"
                          placeholder="Nom de votre organisation"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="organizationType"
                render={({ field }) => (
                  <FormItem>
                    <Label>Type d&apos;organisation</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <Label>Pays</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Sélectionnez le pays" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.cca2} value={country.cca2}>
                            <div className="flex items-center">
                              <Image 
                                src={country.flags.svg} 
                                alt={country.name.common}
                                width={16}
                                height={12}
                                className="mr-2 object-cover"
                                unoptimized
                              />
                              {country.name.common}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="organizationEmail"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="organizationEmail">Email de contact</Label>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          {...field}
                          id="organizationEmail"
                          type="email"
                          placeholder="contact@organisation.com"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="phone">Téléphone</Label>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder={selectedCountry ? `${selectedCountry.idd.root}${selectedCountry.idd.suffixes?.[0] || ''}` : '+33'}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        {/* Étape 2 - Administrateur */}
        {state.currentStep === 2 && (
          <Form {...step2Form}>
            <form className="space-y-4">
              <FormField
                control={step2Form.control}
                name="adminFirstName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="adminFirstName">Prénom</Label>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          {...field}
                          id="adminFirstName"
                          placeholder="Prénom de l'administrateur"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step2Form.control}
                name="adminLastName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="adminLastName">Nom</Label>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          {...field}
                          id="adminLastName"
                          placeholder="Nom de l'administrateur"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step2Form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="adminEmail">Email professionnel</Label>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          {...field}
                          id="adminEmail"
                          type="email"
                          placeholder="admin@organisation.com"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        {/* Étape 3 - Document */}
        {state.currentStep === 3 && (
          <Form {...step3Form}>
            <form className="space-y-4">
              <FormField
                control={step3Form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <Label>Document justificatif d&apos;activité</Label>
                    <FormControl>
                      <div
                        className={`
                          border-2 border-dashed rounded-lg p-6 text-center transition-colors
                          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                          ${field.value ? 'border-success bg-success/5' : ''}
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {field.value ? (
                          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-8 h-8 text-primary" />
                              <div className="text-left">
                                <p className="font-medium text-sm">{field.value.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(field.value.size / 1024 / 1024).toFixed(2)} Mo
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                            <div>
                              <p className="text-sm font-medium">
                                Glissez votre document ici ou{' '}
                                <label className="text-primary cursor-pointer hover:underline">
                                  parcourez
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                  />
                                </label>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, JPEG ou PNG - Maximum 5 Mo
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        {/* Boutons de navigation */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={state.currentStep === 1}
          >
            Précédent
          </Button>

          {state.currentStep < 3 ? (
            <Button type="button" onClick={nextStep}>
              Suivant
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={submitRegistration}
              disabled={state.isSubmitting}
            >
              {state.isSubmitting ? 'Finalisation...' : 'Finaliser l\'inscription'}
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link 
              href="/login" 
              className="text-primary hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      <OtpModal
        isOpen={state.showOtpModal}
        onClose={closeOtpModal}
        onSuccess={() => {
          // TODO: Redirection vers page de succès
          console.log('Inscription validée avec succès');
        }}
      />
    </>
  );
}