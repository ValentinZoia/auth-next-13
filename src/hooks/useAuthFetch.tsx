import NotificationContext from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

interface AuthFetchProps {
  endpoint: string;
  redirectRoute?: string;
  body?: any;
  token?: any;
}

export const useAuthFetch = () => {
  const { showNotification } = useContext(NotificationContext);
  const router = useRouter();

  const authRouter = async ({
    endpoint,
    redirectRoute,
    body,
    token,
  }: AuthFetchProps) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        // Leer la respuesta de error para obtener detalles
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }
      const data = await response.json();

      //Mostrar una notificacion
      showNotification({
        msj: data.message,
        open: true,
        status: "success",
      });

      if (redirectRoute) {
        router.push(redirectRoute);
      }
    } catch (error: any) {
      let errorMessage = "An unknown error occurred";

      // Si el error tiene una respuesta JSON, usar su mensaje
      if (error.message) {
        errorMessage = error.message;
      }

      showNotification({
        msj: errorMessage,
        open: true,
        status: "error",
      });
    }
  };

  return { authRouter };
};