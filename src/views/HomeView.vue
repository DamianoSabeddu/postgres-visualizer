<script setup lang="ts">
import { ref, computed } from "vue";
import SqlEditor from "../components/editor/SqlEditor.vue";
import TableVisualizer from "../components/visualizer/TableVisualizer.vue";

const query = ref("SELECT *\nFROM utenti\nWHERE ruolo = 'Admin';");
const activeQuery = ref(query.value);

// Mock Dati Temporanei
const tableData = [
	{ id: 1, nome: "Damiano", ruolo: "Admin" },
	{ id: 2, nome: "Mario", ruolo: "User" },
	{ id: 3, nome: "Luigi", ruolo: "User" },
];

const simulateExecution = () => (activeQuery.value = query.value);

const highlightedRows = computed(() => {
	const q = activeQuery.value.toLowerCase();
	if (q.includes("'admin'")) return [1];
	if (q.includes("'user'")) return [2, 3];
	return [1, 2, 3];
});
</script>

<template>
	<div
		class="flex h-full w-full overflow-hidden transition-colors duration-300"
	>
		<!-- PANNELLO SINISTRO -->
		<section
			class="w-1/2 border-r flex flex-col transition-colors duration-300 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
		>
			<SqlEditor v-model="query" @execute="simulateExecution" />
		</section>

		<!-- PANNELLO DESTRO -->
		<section
			class="w-1/2 flex flex-col transition-colors duration-300 bg-gray-100 dark:bg-gray-900"
		>
			<TableVisualizer
				table-name="utenti"
				:data="tableData"
				:highlighted-rows="highlightedRows"
			>
				<template #hint>
					Prova a cambiare
					<code class="text-gray-600 dark:text-gray-300"
						>'Admin'</code
					>
					in
					<code class="text-gray-600 dark:text-gray-300">'User'</code>
					nell'editor a sinistra e clicca Esegui per simulare il
					filtraggio.
				</template>
			</TableVisualizer>
		</section>
	</div>
</template>
