import * as React from "react";

interface EmailTemplateProps {
  buttonUrl: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  buttonUrl,
}) => (
  <>
    <div
      style={{
        fontSize: "24px",
        lineHeight: "40px",
        margin: "0",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
        color: "#ffffff",
        fontWeight: "600",
      }}
    >
      Reset your password
    </div>
    <div
      style={{
        fontSize: "14px",
        lineHeight: "24px",
        margin: "0",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
        color: "#aaaaaa",
      }}
    >
      Follow the button to reset the password for your user.
    </div>
    <div
      style={{
        fontSize: "14px",
        lineHeight: "24px",
        margin: "0",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
        color: "#aaaaaa",
      }}
    >
      <a href={buttonUrl}>
        <button
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            lineHeight: "24px",
            margin: "0",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
            color: "#ffffff",
            backgroundColor: "#3498db",
          }}
        >
          Reset password
        </button>
      </a>
      
    </div>
  </>
);
