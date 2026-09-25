import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import HelmetContainer from "@/components/HelmetContainer";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import ResponseMessage from "@/modules/contact/components/ResponseMessage";
import ContactForm from "@/modules/contact/components/ContactForm";
import type { ContactErrors, ContactValues } from "@/modules/contact/components/ContactForm";
import {
  BRAND_NAME,
  OWNER_ALIAS,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
  whatsappUrl,
  mailtoUrl,
} from "@/config/Identity";
import {
  TbBrandWhatsapp,
  TbBrandGmail,
  TbBrandInstagram,
  TbMessages,
  TbClock,
  TbGlobe,
  TbLanguage,
  TbChevronRight,
  TbArrowUpRight,
} from "react-icons/tb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialErrors: ContactErrors = {
  tname: "",
  temail: "",
  tmessage: "",
  tcaptcha: "",
};

const initialValues: ContactValues = {
  name: "",
  email: "",
  type: "Landing Page",
  message: "",
};

/** Validate a single field; returns an error string ("" when valid). */
const validateField = (
  field: keyof ContactValues,
  values: ContactValues
): string => {
  switch (field) {
    case "name":
      return values.name.trim() ? "" : "Name is required.";
    case "email":
      if (!values.email.trim()) return "Email is required.";
      return EMAIL_RE.test(values.email.trim()) ? "" : "Enter a valid email address.";
    case "message":
      return values.message.trim() ? "" : "Message is required.";
    case "type":
      return "";
    default:
      return "";
  }
};

