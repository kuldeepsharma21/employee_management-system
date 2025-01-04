import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

// Zod schema for Signup Validation
const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name must be at least 2 characters" }),
    gender: z.enum(["Male", "Female", "Other"], {
      message: "Gender is required",
    }),
    role: z.enum(["Manager", "Employee"], {
      message: "Role is required",
    }),
    hobbies: z.string().min(1, { message: "At least one hobby is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password cannot be more than 20 characters" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password must be at least 8 characters" })
      .max(20, {
        message: "Confirm Password cannot be more than 20 characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Zod schema for Login Validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password cannot be more than 20 characters" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
});

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  // Form submit handler
  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const response = await axios.post(
          "http://localhost:8000/api/v1/user/login",
          {
            email: data.email,
            password: data.password,
          }
        );
        if (response.data.role == "Manager") {
          navigate("department");
        } else {
          navigate("/employeeDashboard",{ state: response.data });
        }
        console.log("Login Success:", response.data);
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/v1/user/signup",
          {
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            hobbies: data.hobbies.split(",").map((hobby) => hobby.trim()),
            email: data.email,
            password: data.password,
            role: data.role,
          }
        );
        console.log("Signup Success:", response.data);
        if (response.data.user.role == "Manager") {
          navigate("/department");
        } else {
          navigate("/employeeDashboard", { state: response.data.user });
        }
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  const handleHobbiesChange = (e) => {
    const value = e.target.value;
    setValue(
      "hobbies",
      value.split(",").map((hobby) => hobby.trim())
    );
  };

  useEffect(() => {
    console.log(isLogin);
  }, [isLogin]);
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Tabs
        defaultValue="login"
        className="w-[400px]"
        onValueChange={(value) =>
          value == "login" ? setIsLogin(true) : setIsLogin(false)
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {/* Login Form */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Log In</CardTitle>
              <CardDescription>
                Access your account by logging in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    {...register("password")}
                    type="password"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <CardFooter>
                  <Button type="submit" className="w-full mt-4">
                    Log In
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signup Form */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[314px] overflow-auto">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* First Name */}
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    type="text"
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    type="text"
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className="input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500">{errors.gender.message}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    {...register("role")}
                    className="input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500">{errors.role.message}</p>
                  )}
                </div>

                {/* Hobbies */}
                <div className="space-y-1">
                  <Label htmlFor="hobbies">Hobbies</Label>
                  <Input
                    id="hobbies"
                    {...register("hobbies")}
                    type="text"
                    placeholder="Enter your hobbies (comma separated)"
                    onChange={handleHobbiesChange}
                  />
                  {errors.hobbies && (
                    <p className="text-red-500">{errors.hobbies.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    {...register("password")}
                    type="password"
                    placeholder="Create a password"
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <CardFooter>
                  <Button type="submit" className="w-full mt-4">
                    Sign Up
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
