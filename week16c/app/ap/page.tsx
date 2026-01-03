"use client"
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="">
        <button onClick={() => signIn("google")}>Sign In with Google</button>
        <button onClick={() => signIn("credentials", {
          username: "", password: ""
        })}>Sign In with credentials</button>
        <button onClick={() => signOut()}>Sign Out</button>
        {JSON.stringify(session)}
      </div>
    </div>
  );
}
