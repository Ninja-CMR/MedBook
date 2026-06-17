<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useMedicalStore } from '../../stores/medical';
import { 
  ChevronRight, 
  Activity,
} from '@lucide/vue';
import type { Patient } from '../../core/types';

const auth = useAuthStore();
const medical = useMedicalStore();

const patient = computed(() => auth.currentUser as Patient);
const lastConsultation = computed(() => medical.consultations[0]);
const activeOrdonnance = computed(() => medical.ordonnances.find(o => o.valide));

const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
</script>

<template>
  <div class="dashboard">
    <header class="apple-header">
      <p class="apple-text-secondary" style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em;">
        {{ dateStr }}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <h1 class="apple-title-large">Résumé</h1>
        <div class="user-avatar">
          {{ patient.prenom[0] }}{{ patient.nom[0] }}
        </div>
      </div>
    </header>

    <main style="padding: 0 1.25rem 6rem; margin-top: 1rem;">
      <!-- Profile Card (Dynamic Metrics) -->
      <div class="apple-card profile-card">
        <div class="profile-header">
          <div class="avatar-large">{{ patient.prenom[0] }}{{ patient.nom[0] }}</div>
          <div>
            <h2 class="apple-title-medium">{{ patient.prenom }} {{ patient.nom }}</h2>
            <p class="apple-text-secondary">{{ patient.groupeSanguin }} • PT-001</p>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-label">Allergies</span>
            <span class="metric-value" :class="{ 'text-red': patient.allergies !== 'Aucune' }">{{ patient.allergies }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Antécédents</span>
            <span class="metric-value">{{ patient.antecedents }}</span>
          </div>
        </div>
      </div>

      <h2 class="apple-title-small" style="margin: 1.5rem 0 0.75rem;">Activités récentes</h2>
      
      <!-- Last Consultation Card -->
      <div class="apple-card clickable" v-if="lastConsultation">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div class="icon-circle bg-blue">
            <Activity :size="20" color="white" />
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600;">Dernière consultation</div>
            <div class="apple-text-secondary">{{ lastConsultation.motif }} • {{ lastConsultation.date }}</div>
          </div>
          <ChevronRight :size="18" color="#C7C7CC" />
        </div>
      </div>

      <!-- Prescriptions Card -->
      <div class="apple-card activity-card" v-if="activeOrdonnance">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <Activity :size="20" color="var(--accent-orange)" />
            <span style="font-weight: 600;">Ordonnance active</span>
          </div>
          <span class="chip chip-blue">En cours</span>
        </div>
        <div style="margin-top: 0.5rem;">
          <div v-for="med in activeOrdonnance.medicaments" :key="med" class="med-item">
            <div class="dot"></div>
            <span>{{ med }}</span>
          </div>
        </div>
      </div>

      <div class="apple-card info-card" style="background: #E5F1FF; border: none;">
        <div style="display: flex; gap: 1rem;">
          <AlertCircle :size="32" color="var(--accent-blue)" />
          <div>
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--accent-blue);">Sécurité</h3>
            <p style="font-size: 0.85rem; color: #507DB2;">Vos médecins ne voient que ce que vous partagez.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  background: var(--bg-color);
  min-height: 100vh;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: #E5E5EA;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.profile-card {
  padding: 1.5rem;
}

.profile-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--apple-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.metrics-grid {
  display: grid;
  border-top: 0.5px solid var(--separator);
  padding-top: 1rem;
}

.small-metric {
  padding: 1rem;
}

.metric-label-small {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text-primary);
}

.metric-value-small {
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.med-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.9375rem;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-orange);
}

.info-card {
  padding: 1.25rem;
}
</style>
