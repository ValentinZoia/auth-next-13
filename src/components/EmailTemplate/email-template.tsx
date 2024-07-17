// 'use client';

// import { useEffect, useState } from "react";

interface EmailTemplateProps {
  buttonUrl: string;
  title: string;
  description: string;
  descriptionLink?: string;
  otpCode?: string;
  ip: string;
  location: string;
  device: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  buttonUrl,
  title,
  description,
  descriptionLink,
  otpCode,
  ip,
  location,
  device,
}) => {
  
  return (
    <div
      style={{
        margin: "auto",
        textAlign: "start",
        
        backgroundColor: "#1f2937",
        width: "668px",
        height: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          textAlign: "center",
          marginBottom: "20px",
          width: "100%",
          borderTop: "6px solid #6366f1",
        }}
      >
        <h1 style={{paddingLeft: "10px", color:"white", fontSize: "3rem"}}>LOGO</h1>
      </div>
      <div style={{paddingLeft: "20px", paddingBottom: "40px"}}>
        <div
          style={{
            paddingTop: "30px",
            fontSize: "2rem",
            lineHeight: "40px",
            marginBottom: "30px",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
            color: "#ffffff",
            fontWeight: "600",
          }}
        >
          {title}
        </div>
        <div
          style={{
            minWidth: "300px",
            fontSize: "1.2rem",
            lineHeight: "24px",
            marginBottom: "10px",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
            color: "#cdcdcd",
          }}
        >
          {description}
          <div
            style={{
              color: "#ebebf0",
              marginBottom: "10px",
              fontWeight: "600",
              margin: "10px 0",
            }}
          >
            <p>{ip|| "Cargando..."}</p>
            <p>{location|| "Cargando..."}</p>
            <p>{device|| "Cargando..."}</p>

          </div>
        </div>
        {otpCode && (
          <div style={{ maxWidth: "900px" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                padding: "20px 20px",
                width: "fit-content",
                backgroundColor: "#ebebf0",
                lineHeight: "24px",
                margin: "35px 0",
                fontFamily:
                  "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
                color: "#1f2937",
              }}
            >
              {otpCode}
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "24px",
                color: "#cdcdcd",
              }}
            >
              For your security, the verification code is valid for 30 minutes
              and will be invalidated after use. If you do not recognize this
              request, please click here to deactivate your account . Valid only
              for 5 minutes.
            </p>
          </div>
        )}

        <div
          style={{
            fontSize: "14px",
            display: "flex",
            justifyContent: "center",
            lineHeight: "24px",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
            color: "#aaaaaa",
          }}
        >
          <a
            href={buttonUrl}
            style={{
              textDecoration: "none",
              lineHeight: "100%",
              display: "inline-block",
              maxWidth: "100%",
              fontFamily:
                "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
              cursor: "pointer",
              border: "none",
              background: "linear-gradient(to right, #6366f1, #3b82f6)",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: "600",
              textAlign: "center",
              width: "200px",
              padding: "20px 20px",
              borderRadius: "8px",
              marginTop: "1rem",
            }}
          >
            {descriptionLink}
          </a>
        </div>
      </div>
    </div>
  );
};
