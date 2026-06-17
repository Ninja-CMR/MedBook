<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { 
  Search, 
  ChevronRight, 
  Plus,
  BookOpen
} from '@lucide/vue';
import type { Patient } from '../../core/types';

const auth = useAuthStore();
const router = useRouter();

const searchQuery = ref('');

// A doctor's address book is a list of patients they follow.
// For the prototype, we'll derive this from the global registered users.
const addressBookPatients = computed(() => {
  return auth.registeredUsers.filter(u => u.role === 'PATIENT') as Patient[];
});

const filteredPatients = computed(() => {
  if (!searchQuery.value) return addressBookPatients.value;
  return addressBookPatients.value.filter(p => 
    p.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    p.prenom.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const viewRecord = (patientId: string) => {
  router.push(`/doctor/patient/${patientId}`);
};
</script>

<template>
  <div class="address-book animate-slide-up">
    <header class="apple-header">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem;">
        <h1 class="apple-title-large">Patients</h1>
        <button class="add-patient-btn">
          <Plus :size="20" color="var(--accent-blue)" />
        </button>
      </div>
      
      <div class="search-bar">
        <Search :size="18" class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher dans mes patients"
          class="apple-input search-input"
        >
      </div>
    </header>

    <main style="padding: 0 1.25rem 6rem;">
      <div v-if="filteredPatients.length > 0" class="patient-list">
        <!-- Alphabetical Grouping (Simple version) -->
        <div v-for="p in filteredPatients" :key="p.id" class="apple-card patient-item" @click="viewRecord(p.id)">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div class="patient-avatar">{{ p.prenom[0] }}{{ p.nom[0] }}</div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 1rem;">{{ p.nom }} {{ p.prenom }}</div>
              <div class="apple-text-secondary" style="font-size: 0.8rem;">
                {{ p.groupeSanguin }} • Né(e) le {{ p.dateNaissance }}
              </div>
            </div>
            <ChevronRight :size="18" color="#C7C7CC" />
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <BookOpen :size="64" color="#E5E5EA" />
        <p class="apple-text-secondary">Aucun patient trouvé dans votre répertoire.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.address-book {
  background: var(--bg-color);
  min-height: 100vh;
}

.add-patient-btn {
  background: #E5F1FF;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.search-bar {
  position: relative;
  margin-top: 0.5rem;
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

.patient-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.patient-item {
  margin-bottom: 0;
  cursor: pointer;
  transition: transform 0.1s;
}

.patient-item:active {
  transform: scale(0.98);
}

.patient-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #F2F2F7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--accent-blue);
  font-size: 0.95rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  gap: 1.5rem;
}
</style>
