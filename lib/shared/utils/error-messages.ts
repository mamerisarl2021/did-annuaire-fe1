/**
 * Dictionnaire de traduction des codes d'erreur backend en messages utilisateur conviviaux (Français).
 */
export const ERROR_MESSAGES: Record<string, string> = {
    // Auth
    CREDENTIALS_INVALID: "Email ou mot de passe incorrect.",
    USER_NOT_FOUND: "Utilisateur non trouvé.",
    USER_DISABLED: "Votre compte a été désactivé. Contactez l'administrateur.",
    OTP_INVALID: "Code de vérification invalide.",
    OTP_EXPIRED: "Le code de vérification a expiré.",
    RESET_TOKEN_INVALID: "Le lien de réinitialisation est invalide ou a expiré.",

    // Registration / Organizations
    ORGANIZATION_ALREADY_EXISTS: "Une organisation avec ce nom existe déjà.",
    DOMAIN_ALREADY_EXISTS: "Ce domaine est déjà utilisé.",

    // Generic
    INTERNAL_ERROR: "Une erreur interne s'est produite. Veuillez réessayer plus tard.",
    VALIDATION_ERROR: "Certains champs du formulaire sont invalides.",
    NOT_FOUND: "La ressource demandée est introuvable.",
    UNAUTHORIZED: "Vous devez être connecté pour effectuer cette action.",
    FORBIDDEN: "Vous n'avez pas les permissions nécessaires.",
    NETWORK_ERROR: "Erreur de connexion. Veuillez vérifier votre accès internet.",
};

export class ErrorMessageTranslator {
    static translate(code?: string, fallback?: string): string {
        if (!code) return fallback || ERROR_MESSAGES.INTERNAL_ERROR;
        return ERROR_MESSAGES[code] || fallback || ERROR_MESSAGES.INTERNAL_ERROR;
    }
}
