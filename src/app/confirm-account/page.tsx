'use client';
import { Form } from "@/components/Form";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useSearchParams } from "next/navigation";

export default function ChangeaAccountPage() {
  const { authRouter } = useAuthFetch();
  const searchParams = useSearchParams();

  const confirmAccount = async (formData: any) => {
    const token = searchParams.get("token");
    //concateno todos los valores del formulario en un unico string
    const otpStr = Object.values(formData).join("");
    const body = {
      otpCode: otpStr,
    };
    console.log(body, typeof body);
    await authRouter({
      endpoint: "confirm-account",
      redirectRoute: "/login",
      body: body,
      token: token,
    });
  };

  const classNameInput = "h-20 text-center text-3xl";
  return (
    <>
      <Form
        onSubmit={confirmAccount}
        title="OTP Verification"
        description="Please enter the code we have sent to your email."
      >
        <div className="grid grid-cols-6 gap-4">
          <Form.Input
            type="text"
            maxLength={1}
            name="otp1"
            required
            className={classNameInput}
          />
          <Form.Input
            type="text"
            maxLength={1}
            name="otp2"
            required
            className={classNameInput}
          />
          <Form.Input
            type="text"
            maxLength={1}
            name="otp3"
            required
            className={classNameInput}
          />
          <Form.Input
            type="text"
            maxLength={1}
            name="otp4"
            required
            className={classNameInput}
          />
          <Form.Input
            type="text"
            maxLength={1}
            name="otp5"
            required
            className={classNameInput}
          />
          <Form.Input
            type="text"
            maxLength={1}
            name="otp6"
            required
            className={classNameInput}
          />
        </div>

        <Form.SubmitButton text="Verify"></Form.SubmitButton>
      </Form>
    </>
  );
}