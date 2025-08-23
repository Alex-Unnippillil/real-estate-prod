"use client";

import ApplicationCard from "@/components/ApplicationCard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useUpdateApplicationStatusMutation,
} from "@/state/api";
import { Application } from "@/types/prismaTypes";
import React, { useEffect, useState } from "react";

const statusList = ["Pending", "Approved", "Denied"] as const;
type Status = (typeof statusList)[number];

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();

  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery(
    {
      userId: authUser?.cognitoInfo?.userId,
      userType: "manager",
    },
    {
      skip: !authUser?.cognitoInfo?.userId,
      pollingInterval: 5000,
    }
  );
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const [columns, setColumns] = useState<Record<Status, Application[]>>({
    Pending: [],
    Approved: [],
    Denied: [],
  });

  useEffect(() => {
    if (applications) {
      setColumns({
        Pending: applications.filter((a) => a.status === "Pending"),
        Approved: applications.filter((a) => a.status === "Approved"),
        Denied: applications.filter((a) => a.status === "Denied"),
      });
    }
  }, [applications]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    id: number,
    status: Status
  ) => {
    e.dataTransfer.setData("applicationId", id.toString());
    e.dataTransfer.setData("sourceStatus", status);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    destStatus: Status
  ) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("applicationId"));
    const sourceStatus = e.dataTransfer.getData("sourceStatus") as Status;
    if (!id || sourceStatus === destStatus) return;

    setColumns((prev) => {
      const sourceItems = [...prev[sourceStatus]];
      const destItems = [...prev[destStatus]];
      const idx = sourceItems.findIndex((app) => app.id === id);
      if (idx === -1) return prev;
      const [moved] = sourceItems.splice(idx, 1);
      moved.status = destStatus;
      destItems.unshift(moved);
      return { ...prev, [sourceStatus]: sourceItems, [destStatus]: destItems };
    });

    await updateApplicationStatus({ id, status: destStatus });
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  if (isLoading) return <Loading />;
  if (isError || !applications) return <div>Error fetching applications</div>;

  return (
    <div className="dashboard-container">
      <Header title="Applications" subtitle="Drag cards to update status" />
      <div className="flex gap-4">
        {statusList.map((status) => (
          <div
            key={status}
            className="flex-1 bg-gray-100 rounded p-4 min-h-[400px]"
            onDragOver={allowDrop}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h3 className="text-lg font-semibold mb-4">{status}</h3>
            <div className="space-y-4">
              {columns[status].map((application) => (
                <div
                  key={application.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, application.id, status)
                  }
                >
                  <ApplicationCard
                    application={application}
                    userType="manager"
                  >
                    {null}
                  </ApplicationCard>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;

