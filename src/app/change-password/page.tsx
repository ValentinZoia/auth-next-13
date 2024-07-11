"use client";

import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useSearchParams } from 'next/navigation'

export default function ChangePasswordPage() {
  const { authRouter } = useAuthFetch();
  const searchParams = useSearchParams();

  const changePassword = async (formData: any) => {
    const token = searchParams.get('token')
    console.log(formData)
    await authRouter({
      endpoint: "change-password",
      redirectRoute: "/",
      body: formData,
      token: `${token}`
    });
  };

  return (
    <>
      <Form
        onSubmit={changePassword}
        title="Set up a new password"
        description="Your password must be different from your previous one."
      >
        <Form.Input
          type="password"
          name="newPassword"
          placeholder="New password"
          required
        ></Form.Input>
        <Form.Input
          type="password"
          name="confirmNewPassword"
          placeholder="Confrim new password"
          required
        ></Form.Input>
        <Form.SubmitButton text="Update password"></Form.SubmitButton>
      </Form>
    </>
  );
}
