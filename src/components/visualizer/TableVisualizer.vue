<script setup lang="ts">
import { Database } from 'lucide-vue-next'

defineProps<{
  tableName: string
  data: any[]
  highlightedRows: number[]
}>()
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div class="h-10 px-4 border-b flex items-center transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Visualizzatore Tabella</span>
    </div>
    
    <div class="flex-1 p-8 flex flex-col items-center justify-center">
      <div class="w-full max-w-md border rounded-lg shadow-xl overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700">
        
        <div class="px-4 py-2 border-b flex items-center gap-2 transition-colors duration-300 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <Database :size="14" class="text-gray-400" />
          <span class="text-xs font-mono text-gray-600 dark:text-gray-300">Tabella: {{ tableName }}</span>
        </div>

        <div class="p-2 space-y-1">
          <div 
            v-for="row in data" 
            :key="row.id"
            class="flex justify-between px-3 py-2 rounded text-sm font-mono transition-all duration-500 border"
            :class="
              highlightedRows.includes(row.id) 
                ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-500/30 scale-100 opacity-100' 
                : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-transparent scale-[0.98] opacity-60 dark:opacity-40 grayscale'
            "
          >
            <!-- Renderizza dinamicamente le colonne a prescindere da quali siano -->
            <span v-for="(value, key) in row" :key="key">{{ value }}</span>
          </div>
        </div>
      </div>
      
      <!-- Slot per testi di aiuto dinamici -->
      <div class="mt-6 text-center max-w-sm text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        <slot name="hint"></slot>
      </div>
    </div>
  </div>
</template>