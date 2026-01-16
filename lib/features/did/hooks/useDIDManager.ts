import { useState, useCallback } from "react";
import { MethodType, TabType, Service, DID, VerificationMethod, DIDMode, OptionKey } from "../types";
import { didService } from "../services";

const INITIAL_DID_DOCUMENT = JSON.stringify(
    {
        "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/jws-2020/v1"],
        verificationMethod: [],
        authentication: [],
        assertionMethod: [],
        keyAgreement: [],
        service: [],
    },
    null,
    2
);

export function useDIDManager(initialMode: DIDMode = "create") {
    const [mode, setMode] = useState<DIDMode>(initialMode);
    const [selectedMethod] = useState<MethodType>("WEB");
    const [logicalIdentifier, setLogicalIdentifier] = useState("");
    const [didDocument, setDidDocument] = useState<string>(INITIAL_DID_DOCUMENT);
    const [selectedOptions, setSelectedOptions] = useState<OptionKey[]>([]);

    const [activeTab, setActiveTab] = useState<TabType>("request");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompiled, setIsCompiled] = useState(false);

    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    const toggleOption = (option: OptionKey) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        );
        setIsCompiled(false);
    };

    const handleAddKeys = useCallback((keys: VerificationMethod[]) => {
        try {
            const doc = JSON.parse(didDocument);
            const host = logicalIdentifier || "example.com";
            const didId = `did:web:${host}`;

            if (!doc.verificationMethod) doc.verificationMethod = [];

            keys.forEach((key: VerificationMethod, index: number) => {
                const keyId = `${didId}${key.id || `#key-${doc.verificationMethod.length + index}`}`;
                doc.verificationMethod.push({
                    id: keyId,
                    type: key.type,
                    controller: didId,
                    publicKeyJwk: key.publicKeyJwk,
                });

                // Auto-assign purposes based on key type/curve if common
                if (key.publicKeyJwk.crv === "Ed25519" || key.publicKeyJwk.crv === "P-256") {
                    if (!doc.authentication) doc.authentication = [];
                    if (!doc.assertionMethod) doc.assertionMethod = [];
                    if (!doc.authentication.includes(keyId)) doc.authentication.push(keyId);
                    if (!doc.assertionMethod.includes(keyId)) doc.assertionMethod.push(keyId);
                }

                if (key.publicKeyJwk.crv === "X25519" || key.publicKeyJwk.crv === "P-256") {
                    if (!doc.keyAgreement) doc.keyAgreement = [];
                    if (!doc.keyAgreement.includes(keyId)) doc.keyAgreement.push(keyId);
                }
            });

            setDidDocument(JSON.stringify(doc, null, 2));
            setIsCompiled(false);
        } catch (e) {
            console.error("Error adding keys:", e);
        }
    }, [didDocument, logicalIdentifier]);

    const handleAddService = useCallback((service: Service) => {
        try {
            const doc = JSON.parse(didDocument);
            if (!doc.service) doc.service = [];

            doc.service.push({
                id: service.id,
                type: service.type,
                serviceEndpoint: service.serviceEndpoint,
            });

            setDidDocument(JSON.stringify(doc, null, 2));
            setIsCompiled(false);
        } catch (e) {
            console.error("Error adding service:", e);
        }
    }, [didDocument]);

    const compileDID = async () => {
        setIsSubmitting(true);
        setError("");
        try {
            // Basic validation
            if (!logicalIdentifier) throw new Error("Logical Identifier is required.");
            const parsedDoc = JSON.parse(didDocument);

            // Update ID in document based on logical identifier
            const didId = `did:web:${logicalIdentifier}`;
            parsedDoc.id = didId;

            // Ensure purposes are reflected if needed (though the backend usually handles this)
            // Here we just prepare the state for execution
            setDidDocument(JSON.stringify(parsedDoc, null, 2));
            setIsCompiled(true);

            // Simulate/Trigger a compile-only check if API supports it, 
            // otherwise this is just local validation.
            // For now, let's just mark as compiled.
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setError(`Compilation failed: ${message}`);
            setIsCompiled(false);
            setActiveTab("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const executeAction = async () => {
        if (!isCompiled) {
            setError("Please compile the DID first.");
            return;
        }

        setIsSubmitting(true);
        setError("");
        try {
            const parsedDoc = JSON.parse(didDocument);
            const optionsObj: any = {};
            selectedOptions.forEach(opt => {
                optionsObj[opt] = []; // Assuming backend expects arrays for these if provided
            });

            let res;
            if (mode === "create") {
                res = await didService.createDID({
                    method: selectedMethod,
                    didDocument: parsedDoc,
                    options: optionsObj,
                    secret: {}, // Secret is removed as per requirements
                });
            } else {
                // Assume an updateDID service exists or use createDID with specific metadata
                res = await didService.updateDID({
                    id: parsedDoc.id,
                    didDocument: parsedDoc,
                    options: optionsObj,
                });
            }

            setResponse(JSON.stringify(res, null, 2));
            setActiveTab("response");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setError(`Execution failed: ${message}`);
            setActiveTab("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadDID = (did: DID, newMode: DIDMode = "update") => {
        if (!did) return;
        setMode(newMode);

        // Extract logical identifier from DID ID (did:web:domain -> domain)
        const idParts = did.id.split(":");
        if (idParts.length >= 3) {
            setLogicalIdentifier(idParts.slice(2).join(":"));
        }

        setDidDocument(JSON.stringify(did.didDocument || {}, null, 2));

        // Map existing options if possible
        const purposes: OptionKey[] = [];
        if (did.metadata?.options) {
            const opts = did.metadata.options as any;
            (Object.keys(opts) as OptionKey[]).forEach(k => {
                if (["authentication", "assertionMethod", "keyAgreement", "capabilityInvocation", "capabilityDelegation"].includes(k)) {
                    purposes.push(k);
                }
            });
        }
        setSelectedOptions(purposes);

        setIsCompiled(false);
        setActiveTab("request");
        setError("");
        setResponse("");
    };

    return {
        mode,
        setMode,
        selectedMethod,
        logicalIdentifier,
        setLogicalIdentifier,
        didDocument,
        setDidDocument,
        selectedOptions,
        toggleOption,
        activeTab,
        setActiveTab,
        isSubmitting,
        isCompiled,
        compileDID,
        executeAction,
        loadDID,
        handleAddKeys,
        handleAddService,
        response,
        error,
    };
}
