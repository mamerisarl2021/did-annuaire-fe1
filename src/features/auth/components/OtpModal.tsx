/**
 * Modal de validation OTP
 * ======================
 *
 * Modal pour la saisie et validation du code OTP.
 */

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useOtp } from '../hooks/useAuthForm';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function OtpModal({ isOpen, onClose, onSuccess }: OtpModalProps) {
  const { form, isSubmitting, canResend, countdown, onSubmit, handleResend } = useOtp(() => {
    onSuccess?.();
    onClose();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Vérification de votre inscription
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            Un code de vérification à 6 chiffres a été envoyé à votre adresse email. 
            Veuillez le saisir ci-dessous pour finaliser votre inscription.
          </p>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="code" className="sr-only">
                      Code de vérification
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="code"
                        placeholder="000000"
                        className="text-center text-2xl tracking-widest font-mono"
                        maxLength={6}
                        disabled={isSubmitting}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Vérification...' : 'Valider'}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={!canResend}
              className="text-sm"
            >
              {canResend 
                ? 'Renvoyer le code' 
                : `Renvoyer dans ${countdown}s`
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}