import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import { supabase } from "@/lib/supabase";
import DropzoneUpload from "@/components/ui/DropzoneUpload";
import { Copy, Download, Trash2, Link as LinkIcon } from "lucide-react";

// Config
const PRICE_EGP = 100;
const IMAGE_BUCKET = "tool-images"; // create as Public bucket in Supabase Storage
const SITE_BUCKET = "tool-sites"; // create as Public bucket in Supabase Storage

// Helper: generate simple website HTML using the uploaded image URL
const cleanUrl = (u) => String(u || "").trim().replace(/`/g, "");

const generateSiteHtml = ({ title, imageUrl, imageUrls = [], username }) => {
  // Support single or multiple images; prefer provided array
  const urls = (imageUrls && imageUrls.length ? imageUrls : [imageUrl]).filter(Boolean).map(cleanUrl);
  const safeTitle = String(title || "").trim();
  return {
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="robots" content="index, follow" />
    <meta name="description" content="Auto-generated website from your images." />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background:#0b0f17; color:#e5e7eb; }
      .wrap { max-width: 1000px; margin: 0 auto; padding: 0; }
      .img { width: 100%; height: auto; display:block; }
      .stack { display: grid; gap: 16px; padding: 16px; }
      .credit { width:100%; background:#111827; border-top:1px solid #374151; padding:8px 12px; }
      .credit-row { display:flex; align-items:center; justify-content:center; gap:6px; }
      .credit-text { font-size:11px; color:#d1d5db; }
      .credit-link { font-size:11px; color:#818cf8; text-decoration:none; display:inline-flex; align-items:center; gap:4px; transition: color .2s ease; }
      .credit-link:hover { color:#fff; }
      .credit-icon { color:#818cf8; display:inline-flex; align-items:center; justify-content:center; transition: transform .3s ease; }
      .credit.hovered .credit-icon { transform: scale(1.2); }
      .ext { width:12px; height:12px; vertical-align:middle; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <div class="stack">
        ${urls.map(u => `<img class=\"img\" src=\"${u}\" alt=\"${safeTitle || 'Image'}\" />`).join("\n        ")}
      </div>
    </main>
    <div id="dev-credit" class="credit">
      <div class="credit-row">
        <span class="credit-text">Crafted by</span>
        <span id="dev-icon" class="credit-icon" aria-hidden="true"></span>
        <a class="credit-link" href="https://truefolio.tech" target="_blank" rel="noopener noreferrer">
          TrueFolio
          <svg class="ext" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
          </svg>
        </a>
      </div>
    </div>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script>
      (function(){
        var names = ['code','cpu','binary','sparkles'];
        var idx = 0; var isHovered = false;
        var iconEl = document.getElementById('dev-icon');
        var creditEl = document.getElementById('dev-credit');
        function render(){
          try {
            var svg = window.lucide && window.lucide.createIcon(names[idx % names.length]).toSvg({stroke:'currentColor'});
            if (svg) {
              iconEl.innerHTML = svg;
              var svgEl = iconEl.querySelector('svg');
              if (svgEl) { svgEl.style.width='12px'; svgEl.style.height='12px'; }
            }
          } catch (e) {}
        }
        render();
        var timer = setInterval(function(){ if (!isHovered) { idx = (idx+1)%names.length; render(); } }, 1500);
        creditEl.addEventListener('mouseenter', function(){ isHovered = true; creditEl.classList.add('hovered'); });
        creditEl.addEventListener('mouseleave', function(){ isHovered = false; creditEl.classList.remove('hovered'); });
      })();
    </script>
  </body>
</html>`
  };
};

export default function Tool_ImageToSite() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("guest");
  const [items, setItems] = useState([]); // {file, dataUrl, title?, finalSiteUrl?}
  const [ordinal, setOrdinal] = useState(1);
  const [saving, setSaving] = useState(false);
  const [finalSiteUrl, setFinalSiteUrl] = useState(""); // last created
  const [history, setHistory] = useState([]);
  const [title, setTitle] = useState("My Auto Site");
  const toolId = "image-to-site";

  useEffect(() => {
    const init = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        console.log("[ImageToSite] auth.getUser:", auth);
        if (auth?.user) {
          setUser(auth.user);
          // Try to get username from client profile, fallback to email prefix
          const { data: clients, error: clientErr } = await supabase
            .from("client")
            .select("id, first_name, company_name, email, wallet")
            .eq("id", auth.user.id)
            .limit(1);
          if (clientErr) console.error("[ImageToSite] client fetch error:", clientErr);
          console.log("[ImageToSite] client profile:", clients);
          const client = clients?.[0];
          // Derive a safe username from existing fields (no username column in client)
          const rawName = client?.company_name || client?.first_name || (auth.user.email ? auth.user.email.split("@")[0] : "user");
          const uname = String(rawName || "user")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9._-]/g, "-");
          setUsername(uname);

          // Fetch current count to compute ordinal (per user per tool)
          const { count, error } = await supabase
            .from("tool_instances")
            .select("id", { count: "exact" })
            .eq("client_id", auth.user.id)
            .eq("tool_id", toolId)
            .range(0, 0);
          console.log("[ImageToSite] tool_instances count:", { count, error });
          if (!error && typeof count === "number") {
            setOrdinal((count || 0) + 1);
          }
        }
      } catch (e) {
        // non-fatal
        console.error("[ImageToSite] init error:", e);
      }
    };
    init();
  }, []);

  const handleFilesFromDropzone = (incoming) => {
    const results = Array.isArray(incoming) ? incoming : [];
    if (!results.length) return;
    console.log("[ImageToSite] files added:", results.map(it => ({ name: it.file?.name, size: it.file?.size })));
    setItems((prev) => [...prev, ...results]);
    if (title === "My Auto Site" && results[0]?.file?.name) {
      const base = results[0].file.name.replace(/\.[^.]+$/, "");
      setTitle(base);
    }
  };

  // Preview combined site (friendly URL on current domain)
  const site = useMemo(() => {
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://truefolio.tech";
    const previewFriendlyUrl = `${origin}/${username}/${toolId}/${ordinal}`;
    const htmlObj = generateSiteHtml({ title, imageUrls: items.map(it => it.dataUrl), username });
    return { ...htmlObj, siteUrl: finalSiteUrl || previewFriendlyUrl };
  }, [items, title, username, toolId, ordinal, finalSiteUrl]);

  const qrUrl = useMemo(() => {
    try {
      const target = encodeURIComponent(site.siteUrl || "");
      if (!target) return "";
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${target}`;
    } catch {
      return "";
    }
  }, [site.siteUrl]);

  // Helper: build QR URL for arbitrary link (used in history list)
  const makeQrUrl = (u) => {
    try {
      const target = encodeURIComponent(String(u || ""));
      if (!target) return "";
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${target}`;
    } catch {
      return "";
    }
  };

  const downloadCombinedHtml = () => {
    const htmlObj = generateSiteHtml({ title, imageUrls: items.map(it => it.dataUrl), username });
    const blob = new Blob([htmlObj.html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${toolId}-${ordinal}-combined.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadQr = () => {
    if (!qrUrl) return;
    // Open QR in a new tab to avoid cross-origin download aborts
    window.open(qrUrl, "_blank");
  };

  // Download QR image for a given URL with graceful fallback
  const downloadQrFromUrl = async (url, filename = "qr.png") => {
    try {
      if (!url) return;
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(`Failed to fetch QR (${res.status})`);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.warn("[ImageToSite] QR download fallback:", err);
      window.open(url, "_blank");
    }
  };

  // Helpers
  const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://truefolio.tech";
  const friendly = (uname, ord) => `${origin}/${uname}/${toolId}/${ord}`;
  const toFriendlyFromStorageUrl = (u) => {
    try {
      const m = String(u || "").match(/tool-sites\/(.*?)\/image-to-site\/(\d+)\/index\.html/);
      if (!m) return u;
      const uname = m[1];
      const ord = m[2];
      return friendly(uname, ord);
    } catch {
      return u;
    }
  };
  const uploadToStorage = async (bucket, path, fileData, contentType) => {
    console.log("[ImageToSite] upload start:", { bucket, path, contentType, size: fileData?.size });
    const { error } = await supabase.storage.from(bucket).upload(path, fileData, {
      upsert: true,
      cacheControl: "3600",
      contentType: contentType || "application/octet-stream",
    });
    if (error) {
      console.error("[ImageToSite] upload error:", error);
      throw error;
    }
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    console.log("[ImageToSite] public URL:", pub);
    return pub.publicUrl;
  };

  const saveCombinedInstance = async () => {
    if (!user) return alert("You need to be logged in.");
    if (!items.length) return alert("Please upload at least one image.");

    try {
      setSaving(true);
      console.log("[ImageToSite] saveCombined start", { user, username, toolId, ordinal, count: items.length });
      // Refresh ordinal to reduce collision risk
      const { count, error: cntErr } = await supabase
        .from("tool_instances")
        .select("id", { count: "exact" })
        .eq("client_id", user.id)
        .eq("tool_id", toolId)
        .range(0, 0);
      if (!cntErr && typeof count === "number") {
        setOrdinal((count || 0) + 1);
      }

      // Use a unique fallback ordinal if RLS prevents counting
      const ordForPath = Number.isFinite(ordinal) && ordinal > 0 ? ordinal : Math.floor(Date.now());
      console.log("[ImageToSite] ordinals:", { ordinal_state: ordinal, count, ordForPath });

      // Upload all images and collect public URLs
      const imagePublicUrls = [];
      for (const item of items) {
        const safeName = sanitizeFilename(item.file.name || `img_${Date.now()}.png`);
        const imagePath = `${username}/${toolId}/${ordForPath}/${safeName}`;
        console.log("Uploading image to:", IMAGE_BUCKET, imagePath);
        try {
          const url = await uploadToStorage(IMAGE_BUCKET, imagePath, item.file, item.file.type || "image/png");
          imagePublicUrls.push(url);
        } catch (err) {
          const msg = err?.message || String(err);
          alert(`Failed to upload image: ${msg}`);
          throw err;
        }
      }

      const sitePath = `${username}/${toolId}/${ordForPath}/index.html`;
      const { data: sitePubData } = supabase.storage.from(SITE_BUCKET).getPublicUrl(sitePath);
      const sitePublicUrl = cleanUrl(sitePubData.publicUrl);
      const friendlyUrl = friendly(username, ordForPath);
      console.log("[ImageToSite] site public URL (pre-upload):", sitePublicUrl);

      const finalHtml = generateSiteHtml({ title, imageUrls: imagePublicUrls, username }).html;
      const htmlBlob = new Blob([finalHtml], { type: "text/html; charset=utf-8" });
      console.log("Uploading site HTML to:", SITE_BUCKET, sitePath);
      try {
        await uploadToStorage(SITE_BUCKET, sitePath, htmlBlob, "text/html; charset=utf-8");
        console.log("[ImageToSite] site HTML uploaded:", sitePublicUrl);
      } catch (err) {
        const msg = err?.message || String(err);
        alert(`Failed to upload site page: ${msg}`);
        throw err;
      }

      // Atomic wallet check + deduction + instance + transaction
      console.log("[ImageToSite] calling RPC purchase_tool_instance", {
        p_client_id: user.id,
        p_tool_id: toolId,
        p_price: PRICE_EGP,
        p_site_url: friendlyUrl,
        p_source_image_url: imagePublicUrls[0] || "",
        p_title: title,
      });
      const { data: purchase, error: purchaseErr } = await supabase.rpc("purchase_tool_instance", {
        p_client_id: user.id,
        p_tool_id: toolId,
        p_price: PRICE_EGP,
        p_site_url: friendlyUrl,
        p_source_image_url: imagePublicUrls[0] || "",
        p_title: title,
      });
      console.log("[ImageToSite] RPC result:", { purchase, purchaseErr });
      if (purchaseErr) throw purchaseErr;

      setFinalSiteUrl(friendlyUrl); // last created
      setItems((prev) => prev.map((it) => ({ ...it, finalSiteUrl: friendlyUrl })));
      if (purchase?.ordinal_id) setOrdinal(purchase.ordinal_id);
      alert("Site created successfully and charged once. QR is ready.");
    } catch (e) {
      const msg = e?.message || String(e);
      if (/insufficient/i.test(msg)) {
        alert("Insufficient wallet balance for this tool.");
      } else {
        alert(`Failed to save: ${msg}`);
      }
      console.error("[ImageToSite] saveInstance error:", e);
    } finally {
      setSaving(false);
      console.log("[ImageToSite] saveInstance end");
    }
  };

  const loadHistory = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tool_instances")
      .select("id, created_at, site_url, title")
      .eq("client_id", user.id)
      .eq("tool_id", toolId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[ImageToSite] history error:", error);
      return;
    }
    const mapped = (data || []).map((row) => ({ ...row, site_url: toFriendlyFromStorageUrl(row.site_url) }));
    setHistory(mapped);
  };

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); alert("Link copied"); } catch {}
  };

  const deleteInstance = async (id) => {
    if (!confirm("Do you want to delete this record?")) return;
    const { error } = await supabase.from("tool_instances").delete().eq("id", id).eq("client_id", user.id);
    if (error) {
      alert("Failed to delete: " + (error.message || ""));
      return;
    }
    await loadHistory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Image to Site</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Price: {PRICE_EGP} EGP • Upload multiple images, generate one site, and get a QR code.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Upload & Items */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload Images</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Choose one or more images. They will be stacked in the final site.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadCombinedHtml}
                    disabled={!items.length}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                  >
                    Download Combined HTML
                  </button>
                  <button
                    onClick={saveCombinedInstance}
                    disabled={saving || !items.length}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                  >
                    {saving ? "Creating..." : "Create Combined Site"}
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Title</label>
                <input
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 mb-4 shadow-sm focus:ring-2 focus:ring-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Auto Site"
                />
                <DropzoneUpload
                  multiple
                  accept="image/*"
                  value={items}
                  onFilesChange={handleFilesFromDropzone}
                  className="mt-2"
                  label="Drag & drop images here"
                  sublabel="or click to browse"
                />
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={item.dataUrl} alt="Preview" className="w-full" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {item.finalSiteUrl && (
                        <div className="mt-1">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Link:</p>
                          <a href={item.finalSiteUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 break-all">
                            {item.finalSiteUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!items.length && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No images yet — upload to get started.
                </div>
              )}
            </div>
          </div>

          {/* Right: Access & History */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Access</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest generated URL</p>
              <a href={site.siteUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 break-all">
                {site.siteUrl}
              </a>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">QR Code</p>
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Code" className="mt-2 w-40 h-40 bg-white rounded" />
                ) : (
                  <div className="mt-2 w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded" />
                )}
                <button onClick={downloadQr} disabled={!qrUrl} className="mt-3 px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50">
                  Open QR
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Usage History</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">View and manage previously created links.</p>
              <div className="mt-3 space-y-3">
                {history.map((row) => (
                  <div
                    key={row.id}
                    className="group relative overflow-hidden rounded-xl border border-gray-200/70 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500/40 via-emerald-500/40 to-sky-500/40" />
                    <div className="p-3 sm:p-4 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={makeQrUrl(row.site_url)}
                          alt="QR"
                          className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-white dark:bg-gray-900 ring-1 ring-gray-200/60 dark:ring-gray-700 object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        {row.title && (
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {row.title}
                          </div>
                        )}
                        <div className="mt-0.5 flex items-center gap-2 min-w-0">
                          <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <a
                            href={row.site_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[340px] sm:max-w-[420px]"
                            title={row.site_url}
                          >
                            {row.site_url}
                          </a>
                        </div>
                        <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                          {new Date(row.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(row.site_url)}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-300 dark:ring-indigo-900"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </button>
                        <button
                          onClick={() => downloadQrFromUrl(makeQrUrl(row.site_url), `qr-${row.id}.png`)}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download QR
                        </button>
                        <button
                          onClick={() => deleteInstance(row.id)}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!history.length && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">No records yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
