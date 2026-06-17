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
  groupeSanguin: 'A+',
  dateNaissance: '',
  allergies: '',
  antecedents: '',
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
</script>

<template>
  <div class="signup-view animate-slide-up">
    <header class="apple-header">
      <button @click="router.push('/login')" class="back-btn">
        <ArrowLeft :size="24" color="var(--apple-blue)" />
      </button>
      <h1 class="apple-title-large">Inscription</h1>
      <p class="apple-text-secondary">Rejoignez le réseau MedBook.</p>
    </header>

    <main class="signup-main">
      <div class="apple-card">
        <!-- Step 1: Role -->
        <div v-if="step === 1" class="step-container">
          <h2 class="apple-title-medium">Vous êtes ?</h2>
          <div class="role-cards">
            <div @click="role = UserRole.PATIENT" class="role-card" :class="{ active: role === UserRole.PATIENT }">
              <div class="role-icon bg-blue">
                <UserIcon :size="32" color="white" />
              </div>
              <span class="role-label">Patient</span>
            </div>
            <div @click="role = UserRole.MEDECIN" class="role-card" :class="{ active: role === UserRole.MEDECIN }">
              <div class="role-icon bg-purple">
                <Stethoscope :size="32" color="white" />
              </div>
              <span class="role-label">Médecin</span>
            </div>
          </div>
          <button @click="step = 2" class="apple-button">Continuer</button>
        </div>

        <!-- Step 2: Personal -->
        <div v-if="step === 2" class="step-container">
          <h2 class="apple-title-medium">Identité</h2>
          <div class="input-grid">
            <div class="input-group">
              <label>Prénom</label>
              <input v-model="formData.prenom" type="text" class="apple-input" placeholder="Jean">
            </div>
            <div class="input-group">
              <label>Nom</label>
              <input v-model="formData.nom" type="text" class="apple-input" placeholder="Dupont">
            </div>
          </div>
          <div class="input-group">
            <label>Email</label>
            <input v-model="formData.email" type="email" class="apple-input" placeholder="jean@exemple.fr">
          </div>
          <div class="input-group">
            <label>Mot de passe</label>
            <input v-model="formData.password" type="password" class="apple-input" placeholder="••••••••">
          </div>
          <div class="actions">
            <button @click="step = 1" class="apple-button secondary">Retour</button>
            <button @click="step = 3" class="apple-button primary">Suivant</button>
          </div>
        </div>

        <!-- Step 3: Specific -->
        <div v-if="step === 3" class="step-container">
          <h2 class="apple-title-medium">Détails de santé</h2>
          
          <div v-if="role === UserRole.PATIENT">
            <div class="input-group">
              <label>Date de naissance</label>
              <input v-model="formData.dateNaissance" type="date" class="apple-input">
            </div>
            <div class="input-group">
              <label>Groupe Sanguin</label>
              <select v-model="formData.groupeSanguin" class="apple-input">
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
                <option>O+</option><option>O-</option>
              </select>
            </div>
            <div class="input-group">
              <label>Allergies connues</label>
              <input v-model="formData.allergies" type="text" class="apple-input" placeholder="Pollen, Arachides...">
            </div>
          </div>

          <div v-else>
            <div class="input-group">
              <label>Spécialité médicale</label>
              <input v-model="formData.specialite" type="text" class="apple-input" placeholder="Généraliste, Cardiologue...">
            </div>
            <div class="input-group">
              <label>Niveau d'accès requis</label>
              <select v-model="formData.niveauAcces" class="apple-input">
                <option :value="AccessLevel.FULL">Complet (Cabinet + Urgence)</option>
                <option :value="AccessLevel.LIMITED">Consultation uniquement</option>
              </select>
            </div>
          </div>

          <div class="actions">
            <button @click="step = 2" class="apple-button secondary">Retour</button>
            <button @click="handleRegister" class="apple-button primary" :disabled="loading">
              {{ loading ? 'Création...' : 'Finaliser' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.signup-view {
  background: var(--bg-color);
  min-height: 100vh;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.signup-main {
  padding: 1.5rem 1.25rem 6rem;
}

.step-container h2 {
  margin-bottom: 2rem;
  text-align: center;
}

.role-cards {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.role-card {
  flex: 1;
  background: #F2F2F7;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 2.5px solid transparent;
}

.role-card.active {
  background: white;
  border-color: var(--apple-blue);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.role-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-blue { background: var(--apple-blue); }
.bg-purple { background: var(--apple-purple); }

.role-label {
  font-weight: 700;
  font-size: 0.95rem;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
  margin-left: 4px;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.actions .secondary {
  flex: 1;
  background: #F2F2F7;
  color: black;
}

.actions .primary {
  flex: 2;
}
</style>
