"use client";

import SettingsForm from "@/components/SettingsForm";
import { Button } from "@/components/ui/button";
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
  useCreatePayoutLinkMutation,
} from "@/state/api";
import React from "react";

const ManagerSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateManager] = useUpdateManagerSettingsMutation();
  const [createPayoutLink] = useCreatePayoutLinkMutation();
  const payoutsEnabled =
    process.env.NEXT_PUBLIC_ENABLE_MANAGER_PAYOUTS === "true";

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
      cognitoId: authUser?.cognitoInfo?.userId,
      ...data,
    });
  };

  const handlePayoutOnboarding = async () => {
    if (!authUser) return;
    const res = await createPayoutLink(
      authUser.cognitoInfo.userId
    ).unwrap();
    window.location.href = res.url;
  };

  return (
    <>
      <SettingsForm
        initialData={initialData}
        onSubmit={handleSubmit}
        userType="manager"
      />
      {payoutsEnabled && (
        <div className="px-8 pb-8">
          <Button
            onClick={handlePayoutOnboarding}
            className="bg-primary-700 text-white hover:bg-primary-800"
          >
            Set Up Payouts
          </Button>
        </div>
      )}
    </>
  );
};

export default ManagerSettings;
