<script setup lang="ts">
import { computed } from "vue";
import { Codemirror } from "vue-codemirror";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { Play } from "lucide-vue-next";
import { useDark } from "@vueuse/core";

// Gestione del v-model in ingresso/uscita
const query = defineModel<string>({ required: true });

// Dichiariamo l'evento che invieremo al genitore
const emit = defineEmits(["execute"]);

const isDark = useDark();
const extensions = computed(() => (isDark.value ? [sql(), oneDark] : [sql()]));
</script>

<template>
	<div class="flex flex-col h-full w-full">
		<!-- Header locale -->
		<div
			class="h-10 px-4 border-b flex items-center justify-between transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
		>
			<span
				class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
				>Editor SQL</span
			>
			<button
				@click="emit('execute')"
				class="flex items-center gap-1.5 transition-colors text-xs font-medium px-2 py-1 rounded text-emerald-600 dark:text-emerald-400 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20"
			>
				<Play :size="14" fill="currentColor" /> Esegui Query
			</button>
		</div>

		<!-- CodeMirror -->
		<div class="flex-1 overflow-auto text-sm">
			<Codemirror
				v-model="query"
				:extensions="extensions"
				:style="{ height: '100%', outline: 'none' }"
			/>
		</div>
	</div>
</template>
