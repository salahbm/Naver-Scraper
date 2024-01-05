"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session }: any = useSession();
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="logo"
          />

          <p className="nav-logo">
            Naver<span className="text-primary">Place</span>
          </p>
        </Link>

        <div className="flex-between">
          {!session ? (
            <Link href="/pages/sign-in">
              <Image
                src="/assets/icons/user.svg"
                alt="user icon"
                width={28}
                height={28}
                className="object-contain"
              />
            </Link>
          ) : (
            <div className="flex-center">
              <span
                id="emailSpan"
                className="text-neutral-700 font-semibold md:w-full w-[100px] overflow-hidden overflow-ellipsis"
              >
                {session.user?.email}
              </span>
              <Button
                className="mx-1 text-white"
                type="button"
                variant={"default"}
                onClick={() => signOut()}
              >
                Log Out
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
