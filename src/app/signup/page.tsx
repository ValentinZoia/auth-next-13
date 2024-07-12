"use client";

import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useState } from "react";

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const { authRouter } = useAuthFetch();

  const signup = async (formData: any) => {
    const result = await authRouter({
      endpoint: "signup",
      body: formData,
    });

    setEmail(formData.email);

    //si todo sale bien- osea response.ok es true
    if (result.success) {
  
      setIsSubmitted(true);
    }
  };

  //si los datos fueron validos muestro el componente
  if (isSubmitted) {
    return (
      <>
        <div className="bg-gray-900 w-full h-screen text-white">
          <div className="w-full h-screen flex justify-center items-center text-center gap-2 flex-col p-6 ">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="4em"
              width="4em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path>
            </svg>
            <h2 className="text-3xl tracking-[-0.16px] text-slate-12 font-bold">
              Check your email
            </h2>
            <span className="text-m text-slate-11 font-normal mb-6">
              We just sent a verification link to {email}.
            </span>
            <a href="/login">
              <button className="text-lg h-10 px-3 rounded-md gap-1 font-semibold bg-white text-gray-900">
                Go to login
              </button>
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <main className="w-full h-screen bg-gray-900">
      <Form
        onSubmit={signup}
        title="Create Account"
        description="Already have an account?"
        descriptionLink=" Log in."
        href="/login"
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
        <Form.SubmitButton text="Create Account"></Form.SubmitButton>
      </Form>
    </main>
  );
}
