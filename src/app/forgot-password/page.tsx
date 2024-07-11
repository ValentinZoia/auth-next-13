"use client";

import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function ForgetPasswordPage() {
  const { authRouter } = useAuthFetch();

  const resetPassword = async (formData: any) => {
    await authRouter({
      endpoint: "forgot-password",
      body: formData,
    });
  };

  return (
    <>
      <Form
        onSubmit={resetPassword}
        title="Reset password"
        description="Include the email address associated with your account and we’ll send
           you an email with instructions to reset your password."
      >
        <Form.Input
          type="email"
          name="email"
          placeholder="Email address"
          required
        ></Form.Input>
        <Form.SubmitButton text="Send reset instructions"></Form.SubmitButton>
      </Form>
    </>
  );
}
