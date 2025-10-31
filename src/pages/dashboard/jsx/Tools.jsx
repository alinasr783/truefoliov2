import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function ToolsPage() {
  const navigate = useNavigate();

  const defaultTools = [
    {
      id: "image-to-site",
      tool_id: "image-to-site",
      name: "Image to Site",
      description: "Upload multiple images and generate a simple stacked website.",
      price: 100,
      currency: "EGP",
      status: "Paid",
      image_url: "/vite.svg",
      route_path: "/dashboard/tools/image-to-site",
      is_active: true,
    },
  ];

  const [tools, setTools] = useState(defaultTools);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("tool_catalog")
          .select("id, tool_id, name, description, price, currency, status, image_url, route_path, is_active")
          .eq("is_active", true)
          .order("name", { ascending: true });
        if (error) throw error;
        if (!cancelled) setTools(data?.length ? data : defaultTools);
      } catch (e) {
        console.error("[Tools] fetch error:", e);
        if (!cancelled) setTools(defaultTools);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const openTool = (tool) => {
    const path = tool?.route_path || `/dashboard/tools/${tool?.tool_id || tool?.id}`;
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Tools</h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.tool_id || tool.id}
                className="group relative bg-white/90 dark:bg-gray-800/80 backdrop-blur rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="relative">
                  <img src={tool.image_url || "/vite.svg"} alt={tool.name} className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <span className="absolute top-3 right-3 inline-block text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-black/40 text-blue-700 dark:text-blue-300 shadow">
                    {tool.status || "Available"}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">{tool.price}</span>
                      <span className="ml-1 text-gray-600 dark:text-gray-400">{tool.currency}</span>
                    </div>
                    <button
                      onClick={() => openTool(tool)}
                      disabled={tool.is_active === false}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow disabled:opacity-50"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                        <path d="M7 7h10v10" /><path d="M7 17 17 7" />
                      </svg>
                      {tool.is_active === false ? "Coming Soon" : "Open"}
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute inset-0 ring-1 ring-indigo-500/20 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
