"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useGetPropertyClustersQuery } from "@/state/api";
import { setHoveredPropertyId } from "@/state";
import { Property } from "@/types/prismaTypes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const propertyMarkersRef = useRef(new Map<number, mapboxgl.Marker>());
  const clusterMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.global.filters);
  const hoveredPropertyId = useAppSelector(
    (state) => state.global.hoveredPropertyId
  );
  const [bbox, setBbox] = useState<number[] | null>(null);
  const [zoom, setZoom] = useState<number>(9);

  const { data: clusters } = useGetPropertyClustersQuery(
    bbox ? { bbox, zoom } : ({} as any),
    { skip: !bbox }
  );

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/majesticglue/cm6u301pq008b01sl7yk1cnvb",
      center: filters.coordinates || [-74.5, 40],
      zoom: 9,
    });

    const updateBounds = () => {
      if (!mapRef.current) return;
      const bounds = mapRef.current.getBounds();
      setBbox([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]);
      setZoom(Math.round(mapRef.current.getZoom()));
    };

    mapRef.current.on("load", updateBounds);
    mapRef.current.on("moveend", updateBounds);
  }, [filters.coordinates]);

  useEffect(() => {
    if (!clusters || !mapRef.current) return;

    propertyMarkersRef.current.forEach((m) => m.remove());
    propertyMarkersRef.current.clear();
    clusterMarkersRef.current.forEach((m) => m.remove());
    clusterMarkersRef.current = [];

    clusters.forEach((feature: any) => {
      const [lng, lat] = feature.geometry.coordinates;
      if (feature.properties.cluster) {
        const el = document.createElement("div");
        el.className =
          "flex items-center justify-center bg-blue-500 text-white rounded-full";
        const size = 30;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.textContent = feature.properties.point_count;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(mapRef.current!);
        clusterMarkersRef.current.push(marker);
        el.addEventListener("click", () => {
          mapRef.current!.easeTo({
            center: [lng, lat],
            zoom: mapRef.current!.getZoom() + 2,
          });
        });
      } else {
        const property: Property = feature.properties;
        const el = document.createElement("div");
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#000";
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `
              <div class="marker-popup">
                <div class="marker-popup-image"></div>
                <div>
                  <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
                  <p class="marker-popup-price">
                    $${property.pricePerMonth}
                    <span class="marker-popup-price-unit"> / month</span>
                  </p>
                </div>
              </div>
              `
            )
          )
          .addTo(mapRef.current!);
        propertyMarkersRef.current.set(property.id, marker);
        el.addEventListener("mouseenter", () =>
          dispatch(setHoveredPropertyId(property.id))
        );
        el.addEventListener("mouseleave", () =>
          dispatch(setHoveredPropertyId(null))
        );
      }
    });
  }, [clusters, dispatch]);

  useEffect(() => {
    propertyMarkersRef.current.forEach((marker, id) => {
      const el = marker.getElement() as HTMLElement;
      el.style.backgroundColor = id === hoveredPropertyId ? "#2563eb" : "#000";
    });
  }, [hoveredPropertyId]);

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

export default Map;
