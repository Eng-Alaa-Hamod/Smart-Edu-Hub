import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Please 8 char at least"),
});

export const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "2 at least")
      .max(10, "Please enter your real first name"),
    secondName: z
      .string()
      .min(2, "2 at least")
      .max(10, "Please enter your true second name"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["student", "teacher"], {
      error: "Please choose whether you are a student or teacher",
    }),
    password: z.string().min(8, "Please 8 char at least"),
    confirmPassword: z.string().min(8, "Please 8 char at least"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords are not identical",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Please 8 char at least"),
    confirmPassword: z.string().min(8, "Please 8 char at least"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords are not identical",
    path: ["confirmPassword"],
  });
