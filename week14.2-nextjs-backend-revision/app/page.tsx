"use client";
import axios from "axios";
import signIn from 'next-auth';
import signOut from 'next-auth';

export default async function Home() {
  await new Promise(r => setTimeout(r, 5000));
  const response = await axios.get('http://localhost:3000/api/health');
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>{response.data.username}</p>
      <p>{response.data.email}</p>
    </div>
  );
}


export const Appbar = () => {
    return <div>
    <button onClick={() => signIn()}>Signin</button>
    <button onClick={() => signOut()}>Sign out</button>
  </div>
}