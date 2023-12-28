"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/lib/validation";

const SignUp = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      passwordConfirm: "",
      number: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values });
  };

  return (
    <main className="flex min-h-screen items-center justify-between bg-neutral-100 p-10">
      <Form {...form}>
        <div className="sm:w-420 flex-center justify-center flex-col md:flex-row">
          <img src="/assets/images/hero-1.svg" />
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-5 w-full mt-2"
          >
            <h2 className="h3-hold md:h2-bold pt-5 sm:pt-8">Log In Account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-1">
              Please Sign in to continue your journey
            </p>
            <FormField
              control={form.control}
              name="name"
              render={({ field }: any) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" type="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }: any) => {
                return (
                  <FormItem>
                    <FormLabel>Your Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Number" type="number" {...field} />
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
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }: any) => {
                return (
                  <FormItem>
                    <FormLabel>Password confirm</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password confirm"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <p className=" text-start mt-2 ">
              Don't have account ?{" "}
              <Link href={"./sign-in"} className="text-blue-500 font-bold">
                Sign In
              </Link>
            </p>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </div>
      </Form>
    </main>
  );
};

export default SignUp;
