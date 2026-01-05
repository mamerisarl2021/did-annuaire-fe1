/**
 * Formulaire d'inscription
 * ========================
 *
 * Formulaire en 2 étapes pour l'inscription d'une organisation.
 * Étape 1 : Informations Organisationnelles
 * Étape 2 : Informations Administratives
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Upload, X, FileText, Building, MapPin, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ProgressBar } from './ProgressBar';
import { useRegister } from '../hooks/useAuthForm';

const organizationTypes = [
  { value: 'Administration', label: 'Administration' },
  { value: 'Entreprise', label: 'Entreprise' },
  { value: 'PSCE', label: 'PSCE' },
  { value: 'Autre', label: 'Autre' },
];

export function RegisterForm() {
  const {
    state,
    countries,
    selectedCountry,
    step1Form,
    step2Form,
    nextStep,
    prevStep,
    submitRegistration,
  } = useRegister();

  const [dragActive, setDragActive] = useState(false);
  const [domains, setDomains] = useState<string[]>(['']);

  // Gestion des domaines
  const addDomain = () => {
    if (domains.length < 10) {
      setDomains([...domains, '']);
    }
  };

  const removeDomain = (index: number) => {
    if (domains.length > 1) {
      const newDomains = domains.filter((_, i) => i !== index);
      setDomains(newDomains);
      step1Form.setValue(
        'domains',
        newDomains.filter((d) => d.trim() !== '')
      );
    }
  };

  const updateDomain = (index: number, value: string) => {
    const newDomains = [...domains];
    newDomains[index] = value;
    setDomains(newDomains);
    step1Form.setValue(
      'domains',
      newDomains.filter((d) => d.trim() !== '')
    );
  };

  // Gestion du drag & drop pour les documents
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    fieldName: 'activityDocument' | 'authorizationDocument'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (state.currentStep === 1) {
        step1Form.setValue(fieldName as 'activityDocument', e.dataTransfer.files[0]);
      } else if (state.currentStep === 2) {
        step2Form.setValue(fieldName as 'authorizationDocument', e.dataTransfer.files[0]);
      }
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'activityDocument' | 'authorizationDocument'
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (state.currentStep === 1) {
        step1Form.setValue(fieldName as 'activityDocument', e.target.files[0]);
      } else if (state.currentStep === 2) {
        step2Form.setValue(fieldName as 'authorizationDocument', e.target.files[0]);
      }
    }
  };

  const removeFile = (fieldName: 'activityDocument' | 'authorizationDocument') => {
    if (state.currentStep === 1) {
      step1Form.setValue(fieldName as 'activityDocument', undefined as unknown as File);
    } else if (state.currentStep === 2) {
      step2Form.setValue(fieldName as 'authorizationDocument', undefined as unknown as File);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <ProgressBar currentStep={state.currentStep} />

        {/* Étape 1 - Informations Organisationnelles */}
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
                        <Building className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
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
                            <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="address">Adresse complète</Label>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="address"
                        placeholder="Rue, ville, code postal, pays..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step1Form.control}
                name="organizationEmail"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="organizationEmail">Email Officiel</Label>
                    <FormControl>
                      <div className="relative">
                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
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
                        <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder={
                            selectedCountry
                              ? `${selectedCountry.idd.root}${selectedCountry.idd.suffixes?.[0] || ''}`
                              : '+33'
                          }
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gestion des domaines */}
              <div className="space-y-2">
                <Label>Domaines (1 à 10 domaines)</Label>
                {domains.map((domain, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={domain}
                      onChange={(e) => updateDomain(index, e.target.value)}
                      placeholder="exemple.com"
                      className="flex-1"
                    />
                    {domains.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeDomain(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {domains.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDomain}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un domaine
                  </Button>
                )}
              </div>

              {/* Document d'activité (optionnel) */}
              <FormField
                control={step1Form.control}
                name="activityDocument"
                render={({ field }) => (
                  <FormItem>
                    <Label>Document d&apos;activité (optionnel)</Label>
                    <FormControl>
                      <div
                        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'} ${field.value ? 'border-success bg-success/5' : ''} `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={(e) => handleDrop(e, 'activityDocument')}
                      >
                        {field.value ? (
                          <div className="bg-muted flex items-center justify-between rounded-md p-3">
                            <div className="flex items-center space-x-3">
                              <FileText className="text-primary h-8 w-8" />
                              <div className="text-left">
                                <p className="text-sm font-medium">{field.value.name}</p>
                                <p className="text-muted-foreground text-xs">
                                  {(field.value.size / 1024 / 1024).toFixed(2)} Mo
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile('activityDocument')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                            <div>
                              <p className="text-sm font-medium">
                                Glissez votre document ici ou{' '}
                                <label className="text-primary cursor-pointer hover:underline">
                                  parcourez
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={(e) => handleFileChange(e, 'activityDocument')}
                                  />
                                </label>
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                PDF uniquement - Maximum 5 Mo
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

        {/* Étape 2 - Informations Administratives */}
        {state.currentStep === 2 && (
          <Form {...step2Form}>
            <form className="space-y-4">
              <FormField
                control={step2Form.control}
                name="adminFirstName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="adminFirstName">Prénom de l&apos;administrateur</Label>
                    <FormControl>
                      <Input {...field} id="adminFirstName" placeholder="Prénom" />
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
                    <Label htmlFor="adminLastName">Nom de l&apos;administrateur</Label>
                    <FormControl>
                      <Input {...field} id="adminLastName" placeholder="Nom" />
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
                    <Label htmlFor="adminEmail">Email de l&apos;administrateur</Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="adminEmail"
                        type="email"
                        placeholder="admin@organisation.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step2Form.control}
                name="adminFunction"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="adminFunction">Fonction de l&apos;administrateur</Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="adminFunction"
                        placeholder="Ex: Directeur Général, Responsable IT..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document d'autorisation (obligatoire) */}
              <FormField
                control={step2Form.control}
                name="authorizationDocument"
                render={({ field }) => (
                  <FormItem>
                    <Label>Document d&apos;autorisation signé (obligatoire)</Label>
                    <FormControl>
                      <div
                        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'} ${field.value ? 'border-success bg-success/5' : ''} `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={(e) => handleDrop(e, 'authorizationDocument')}
                      >
                        {field.value ? (
                          <div className="bg-muted flex items-center justify-between rounded-md p-3">
                            <div className="flex items-center space-x-3">
                              <FileText className="text-primary h-8 w-8" />
                              <div className="text-left">
                                <p className="text-sm font-medium">{field.value.name}</p>
                                <p className="text-muted-foreground text-xs">
                                  {(field.value.size / 1024 / 1024).toFixed(2)} Mo
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile('authorizationDocument')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                            <div>
                              <p className="text-sm font-medium">
                                Glissez votre document ici ou{' '}
                                <label className="text-primary cursor-pointer hover:underline">
                                  parcourez
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e, 'authorizationDocument')}
                                  />
                                </label>
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                PDF signé requis - Maximum 5 Mo
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

          {state.currentStep < 2 ? (
            <Button type="button" onClick={nextStep}>
              Suivant
            </Button>
          ) : (
            <Button type="button" onClick={submitRegistration} disabled={state.isSubmitting}>
              {state.isSubmitting ? 'Soumission...' : "Soumettre l'inscription"}
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
