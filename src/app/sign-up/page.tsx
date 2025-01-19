"use client";

import { authClient } from "@/lib/auth-client"; // Import the auth client
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const signUp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await authClient.signUp.email(
        { email, password, name },
        {
          onRequest: () => console.log("Request initiated..."),
          onSuccess: () => router.push("/"),
          onError: (ctx) =>
            setErrorMessage(ctx.error.message || "An error occurred."),
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      console.log("Sign-up response data:", data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create an Account
        </h1>
        {errorMessage && (
          <p className="text-sm text-red-500 text-center mb-4">
            {errorMessage}
          </p>
        )}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={signUp}
          disabled={loading}
          className={`mt-6 w-full py-2 px-4 text-white font-bold rounded-md ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <a href="/sign-in" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
