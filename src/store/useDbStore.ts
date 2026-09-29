import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initDb, executeSql } from '../services/db'

export const useDbStore = defineStore('db', () => {
    const isReady = ref(false)
    const results = ref<any[]>([])
    const currentError = ref<string | null>(null)

    // Avvia il database all'apertura dell'app
    const bootDatabase = async () => {
        try {
            await initDb()
            isReady.value = true
        } catch (err: any) {
            currentError.value = "Errore di avvio DB: " + err.message
        }
    }

    // Prende la stringa dall'editor e la lancia su Postgres
    const runQuery = async (sqlString: string) => {
        if (!isReady.value) return

        currentError.value = null // Resetta errori precedenti
        try {
            const res = await executeSql(sqlString)
            results.value = res.rows
        } catch (err: any) {
            currentError.value = err.message
            results.value = [] // Svuota i risultati se la query fallisce
        }
    }

    return { isReady, results, currentError, bootDatabase, runQuery }
})