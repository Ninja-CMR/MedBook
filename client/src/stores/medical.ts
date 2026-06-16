import { defineStore } from 'pinia';
import { useLocalStorage } from '../shared/composables/useLocalStorage';
import type {
    Carnet,
    Consultation,
    Ordonnance,
    Vaccination,
    ResultatAnalyse,
    AuditLog,
    AccessRequest
} from '../core/types';

export const useMedicalStore = defineStore('medical', () => {
    const carnets = useLocalStorage<Carnet[]>('medbook_carnets', [
        {
            id_carnet: 'CN-001',
            dateCreation: '2023-01-10',
            cle: 'AES-HASH-001',
            patient_id: 'p1'
        }
    ]);

    const consultations = useLocalStorage<Consultation[]>('medbook_consultations', [
        {
            id: 'c1',
            carnet_id: 'CN-001',
            date: '2024-05-15',
            motif: 'Contrôle annuel',
            diagnostique: 'Tout va bien, tension normale.',
            medecin_id: 'd1',
            signe: true
        }
    ]);

    const ordonnances = useLocalStorage<Ordonnance[]>('medbook_ordonnances', [
        {
            id: 'o1',
            carnet_id: 'CN-001',
            date: '2024-05-15',
            medicaments: ['Paracétamol 500mg', 'Vitamine C'],
            duree: 7,
            medecin_id: 'd1',
            valide: true
        }
    ]);

    const vaccinations = useLocalStorage<Vaccination[]>('medbook_vaccinations', [
        {
            id: 'v1',
            carnet_id: 'CN-001',
            vaccin: 'Grippe',
            dateAdmin: '2023-11-05',
            dateRappel: '2024-11-05'
        }
    ]);

    const resultatsAnalyse = useLocalStorage<ResultatAnalyse[]>('medbook_resultats', []);
    const auditLogs = useLocalStorage<AuditLog[]>('medbook_audit_logs', []);
    const accessRequests = useLocalStorage<AccessRequest[]>('medbook_access_requests', []);

    function addConsultation(consultation: Consultation) {
        consultations.value.push(consultation);
        addAuditLog('ADD_CONSULTATION', consultation.medecin_id, `Consultation added for carnet ${consultation.carnet_id}`);
    }

    function addOrdonnance(ordonnance: Ordonnance) {
        ordonnances.value.push(ordonnance);
        addAuditLog('ADD_ORDONNANCE', ordonnance.medecin_id, `Prescription added for carnet ${ordonnance.carnet_id}`);
    }

    function addAuditLog(action: string, userId: string, details: string) {
        auditLogs.value.unshift({
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            action,
            utilisateur_id: userId,
            details
        });
    }

    function getCarnetByPatientId(patientId: string) {
        return carnets.value.find(c => c.patient_id === patientId);
    }

    return {
        carnets,
        consultations,
        ordonnances,
        vaccinations,
        resultatsAnalyse,
        auditLogs,
        accessRequests,
        addConsultation,
        addOrdonnance,
        getCarnetByPatientId,
        addAuditLog
    };
});
