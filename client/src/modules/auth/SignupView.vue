<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useMedicalStore } from '../../stores/medical';
import { UserRole, AccessLevel } from '../../core/types';
import type { Patient, Medecin } from '../../core/types';
import { Stethoscope, User as UserIcon, ArrowLeft } from '@lucide/vue';

const auth = useAuthStore();
const medical = useMedicalStore();
const router = useRouter();

const role = ref<UserRole>(UserRole.PATIENT);
const step = ref(1);
const loading = ref(false);

const formData = ref({
  nom: '',
  prenom: '',
  email: '',
  password: '',
  // Patient fields
  groupeSanguin: 'A+',
  dateNaissance: '',
  allergies: '',
  antecedents: '',
  // Doctor fields
  specialite: '',
  niveauAcces: AccessLevel.FULL,
});

const handleRegister = () => {
  loading.value = true;
  
  const id = Math.random().toString(36).substr(2, 9);
  
  if (role.value === UserRole.PATIENT) {
    const newPatient: Patient = {
      id,
      id_patient: 'PT-' + Math.floor(1000 + Math.random() * 9000),
      nom: formData.value.nom,
      prenom: formData.value.prenom,
      email: formData.value.email,
      role: UserRole.PATIENT,
      groupeSanguin: formData.value.groupeSanguin,
      dateNaissance: formData.value.dateNaissance,
      allergies: formData.value.allergies,
      antecedents: formData.value.antecedents,
    };
    
    auth.register(newPatient);
    
    // Auto-create carnet
    medical.carnets.push({
      id_carnet: 'CN-' + Math.floor(1000 + Math.random() * 9000),
      dateCreation: new Date().toISOString().split('T')[0],
      cle: 'AES-' + Math.random().toString(36).substr(2, 12),
      patient_id: id
    });
    
  } else {
    const newMedecin: Medecin = {
      id,
      id_med: 'MED-' + Math.floor(1000 + Math.random() * 9000),
      nom: formData.value.nom,
      prenom: formData.value.prenom,
      email: formData.value.email,
      role: UserRole.MEDECIN,
      specialite: formData.value.specialite,
      niveauAcces: formData.value.niveauAcces,
    };
    
    auth.register(newMedecin);
  }

  setTimeout(() => {
    loading.value = false;
    router.push(role.value === UserRole.PATIENT ? '/patient' : '/doctor');
  }, 1000);
};

const nextStep = () => step.value++;
const prevStep = () => step.value--;
</script>

<template>
  <div class="signup-container">
    <header class="apple-header">
      <button @click="router.push('/login')" class="back-btn">
        <ArrowLeft :size="24" color="var(--accent-blue)" />
      </button>
      <h1 class="apple-title-large" style="margin-top: 1rem;">Inscription</h1>
      <p class="apple-text-secondary">Créez votre compte MedBook en quelques instants.</p>
    </header>

    <main style="padding: 0 1.25rem 4rem;">
      <div class="apple-card">
        <!-- Step 1: Role Selection -->
        <div v-if="step === 1">
          <h2 class="apple-title-medium" style="margin-bottom: 1.5rem;">Quel est votre rôle ?</h2>
          <div class="role-selector">
            <button @click="role = UserRole.PATIENT" class="role-btn" :class="{ active: role === UserRole.PATIENT }">
              <UserIcon :size="32" />
              <span>Patient</span>
            </button>
            <button @click="role = UserRole.MEDECIN" class="role-btn" :class="{ active: role === UserRole.MEDECIN }">
              <Stethoscope :size="32" />
              <span>Médecin</span>
            </button>
          </div>
          <button @click="nextStep" class="apple-button" style="margin-top: 1rem;">Continuer</button>
        </div>

        <!-- Step 2: Personal Info -->
        <div v-if="step === 2">
          <h2 class="apple-title-medium" style="margin-bottom: 1.5rem;">Informations personnelles</h2>
          <div class="form-group">
            <label class="apple-text-secondary">Prénom</label>
            <input v-model="formData.prenom" type="text" class="apple-input" placeholder="Jean">
          </div>
          <div class="form-group">
            <label class="apple-text-secondary">Nom</label>
            <input v-model="formData.nom" type="text" class="apple-input" placeholder="Dupont">
          </div>
          <div class="form-group">
            <label class="apple-text-secondary">Email</label>
            <input v-model="formData.email" type="email" class="apple-input" placeholder="jean.dupont@email.com">
          </div>
          <div class="form-group">
            <label class="apple-text-secondary">Mot de passe</label>
            <input v-model="formData.password" type="password" class="apple-input" placeholder="••••••••">
          </div>
          
          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button @click="prevStep" class="apple-button" style="background: #F2F2F7; color: var(--text-primary); flex: 1;">Retour</button>
            <button @click="nextStep" class="apple-button" style="flex: 2;">Suivant</button>
          </div>
        </div>

        <!-- Step 3: Specific Info -->
        <div v-if="step === 3">
          <h2 class="apple-title-medium" style="margin-bottom: 1.5rem;">Détails spécifiques</h2>
          
          <!-- Patient specific -->
          <div v-if="role === UserRole.PATIENT">
            <div class="form-group">
              <label class="apple-text-secondary">Date de naissance</label>
              <input v-model="formData.dateNaissance" type="date" class="apple-input">
            </div>
            <div class="form-group">
              <label class="apple-text-secondary">Groupe Sanguin</label>
              <select v-model="formData.groupeSanguin" class="apple-input">
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
                <option>O+</option><option>O-</option>
              </select>
            </div>
            <div class="form-group">
              <label class="apple-text-secondary">Allergies</label>
              <input v-model="formData.allergies" type="text" class="apple-input" placeholder="Aucune, ou précisez...">
            </div>
          </div>

          <!-- Medecin specific -->
          <div v-if="role === UserRole.MEDECIN">
            <div class="form-group">
              <label class="apple-text-secondary">Spécialité</label>
              <input v-model="formData.specialite" type="text" class="apple-input" placeholder="Ex: Cardiologie, Généraliste...">
            </div>
            <div class="form-group">
              <label class="apple-text-secondary">Niveau d'accès requis</label>
              <select v-model="formData.niveauAcces" class="apple-input">
                <option :value="AccessLevel.FULL">Complet (Administrateur)</option>
                <option :value="AccessLevel.LIMITED">Limité (Consultation)</option>
              </select>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button @click="prevStep" class="apple-button" style="background: #F2F2F7; color: var(--text-primary); flex: 1;">Retour</button>
            <button @click="handleRegister" class="apple-button" style="flex: 2;" :disabled="loading">
              <span v-if="!loading">Finaliser</span>
              <span v-else>Création...</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.signup-container {
  background: var(--bg-color);
  min-height: 100vh;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0;
}

.role-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.role-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 20px;
  border: 2px solid transparent;
  background: #F2F2F7;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.role-btn.active {
  background: #E5F1FF;
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}

.role-btn span {
  font-weight: 700;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
}
</style>
