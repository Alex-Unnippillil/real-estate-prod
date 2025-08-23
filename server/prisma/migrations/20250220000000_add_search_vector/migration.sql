ALTER TABLE "Property"
  ADD COLUMN "searchVector" tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce("name", '') || ' ' || coalesce("description", ''))
  ) STORED;

CREATE INDEX "Property_searchVector_idx" ON "Property" USING GIN ("searchVector");
