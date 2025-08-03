-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "performance" TEXT NOT NULL,
    "performanceValue" REAL NOT NULL,
    "currentPrice" REAL NOT NULL,
    "targetPrice" REAL NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "volume24h" REAL,
    "marketCap" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
