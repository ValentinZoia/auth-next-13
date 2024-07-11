"use client";

import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function LoginPage() {
  const { authRouter } = useAuthFetch();

  const login = async (formData: any) => {
    await authRouter({
      endpoint: "/login",
      redirectRoute: "/home",
      body: formData,
    });
  };
  
  return (
    <>
      <Form
        onSubmit={login}
        title="Login"
        description="Don't have an account?"
        descriptionLink=" Sign up."
        href="/register"
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
        <div className="flex items-center justify-between flex-wrap">
          <label
            className="text-sm text-gray-200 cursor-pointer"
            htmlFor="remember-me"
          >
            <input className="mr-2" id="remember-me" type="checkbox" />
            Remember me
          </label>
          <a
            className="text-sm text-blue-500 hover:underline mb-0.5"
            href="/forgot-password"
          >
            Forgot password?
          </a>
        </div>
        <Form.SubmitButton text="Continue"></Form.SubmitButton>
      </Form>
    </>
  );
}
