import React from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function ToolsPage() {
  const navigate = useNavigate();

  const tools = [
    {
      id: "image-to-site",
      name: "Image to Site",
      description:
        "Upload an image and automatically generate a simple website from it.",
      price: 100,
      currency: "EGP",
      status: "Paid",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Tools
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {tool.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    {tool.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Price: {tool.price} {tool.currency}
                </div>
                <button
                  onClick={() => navigate(`/dashboard/tools/${tool.id}`)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Open Tool
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
