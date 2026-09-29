<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PGlite } from "@electric-sql/pglite";

// Stato reattivo per mostrare i dati nell'interfaccia
const dbResults = ref<any[]>([]);
const isReady = ref(false);

onMounted(async () => {
	console.log("Avvio PGlite in corso...");

	// 1. Inizializza Postgres in memoria
	const db = await PGlite.create();

	// 2. Crea la tabella (Primo comando separato)
	await db.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      nome TEXT,
      ruolo TEXT
    );
  `);

	// 3. Inserisci i dati (Secondo comando separato)
	await db.query(`
    INSERT INTO users (nome, ruolo) VALUES 
      ('Damiano', 'Admin'),
      ('Mario', 'User'),
      ('Luigi', 'User');
  `);

	// 4. Esegui la query per estrarre i dati
	const res = await db.query(`SELECT * FROM users WHERE ruolo = 'User';`);

	// 5. Salva i risultati nello stato di Vue per mostrarli nell'HTML
	dbResults.value = res.rows;
	isReady.value = true;

	console.log("Query eseguita con successo:", res.rows);
});
</script>
<template>
	<div
		class="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans flex flex-col items-center justify-center"
	>
		<div
			class="max-w-2xl w-full bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700"
		>
			<h1 class="text-3xl font-bold text-emerald-400 mb-2">
				PostgreSQL Visualizer PoC
			</h1>
			<p class="text-gray-400 mb-6">
				Database in WebAssembly avviato con successo.
			</p>

			<div
				v-if="!isReady"
				class="animate-pulse text-emerald-500 font-mono"
			>
				Inizializzazione motore SQL in corso...
			</div>

			<div v-else>
				<h2
					class="text-lg font-semibold mb-3 border-b border-gray-700 pb-2"
				>
					Risultato Query:
					<span class="font-mono text-purple-400 text-sm font-normal"
						>SELECT * FROM users WHERE ruolo = 'User';</span
					>
				</h2>

				<ul class="space-y-2 font-mono text-sm">
					<li
						v-for="row in dbResults"
						:key="row.id"
						class="bg-gray-900 p-3 rounded-lg border border-gray-700 flex justify-between"
					>
						<span
							>ID:
							<span class="text-blue-400">{{
								row.id
							}}</span></span
						>
						<span
							>Nome:
							<span class="text-yellow-400">{{
								row.nome
							}}</span></span
						>
						<span
							>Ruolo:
							<span class="text-pink-400">{{
								row.ruolo
							}}</span></span
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
