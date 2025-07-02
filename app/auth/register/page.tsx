"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/auth/login")
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 sm:px-6">
      <Card className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-100 transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="text-center pb-6 sm:pb-8">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Create Account</CardTitle>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Sign up to get started</p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:border-gray-300 focus:shadow-lg transition-all duration-300 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:border-gray-300 focus:shadow-lg transition-all duration-300 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:border-gray-300 focus:shadow-lg transition-all duration-300 text-sm sm:text-base"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg sm:rounded-xl py-2 sm:py-3 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-gray-900 font-medium hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
