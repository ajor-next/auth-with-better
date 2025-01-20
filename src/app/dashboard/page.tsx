"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { authClient } from "@/lib/auth-client"; // Import the auth client
//import AddQuotation from "@/components/AddQuotation";
import UpdateUserName from "@/components/UpdateUser";
import AddQuotation from "@/components/AddQuotation";

export default function Dashboard() {
  const router = useRouter();

  const {
    data: session,
    isPending, // Loading state
    error, // Error object
  } = authClient.useSession();

  const handleSignOut = async () => {
     await authClient.signOut({
      fetchOptions: {
        credentials: "include",
        onSuccess: () => {
          router.push("/sign-in"); // Redirect to login page
        },
        onError: (ctx) => {
            console.log(ctx);
            
        }
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-700">No user data available.</div>
      </div>
    );
  }

  const { name, email } = session.user;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col gap-10 items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full text-center">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-gray-400">
          <span className="text-2xl">👤</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
        <p className="text-gray-600">{email}</p>
        <button
          onClick={handleSignOut}
          className="mt-6 w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md"
        >
          Sign Out
        </button>
      </div>
      <div>
        <UpdateUserName />
      </div>
      <div>
        <AddQuotation />
      </div>
    </div>
  );
}
