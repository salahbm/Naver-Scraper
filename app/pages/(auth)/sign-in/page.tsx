"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchemaSignIn } from "@/lib/validation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SingIn = () => {
  const router = useRouter();
  const session = useSession();
  const form = useForm<z.infer<typeof formSchemaSignIn>>({
    resolver: zodResolver(formSchemaSignIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchemaSignIn>) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (res?.error) {
      alert("Invalid email or password");
    }
    if (res?.url) router.replace("/");
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/");
    }
  }, [session, router]);
  return (
    <main className="flex-center max-h-screen  p-10">
      <div className="sm:w-420 flex-center justify-between flex-col md:flex-row">
        {/* Image */}
        <img src="/assets/images/signIn.svg" className="md:w-1/2" />
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 w-full mt-4"
            >
              <h2 className="h3-hold md:h2-bold pt-5 sm:pt-12">
                Log In Account
              </h2>
              <p className="text-light-3 small-medium md:base-regular mt-2">
                Please Sign in to continue your journey
              </p>
              <FormField
                control={form.control}
                name="email"
                render={({ field }: any) => {
                  return (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="nialabs@gmail.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }: any) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
          <p className="mt-2 ">
            Don't have account?{" "}
            <Link href={"./sign-up"} className="text-blue-500 font-bold">
              Sign up
            </Link>
          </p>
          <Button
            className="text-white"
            type="button"
            variant={"secondary"}
            onClick={() => signIn("github")}
          >
            Sign In with Github
          </Button>
          <Button
            className="text-white m-1"
            type="button"
            variant={"secondary"}
            onClick={() => signIn("google")}
          >
            Sign In with Google
          </Button>
        </div>
      </div>
    </main>
  );
};

export default SingIn;
