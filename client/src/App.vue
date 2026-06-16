<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { Home, ClipboardList, ShieldCheck, LogOut } from '@lucide/vue';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const showNav = computed(() => auth.isAuthenticated && route.path !== '/login');

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <nav v-if="showNav" class="bottom-nav">
      <router-link to="/patient" v-if="auth.userRole === 'PATIENT'" class="nav-item" :class="{ active: route.path === '/patient' }">
        <Home :size="24" />
        <span>Résumé</span>
      </router-link>
      <router-link to="/doctor" v-if="auth.userRole === 'MEDECIN'" class="nav-item" :class="{ active: route.path === '/doctor' }">
        <Home :size="24" />
        <span>Cabinet</span>
      </router-link>
      
      <router-link v-if="auth.userRole === 'PATIENT'" to="/patient/audit" class="nav-item" :class="{ active: route.path === '/patient/audit' }">
        <ClipboardList :size="24" />
        <span>Audit</span>
      </router-link>
      
      <router-link v-if="auth.userRole === 'PATIENT'" to="/patient/sharing" class="nav-item" :class="{ active: route.path === '/patient/sharing' }">
        <ShieldCheck :size="24" />
        <span>Partage</span>
      </router-link>

      <button @click="handleLogout" class="nav-item" style="background: none; border: none; cursor: pointer;">
        <LogOut :size="24" />
        <span>Quitter</span>
      </button>
    </nav>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
