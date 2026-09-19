import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface RecaptchaProps {
  sitekey: string;
  onChange: (value: boolean) => void;
  onExpired: (value: boolean) => void;
}

const Recaptcha: React.FC<RecaptchaProps> = ({
  sitekey,
  onChange,
  onExpired,
}) => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const { resolvedTheme, theme } = useTheme();

  // Store initial theme so switching theme does not unmount reCAPTCHA & lose verification state
  const [initialTheme] = useState<"dark" | "light">(() => {
    const active = resolvedTheme || theme;
    return active === "dark" ? "dark" : "light";
  });

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={sitekey}
      theme={initialTheme}
      onChange={(token) => onChange(Boolean(token))}
      onExpired={() => onExpired(false)}
    />
  );
};

export default Recaptcha;
