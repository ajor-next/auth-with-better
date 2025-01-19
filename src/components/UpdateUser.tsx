import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UpdateUserName: React.FC = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (!name.trim()) {
        setMessage("Name cannot be empty.");
        setIsLoading(false);
        return;
      }

      await authClient.updateUser({
        name: name.trim(),
      });

      setMessage("User name updated successfully!");
    } catch (error) {
      console.error("Error updating user name:", error);
      setMessage("Failed to update user name. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await authClient.deleteUser();
      router.push("/sign-in"); // Navigate to login page after successful deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Update User Name</h1>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
          New Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="Enter new name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button
        onClick={handleUpdate}
        className={`w-full px-4 py-2 text-white rounded-lg mb-4 ${
          isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Name"}
      </button>
      <button
        onClick={handleDelete}
        className={`w-full px-4 py-2 text-white rounded-lg ${
          isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete Account"}
      </button>
      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default UpdateUserName;
