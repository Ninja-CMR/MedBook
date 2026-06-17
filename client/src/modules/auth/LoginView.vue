<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { UserRole } from '../../core/types';
import { ShieldCheck, Stethoscope, User as UserIcon } from '@lucide/vue';

const auth = useAuthStore();
const router = useRouter();

const email = ref('patient@example.com');
const role = ref<UserRole>(UserRole.PATIENT);
const loading = ref(false);

const handleLogin = () => {
  loading.value = true;
  setTimeout(() => {
    const success = auth.login(email.value, role.value);
    if (success) {
      router.push(role.value === UserRole.PATIENT ? '/patient' : '/doctor');
    } else {
      alert('Email ou rôle incorrect');
    }
    loading.value = false;
  }, 800);
};

const setRole = (r: UserRole) => {
  role.value = r;
  email.value = r === UserRole.PATIENT ? 'patient@example.com' : 'doctor@example.com';
};
</script>

<template>
  <div class="login-container">
    <div class="apple-header" style="text-align: center; margin-bottom: 2rem;">
      <ShieldCheck :size="64" color="var(--accent-blue)" style="margin-bottom: 1rem;" />
      <h1 class="apple-title-large">MedBook</h1>
      <p class="apple-text-secondary">Vos données de santé, partout avec vous.</p>
    </div>

    <div class="apple-card">
      <h2 class="apple-title-medium" style="margin-bottom: 1.5rem; text-align: center;">Connexion</h2>
      
      <div class="role-selector">
        <button 
          @click="setRole(UserRole.PATIENT)" 
          class="role-btn" 
          :class="{ active: role === UserRole.PATIENT }"
        >
          <UserIcon :size="24" />
          <span>Patient</span>
        </button>
        <button 
          @click="setRole(UserRole.MEDECIN)" 
          class="role-btn" 
          :class="{ active: role === UserRole.MEDECIN }"
        >
          <Stethoscope :size="24" />
          <span>Médecin</span>
        </button>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label class="apple-text-secondary" style="display: block; margin-bottom: 0.5rem; margin-left: 0.5rem;">Adresse email</label>
        <input v-model="email" type="email" class="apple-input" placeholder="nom@exemple.com">
      </div>

      <button @click="handleLogin" class="apple-button" :disabled="loading">
        <span v-if="!loading">Se connecter</span>
        <span v-else>Chargement...</span>
      </button>

      <p @click="router.push('/signup')" class="apple-text-secondary" style="text-align: center; margin-top: 1.5rem; cursor: pointer; color: var(--accent-blue); font-weight: 500;">
        Pas encore de compte ? Créer un compte
      </p>
    </div>

    <p class="apple-text-secondary" style="text-align: center; font-size: 0.8rem; margin-top: 2rem;">
      Prototype sécurisé par chiffrement local.
    </p>
  </div>
</template>

<style scoped>
.login-container {
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}

.role-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.role-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 16px;
  border: 2px solid #F2F2F7;
  background: #F2F2F7;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.role-btn.active {
  border-color: var(--accent-blue);
  background: #E5F1FF;
  color: var(--accent-blue);
}

.role-btn span {
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
