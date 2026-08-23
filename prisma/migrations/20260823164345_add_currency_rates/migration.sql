-- CreateEnum
CREATE TYPE "UnitCategory" AS ENUM ('LENGTH', 'MASS', 'TEMPERATURE', 'VOLUME', 'TIME', 'SPEED', 'AREA', 'ENERGY', 'PRESSURE', 'CURRENCY');

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "category" "UnitCategory" NOT NULL,
    "description" TEXT,
    "rate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionFactor" (
    "id" TEXT NOT NULL,
    "fromUnitId" TEXT NOT NULL,
    "toUnitId" TEXT NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,
    "offset" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isApproximate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversionFactor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_symbol_key" ON "Unit"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "ConversionFactor_fromUnitId_toUnitId_key" ON "ConversionFactor"("fromUnitId", "toUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversionFactor_toUnitId_fromUnitId_key" ON "ConversionFactor"("toUnitId", "fromUnitId");

-- AddForeignKey
ALTER TABLE "ConversionFactor" ADD CONSTRAINT "ConversionFactor_fromUnitId_fkey" FOREIGN KEY ("fromUnitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionFactor" ADD CONSTRAINT "ConversionFactor_toUnitId_fkey" FOREIGN KEY ("toUnitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
