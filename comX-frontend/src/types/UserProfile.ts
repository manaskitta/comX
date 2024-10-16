import { z } from "zod";
// import RegisterRequest from "@prathamjain522/comx-common";

export type Designation = {
  value: string;
  label: string;
};

// Define the Zod schema
export const UserDataSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    username:z.string(),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter") // Require at least one uppercase letter
      .regex(/[a-z]/, "Password must contain at least one lowercase letter") // Require at least one lowercase letter
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ), // Require at least one special character
    confirmPassword: z.string(),
    designation: z.any(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserData = z.infer<typeof UserDataSchema>;

// export type UserDate = RegisterRequest;

export type LoginDetails = {
  name: string;
  username: string;
  email: string;
  designation: string;
  isLoggedIn: boolean;
  id:number;
  avatar:string;
};

export type Member = {
  userId: number;
  name: string;
  username:string;
  designation:string;
  email: string;
  role: "MEMBER" | "ADMIN" | "BANNED" | "QUEUE" | "OWNER";
  joinedAt: string;
  avatar: string;
};
