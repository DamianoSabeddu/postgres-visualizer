<script setup lang="ts">
import { Database, Code2, Play, Settings, Sun, Moon } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'

// Gestione globale del tema tramite VueUse
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <div class="flex h-screen font-sans overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    
    <!-- Sidebar Laterale -->
    <aside class="w-16 flex flex-col items-center py-4 border-r transition-colors duration-300 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
      <div class="mb-8 cursor-pointer text-emerald-600 dark:text-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
        <Database :size="28" stroke-width="2" />
      </div>
      
      <nav class="flex flex-col gap-6 flex-1">
        <button class="p-2 rounded-xl transition-colors group relative bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700">
          <Code2 :size="24" />
          <span class="absolute left-14 top-2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border whitespace-nowrap bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700">
            SQL Editor
          </span>
        </button>
      </nav>

      <div class="mt-auto flex flex-col gap-4 items-center">
        <!-- Bottone Theme Toggle -->
        <button @click="toggleDark()" class="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
          <Sun v-if="isDark" :size="24" />
          <Moon v-else :size="24" />
        </button>
        
        <button class="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
          <Settings :size="24" />
        </button>
      </div>
    </aside>

    <!-- Area di Lavoro -->
    <main class="flex-1 flex flex-col min-w-0">
      <header class="h-14 border-b flex items-center px-4 justify-between transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <h1 class="text-sm font-semibold text-gray-500 dark:text-gray-300">
          Schema Corrente: <span class="text-emerald-600 dark:text-emerald-400 font-mono">public</span>
        </h1>
        
        <button class="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20">
          <Play :size="16" fill="currentColor" />
          Esegui
        </button>
      </header>

      <div class="flex-1 overflow-hidden">
        <slot />
      </div>
    </main>

  </div>
</template>