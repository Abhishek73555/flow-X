"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export function LoginButtons({ error }: { error?: string }) {
  const [email, setEmail] = useState("")

  return (
    <div className="flex flex-col space-y-4 max-w-sm w-full mx-auto mt-8 items-center">
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm text-center w-full">
          Authentication failed ({error}). Please try again.
        </div>
      )}

      {/* OAuth Providers */}
      <button 
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full bg-white text-gray-800 border-gray-300 border py-2 rounded shadow-sm hover:bg-gray-50 flex justify-center items-center"
      >
        Sign in with Google
      </button>

      <button 
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="w-full bg-slate-900 text-white border-slate-900 border py-2 rounded shadow-sm hover:bg-slate-800 flex justify-center items-center"
      >
        Sign in with GitHub
      </button>

      <button 
        onClick={() => signIn("linkedin", { callbackUrl: "/dashboard" })}
        className="w-full bg-[#0A66C2] text-white border-[#0A66C2] border py-2 rounded shadow-sm hover:bg-[#004b90] flex justify-center items-center"
      >
        Sign in with LinkedIn
      </button>

      <div className="flex items-center w-full my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-3 text-gray-500 text-sm">or using email</div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Email Magic Link */}
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          signIn("nodemailer", { email, callbackUrl: "/dashboard" })
        }}
        className="w-full flex space-x-2"
      >
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 border rounded py-2 px-3 focus:outline-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white rounded px-4 hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
