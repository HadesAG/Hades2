-- CreateTable
CREATE TABLE "TelegramMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "fromId" TEXT,
    "fromUsername" TEXT,
    "channelName" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "entities" JSONB,
    "forwardFrom" JSONB,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TelegramSignal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,
    "originalMessage" TEXT NOT NULL,
    "extractedData" JSONB NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "confidence" INTEGER,
    "token" TEXT,
    "symbol" TEXT,
    "action" TEXT,
    "price" REAL,
    "target" REAL,
    "stopLoss" REAL,
    "riskLevel" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "TelegramMessage_chatId_idx" ON "TelegramMessage"("chatId");

-- CreateIndex
CREATE INDEX "TelegramMessage_date_idx" ON "TelegramMessage"("date");

-- CreateIndex
CREATE INDEX "TelegramMessage_processed_idx" ON "TelegramMessage"("processed");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramMessage_chatId_messageId_key" ON "TelegramMessage"("chatId", "messageId");

-- CreateIndex
CREATE INDEX "TelegramSignal_sourceId_idx" ON "TelegramSignal"("sourceId");

-- CreateIndex
CREATE INDEX "TelegramSignal_timestamp_idx" ON "TelegramSignal"("timestamp");

-- CreateIndex
CREATE INDEX "TelegramSignal_processed_idx" ON "TelegramSignal"("processed");

-- CreateIndex
CREATE INDEX "TelegramSignal_token_idx" ON "TelegramSignal"("token");