export default function ContactPage() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>(initialErrors);
  const [captcha, setCaptcha] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);

  const onFieldChange = useCallback((field: keyof ContactValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear the field's error as soon as the user edits it.
    if (field !== "type") {
      const key = `t${field}` as keyof ContactErrors;
      setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
    }
  }, []);

  const onFieldBlur = useCallback(
    (field: keyof ContactValues) => {
      if (field === "type") return;
      const message = validateField(field, values);
      const key = `t${field}` as keyof ContactErrors;
      setErrors((prev) => ({ ...prev, [key]: message }));
    },
    [values]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: ContactErrors = {
      tname: validateField("name", values),
      temail: validateField("email", values),
      tmessage: validateField("message", values),
      tcaptcha: captcha ? "" : "Please complete the captcha.",
    };
    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/contact/send`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setStatus("success");
        setValues(initialValues);
        setCaptcha(false);
      } else {
        setStatus("error");
      }
    } catch {
      // Network failure — always resolve to a terminal error state.
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <HelmetContainer page="talk" />
      <div className="page-base relative">
        <BackgroundBlobs />

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="relative z-10"
            >
              {/* Header */}
              <header className="page-x pt-28 pb-14">
                <div className="flex flex-col items-center text-center mb-6">
                  {/* Decorative badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 flex items-center gap-3"
                  >
                    <div className="h-px w-12 bg-linear-to-r from-transparent to-neutral-500" />
                    <TbMessages
                      strokeWidth="1.5"
                      className="h-8 w-8 text-neutral-800 dark:text-neutral-200"
                    />
                    <div className="h-px w-12 bg-linear-to-l from-transparent to-neutral-500" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-5"
                  >
                    <span className="bg-linear-to-r from-neutral-900 via-neutral-600 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-white bg-clip-text text-transparent">
                      Contact {BRAND_NAME}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl text-lg md:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed"
                  >
                    Send a project brief by form, WhatsApp, or email. Replies land
                    within 24 hours, GMT+7 (WIB), in English or Bahasa Indonesia.
                  </motion.p>
                </div>
              </header>

              {/* Main Content Grid */}
              <main className="page-x pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                  {/* Contact Form - Takes 3 columns */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="lg:col-span-3"
                  >
                    <ContactForm
                      values={values}
                      onFieldChange={onFieldChange}
                      onFieldBlur={onFieldBlur}
                      setCaptcha={setCaptcha}
                      handleSubmit={handleSubmit}
                      submitting={submitting}
                      errors={errors}
                    />
                  </motion.div>

                  {/* Side Info - Takes 2 columns */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="lg:col-span-2 flex flex-col gap-6"
                  >
                    {/* Direct Contact Card */}
                    <div className="rounded-3xl border border-neutral-300/30 bg-white/40 p-8 backdrop-blur-md dark:border-neutral-800/40 dark:bg-neutral-900/40">
                      <div className="mb-6 flex items-center gap-2">
                        <h3 className="text-lg font-bold">Direct Contact</h3>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="flex flex-col gap-3">
                        {[
                          {
                            icon: TbBrandWhatsapp,
                            label: "WhatsApp",
                            sub: "Fastest response",
                            href: whatsappUrl(),
                            color: "bg-green-500/10 text-green-600 dark:text-green-400",
                            iconBg: "bg-green-500/15 dark:bg-green-500/20",
                          },
                          {
                            icon: TbBrandGmail,
                            label: "Email",
                            sub: "For detailed inquiries",
                            href: mailtoUrl(CONTACT_EMAIL),
                            color: "text-red-500 dark:text-red-400",
                            iconBg: "bg-red-500/15 dark:bg-red-500/20",
                          },
                          {
                            icon: TbBrandInstagram,
                            label: "Instagram",
                            sub: `@${OWNER_ALIAS}`,
                            href: SOCIAL_LINKS.instagram,
                            color: "text-pink-500 dark:text-pink-400",
                            iconBg: "bg-pink-500/15 dark:bg-pink-500/20",
                          },
                        ].map((contact) => (
                          <a
                            key={contact.label}
                            href={contact.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-neutral-300/30 hover:bg-white/60 hover:shadow-lg hover:shadow-neutral-500/5 dark:hover:border-neutral-700/40 dark:hover:bg-white/5"
                          >
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${contact.iconBg} ${contact.color} transition-transform duration-300 group-hover:scale-110`}
                            >
                              <contact.icon className="h-6 w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                {contact.label}
                              </p>
                              <p className="truncate text-sm text-neutral-400">
                                {contact.sub}
                              </p>
                            </div>
                            <TbChevronRight className="h-5 w-5 text-neutral-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-neutral-500 dark:text-neutral-600 dark:group-hover:text-neutral-400" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Availability Card */}
                    <div className="rounded-3xl border border-neutral-300/30 bg-white/40 p-8 backdrop-blur-md dark:border-neutral-800/40 dark:bg-neutral-900/40">
                      <h3 className="mb-6 text-lg font-bold">Availability</h3>
                      <div className="flex flex-col gap-4">
                        {[
                          {
                            icon: TbClock,
                            label: "Response Time",
                            value: "Within 24 hours",
                          },
                          {
                            icon: TbGlobe,
                            label: "Timezone",
                            value: "GMT+7 (WIB)",
                          },
                          {
                            icon: TbLanguage,
                            label: "Languages",
                            value: "English & Bahasa Indonesia",
                          },
                        ].map((row) => (
                          <div key={row.label} className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-500/10 text-neutral-500 dark:bg-neutral-500/15 dark:text-neutral-300">
                              <row.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest opacity-50">
                                {row.label}
                              </p>
                              <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                {row.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA card */}
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-between overflow-hidden rounded-3xl border border-neutral-300/30 bg-linear-to-br from-neutral-900 to-neutral-800 p-8 text-white shadow-xl shadow-neutral-500/10 transition-all duration-300 hover:shadow-2xl dark:border-neutral-700/40 dark:from-neutral-200 dark:to-white dark:text-neutral-900"
                    >
                      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/40" />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-70">
                          Prefer to chat?
                        </p>
                        <p className="mt-1 text-2xl font-bold">Message me now</p>
                      </div>
                      <TbArrowUpRight className="h-8 w-8 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </a>
                  </motion.div>
                </div>
              </main>
            </motion.div>
          )
          }

          {
            (status === "success" || status === "error") && (
              <motion.div
                key="response"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                role="status"
                aria-live="polite"
                className="relative z-10"
              >
                <ResponseMessage status={status} />
              </motion.div>
            )
          }
        </AnimatePresence >
      </div >
    </>
  );
}
