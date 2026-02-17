/**
 * Dictionnaire des codes d'erreur et leurs traductions en français.
 */
export const ERROR_MESSAGES: Record<string, string> = {
    // Auth & Session
    'INVALID_CREDENTIALS': 'Email ou mot de passe incorrect.',
    'SESSION_EXPIRED': 'Votre session a expiré. Veuillez vous reconnecter.',
    'UNAUTHORIZED': 'Vous n\'êtes pas autorisé à effectuer cette action.',
    'FORBIDDEN': 'Accès refusé. Vous n\'avez pas les permissions nécessaires.',
    'TOKEN_EXPIRED': 'Votre session a expiré. Veuillez vous reconnecter.',
    'INVALID_OTP': 'Le code de vérification est invalide ou expiré.',

    // Validation
    'VALIDATION_ERROR': 'Certains champs contiennent des erreurs.',
    'INVALID_FORMAT': 'Le format des données est invalide.',
    'REQUIRED_FIELD': 'Ce champ est obligatoire.',

    // Serveur & Réseau
    'INTERNAL_ERROR': 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    'SERVICE_UNAVAILABLE': 'Le service est temporairement indisponible.',
    'GATEWAY_TIMEOUT': 'Le serveur met trop de temps à répondre.',
    'NETWORK_ERROR': 'Erreur de connexion. Vérifiez votre connexion Internet.',

    // DID Operations
    'DID_NOT_FOUND': 'DID introuvable.',
    'DID_ALREADY_EXISTS': 'Ce DID existe déjà.',
    'DID_PENDING': 'Une opération est déjà en cours sur ce DID.',
    'CERTIFICATE_EXPIRED': 'Le certificat a expiré.',
    'INVALID_SIGNATURE': 'Signature invalide.',

    // User Management
    'USER_NOT_FOUND': 'Utilisateur introuvable.',
    'USER_ALREADY_EXISTS': 'Un utilisateur avec cet email existe déjà.',
    'INVITATION_EXPIRED': 'L\'invitation a expiré.',

    // Organization
    'ORGANIZATION_NOT_FOUND': 'Organisation introuvable.',

    // Défaut
    'UNKNOWN_ERROR': 'Une erreur inattendue s\'est produite.',
};

export class ErrorMessageTranslator {
    /**
     * Traduit un code d'erreur en message convivial.
     * @param code Le code d'erreur (ex: 'INVALID_CREDENTIALS')
     * @param fallback Message de secours si le code n'est pas reconnu
     * @returns Le message traduit ou le fallback
     */
    static translate(code: string, fallback?: string): string {
        const message = ERROR_MESSAGES[code];
        if (message) return message;

        // Si le code ressemble à un message technique anglais, on préfère le fallback
        if (this.isTechnicalMessage(code)) {
            return fallback || ERROR_MESSAGES['UNKNOWN_ERROR'];
        }

        return fallback || code || ERROR_MESSAGES['UNKNOWN_ERROR'];
    }

    /**
     * Vérifie si un message est technique (anglais, stack trace, etc.)
     */
    private static isTechnicalMessage(text: string): boolean {
        const technicalPatterns = [
            /unexpected error/i,
            /internal server error/i,
            /failed to fetch/i,
            /undefined/i,
            /null/i,
            /stack trace/i,
            /[a-z]+:[0-9]+/i, // Pattern comme file.ts:123
        ];

        return technicalPatterns.some(pattern => pattern.test(text));
    }
}
