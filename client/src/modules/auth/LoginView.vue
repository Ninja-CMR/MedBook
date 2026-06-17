<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { UserRole } from '../../core/types';
import { ShieldCheck, Stethoscope, User as UserIcon } from '@lucide/vue';

const auth = useAuthStore();
const router = useRouter();

const role = ref<UserRole>(UserRole.PATIENT);
const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = () => {
  loading.value = true;
  setTimeout(() => {
    const success = auth.login(email.value, role.value);
    loading.value = false;
    if (success) {
      router.push(role.value === UserRole.PATIENT ? '/patient' : '/doctor');
    } else {
      alert('Identifiants invalides pour ce rôle.');
    }
  }, 1000);
};
</script>

<template>
  <div class="login-view animate-slide-up">
    <div class="login-container">
      <header class="login-header">
        <div class="logo-circle">
          <ShieldCheck :size="48" color="white" />
        </div>
        <h1 class="apple-title-large">MedBook</h1>
        <p class="apple-text-secondary">Vos données de santé, partout avec vous.</p>
      </header>

      <div class="apple-card">
        <div class="role-tabs">
          <button 
            @click="role = UserRole.PATIENT" 
            class="role-tab" 
            :class="{ active: role === UserRole.PATIENT }"
          >
            <UserIcon :size="20" />
            <span>Patient</span>
          </button>
          <button 
            @click="role = UserRole.MEDECIN" 
            class="role-tab" 
            :class="{ active: role === UserRole.MEDECIN }"
          >
            <Stethoscope :size="20" />
            <span>Médecin</span>
          </button>
        </div>

        <div class="form-body">
          <div class="input-group">
            <label>Adresse email</label>
            <input v-model="email" type="email" class="apple-input" placeholder="nom@exemple.fr">
          </div>
          <div class="input-group">
            <label>Mot de passe</label>
            <input v-model="password" type="password" class="apple-input" placeholder="••••••••">
          </div>
          
          <button @click="handleLogin" class="apple-button" :disabled="loading">
            <span v-if="!loading">Se connecter</span>
            <span v-else>Connexion en cours...</span>
          </button>
        </div>
      </div>

      <p @click="router.push('/signup')" class="signup-link">
        Pas encore de compte ? <span>Créer un compte</span>
      </p>

      <footer class="login-footer">
        <p>© 2026 MedBook Prototype • Sécurisé par AES-256</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 1.25rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: var(--apple-blue);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 122, 255, 0.3);
}

.role-tabs {
  display: flex;
  background: #F2F2F7;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.role-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.role-tab.active {
  background: white;
  color: var(--apple-blue);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.form-body {
  display: flex;
  flex-direction: column;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
  margin-left: 4px;
}

.signup-link {
  text-align: center;
  margin-top: 2rem;
  font-size: 15px;
  color: var(--text-secondary);
  cursor: pointer;
}

.signup-link span {
  color: var(--apple-blue);
  font-weight: 600;
}

.login-footer {
  margin-top: 4rem;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
