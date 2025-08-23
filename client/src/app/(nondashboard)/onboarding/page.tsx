"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCreateCompanyMutation, useGetAuthUserQuery } from "@/state/api";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    preferences: "",
  });
  const { data: authUser } = useGetAuthUserQuery();
  const [createCompany] = useCreateCompanyMutation();
  const router = useRouter();

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    await createCompany({
      name: formData.name,
      address: formData.address,
      preferences: { notes: formData.preferences },
      managerCognitoId: authUser?.cognitoInfo?.userId as string,
    });
    router.push("/managers/properties");
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Company Name</h2>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Company name"
          />
          <Button onClick={next} disabled={!formData.name}>
            Next
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Address</h2>
          <Input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Company address"
          />
          <div className="flex justify-between">
            <Button variant="outline" onClick={prev}>
              Back
            </Button>
            <Button onClick={next} disabled={!formData.address}>
              Next
            </Button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>
          <Textarea
            value={formData.preferences}
            onChange={(e) =>
              setFormData({ ...formData, preferences: e.target.value })
            }
            placeholder="Let us know your preferences"
          />
          <div className="flex justify-between">
            <Button variant="outline" onClick={prev}>
              Back
            </Button>
            <Button onClick={handleSubmit}>Finish</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
