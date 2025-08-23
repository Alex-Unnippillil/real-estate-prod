"use client";

import { useGetAuthUserQuery } from "@client/state/api";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import ImagePreviews from "@client/app/(nondashboard)/search/[id]/ImagePreviews";
import PropertyOverview from "@client/app/(nondashboard)/search/[id]/PropertyOverview";
import PropertyDetails from "@client/app/(nondashboard)/search/[id]/PropertyDetails";
import PropertyLocation from "@client/app/(nondashboard)/search/[id]/PropertyLocation";
import ContactWidget from "@client/app/(nondashboard)/search/[id]/ContactWidget";
import ApplicationModal from "@client/app/(nondashboard)/search/[id]/ApplicationModal";

const SingleListing = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: authUser } = useGetAuthUserQuery();

  return (
    <div>
      <ImagePreviews
        images={["/singlelisting-2.jpg", "/singlelisting-3.jpg"]}
      />
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  );
};

export default SingleListing;
