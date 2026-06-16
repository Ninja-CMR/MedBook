<script setup lang="ts">
import { ref } from 'vue';
import { ShieldCheck, User as UserIcon, X, Plus } from '@lucide/vue';
import { useMedicalStore } from '../../stores/medical';

const medical = useMedicalStore();

const doctorsWithAccess = ref([
  { id: 'd1', nom: 'Smith', prenom: 'Alice', specialite: 'Cardiologie', dateAcces: '2024-05-10' },
  { id: 'd2', nom: 'Gilles', prenom: 'Marc', specialite: 'Médecin Généraliste', dateAcces: '2023-11-20' },
]);

const revokeAccess = (id: string) => {
  if (confirm('Voulez-vous vraiment révoquer l\'accès pour ce médecin ?')) {
    doctorsWithAccess.value = doctorsWithAccess.value.filter(d => d.id !== id);
    medical.addAuditLog('REVOKE_ACCESS', 'patient_self', `Access revoked for doctor ${id}`);
  }
};

</script>

<template>
  <div class="sharing-view">
    <header class="apple-header" style="background: white; border-bottom: 1px solid #F2F2F7; padding-top: 1rem;">
      <h1 class="apple-title-large">Partage</h1>
      <p class="apple-text-secondary">Gérez qui peut consulter vos données.</p>
    </header>

    <main style="padding: 1.25rem 1.25rem 6rem;">
      <div class="apple-card invite-card">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div class="invite-icon">
            <Plus :size="24" color="white" />
          </div>
          <div>
            <h3 style="font-weight: 600;">Inviter un médecin</h3>
            <p class="apple-text-secondary" style="font-size: 0.8rem;">Partagez votre carnet via email ou ID.</p>
          </div>
        </div>
      </div>

      <h2 class="apple-title-medium" style="margin: 2rem 0 1rem;">Médecins autorisés</h2>
      
      <div v-if="doctorsWithAccess.length > 0" class="doctor-list">
        <div v-for="doc in doctorsWithAccess" :key="doc.id" class="apple-card doctor-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div class="doc-avatar">
                <UserIcon :size="20" color="var(--accent-blue)" />
              </div>
              <div>
                <div style="font-weight: 600;">Dr. {{ doc.prenom }} {{ doc.nom }}</div>
                <div class="apple-text-secondary" style="font-size: 0.75rem;">{{ doc.specialite }}</div>
                <div class="apple-text-secondary" style="font-size: 0.7rem; margin-top: 2px;">Accès depuis: {{ doc.dateAcces }}</div>
              </div>
            </div>
            <button @click="revokeAccess(doc.id)" class="revoke-btn">
              <X :size="18" color="var(--accent-red)" />
            </button>
          </div>
        </div>
      </div>
      <div v-else class="apple-text-secondary" style="text-align: center; padding: 3rem;">
        Aucun médecin n'a actuellement accès à votre carnet.
      </div>

      <div class="apple-card info-box" style="margin-top: 2rem;">
        <div style="display: flex; gap: 1rem;">
          <ShieldCheck :size="24" color="var(--accent-green)" />
          <p style="font-size: 0.85rem; line-height: 1.4;">
            <strong>Confidentialité :</strong> Vos données sont chiffrées. Même en cas d'accès autorisé, vous gardez une trace de chaque consultation.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.sharing-view {
  background: var(--bg-color);
  min-height: 100vh;
}

.invite-card {
  background: white;
  cursor: pointer;
  border: 1.5px dashed var(--accent-blue);
}

.invite-icon {
  width: 44px;
  height: 44px;
  background: var(--accent-blue);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doctor-card {
  margin-bottom: 1rem;
}

.doc-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E5F1FF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.revoke-btn {
  background: #FFEBEA;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.info-box {
  background: #F2F2F7;
  border: none;
}
</style>
