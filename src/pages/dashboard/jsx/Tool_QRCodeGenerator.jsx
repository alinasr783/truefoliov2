import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import { supabase } from "@/lib/supabase";

export default function Tool_QRCodeGenerator() {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(true);
  const [price, setPrice] = useState(null);
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(0);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [format, setFormat] = useState("png"); // png | svg | jpg
  const [copied, setCopied] = useState(false);

  const toolId = "qr-code-generator";

  useEffect(() => {
    let cancelled = false;
    const checkActive = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tools")
          .select("tool_id, is_active, price")
          .eq("tool_id", toolId)
          .maybeSingle();
        if (error) throw error;
        if (!cancelled) {
          setActive(data?.is_active ?? false);
          setPrice(data?.price ?? null);
        }
      } catch (e) {
        console.warn("[QR Tool] tools lookup failed, defaulting to active=false", e);
        if (!cancelled) setActive(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    checkActive();
    return () => { cancelled = true; };
  }, []);

  const qrUrl = useMemo(() => {
    const base = "https://api.qrserver.com/v1/create-qr-code/";
    const params = new URLSearchParams();
    const cl = (hex) => (hex || "").replace("#", "");
    const s = Math.max(64, Math.min(1024, Number(size) || 300));
    const m = Math.max(0, Math.min(50, Number(margin) || 0));
    params.set("size", `${s}x${s}`);
    params.set("data", text || "");
    if (fgColor) params.set("color", cl(fgColor));
    if (bgColor) params.set("bgcolor", cl(bgColor));
    if (m) params.set("qzone", String(m));
    if (format && format !== "png") params.set("format", format);
    return `${base}?${params.toString()}`;
  }, [text, size, margin, fgColor, bgColor, format]);

  const download = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const link = document.createElement("a");
      const ext = format === "svg" ? "svg" : format === "jpg" ? "jpg" : "png";
      link.href = URL.createObjectURL(blob);
      link.download = `qr-code.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Download failed. Try again.");
      console.error(e);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 ml-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">QR Code Generator</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Create customized QR codes instantly</p>
              {price != null && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Service price: {price} EGP (activation via Supabase)</p>
              )}
            </div>
          </div>

          {!active && (
            <div className="mb-6 p-4 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded-lg dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">
              This tool is currently disabled. Admin can activate it from Supabase.
            </div>
          )}

          {/* Config Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text or URL</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text, URL, or any payload"
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size (px)</label>
                    <input
                      type="number"
                      min={64}
                      max={1024}
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value || "300"))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Margin</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={margin}
                      onChange={(e) => setMargin(parseInt(e.target.value || "0"))}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foreground</label>
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background</label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-10 p-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                    <option value="jpg">JPG</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    disabled={!active || !text || loading}
                    onClick={download}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                  >
                    Download QR
                  </button>
                  <button
                    disabled={!active || !text}
                    onClick={copyLink}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    {copied ? "Copied!" : "Copy Image Link"}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center min-h-[360px]">
              {!text ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Enter text to preview the QR code.
                </div>
              ) : (
                format === "svg" ? (
                  <object type="image/svg+xml" data={qrUrl} aria-label="QR Code" className="max-w-full max-h-[480px]" />
                ) : (
                  <img src={qrUrl} alt="QR Code" className="max-w-full max-h-[480px]" />
                )
              )}
            </div>
          </div>

          {/* Help */}
          <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
            Note: This uses a public QR API. For production, you can switch to a private service or library.
          </div>
        </div>
      </div>
    </>
  );
}

