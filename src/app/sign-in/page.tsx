"use client";
import { authClient } from "@/lib/auth-client"; // Import the auth client
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Handle email/password sign-in
  const handleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await authClient.signIn.email(
        { email, password },
        {
          onRequest: () => console.log("Request initiated..."),
          onSuccess: (ctx)=>{
            const authToken = ctx.response.headers.get("set-auth-token") // get the token from the response headers
            // Store the token securely (e.g., in localStorage)
            localStorage.setItem("bearer_token", authToken as string);
            router.push("/dashboard");
          },
          onError: (ctx) => setErrorMessage(ctx.error.message || "An error occurred."),
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      console.log("Sign-in response data:", data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      await authClient.signIn.social(
        { provider: "google", callbackURL: "http://localhost:3000/dashboard" }, // Redirect to dashboard after sign-in
        {
          onRequest: () => console.log("Google sign-in initiated..."),
          onSuccess: () => console.log("Successfully signed in with Google."),
          onError: (ctx) => setErrorMessage(ctx.error.message || "Google sign-in failed."),
        }
      );
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h1>
        {errorMessage && (
          <p className="text-sm text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
          onClick={handleSignIn}
          disabled={loading}
          className={`mt-6 w-full py-2 px-4 text-white font-bold rounded-md ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-bold rounded-md ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Redirecting to Google..." : "Sign In with Google"}
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Do not have an account?{" "}
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
