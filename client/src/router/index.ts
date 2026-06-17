import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../modules/auth/LoginView.vue';
import PatientDashboard from '../modules/patient/PatientDashboard.vue';
import DoctorDashboard from '../modules/doctor/DoctorDashboard.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: LoginView },
        { path: '/signup', component: () => import('../modules/auth/SignupView.vue') },
        {
            path: '/patient',
            component: PatientDashboard,
            meta: { requiresAuth: true, role: 'PATIENT' }
        },
        {
            path: '/patient/sharing',
            component: () => import('../modules/patient/AccessSharing.vue'),
            meta: { requiresAuth: true, role: 'PATIENT' }
        },
        {
            path: '/patient/audit',
            component: () => import('../modules/patient/AuditLogs.vue'),
            meta: { requiresAuth: true, role: 'PATIENT' }
        },
        {
            path: '/doctor',
            component: DoctorDashboard,
            meta: { requiresAuth: true, role: 'MEDECIN' }
        },
        {
            path: '/doctor/patient/:id',
            component: () => import('../modules/doctor/PatientRecordView.vue'),
            meta: { requiresAuth: true, role: 'MEDECIN' }
        },
        {
            path: '/doctor/address-book',
            component: () => import('../modules/doctor/AddressBook.vue'),
            meta: { requiresAuth: true, role: 'MEDECIN' }
        },
    ]
});

router.beforeEach((to, _, next) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && auth.isAuthenticated) {
        next(auth.userRole === 'PATIENT' ? '/patient' : '/doctor');
    } else {
        next();
    }
});

export default router;
