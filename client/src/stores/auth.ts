import { defineStore } from 'pinia';
import { computed } from 'vue';
import { UserRole, AccessLevel } from '../core/types';
import type { User, Patient, Medecin } from '../core/types';
import { useLocalStorage } from '../shared/composables/useLocalStorage';

export const useAuthStore = defineStore('auth', () => {
    const currentUser = useLocalStorage<User | null>('medbook_user', null);
    const isAuthenticated = computed(() => currentUser.value !== null);
    const userRole = computed(() => currentUser.value?.role);

    const mockUsers: (Patient | Medecin)[] = [
        {
            id: 'p1',
            id_patient: 'PT-001',
            email: 'patient@example.com',
            nom: 'Dupont',
            prenom: 'Jean',
            role: UserRole.PATIENT,
            groupeSanguin: 'A+',
            dateNaissance: '1985-05-20',
            allergies: 'Pollen, Penicilline',
            antecedents: 'Asthme léger',
        },
        {
            id: 'd1',
            id_med: 'MED-007',
            email: 'doctor@example.com',
            nom: 'Smith',
            prenom: 'Alice',
            role: UserRole.MEDECIN,
            specialite: 'Cardiologie',
            niveauAcces: AccessLevel.FULL,
        },
    ];

    const registeredUsers = useLocalStorage<(Patient | Medecin)[]>('medbook_registered_users', mockUsers);

    function login(email: string, role: UserRole) {
        const user = registeredUsers.value.find(u => u.email === email && u.role === role);
        if (user) {
            currentUser.value = user;
            return true;
        }
        return false;
    }

    function register(userData: Patient | Medecin) {
        // Prevent duplicate emails for the prototype
        if (registeredUsers.value.some(u => u.email === userData.email)) {
            return false;
        }
        registeredUsers.value.push(userData);
        currentUser.value = userData;
        return true;
    }

    function logout() {
        currentUser.value = null;
    }

    return {
        currentUser,
        isAuthenticated,
        userRole,
        registeredUsers,
        login,
        register,
        logout,
    };
});
