Voici les workflows de bout en bout — des entrées utilisateur jusqu’à la dernière étape — conformes à l’architecture et aux politiques actuelles (BYOS, 1 VM, owner‑only, approvals).

1. Onboarding du certificat (pré‑requis)

- Entrées (FE): organization_id, fichier (PEM/DER/PKCS#7/PKCS#12/CRT), password? (PKCS12), format (PEM|DER|PKCS7|PKCS12|CRT|AUTO).
- Endpoint: POST /api/registry/certificates
- Validation: parsing x509; extraction JWK; fingerprint SHA‑256; JWK “publicKeyJwk only”.
- Sortie: {id: certificate_id, extracted_jwk, fingerprint}.
- Permissions: utilisateur authentifié de l’org.

2. Compiler/Prévisualiser (aucune écriture)

- Entrées: organization_id, document_type, certificate_id, key_id, purposes[] (standard only).
- Endpoint:
  - GET /api/registry/dids/preview?organization_id&document_type&certificate_id&key_id[&purposes=...] (single)
  - ou POST /api/registry/dids/preview (body JSON) — longueur 1 exigée (une seule clé/VM).
- Validations:
  - 1 seul verificationMethod (policy).
  - Purposes autorisées selon le type de clé (Ed25519/X25519/P‑256/384/521/RSA).
  - JSON Schema (did_document.schema.json) + ordre JSON préféré.
- Sortie: envelope { didState:"action", did, didDocument, didRegistrationMetadata{method,requestId} }.
- Permissions: utilisateur de l’org.

3. Créer le DID (DRAFT)

- Entrées: organization_id, document_type, (certificate_id + key_id + purposes[]).
- Endpoint: POST /api/registry/dids
- Effets: création DID, UploadedPublicKey(version=1), DIDDocument v1 en DRAFT (canonical_sha256).
- Sortie: { didState:"wait", did, didDocument, environment:"DRAFT", didDocumentMetadata{version,published:false}, didRegistrationMetadata{requestId} }.
- Permissions: utilisateur de l’org (créateur = owner).

4. Publier en PREPROD (BYOS — 2 phases)

- Phase A — demander la signature
  - Entrées: did, env=preprod[, version?].
  - Endpoint: POST /api/registry/dids/{did}/publish?env=preprod
  - Effets: canonicalisation + préparation JWS‑2020 détachée (b64=false, crit=["b64"], kid=did#key‑1, alg).
  - Sortie: { didState:"action", action:"signPayload", signingRequest{protected, alg, kid, nonce, payload, signingInput}, … }.
- Phase B — soumettre la signature
  - Entrées: {protected, signature, env:"preprod"[, version]} signés côté propriétaire (wallet/HSM/KMS).
  - Endpoint: POST /api/registry/dids/{did}/publish/signature
  - Effets: vérification JWS; attache proof JsonWebSignature2020; écriture atomique /.well‑known/preprod/{org}/{user}/{type}/did.json; activation unique en PREPROD.
  - Sortie: { didState:"finished", environment:"PREPROD", location: "https://{HOST}/preprod/{org}/{user}/{type}/did.json", … }.
- Permissions: owner (gestion) + publication PREPROD autorisée aux membres de l’org (refus si politique plus stricte).

5. Publier en PROD (BYOS + approbation si nécessaire)

- Cas autorisé (ORG_ADMIN ou can_publish_prod)
  - Recommandé: réutiliser le document déjà signé en PREPROD (pas de re‑signature).
  - Endpoint: POST /api/registry/dids/{did}/publish?env=prod
  - Effets: copie fidèle du doc signé vers /.well‑known/{org}/{user}/{type}/did.json; activation unique en PROD.
  - Sortie: { didState:"finished", environment:"PROD", location: "https://{HOST}/{org}/{user}/{type}/did.json" }.
- Cas non autorisé
  - Endpoint idem → 202
  - Sortie: { didState:"wait", environment:"PROD", reason:"approval_required", publishRequestId }.
  - Approvals (ORG_ADMIN):
    - GET /api/registry/publish-requests?org_id=... [status?]
    - POST /api/registry/publish-requests/{id}/approve → publication PROD immédiate; didState:"finished".
    - POST /api/registry/publish-requests/{id}/reject → didState:"rejected".

6. Mettre à jour le DID Document (nouvelle version)

- Entrées: payload de mise à jour (mêmes règles que create, 1 VM; purposes conformes).
- Endpoint: POST /api/universal-registrar/update (ou route /registry dédiée)
- Effets: création d’une nouvelle DRAFT v(n+1) (owner‑only).
- Sortie: { didState:"update", environment:"DRAFT", version:n+1 }.
- Publication: reprendre le workflow PREPROD puis PROD (BYOS).

7. Rotation de certificat (même key_id — versionning du matériau)

- Entrées: did, key_id, certificate_id (nouveau), purposes? (optionnel si inchangées).
- Endpoint: POST /api/registry/dids/{did}/keys/rotate
- Effets: UploadedPublicKey.version += 1 pour (did,key_id); nouveau DIDDocument DRAFT v(n+1) reconstruit; liaison DidDocumentKeyBinding (traçabilité).
- Sortie: { didState:"update", environment:"DRAFT", version:n+1 }.
- Publication: PREPROD/PROD via BYOS. Le verificationMethod.id (did#key_id) reste stable.

8. Désactivation (option)

- Entrées: did (owner‑only; confirmer politique si ORG_ADMIN doit aussi pouvoir).
- Endpoint: POST /universal-registrar/deactivate
- Effets: publication d’un document minimal {"@context":["https://www.w3.org/ns/did/v1"],"id":did,"deactivated":true} en PROD; DID.status=DEACTIVATED.
- Sortie: { didState:"finished", environment:"PROD" }.
- Résolution: le resolver renvoie 410 pour ce DID.

9. Résolution (lecture publique)

- Entrée: identifier=did:web:...
- Endpoint: GET /universal-resolver/identifiers/{identifier}
- Content‑Negotiation:
  - Accept: application/did → retourne did.json (PROD par défaut).
  - Accept: application/did-resolution → {didDocument, didResolutionMetadata, didDocumentMetadata}.
- Source de vérité: fichier servi par Nginx (.well‑known). PREPROD accessible sous /preprod/...

10. Règles transverses

- 1 seul verificationMethod (policy) → refus 400 si plusieurs clés.
- Purposes par type de clé:
  - Ed25519: auth, assertion, capInv, capDel (pas KA).
  - X25519: KA only.
  - P‑256/384/521: cinq relations possibles.
  - RSA: auth, assertion, capInv (pas KA).
- JWK:
  - kid = did#key‑1, alg dérivé (RS256/ES256/ES384/ES512/EdDSA), use/key_ops seulement si non ambigu; jamais x5\*.
- Enveloppes: toutes les réponses succès incluent didRegistrationMetadata{method:"web", requestId}; les erreurs 4xx incluent didState:"error" + requestId.
- Permissions:
  - Owner‑only: update, rotation, validations ciblées.
  - PROD publish: ORG_ADMIN ou can_publish_prod; sinon workflow d’approbation.
- URLs did:web:
  - PREPROD: https://{HOST}/preprod/{org}/{user}/{type}/did.json
  - PROD: https://{HOST}/{org}/{user}/{type}/did.json

Si tu veux, je peux synthétiser ceci en un README “Workflows” à déposer sous src/dids/did_registry_api/ (avec exemples d’enveloppes et erreurs typiques) avant de coder.
