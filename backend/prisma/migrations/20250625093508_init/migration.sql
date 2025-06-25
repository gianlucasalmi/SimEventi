-- CreateTable
CREATE TABLE "Utente" (
    "UtenteID" SERIAL NOT NULL,
    "Nome" TEXT NOT NULL,
    "Cognome" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Ruolo" TEXT NOT NULL,

    CONSTRAINT "Utente_pkey" PRIMARY KEY ("UtenteID")
);

-- CreateTable
CREATE TABLE "Evento" (
    "EventoID" SERIAL NOT NULL,
    "Titolo" TEXT NOT NULL,
    "Data" TIMESTAMP(3) NOT NULL,
    "Descrizione" TEXT,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("EventoID")
);

-- CreateTable
CREATE TABLE "Iscrizione" (
    "IscrizioneID" SERIAL NOT NULL,
    "UtenteID" INTEGER NOT NULL,
    "EventoID" INTEGER NOT NULL,
    "CheckinEffettuato" BOOLEAN NOT NULL DEFAULT false,
    "OraCheckin" TIMESTAMP(3),

    CONSTRAINT "Iscrizione_pkey" PRIMARY KEY ("IscrizioneID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utente_Email_key" ON "Utente"("Email");

-- AddForeignKey
ALTER TABLE "Iscrizione" ADD CONSTRAINT "Iscrizione_UtenteID_fkey" FOREIGN KEY ("UtenteID") REFERENCES "Utente"("UtenteID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iscrizione" ADD CONSTRAINT "Iscrizione_EventoID_fkey" FOREIGN KEY ("EventoID") REFERENCES "Evento"("EventoID") ON DELETE CASCADE ON UPDATE CASCADE;
