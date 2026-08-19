WITH duplicate_payments AS (
  SELECT "id", ROW_NUMBER() OVER (
    PARTITION BY "stripePaymentIntentId" ORDER BY "createdAt", "id"
  ) AS row_number
  FROM "Pago"
  WHERE "stripePaymentIntentId" IS NOT NULL
)
UPDATE "Pago"
SET "stripePaymentIntentId" = NULL
WHERE "id" IN (SELECT "id" FROM duplicate_payments WHERE row_number > 1);

CREATE UNIQUE INDEX "Pago_stripePaymentIntentId_key" ON "Pago"("stripePaymentIntentId");
