"use client";

import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const NewProperty = () => {
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: "",
      highlights: "",
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const [step, setStep] = useState(0);

  const stepFields: (keyof PropertyFormData)[][] = [
    [
      "name",
      "description",
      "pricePerMonth",
      "securityDeposit",
      "applicationFee",
      "beds",
      "baths",
      "squareFeet",
      "isPetsAllowed",
      "isParkingIncluded",
      "propertyType",
    ],
    ["address", "city", "state", "country", "postalCode"],
    ["photoUrls"],
    ["amenities", "highlights"],
  ];

  const nextStep = async () => {
    const fields = stepFields[step];
    const valid = await form.trigger(fields as any);
    if (valid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: PropertyFormData) => {
    if (!authUser?.cognitoInfo?.userId) {
      throw new Error("No manager ID found");
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "photoUrls") {
        const files = value as File[];
        files.forEach((file: File) => {
          formData.append("photos", file);
        });
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    formData.append("managerCognitoId", authUser.cognitoInfo.userId);

    await createProperty(formData);
  };

  return (
    <div className="dashboard-container">
      <Header
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <CustomFormField name="name" label="Property Name" />
                  <CustomFormField
                    name="description"
                    label="Description"
                    type="textarea"
                  />
                  <CustomFormField
                    name="pricePerMonth"
                    label="Price per Month"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomFormField
                    name="securityDeposit"
                    label="Security Deposit"
                    type="number"
                  />
                  <CustomFormField
                    name="applicationFee"
                    label="Application Fee"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomFormField
                    name="beds"
                    label="Number of Beds"
                    type="number"
                  />
                  <CustomFormField
                    name="baths"
                    label="Number of Baths"
                    type="number"
                  />
                  <CustomFormField
                    name="squareFeet"
                    label="Square Feet"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CustomFormField
                    name="isPetsAllowed"
                    label="Pets Allowed"
                    type="switch"
                  />
                  <CustomFormField
                    name="isParkingIncluded"
                    label="Parking Included"
                    type="switch"
                  />
                </div>
                <div className="mt-4">
                  <CustomFormField
                    name="propertyType"
                    label="Property Type"
                    type="select"
                    options={Object.keys(PropertyTypeEnum).map((type) => ({
                      value: type,
                      label: type,
                    }))}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold mb-4">Location</h2>
                <CustomFormField name="address" label="Address" />
                <div className="flex justify-between gap-4">
                  <CustomFormField name="city" label="City" className="w-full" />
                  <CustomFormField
                    name="state"
                    label="State"
                    className="w-full"
                  />
                  <CustomFormField
                    name="postalCode"
                    label="Postal Code"
                    className="w-full"
                  />
                </div>
                <CustomFormField name="country" label="Country" />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Photos</h2>
                <CustomFormField
                  name="photoUrls"
                  label="Property Photos"
                  type="file"
                  accept="image/*"
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Amenities and Highlights
                </h2>
                <div className="space-y-6">
                  <CustomFormField
                    name="amenities"
                    label="Amenities"
                    type="select"
                    options={Object.keys(AmenityEnum).map((amenity) => ({
                      value: amenity,
                      label: amenity,
                    }))}
                  />
                  <CustomFormField
                    name="highlights"
                    label="Highlights"
                    type="select"
                    options={Object.keys(HighlightEnum).map((highlight) => ({
                      value: highlight,
                      label: highlight,
                    }))}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {step < stepFields.length - 1 && (
                <Button type="button" className="ml-auto" onClick={nextStep}>
                  Next
                </Button>
              )}
              {step === stepFields.length - 1 && (
                <Button
                  type="submit"
                  className="ml-auto bg-primary-700 text-white"
                >
                  Create Property
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProperty;
