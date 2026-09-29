<script setup lang="ts">
import { ref, onMounted } from "vue";
import SqlEditor from "../components/editor/SqlEditor.vue";
import TableVisualizer from "../components/visualizer/TableVisualizer.vue";
import { useDbStore } from "../store/useDbStore";
import { executeSql } from "../services/db";

const dbStore = useDbStore();
const query = ref("SELECT *\nFROM utenti\nWHERE ruolo = 'Admin';");

// Stato locale per mantenere i dati della tabella originale intatti
const baselineData = ref<any[]>([]);

onMounted(async () => {
	await dbStore.bootDatabase();

	// 1. Estraiamo TUTTA la tabella in background per usarla come sorgente visiva
	const res = await executeSql("SELECT * FROM utenti ORDER BY id;");
	baselineData.value = res.rows;

	// 2. Eseguiamo la query scritta nell'editor per mostrare il risultato
	await dbStore.runQuery(query.value);
});

const handleExecution = async () => {
	await dbStore.runQuery(query.value);
};
</script>

<template>
	<div
		class="flex h-full w-full overflow-hidden transition-colors duration-300"
	>
		<section
			class="w-1/2 border-r flex flex-col transition-colors duration-300 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
		>
			<SqlEditor v-model="query" @execute="handleExecution" />
		</section>

		<section
			class="w-1/2 flex flex-col transition-colors duration-300 bg-gray-100 dark:bg-gray-900"
		>
			<!-- Passiamo sia i dati base (sourceData) che i risultati filtrati (resultData) -->
			<TableVisualizer
				table-name="utenti"
				:source-data="baselineData"
				:result-data="dbStore.results"
			>
				<template #hint>
					<div class="flex flex-col gap-2">
						<span
							v-if="dbStore.currentError"
							class="text-xs text-red-600 dark:text-red-400 font-semibold bg-red-100 dark:bg-red-900/30 p-2 rounded border border-red-200 dark:border-red-800/50"
						>
							Errore SQL: {{ dbStore.currentError }}
						</span>
						<span
							v-else
							class="text-xs text-gray-500 dark:text-gray-400"
						>
							Modifica il codice e clicca Esegui per interrogare
							il database.
						</span>
					</div>
				</template>
			</TableVisualizer>
		</section>
	</div>
</template>
