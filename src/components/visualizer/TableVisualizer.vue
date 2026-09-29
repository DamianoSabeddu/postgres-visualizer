<script setup lang="ts">
import { Database, ArrowDown, Table2 } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
	tableName: string;
	sourceData: any[];
	resultData: any[];
}>();

// Calcoliamo le colonne disponibili
const sourceColumns = computed(() => {
	if (!props.sourceData || props.sourceData.length === 0) return [];
	return Object.keys(props.sourceData[0]);
});

const resultColumns = computed(() => {
	if (!props.resultData || props.resultData.length === 0) return [];
	return Object.keys(props.resultData[0]);
});

// FUNZIONE INTELLIGENTE: Capisce se la riga è sopravvissuta al filtro,
// anche se l'utente non ha estratto la colonna 'id' nella SELECT.
const isRowHighlighted = (sourceRow: any) => {
	if (!props.resultData || props.resultData.length === 0) return false;

	// Se la query include l'ID, andiamo a colpo sicuro
	if (resultColumns.value.includes("id")) {
		return props.resultData.some((r) => r.id === sourceRow.id);
	}

	// Se l'ID non c'è (es. SELECT nome), confrontiamo i valori estratti per capire se la riga corrisponde
	return props.resultData.some((resRow) => {
		return resultColumns.value.every(
			(col) => resRow[col] === sourceRow[col],
		);
	});
};

// Griglia CSS fluida
const getGridStyle = (colsCount: number) => ({
	display: "grid",
	gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))`,
	gap: "1rem",
});
</script>

<template>
	<div class="flex flex-col h-full w-full overflow-y-auto">
		<div
			class="h-10 px-4 border-b flex items-center shrink-0 transition-colors duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
		>
			<span
				class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
				>Visualizzatore Esecuzione</span
			>
		</div>

		<div class="flex-1 p-6 flex flex-col items-center gap-6">
			<!-- TABELLA 1: SORGENTE (Dati Iniziali) -->
			<div
				class="w-full max-w-lg border rounded-lg shadow-md overflow-hidden transition-colors duration-300 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700"
			>
				<div
					class="px-4 py-2 border-b flex items-center justify-between transition-colors duration-300 bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
				>
					<div class="flex items-center gap-2">
						<Database :size="14" class="text-gray-400" />
						<span
							class="text-xs font-mono text-gray-600 dark:text-gray-300"
							>Tabella Origine: {{ tableName }}</span
						>
					</div>
				</div>

				<div class="p-3 space-y-1.5">
					<!-- Intestazione Colonne Sorgente -->
					<div
						v-if="sourceColumns.length > 0"
						:style="getGridStyle(sourceColumns.length)"
						class="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800/80"
					>
						<span
							v-for="col in sourceColumns"
							:key="col"
							class="truncate px-2 py-0.5 rounded transition-all duration-300"
							:class="
								resultColumns.includes(col)
									? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
									: 'text-gray-400 dark:text-gray-500 opacity-30'
							"
						>
							{{ col }}
						</span>
					</div>

					<!-- Righe Dati Sorgente -->
					<div
						v-for="row in sourceData"
						:key="row.id"
						:style="getGridStyle(sourceColumns.length)"
						class="px-3 py-1.5 rounded-md text-sm font-mono transition-all duration-300 border"
						:class="
							isRowHighlighted(row)
								? 'bg-emerald-50/20 dark:bg-emerald-900/10 border-emerald-200/40 dark:border-emerald-800/40'
								: 'bg-gray-50/30 dark:bg-gray-900/20 border-transparent opacity-30 grayscale'
						"
					>
						<!-- Singola Cella -->
						<span
							v-for="(value, key) in row"
							:key="key"
							class="truncate px-2 py-1 rounded transition-all duration-300"
							:class="[
								resultColumns.includes(key) &&
								isRowHighlighted(row)
									? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-700/50 shadow-sm'
									: 'text-gray-400 dark:text-gray-500 border border-transparent',
							]"
						>
							{{ value }}
						</span>
					</div>
				</div>
			</div>

			<!-- FRECCIA DI FLUSSO -->
			<div
				class="flex flex-col items-center text-emerald-500 dark:text-emerald-400 animate-pulse"
			>
				<ArrowDown :size="28" stroke-width="2.5" />
			</div>

			<!-- TABELLA 2: RISULTATO (Dati Filtrati) -->
			<div
				class="w-full max-w-lg border rounded-lg shadow-xl overflow-hidden transition-colors duration-300 bg-emerald-50/50 dark:bg-gray-950 border-emerald-200 dark:border-emerald-900/50"
			>
				<div
					class="px-4 py-2 border-b flex items-center justify-between transition-colors duration-300 bg-emerald-100/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/50"
				>
					<div class="flex items-center gap-2">
						<Table2
							:size="14"
							class="text-emerald-600 dark:text-emerald-500"
						/>
						<span
							class="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400"
							>Set di Risultati (Proiezione)</span
						>
					</div>
					<span
						class="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-200 dark:bg-emerald-800/50 px-2 py-0.5 rounded-full"
						>{{ resultData?.length || 0 }} righe estrapolate</span
					>
				</div>

				<div
					class="p-3 space-y-1.5 min-h-[60px] flex flex-col justify-center"
				>
					<div
						v-if="!resultData || resultData.length === 0"
						class="text-center text-xs text-gray-400 py-4"
					>
						La query non ha prodotto alcun risultato.
					</div>
					<div v-else class="w-full">
						<!-- Intestazione Colonne Risultato -->
						<div
							v-if="resultColumns.length > 0"
							:style="getGridStyle(resultColumns.length)"
							class="px-3 py-1.5 mb-2 rounded-md text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-200/50 dark:bg-emerald-900/60"
						>
							<span
								v-for="col in resultColumns"
								:key="'res-col-' + col"
								class="truncate px-2"
								>{{ col }}</span
							>
						</div>

						<!-- Righe Dati Risultato -->
						<div
							v-for="(row, index) in resultData"
							:key="'res-row-' + index"
							:style="getGridStyle(resultColumns.length)"
							class="px-3 py-1.5 mb-1.5 rounded-md text-sm font-mono border bg-white dark:bg-gray-900 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
						>
							<span
								v-for="(value, key) in row"
								:key="'res-val-' + key"
								class="truncate px-2"
								>{{ value }}</span
							>
						</div>
					</div>
				</div>
			</div>

			<!-- Spazio per messaggi ed errori -->
			<div class="mt-2 text-center w-full max-w-lg">
				<slot name="hint"></slot>
			</div>
		</div>
	</div>
</template>
