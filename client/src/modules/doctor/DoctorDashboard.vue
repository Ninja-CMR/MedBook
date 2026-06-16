<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useMedicalStore } from '../../stores/medical';
import { 
  Search, 
  Flame, 
  History,
  Activity,
  PlusCircle
} from '@lucide/vue';

const auth = useAuthStore();
const medical = useMedicalStore();

const searchQuery = ref('');
const showBriseGlaceModal = ref(false);

const mockPatients = [
  { id: 'p1', nom: 'Dupont', prenom: 'Jean', email: 'patient@example.com' },
  { id: 'p2', nom: 'Martin', prenom: 'Marie', email: 'marie@example.com' },
];

const filteredPatients = computed(() => {
  if (!searchQuery.value) return [];
  return mockPatients.filter(p => 
    p.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    p.prenom.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleEmergencyAccess = () => {
  showBriseGlaceModal.value = true;
};

const confirmEmergency = () => {
  // Mock logic for Brise-Glace
  medical.addAuditLog('EMERGENCY_ACCESS', auth.currentUser?.id || 'unknown', 'Emergency access triggered for patient P-001');
  showBriseGlaceModal.value = false;
  alert('Accès d\'urgence activé. Session enregistrée dans le journal d\'audit.');
};
</script>

<template>
  <div class="doctor-dashboard">
    <header class="apple-header">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem;">
        <h1 class="apple-title-large">Cabinet</h1>
        <div class="user-avatar" style="background: #E5F1FF; color: var(--accent-blue);">
          Dr. {{ auth.currentUser?.nom }}
        </div>
      </div>

      <div class="search-container">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          class="apple-input search-input" 
          placeholder="Rechercher un patient (Nom, Email...)"
        >
      </div>
    </header>

    <main style="padding: 0 1.25rem 6rem;">
      <!-- Search Results -->
      <div v-if="searchQuery" class="search-results">
        <h2 class="apple-title-medium" style="margin-bottom: 1rem;">Résultats</h2>
        <div v-if="filteredPatients.length > 0">
          <div v-for="p in filteredPatients" :key="p.id" class="apple-card patient-card">
            <div class="patient-info">
              <div class="patient-avatar">{{ p.prenom[0] }}{{ p.nom[0] }}</div>
              <div>
                <div style="font-weight: 600;">{{ p.prenom }} {{ p.nom }}</div>
                <div class="apple-text-secondary" style="font-size: 0.8rem;">{{ p.email }}</div>
              </div>
            </div>
            <button class="action-btn">
              <PlusCircle :size="20" color="var(--accent-blue)" />
            </button>
          </div>
        </div>
        <div v-else class="apple-text-secondary" style="text-align: center; padding: 2rem;">
          Aucun patient trouvé.
        </div>
      </div>

      <!-- Emergency Section -->
      <div class="apple-card emergency-card" @click="handleEmergencyAccess">
        <div class="emergency-content">
          <div class="emergency-icon">
            <Flame :size="24" color="white" />
          </div>
          <div>
            <h3 style="font-weight: 700; color: white;">Mode Brise-Glace</h3>
            <p style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.8);">Accès d'urgence sans consentement immédiat.</p>
          </div>
        </div>
        <ChevronRight :size="20" color="white" />
      </div>

      <!-- Recent Patients -->
      <h2 class="apple-title-medium" style="margin: 1.5rem 0 1rem;">Patients récents</h2>
      <div class="apple-card recent-list">
        <div v-for="p in mockPatients" :key="p.id" class="list-item">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <History :size="20" color="var(--text-secondary)" />
            <div>
              <div style="font-weight: 500;">{{ p.prenom }} {{ p.nom }}</div>
              <div class="apple-text-secondary" style="font-size: 0.75rem;">Dernière visite: Hier</div>
            </div>
          </div>
          <ChevronRight :size="18" color="#C7C7CC" />
        </div>
      </div>

      <!-- Quick Actions -->
      <h2 class="apple-title-medium" style="margin: 1.5rem 0 1rem;">Action rapide</h2>
      <div class="quick-actions">
        <div class="apple-card action-card">
          <Activity :size="24" color="var(--accent-green)" />
          <span>Nouvelle Consultation</span>
        </div>
        <div class="apple-card action-card">
          <Clipboard :size="24" color="var(--accent-indigo)" />
          <span>Ordonnance</span>
        </div>
      </div>
    </main>

    <!-- Emergency Modal -->
    <Teleport to="body">
      <div v-if="showBriseGlaceModal" class="modal-overlay">
        <div class="apple-card modal-content">
          <h2 class="apple-title-medium" style="color: var(--accent-red); margin-bottom: 1rem;">ATTENTION</h2>
          <p class="apple-text-secondary" style="margin-bottom: 1.5rem;">
            L'utilisation du mode <strong>"Brise-Glace"</strong> est strictement réservée aux situations d'urgence vitale. 
            Toute consultation sera enregistrée de manière indélébile dans le journal d'audit du patient.
          </p>
          <div style="display: flex; gap: 1rem;">
            <button @click="showBriseGlaceModal = false" class="apple-button" style="background: #E5E5EA; color: var(--text-primary); flex: 1;">
              Annuler
            </button>
            <button @click="confirmEmergency" class="apple-button" style="background: var(--accent-red); flex: 1;">
              Confirmer l'accès
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.doctor-dashboard {
  background: var(--bg-color);
  min-height: 100vh;
}

.user-avatar {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input {
  padding-left: 2.75rem;
  background: #E5E5EA;
  border: none;
}

.patient-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.patient-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #F2F2F7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--accent-blue);
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.emergency-card {
  background: linear-gradient(135deg, #FF3B30, #FF9500);
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.emergency-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.emergency-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recent-list {
  padding: 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #F2F2F7;
  cursor: pointer;
}

.list-item:last-child {
  border-bottom: none;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
}

.action-card span {
  font-size: 0.85rem;
  font-weight: 600;
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
  padding: 2rem;
}

.modal-content {
  max-width: 400px;
  width: 100%;
}
</style>
