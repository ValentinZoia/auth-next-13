"use client";

import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useSearchParams } from 'next/navigation'

export default function ChangeaAccountPage() {
  const { authRouter } = useAuthFetch();
  const searchParams = useSearchParams();

  const confirmAccount = async (formData: any) => {
    const token = searchParams.get('token')
    console.log(formData)
    await authRouter({
      endpoint: "confirm-account",
      redirectRoute: "/login",
      token: `${token}`
    });
  };

  return (
    <>
      <Form
        onSubmit={confirmAccount}
        title="Account confirmatión"
        description="To confirm your account, please follow the below."
      >
        <Form.SubmitButton text="Confirm account"></Form.SubmitButton>
      </Form>
    </>
  );
}
