<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useMedicalStore } from '../../stores/medical';
import { 
  Activity, 
  Clipboard, 
  Calendar, 
  Droplet, 
  ChevronRight,
  TrendingUp,
  AlertCircle
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

    <main style="padding: 0 1.25rem 6rem;">
      <!-- Health Metrics (Apple Health style) -->
      <div class="apple-card health-metric">
        <div class="metric-header">
          <div class="metric-icon" style="background: #FFEBEA;">
            <Droplet :size="18" color="var(--accent-red)" />
          </div>
          <span class="metric-label" style="color: var(--accent-red)">Groupe Sanguin</span>
        </div>
        <div class="metric-value">{{ patient.groupeSanguin }}</div>
        <div class="apple-text-secondary">Précision vérifiée</div>
      </div>

      <div class="metrics-grid">
        <div class="apple-card small-metric">
          <div class="metric-header">
            <TrendingUp :size="16" color="var(--accent-green)" />
            <span class="metric-label-small">Allergies</span>
          </div>
          <div class="metric-value-small">{{ patient.allergies }}</div>
        </div>
        <div class="apple-card small-metric">
          <div class="metric-header">
            <Clipboard :size="16" color="var(--accent-blue)" />
            <span class="metric-label-small">Antécédents</span>
          </div>
          <div class="metric-value-small">{{ patient.antecedents }}</div>
        </div>
      </div>

      <h2 class="apple-title-medium" style="margin: 1.5rem 0 1rem;">Activités récentes</h2>

      <!-- Consultations Card -->
      <div class="apple-card activity-card" v-if="lastConsultation">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <Calendar :size="20" color="var(--accent-indigo)" />
            <span style="font-weight: 600;">Dernière consultation</span>
          </div>
          <span class="apple-text-secondary">{{ lastConsultation.date }}</span>
        </div>
        <p class="apple-text-secondary">{{ lastConsultation.motif }}</p>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #F2F2F7; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.9rem; font-weight: 500;">{{ lastConsultation.diagnostique }}</span>
          <ChevronRight :size="20" color="#C7C7CC" />
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

.health-metric {
  padding: 1.5rem;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-label {
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
