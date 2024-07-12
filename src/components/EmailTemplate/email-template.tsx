interface EmailTemplateProps {
  buttonUrl: string;
  title: string;
  description: string;
  descriptionLink?: string;
  otpCode?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  buttonUrl,
  title,
  description,
  descriptionLink,
  otpCode,
}) => (
  <div
    style={{
      margin: "auto",
      textAlign: "center",
      backgroundColor: "#1f2937",
      width: "600px",
      height: "600px",
    }}
  >
    <div
      style={{
        paddingTop: "244px",
        fontSize: "24px",
        lineHeight: "40px",
        marginBottom: "10px",
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
        fontSize: "14px",
        lineHeight: "24px",
        marginBottom: "10px",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
        color: "#aaaaaa",
      }}
    >
      {description}
    </div>
      {otpCode && (
        <div
          style={{
            fontSize: "14px",
            lineHeight: "24px",
            marginBottom: "10px",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
            color: "#aaaaaa",
          }}
        >
          {otpCode}
        </div>
      )}

    <div
      style={{
        fontSize: "14px",
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
          lineHeight:"100%",
          display: "inline-block",
          maxWidth: "100%",
          fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif",
           cursor: "pointer",
           border: "none",
           background: "linear-gradient(to right, #6366f1, #3b82f6)",
           color: "#ffffff",
           fontSize: "14px",
           fontWeight: "600",
           textAlign: "center",
           width: "200px",
           padding: "16px 20px 16px 20px",
           borderRadius: "8px",
           marginTop: "1rem",
           }}>
        
        {descriptionLink}
      </a>
    </div>
  </div>
);
