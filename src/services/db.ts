import { PGlite } from '@electric-sql/pglite'

// Usiamo il pattern Singleton per evitare di creare multipli database
let dbInstance: PGlite | null = null

export const initDb = async () => {
    if (dbInstance) return dbInstance

    console.log("Inizializzazione PGlite in corso...")
    dbInstance = await PGlite.create()

    // 1. Setup struttura tabella per la simulazione
    await dbInstance.query(`
    CREATE TABLE IF NOT EXISTS utenti (
      id SERIAL PRIMARY KEY,
      nome TEXT,
      ruolo TEXT
    );
  `)

    // 2. Pulizia preventiva e inserimento dei dati base
    await dbInstance.query(`TRUNCATE TABLE utenti RESTART IDENTITY;`)
    await dbInstance.query(`
    INSERT INTO utenti (nome, ruolo) VALUES 
      ('Damiano', 'Admin'),
      ('Mario', 'User'),
      ('Luigi', 'User');
  `)

    console.log("Database pronto e popolato.")
    return dbInstance
}

export const executeSql = async (sql: string) => {
    if (!dbInstance) throw new Error("Motore SQL non inizializzato.")
    // Esegue la stringa SQL reale inviata dall'utente
    return await dbInstance.query(sql)
}