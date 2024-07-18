'use client';
import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useSearchParams } from "next/navigation";

export default function ChangeaAccountPage() {
  const { authRouter } = useAuthFetch();
  const searchParams = useSearchParams();

  const confirmAccount = async (formData: any) => {
    const token = searchParams.get("token");
    
    
    
    await authRouter({
      endpoint: "confirm-account",
      redirectRoute: "/login",
      body: formData,
      token: token,
    });
  };

  const classNameInput = "text-center text-3xl";
  return (
    <>
      <Form
        onSubmit={confirmAccount}
        title="OTP Verification"
        description="Please enter the code we have sent to your email."
      >
        
          <p className="text-gray-400">Code</p> 
          <Form.Input
            type="text"
            maxLength={6}
            name="otpCode"
            required
            className={classNameInput}
          />
          
          
        

        <Form.SubmitButton text="Verify"></Form.SubmitButton>
      </Form>
    </>
  );
}