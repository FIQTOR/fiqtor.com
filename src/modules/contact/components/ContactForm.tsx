import React, { useState, useRef, useEffect } from "react";
import { TbSend, TbChevronDown, TbCheck } from "react-icons/tb";
import Recaptcha from "./Recaptcha";
import { motion, AnimatePresence } from "framer-motion";

export interface ContactErrors {
  tname: string;
  temail: string;
  tmessage: string;
  tcaptcha: string;
}

export interface ContactValues {
  name: string;
  email: string;
  type: string;
  message: string;
}

interface formProps {
  values: ContactValues;
  onFieldChange: (field: keyof ContactValues, value: string) => void;
  onFieldBlur: (field: keyof ContactValues) => void;
  setCaptcha: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  errors: ContactErrors;
}

const OPTIONS = [
  { label: "Landing Page (Product/Service Promotion)", value: "Landing Page" },
  { label: "Company Profile Website", value: "Company Profile" },
  { label: "Web Application (Interactive System)", value: "Web Application" },
  { label: "Mobile Application (Android / iOS)", value: "Mobile Application" },
  { label: "E-Commerce (Online Store)", value: "E-Commerce" },
  { label: "AI Integration for Business", value: "AI Integration" },
  { label: "Website / App Maintenance", value: "Maintenance" },
  { label: "Business Partnership / Collaboration", value: "Partnership" },
  { label: "Technical Consultation / Advice", value: "Consultation" },
  { label: "Bug Report / Technical Issue", value: "Bug Report" },
  { label: "Other (Please Specify)", value: "Other" },
];

/** Accessible custom dropdown implemented as a listbox with keyboard support. */
function CustomDropdown({
  value,
  onChange,
  labelledBy,
}: {
  value: string;
  onChange: (val: string) => void;
  labelledBy: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, OPTIONS.findIndex((o) => o.value === value))
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = OPTIONS.find((opt) => opt.value === value) || OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const open = () => {
    setActiveIndex(Math.max(0, OPTIONS.findIndex((o) => o.value === value)));
    setIsOpen(true);
  };

  const commit = (index: number) => {
    onChange(OPTIONS[index].value);
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        open();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, OPTIONS.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(OPTIONS.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="contact-type-listbox"
        aria-labelledby={labelledBy}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={onKeyDown}
        className="w-full rounded-2xl border border-neutral-300/40 bg-white/60 px-5 py-3.5 text-left text-neutral-800 backdrop-blur-md transition-all duration-300 flex items-center justify-between focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700/40 dark:bg-neutral-900/60 dark:text-neutral-200 cursor-pointer"
      >
        <span className="truncate">{selectedOption.label}</span>
        <TbChevronDown className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id="contact-type-listbox"
            ref={listRef}
            role="listbox"
            aria-labelledby={labelledBy}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 max-h-60 overflow-y-auto rounded-2xl border border-neutral-300/50 bg-white/95 dark:bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl dark:border-neutral-700/50"
          >
            {OPTIONS.map((option, index) => {
              const selected = value === option.value;
              const active = index === activeIndex;
              return (
                <li key={option.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commit(index)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      selected
                        ? "bg-blue-600 text-white"
                        : active
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    <span>{option.label}</span>
                    {selected && <TbCheck className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactForm({
  values,
  onFieldChange,
  onFieldBlur,
  setCaptcha,
  handleSubmit,
  submitting,
  errors,
}: formProps) {
  const handleRecaptchaChange = (value: boolean) => {
    setCaptcha(value);
  };

  const inputStyles =
    "w-full rounded-2xl border border-neutral-300/40 bg-white/60 px-5 py-3.5 text-neutral-800 backdrop-blur-md transition-all duration-300 placeholder:text-neutral-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700/40 dark:bg-neutral-900/60 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-blue-400/50 dark:focus:ring-blue-400/10";

  const invalidStyles = "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/15";

  const labelStyles =
    "text-sm font-semibold text-neutral-700 dark:text-neutral-300";

  const errorClass = "text-sm text-red-500 font-medium";

  return (
    <div className="rounded-3xl border border-neutral-300/30 bg-white/40 backdrop-blur-md p-8 md:p-10 dark:border-neutral-800/40 dark:bg-neutral-900/40">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <label htmlFor="contact-name" className={labelStyles}>
              Your Name or Company
            </label>
            <input
              type="text"
              name="name"
              id="contact-name"
              autoComplete="name"
              placeholder="e.g., Indonesia Studio"
              value={values.name}
              aria-required="true"
              aria-invalid={Boolean(errors.tname)}
              aria-describedby={errors.tname ? "contact-name-error" : undefined}
              className={`${inputStyles} ${errors.tname ? invalidStyles : ""}`}
              onChange={(e) => onFieldChange("name", e.target.value)}
              onBlur={() => onFieldBlur("name")}
            />
            {errors.tname && (
              <p id="contact-name-error" role="alert" className={errorClass}>
                {errors.tname}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-2"
          >
            <label htmlFor="contact-email" className={labelStyles}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="contact-email"
              autoComplete="email"
              placeholder="e.g., yourname@email.com"
              value={values.email}
              aria-required="true"
              aria-invalid={Boolean(errors.temail)}
              aria-describedby={errors.temail ? "contact-email-error" : undefined}
              className={`${inputStyles} ${errors.temail ? invalidStyles : ""}`}
              onChange={(e) => onFieldChange("email", e.target.value)}
              onBlur={() => onFieldBlur("email")}
            />
            {errors.temail && (
              <p id="contact-email-error" role="alert" className={errorClass}>
                {errors.temail}
              </p>
            )}
          </motion.div>
        </div>

        {/* Service Type Custom Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <label id="contact-type-label" className={labelStyles}>
            How can I help you?
          </label>
          <CustomDropdown
            value={values.type}
            onChange={(val) => onFieldChange("type", val)}
            labelledBy="contact-type-label"
          />
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="contact-message" className={labelStyles}>
            What's on your mind?
          </label>
          <textarea
            name="message"
            id="contact-message"
            placeholder="Tell me about your project, goals, timeline, or any questions you have..."
            required
            rows={5}
            value={values.message}
            aria-required="true"
            aria-invalid={Boolean(errors.tmessage)}
            aria-describedby={errors.tmessage ? "contact-message-error" : undefined}
            onChange={(e) => onFieldChange("message", e.target.value)}
            onBlur={() => onFieldBlur("message")}
            className={`${inputStyles} resize-none ${errors.tmessage ? invalidStyles : ""}`}
          />
          {errors.tmessage && (
            <p id="contact-message-error" role="alert" className={errorClass}>
              {errors.tmessage}
            </p>
          )}
        </motion.div>

        {/* Captcha + Submit Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4"
        >
          <div className="min-h-[78px] w-fit rounded-2xl">
            <Recaptcha
              sitekey={`${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`}
              onChange={handleRecaptchaChange}
              onExpired={handleRecaptchaChange}
            />
          </div>
          {errors.tcaptcha && (
            <p role="alert" className={errorClass}>
              {errors.tcaptcha}
            </p>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-black dark:bg-white  px-8 py-4 text-white dark:text-black font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Sending…
            </>
          ) : (
            <>
              <TbSend className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              Send Message
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
