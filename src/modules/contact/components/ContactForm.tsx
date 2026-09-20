import React, { useState, useRef, useEffect } from "react";
import { TbSend, TbChevronDown, TbCheck } from "react-icons/tb";
import Recaptcha from "./Recaptcha";
import { motion, AnimatePresence } from "framer-motion";

interface formProps {
  setName: any;
  setEmail: any;
  setType: any;
  setMessage: any;
  setCaptcha: any;
  handleSubmit: any;
  errors: any;
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

function CustomDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-2xl border border-neutral-300/40 bg-white/60 px-5 py-3.5 text-left text-neutral-800 backdrop-blur-md transition-all duration-300 flex items-center justify-between focus:border-blue-500/50 focus:outline-none dark:border-neutral-700/40 dark:bg-neutral-900/60 dark:text-neutral-200 cursor-pointer"
      >
        <span className="truncate">{selectedOption.label}</span>
        <TbChevronDown className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-2 z-50 max-h-60 overflow-y-auto rounded-2xl border border-neutral-300/50 bg-white/95 dark:bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl dark:border-neutral-700/50"
          >
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  value === option.value
                    ? "bg-blue-600 text-white"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && <TbCheck className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactForm({
  setName,
  setEmail,
  setType,
  setMessage,
  setCaptcha,
  handleSubmit,
  errors,
}: formProps) {
  const [selectedType, setSelectedType] = useState("Landing Page");

  const handleTypeChange = (val: string) => {
    setSelectedType(val);
    setType(val);
  };

  const handleRecaptchaChange = (value: boolean) => {
    setCaptcha(value);
  };

  const inputStyles =
    "w-full rounded-2xl border border-neutral-300/40 bg-white/60 px-5 py-3.5 text-neutral-800 backdrop-blur-md transition-all duration-300 placeholder:text-neutral-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700/40 dark:bg-neutral-900/60 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-blue-400/50 dark:focus:ring-blue-400/10";

  const labelStyles =
    "text-sm font-semibold text-neutral-700 dark:text-neutral-300";

  return (
    <div className="rounded-3xl border border-neutral-300/30 bg-white/40 backdrop-blur-md p-8 md:p-10 dark:border-neutral-800/40 dark:bg-neutral-900/40">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              placeholder="e.g., Indonesia Studio"
              className={inputStyles}
              required
              onChange={(e: any) => setName(e.target.value)}
            />
            {errors.tname && (
              <p className="text-sm text-red-500 font-medium">{errors.tname}</p>
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
              placeholder="e.g., yourname@email.com"
              className={inputStyles}
              required
              onChange={(e: any) => setEmail(e.target.value)}
            />
            {errors.temail && (
              <p className="text-sm text-red-500 font-medium">
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
          <label className={labelStyles}>
            How can I help you?
          </label>
          <CustomDropdown value={selectedType} onChange={handleTypeChange} />
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
            onChange={(e: any) => setMessage(e.target.value)}
            className={`${inputStyles} resize-none`}
          />
          {errors.tmessage && (
            <p className="text-sm text-red-500 font-medium">
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
          <div className="overflow-hidden rounded-2xl w-fit">
            <Recaptcha
              sitekey={`${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`}
              onChange={handleRecaptchaChange}
              onExpired={handleRecaptchaChange}
            />
          </div>
          {errors.tcaptcha && (
            <p className="text-sm text-red-500 font-medium">
              {errors.tcaptcha}
            </p>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-black dark:bg-white  px-8 py-4 text-white dark:text-black font-bold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30"
        >
          <TbSend className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          Send Message
        </motion.button>
      </form>
    </div>
  );
}
