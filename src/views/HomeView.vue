<script setup lang="ts">
import { ref, computed } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { Play, Database } from 'lucide-vue-next'
import { useDark } from '@vueuse/core'

const isDark = useDark()

const query = ref("SELECT *\nFROM utenti\nWHERE ruolo = 'Admin';")

// L'editor reagisce al cambio di tema in tempo reale
const extensions = computed(() => {
  return isDark.value ? [sql(), oneDark] : [sql()]
})

const tableData = [
  { id: 1, nome: 'Damiano', ruolo: 'Admin' },
  { id: 2, nome: 'Mario',   ruolo: 'User' },
  { id: 3, nome: 'Luigi',   ruolo: 'User' }
]

const activeQuery = ref(query.value)
const simulateExecution = () => activeQuery.value = query.value

const highlightedRows = computed(() => {
  const q = activeQuery.value.toLowerCase()
  if (q.includes("'admin'")) return [1]
  if (q.includes("'user'")) return [2, 3]
  return [1, 2, 3]
})
</script>

<template>
  <div class="flex h-full w-full overflow-hidden transition-colors duration-300">
    
    <!-- PANNELLO SINISTRO: EDITOR -->
    <section class="w-1/2 border-r flex flex-col transition-colors duration-300 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
      <div class="h-10 px-4 border-b flex items-center justify-between transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Editor SQL</span>
        <button 
          @click="simulateExecution"
          class="flex items-center gap-1.5 transition-colors text-xs font-medium px-2 py-1 rounded text-emerald-600 dark:text-emerald-400 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20"
        >
          <Play :size="14" fill="currentColor" /> Esegui Query
        </button>
      </div>
      
      <div class="flex-1 overflow-auto text-sm">
        <Codemirror
          v-model="query"
          :extensions="extensions"
          :style="{ height: '100%', outline: 'none' }"
        />
      </div>
    </section>

    <!-- PANNELLO DESTRO: VISUALIZZATORE -->
    <section class="w-1/2 flex flex-col transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      <div class="h-10 px-4 border-b flex items-center transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Visualizzatore Tabella</span>
      </div>
      
      <div class="flex-1 p-8 flex flex-col items-center justify-center">
        <div class="w-full max-w-md border rounded-lg shadow-xl overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700">
          
          <div class="px-4 py-2 border-b flex items-center gap-2 transition-colors duration-300 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <Database :size="14" class="text-gray-400" />
            <span class="text-xs font-mono text-gray-600 dark:text-gray-300">Tabella: utenti</span>
          </div>

          <div class="p-2 space-y-1">
            <div 
              v-for="row in tableData" 
              :key="row.id"
              class="flex justify-between px-3 py-2 rounded text-sm font-mono transition-all duration-500 border"
              :class="
                highlightedRows.includes(row.id) 
                  ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-500/30 scale-100 opacity-100' 
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-transparent scale-[0.98] opacity-60 dark:opacity-40 grayscale'
              "
            >
              <span>{{ row.id }}</span>
              <span>{{ row.nome }}</span>
              <span>{{ row.ruolo }}</span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 text-center max-w-sm">
          <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Prova a cambiare <code class="text-gray-600 dark:text-gray-300">'Admin'</code> in <code class="text-gray-600 dark:text-gray-300">'User'</code> nell'editor a sinistra e clicca Esegui per simulare il filtraggio.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>