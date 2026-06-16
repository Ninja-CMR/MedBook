export type UUID = string;

export const UserRole = {
    PATIENT: 'PATIENT',
    MEDECIN: 'MEDECIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    id: UUID;
    email: string;
    nom: string;
    prenom: string;
    role: UserRole;
    motDePasse?: string; // Optional for security reasons in frontend state
}

export interface Patient extends User {
    id_patient: string;
    groupeSanguin: string;
    dateNaissance: string;
    allergies: string;
    antecedents: string;
}

export const AccessLevel = {
    FULL: 'FULL',
    LIMITED: 'LIMITED',
    EMERGENCY: 'EMERGENCY',
} as const;

export type AccessLevel = (typeof AccessLevel)[keyof typeof AccessLevel];

export interface Medecin extends User {
    id_med: string;
    specialite: string;
    niveauAcces: AccessLevel;
}

export interface Carnet {
    id_carnet: string;
    dateCreation: string;
    cle: string; // AES-256 placeholder
    patient_id: string;
}

export interface Consultation {
    id: string;
    carnet_id: string;
    date: string;
    motif: string;
    diagnostique: string;
    medecin_id: string;
    signe: boolean;
}

export interface Ordonnance {
    id: string;
    carnet_id: string;
    date: string;
    medicaments: string[];
    duree: number; // in days
    medecin_id: string;
    valide: boolean;
}

export interface Vaccination {
    id: string;
    carnet_id: string;
    vaccin: string;
    dateAdmin: string;
    dateRappel?: string;
}

export interface ResultatAnalyse {
    id_resultat: string;
    carnet_id: string;
    typeExamen: string;
    fichierJoint: string; // URL or base64
    date: string;
    valide: boolean;
}

export interface AuditLog {
    id: string;
    date: string;
    action: string;
    utilisateur_id: string;
    details: string;
}

export interface AccessRequest {
    id: string;
    patient_id: string;
    medecin_id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    dateDemande: string;
}
