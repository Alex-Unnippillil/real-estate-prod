-- Alter Location.coordinates to geometry and add spatial index
ALTER TABLE "Location"
    ALTER COLUMN "coordinates"
    TYPE geometry(Point, 4326)
    USING ST_SetSRID("coordinates"::geometry, 4326);

CREATE INDEX IF NOT EXISTS "Location_coordinates_idx"
    ON "Location"
    USING GIST ("coordinates");
