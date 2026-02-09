"use client";

import React from "react";
import { EyeIcon } from "./register/utils";

interface ErrorAlertProps {
  errors: Record<string, string>;
}

export function ErrorAlert({ errors }: ErrorAlertProps) {
  if (Object.keys(errors).length === 0) return null;

  return (
    <div
      className="bg-red-50 border border-red-200 text-red-800 p-3 rounded animate-[shake_0.3s_ease-in-out]"
      role="alert"
      aria-live="assertive"
    >
      <p className="font-medium">يرجى تصحيح الأخطاء التالية:</p>
      <ul className="mt-2 list-disc list-inside">
        {Object.values(errors).map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggle: () => void;
  placeholder?: string;
  error?: string;
  id?: string;
}

export function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
  placeholder,
  error,
  id = "password",
}: PasswordInputProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border rounded-md px-3 py-2 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
            error ? "border-red-300" : "border-zinc-200"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-zinc-500 hover:text-indigo-700"
          aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          <EyeIcon off={showPassword} />
        </button>
      </div>

      {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
    </div>
  );
}

interface SuccessMessageProps {
  title: string;
  description: string;
  buttonLabel: string;
  onAction: () => void;
}

export function SuccessMessage({
  title,
  description,
  buttonLabel,
  onAction,
}: SuccessMessageProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-4">
        <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-indigo-900">{title}</h2>
      <p className="text-zinc-600">{description}</p>

      <button
        onClick={onAction}
        className="inline-block w-full bg-indigo-900 text-white py-2 sm:py-2.5 rounded-md text-sm sm:text-base transition-all duration-300 hover:bg-indigo-800 hover:shadow-lg active:scale-95"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export function EmailInput({
  value,
  onChange,
  error,
  label = "البريد الإلكتروني",
  placeholder = "example@email.com",
}: EmailInputProps) {
  return (
    <>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-zinc-700 mb-1"
      >
        {label}
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? "email-error" : undefined}
        className={`w-full text-sm sm:text-base border rounded-md px-3 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:scale-[1.01] ${
          error ? "border-red-300" : "border-zinc-200"
        }`}
      />
      {error && (
        <p id="email-error" role="alert" className="text-sm text-red-700 mt-1">
          {error}
        </p>
      )}
    </>
  );
}
