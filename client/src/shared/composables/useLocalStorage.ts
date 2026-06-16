import { ref, watch, onMounted } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T) {
    const value = ref<T>(defaultValue);

    onMounted(() => {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            try {
                value.value = JSON.parse(storedValue);
            } catch (e) {
                console.error(`Error parsing localStorage key "${key}":`, e);
            }
        }
    });

    watch(
        value,
        (newValue) => {
            localStorage.setItem(key, JSON.stringify(newValue));
        },
        { deep: true }
    );

    return value;
}
