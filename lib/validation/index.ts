import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  passwordConfirm: z.string(),
  phoneNumber: z
    .string()
    .min(10, {
      message: "Must be a valid mobile number with at least 10 digits.",
    })
    .max(14, {
      message: "Must be a valid mobile number with at most 14 digits.",
    }),
});

export const formSchemaSignIn = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});
