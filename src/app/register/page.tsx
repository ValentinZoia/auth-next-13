"use client";

import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function RegisterPage() {
  const { authRouter } = useAuthFetch();

  const register = async (formData:any) =>{
    await authRouter({
      endpoint: "register",
      redirectRoute: "/",
      body: formData,
    });
  }
  
  
  
  return (
    <>
      <Form
        onSubmit={register}
        title="Create Account"
        description="Already have an account?"
        descriptionLink=" Log in."
        href="/"
      >
        <Form.Input
          type="email"
          name="email"
          placeholder="Email address"
          required
        ></Form.Input>
        <Form.Input
          type="password"
          name="password"
          placeholder="Password"
          required
        ></Form.Input>
        <Form.Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
        ></Form.Input>

        <div className="flex items-center justify-between flex-wrap">
          <label
            className="text-sm text-gray-200 cursor-pointer"
            htmlFor="remember-me"
          >
            <input className="mr-2" id="remember-me" type="checkbox" />
            Remember me
          </label>
        </div>
        <Form.SubmitButton text="Create Account"></Form.SubmitButton>
      </Form>
    </>

  );
}
