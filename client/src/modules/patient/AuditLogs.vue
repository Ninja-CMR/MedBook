<script setup lang="ts">
import { computed } from 'vue';
import { History, Eye, ShieldAlert, Lock, User as UserIcon } from '@lucide/vue';
import { useMedicalStore } from '../../stores/medical';

const medical = useMedicalStore();

const logs = computed(() => medical.auditLogs);


const getIcon = (action: string) => {
  switch (action) {
    case 'EMERGENCY_ACCESS': return ShieldAlert;
    case 'CONSULT_CARNET': return Eye;
    case 'REVOKE_ACCESS': return Lock;
    default: return History;
  }
};

const getIconColor = (action: string) => {
  switch (action) {
    case 'EMERGENCY_ACCESS': return 'var(--accent-red)';
    case 'REVOKE_ACCESS': return 'var(--accent-orange)';
    case 'CONSULT_CARNET': return 'var(--accent-blue)';
    default: return 'var(--text-secondary)';
  }
};
</script>

<template>
  <div class="audit-view">
    <header class="apple-header" style="background: white; border-bottom: 1px solid #F2F2F7; padding-top: 1rem;">
      <h1 class="apple-title-large">Journal d'audit</h1>
      <p class="apple-text-secondary">Historique des accès à vos données.</p>
    </header>

    <main style="padding: 1.25rem 1.25rem 6rem;">
      <div v-if="logs.length > 0" class="timeline">
        <div v-for="log in logs" :key="log.id" class="log-item">
          <div class="log-icon-container">
            <div class="log-line"></div>
            <div class="log-icon" :style="{ background: getIconColor(log.action) + '22' }">
              <component :is="getIcon(log.action)" :size="18" :color="getIconColor(log.action)" />
            </div>
          </div>
          <div class="log-content apple-card">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
              <span style="font-weight: 700; font-size: 0.9rem;">{{ log.action.replace('_', ' ') }}</span>
              <span class="apple-text-secondary" style="font-size: 0.7rem;">{{ new Date(log.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
            <p class="apple-text-secondary" style="font-size: 0.8rem;">{{ log.details }}</p>
            <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
               <UserIcon :size="12" color="#C7C7CC" />
               <span style="font-size: 0.75rem; color: #C7C7CC;">Par: {{ log.utilisateur_id }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="apple-text-secondary" style="text-align: center; padding: 4rem;">
        Aucune activité enregistrée pour le moment.
      </div>
    </main>
  </div>
</template>

<style scoped>
.audit-view {
  background: var(--bg-color);
  min-height: 100vh;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.log-item {
  display: flex;
  gap: 1rem;
}

.log-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  position: relative;
}

.log-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #E5E5EA;
  z-index: 1;
}

.log-item:first-child .log-line {
  top: 1rem;
}

.log-item:last-child .log-line {
  bottom: calc(100% - 1rem);
}

.log-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  margin-top: 1rem;
  box-shadow: 0 0 0 4px var(--bg-color);
}

.log-content {
  flex: 1;
  margin-bottom: 1rem;
}
</style>
