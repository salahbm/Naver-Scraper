import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2).max(50),
  password: z.string().min(6),
  passwordConfirm: z.string(),
  number: z
    .string()
    .min(10, { message: "Must be a valid mobile number" })
    .max(14, { message: "Must be a valid mobile number" }),
});
