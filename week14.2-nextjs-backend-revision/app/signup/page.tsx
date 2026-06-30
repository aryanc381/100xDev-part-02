"use client"
import { useRouter } from "next/router"

export default async function() {
    const router = useRouter();
    return(
        <div className="">
            <p>Signup</p>
            <input type="text" placeholder="aryan381@gmail.com" />
            <input type="text" placeholder="*****************" />
            <button onClick={() => {router.push('/')}}>signup</button>
        </div>
    )
}