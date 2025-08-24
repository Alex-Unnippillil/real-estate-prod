"use client";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetManagerPropertiesQuery,
  useUpdatePropertyMutation,
  useSoftDeletePropertyMutation,
} from "@/state/api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/prismaTypes";

const Properties = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: managerProperties,
    isLoading,
    error,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });
  const [updateProperty] = useUpdatePropertyMutation();
  const [softDeleteProperty] = useSoftDeletePropertyMutation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { register, handleSubmit, reset } = useForm<{
    name: string;
    pricePerMonth: number;
  }>();

  const startEdit = (property: Property) => {
    setEditingId(property.id);
    reset({ name: property.name, pricePerMonth: property.pricePerMonth });
  };

  const onSubmit = async (data: { name: string; pricePerMonth: number }) => {
    if (!editingId || !authUser?.cognitoInfo?.userId) return;
    await updateProperty({
      id: editingId,
      managerCognitoId: authUser.cognitoInfo.userId,
      ...data,
    });
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!authUser?.cognitoInfo?.userId) return;
    await softDeleteProperty({ id, managerCognitoId: authUser.cognitoInfo.userId });
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading manager properties</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="My Properties"
        subtitle="View and manage your property listings"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managerProperties?.map((property) => (
          <div key={property.id} className="mb-4">
            <Card
              property={property}
              isFavorite={false}
              onFavoriteToggle={() => {}}
              showFavoriteButton={false}
              propertyLink={`/managers/properties/${property.id}`}
            />
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                className="bg-secondary-500 text-white hover:bg-secondary-600"
                onClick={() => startEdit(property)}
              >
                Edit
              </Button>
              <Button
                type="button"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDelete(property.id)}
              >
                Delete
              </Button>
            </div>
            {editingId === property.id && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 bg-white p-4 rounded-xl shadow"
              >
                <input
                  className="border p-2 w-full mb-2"
                  {...register("name")}
                />
                <input
                  className="border p-2 w-full mb-2"
                  type="number"
                  step="0.01"
                  {...register("pricePerMonth", { valueAsNumber: true })}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-primary-700 text-white hover:bg-primary-800"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
      {(!managerProperties || managerProperties.length === 0) && (
        <p>You don&lsquo;t manage any properties</p>
      )}
    </div>
  );
};

export default Properties;
