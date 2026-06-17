<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { 
  Search, 
  Flame, 
  ChevronRight
} from '@lucide/vue';
import type { Patient } from '../../core/types';

const auth = useAuthStore();
const router = useRouter();

const searchQuery = ref('');
const showBriseGlaceModal = ref(false);

const filteredPatients = computed(() => {
  if (!searchQuery.value) return auth.registeredUsers.filter(u => u.role === 'PATIENT') as Patient[];
  const query = searchQuery.value.toLowerCase();
  return (auth.registeredUsers.filter(u => u.role === 'PATIENT') as Patient[]).filter(p => 
    p.nom.toLowerCase().includes(query) || 
    p.prenom.toLowerCase().includes(query) ||
    p.email.toLowerCase().includes(query)
  );
});

const viewPatient = (id: string) => {
  router.push(`/doctor/patient/${id}`);
};

const handleBriseGlace = () => {
  showBriseGlaceModal.value = false;
  // In a real app, this would log access and grant temporary decryption keys
  alert("Accès Brise-Glace activé. L'action a été journalisée.");
};
</script>

<template>
  <div class="doctor-dashboard animate-slide-up">
    <!-- Apple Header with Search -->
    <header class="apple-header">
      <h1 class="apple-title-large">Cabinet médical</h1>
      <div class="search-bar">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher un patient..."
          class="apple-input search-input"
        >
      </div>
    </header>

    <main style="padding: 0 1.25rem 6rem; margin-top: 1rem;">
      <!-- Emergency Card -->
      <div class="apple-card emergency-card" @click="showBriseGlaceModal = true">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div class="icon-circle bg-red pulse">
            <Flame :size="24" color="white" />
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: var(--apple-red);">MODE BRISE-GLACE</div>
            <div class="apple-text-secondary">Accès d'urgence immédiat</div>
          </div>
          <ChevronRight :size="20" color="var(--apple-red)" />
        </div>
      </div>

      <h2 class="apple-title-small" style="margin: 2rem 0 0.75rem;">Mes patients</h2>
      
      <div class="patient-grid">
        <div v-for="patient in filteredPatients" :key="patient.id" class="apple-card patient-mini-card" @click="viewPatient(patient.id)">
          <div class="patient-mini-avatar">{{ patient.prenom[0] }}{{ patient.nom[0] }}</div>
          <div style="margin-top: 0.75rem; font-weight: 600; font-size: 0.9rem; text-align: center;">
            {{ patient.nom }}
          </div>
          <div class="apple-text-secondary" style="font-size: 0.7rem; text-align: center;">
            {{ patient.groupeSanguin }}
          </div>
        </div>
      </div>
    </main>

    <!-- Brise-Glace Modal -->
    <div v-if="showBriseGlaceModal" class="modal-backdrop" @click="showBriseGlaceModal = false">
      <div class="modal-content animate-slide-up" @click.stop>
        <div class="icon-circle bg-red" style="margin: 0 auto 1.5rem;">
          <Flame :size="32" color="white" />
        </div>
        <h2 class="apple-title-medium">Accès d'Urgence</h2>
        <p class="apple-text-secondary" style="margin: 1rem 0 2rem;">
          L'utilisation du mode Brise-Glace contourne le consentement du patient. Cette action sera enregistrée de manière indélébile dans le journal d'audit.
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <button @click="handleBriseGlace" class="apple-button" style="background: var(--apple-red);">
            Confirmer l'accès
          </button>
          <button @click="showBriseGlaceModal = false" class="apple-button" style="background: #F2F2F7; color: black;">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles */
.search-bar {
  position: relative;
  margin-top: 1rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  z-index: 10;
}

.search-input {
  padding-left: 2.75rem !important;
  background: rgba(0,0,0,0.05) !important;
  height: 44px;
  margin-bottom: 0;
}

.emergency-card {
  border-left: 4px solid var(--apple-red);
  cursor: pointer;
  background: rgba(255, 59, 48, 0.03);
}

.icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-red { background-color: var(--apple-red); }

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

.pulse {
  animation: pulse 2s infinite ease-in-out;
}

.patient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.patient-mini-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
}

.patient-mini-avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--apple-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
</style>
