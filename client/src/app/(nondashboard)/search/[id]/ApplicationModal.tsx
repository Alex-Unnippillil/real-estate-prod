import { CustomFormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ApplicationFormData, applicationSchema } from "@/lib/schemas";
import {
  useCreateApplicationMutation,
  useGetAuthUserQuery,
  useSaveApplicationDraftMutation,
  useGetApplicationDraftQuery,
  useGeneratePresignedUrlMutation,
} from "@/state/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ApplicationModal = ({
  isOpen,
  onClose,
  propertyId,
}: ApplicationModalProps) => {
  const [createApplication] = useCreateApplicationMutation();
  const [saveDraft] = useSaveApplicationDraftMutation();
  const [generatePresignedUrl] = useGeneratePresignedUrlMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const { data: existingDraft } = useGetApplicationDraftQuery(
    {
      propertyId,
      tenantCognitoId: authUser?.cognitoInfo.userId || "",
    },
    { skip: !authUser }
  );

  const [step, setStep] = useState(1);
  const [draftId, setDraftId] = useState<number | undefined>();
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  useEffect(() => {
    if (existingDraft) {
      setDraftId(existingDraft.id);
      setStep(existingDraft.currentStep);
      form.reset(existingDraft.data);
      setDocumentUrls(existingDraft.documentUrls || []);
    }
  }, [existingDraft, form]);

  const autosave = async (currentStep: number) => {
    if (!authUser) return;
    const payload = {
      draftId,
      propertyId,
      tenantCognitoId: authUser.cognitoInfo.userId,
      data: form.getValues(),
      currentStep,
      documentUrls,
    };
    const result = await saveDraft(payload).unwrap();
    setDraftId(result.id);
  };

  const handleNext = async () => {
    const nextStep = step + 1;
    await autosave(nextStep);
    setStep(nextStep);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    for (const file of files) {
      const { url } = await generatePresignedUrl({
        fileName: file.name,
        fileType: file.type,
      }).unwrap();
      await fetch(url, { method: "PUT", body: file });
      setDocumentUrls((prev) => [...prev, url.split("?")[0]]);
    }
    await autosave(step);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!authUser || authUser.userRole !== "tenant") {
      console.error(
        "You must be logged in as a tenant to submit an application"
      );
      return;
    }

    await createApplication({
      ...data,
      documentUrls,
      applicationDate: new Date().toISOString(),
      status: "Pending",
      propertyId: propertyId,
      tenantCognitoId: authUser.cognitoInfo.userId,
      draftId,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle>Submit Application for this Property</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {step === 1 && (
              <>
                <CustomFormField
                  name="name"
                  label="Name"
                  type="text"
                  placeholder="Enter your full name"
                />
                <CustomFormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                />
                <CustomFormField
                  name="phoneNumber"
                  label="Phone Number"
                  type="text"
                  placeholder="Enter your phone number"
                />
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary-700 text-white w-full"
                >
                  Next
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <CustomFormField
                  name="message"
                  label="Message (Optional)"
                  type="textarea"
                  placeholder="Enter any additional information"
                />
                <input type="file" multiple onChange={handleFileChange} />
                <ul>
                  {documentUrls.map((url) => (
                    <li key={url}>{url.split("/").pop()}</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-700 text-white flex-1"
                  >
                    Submit Application
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
