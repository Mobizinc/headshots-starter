"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import disposableDomains from "disposable-email-domains";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineGoogle } from "react-icons/ai";
import { WaitingForMagicLink } from "./WaitingForMagicLink";
import Image from "next/image";

type Inputs = {
  email: string;
};

export const Login = ({ host, searchParams }: { host: string | null; searchParams?: { [key: string]: string | string[] | undefined }; }) => {
  const supabase = createClientComponentClient<Database>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async () => {
    setIsSubmitting(true);
    try {
      await signInWithAzure();
      setTimeout(() => {
        setIsSubmitting(false);
        }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: "Please try again, if the problem persists, contact us at hello@tryleap.ai",
        duration: 5000,
      });
    }
  };

  let inviteToken = null;
  if (searchParams && "inviteToken" in searchParams) {
    inviteToken = searchParams["inviteToken"];
  }

  const protocol = host?.includes("localhost") ? "http" : "https";
  // const redirectUrl = `${protocol}://${host}/auth/callback`;
  // console.log("HOST IS HERE: ", host);
  const redirectUrl = `${protocol}://${host}/auth/callback`;

  // console.log({ redirectUrl });

  const signInWithAzure = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo: redirectUrl,
        scopes: "openid profile email",
      },
    });

    if (error) {
      console.log("Error during Azure OAuth sign-in:", error);
    } else {
      console.log("Azure OAuth sign-in data:", data);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  if (isMagicLinkSent) {
    return <WaitingForMagicLink toggleState={() => setIsMagicLinkSent(false)} />;
  }

  return (
      <>
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 p-4 rounded-xl max-w-sm w-full">
            <h1 className="text-xl">Welcome</h1>
            <p className="text-xs opacity-60">Sign in or create an account to get started.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              {/*<div className="flex flex-col gap-4">*/}
              {/*  <div className="flex flex-col gap-2">*/}
              {/*    <Input*/}
              {/*        type="email"*/}
              {/*        placeholder="Email"*/}
              {/*        {...register("email", {*/}
              {/*          required: true,*/}
              {/*          validate: {*/}
              {/*            emailIsValid: (value: string) =>*/}
              {/*                /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) || "Please enter a valid email",*/}
              {/*            emailDoesntHavePlus: (value: string) =>*/}
              {/*                /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) || "Email addresses with a '+' are not allowed",*/}
              {/*            emailIsntDisposable: (value: string) =>*/}
              {/*                !disposableDomains.includes(value.split("@")[1]) || "Please use a permanent email address",*/}
              {/*          },*/}
              {/*        })}*/}
              {/*    />*/}
              {/*    {isSubmitted && errors.email && (*/}
              {/*        <span className={"text-xs text-red-400"}>{errors.email?.message || "Email is required to sign in"}</span>*/}
              {/*    )}*/}
              {/*  </div>*/}
              {/*</div>*/}

             <div onClick={handleSubmit(onSubmit)} className={"flex flex-row items-center justify-center gap-4 cursor-pointer py-2   border rounded-md hover:bg-gray-300 hover:duration-500 hover:transition-all"}>
               <Image src={"/microsoft.png"} alt={""} width={30} height={30} />
               <div>Login using Microsoft</div>

             </div>
            </form>
          </div>
        </div>
      </>
  );
};

export const OR = () => {
  return (
      <div className="flex items-center my-1">
        <div className="border-b flex-grow mr-2 opacity-50" />
        <span className="text-sm opacity-50">OR</span>
        <div className="border-b flex-grow ml-2 opacity-50" />
      </div>
  );
};

