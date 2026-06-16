<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMedicalStore } from '../../stores/medical';
import { 
  ArrowLeft, 
  Plus, 
  Activity, 
  ChevronRight,
  FileText
} from '@lucide/vue';
import type { Patient } from '../../core/types';

const route = useRoute();
const router = useRouter();
const medical = useMedicalStore();

const patientId = route.params.id as string;

// Mock patient lookup - in a real app this would be a store action
const patient = ref<Patient>({
  id: 'p1',
  id_patient: 'PT-001',
  email: 'patient@example.com',
  nom: 'Dupont',
  prenom: 'Jean',
  role: 'PATIENT' as any,
  groupeSanguin: 'A+',
  dateNaissance: '1985-05-20',
  allergies: 'Pollen, Penicilline',
  antecedents: 'Asthme léger',
});

const carnet = computed(() => medical.getCarnetByPatientId(patientId));
const patientConsultations = computed(() => medical.consultations.filter(c => c.carnet_id === carnet.value?.id_carnet));
const patientOrdonnances = computed(() => medical.ordonnances.filter(o => o.carnet_id === carnet.value?.id_carnet));

const showConsultationForm = ref(false);

const goBack = () => router.push('/doctor');
</script>

<template>
  <div class="patient-record-view">
    <header class="apple-header" style="background: white; border-bottom: 1px solid #F2F2F7; padding-top: 1rem;">
      <button @click="goBack" class="back-btn">
        <ArrowLeft :size="24" color="var(--accent-blue)" />
      </button>
      
      <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem;">
        <div class="patient-avatar-large">{{ patient.prenom[0] }}{{ patient.nom[0] }}</div>
        <div>
          <h1 class="apple-title-medium">{{ patient.prenom }} {{ patient.nom }}</h1>
          <p class="apple-text-secondary">{{ patient.dateNaissance }} • {{ patient.groupeSanguin }}</p>
        </div>
      </div>
    </header>

    <main style="padding: 1.25rem 1.25rem 6rem;">
      <!-- Quick Info Bar -->
      <div class="info-bar apple-card">
        <div class="info-item">
          <span class="info-label">Allergies</span>
          <span class="info-value" style="color: var(--accent-red);">{{ patient.allergies }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Antécédents</span>
          <span class="info-value">{{ patient.antecedents }}</span>
        </div>
      </div>

      <!-- Section Tabs Toggle (Mock) -->
      <div class="tabs-container">
        <button class="tab-btn active">Historique</button>
        <button class="tab-btn">Analyses</button>
        <button class="tab-btn">Vaccins</button>
      </div>

      <!-- History Feed -->
      <div class="history-list">
        <!-- Add Action -->
        <button @click="showConsultationForm = true" class="apple-card add-history-card">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="add-icon">
              <Plus :size="20" color="white" />
            </div>
            <span style="font-weight: 600; color: var(--accent-blue);">Nouvelle consultation</span>
          </div>
        </button>

        <div v-for="item in [...patientConsultations, ...patientOrdonnances].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())" :key="item.id" class="history-item">
          <div class="history-date">
            {{ new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }}
          </div>
          <div class="history-content apple-card">
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div v-if="'motif' in item" class="history-type-icon" style="background: #E5F1FF;">
                <FileText :size="18" color="var(--accent-blue)" />
              </div>
              <div v-else class="history-type-icon" style="background: #FFEBEA;">
                <Activity :size="18" color="var(--accent-red)" />
              </div>
              
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                  <span style="font-weight: 700; font-size: 0.95rem;">
                    {{ 'motif' in item ? 'Consultation' : 'Ordonnance' }}
                  </span>
                  <ChevronRight :size="18" color="#C7C7CC" />
                </div>
                <p v-if="'motif' in item" class="apple-text-secondary" style="font-size: 0.85rem;">{{ item.motif }}</p>
                <p v-if="'medicaments' in item" class="apple-text-secondary" style="font-size: 0.85rem;">{{ item.medicaments.join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Consultation Form Overlay (Mock) -->
    <Teleport to="body">
      <div v-if="showConsultationForm" class="modal-overlay">
        <div class="apple-card modal-content" style="max-height: 90vh; overflow-y: auto;">
          <h2 class="apple-title-medium" style="margin-bottom: 1.5rem;">Dossier de Consultation</h2>
          
          <div style="margin-bottom: 1rem;">
            <label class="apple-text-secondary">Motif</label>
            <input type="text" class="apple-input" placeholder="Ex: Douleurs thoraciques">
          </div>
          
          <div style="margin-bottom: 1rem;">
            <label class="apple-text-secondary">Diagnostique</label>
            <textarea class="apple-input" style="height: 100px;" placeholder="Détails cliniques..."></textarea>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <label class="apple-text-secondary">Ordonnance</label>
              <button class="apple-text-secondary" style="background: none; border: none; color: var(--accent-blue);">+ Ajouter médicament</button>
            </div>
            <div class="apple-card" style="padding: 0.75rem; background: #F2F2F7; border: none;">
              <p class="apple-text-secondary" style="font-size: 0.8rem; text-align: center;">Aucun médicament ajouté</p>
            </div>
          </div>

          <div style="display: flex; gap: 1rem;">
            <button @click="showConsultationForm = false" class="apple-button" style="background: #F2F2F7; color: var(--text-primary); flex: 1;">
              Fermer
            </button>
            <button @click="showConsultationForm = false" class="apple-button" style="flex: 2;">
              Signer et Enregistrer
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.patient-record-view {
  background: var(--bg-color);
  min-height: 100vh;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.patient-avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #F2F2F7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-blue);
}

.info-bar {
  display: flex;
  padding: 1rem;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 600;
}

.tabs-container {
  display: flex;
  background: #E5E5EA;
  padding: 2px;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.tab-btn {
  flex: 1;
  border: none;
  background: none;
  padding: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary);
}

.tab-btn.active {
  background: white;
  color: var(--text-primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-history-card {
  border: 1px dashed var(--accent-blue);
  background: rgba(0, 122, 255, 0.05);
  cursor: pointer;
}

.add-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-item {
  display: flex;
  gap: 1rem;
}

.history-date {
  width: 40px;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: right;
  padding-top: 1rem;
  color: var(--text-secondary);
  line-height: 1.2;
}

.history-content {
  flex: 1;
  margin-bottom: 0;
}

.history-type-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.25rem;
}

.modal-content {
  max-width: 500px;
  width: 100%;
}
</style>
