import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import { supabase } from "@/lib/supabase";

// Config
const PRICE_EGP = 100;
const IMAGE_BUCKET = "tool-images"; // create as Public bucket in Supabase Storage
const SITE_BUCKET = "tool-sites"; // create as Public bucket in Supabase Storage

// Helper: generate simple website HTML using the uploaded image URL
const cleanUrl = (u) => String(u || "").trim().replace(/`/g, "");

const generateSiteHtml = ({ title, imageUrl, username }) => {
  const img = cleanUrl(imageUrl);
  const safeTitle = String(title || "").trim();
  const year = new Date().getFullYear();
  return {
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="robots" content="index, follow" />
    <meta name="description" content="Auto-generated website from your image." />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background:#0b0f17; color:#e5e7eb; }
      .wrap { max-width: 1000px; margin: 0 auto; padding: 0; }
      .img { width: 100%; height: auto; display:block; }
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
      <img class="img" src="${img}" alt="${safeTitle || "Uploaded"}" />
    </main>
    <div id="dev-credit" class="credit">
      <div class="credit-row">
        <span class="credit-text">صمم بواسطة</span>
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
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [ordinal, setOrdinal] = useState(1);
  const [title, setTitle] = useState("My Auto Site");
  const [saving, setSaving] = useState(false);
  const [finalSiteUrl, setFinalSiteUrl] = useState("");
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[ImageToSite] file selected:", { name: file.name, size: file.size, type: file.type });
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
      if (!title || title === "My Auto Site") setTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  };

  // Preview site (friendly URL on current domain) and generated HTML
  const site = useMemo(() => {
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://truefolio.tech";
    const previewFriendlyUrl = `${origin}/${username}/${toolId}/${ordinal}`;
    const htmlObj = generateSiteHtml({ title, imageUrl, username });
    return { ...htmlObj, siteUrl: finalSiteUrl || previewFriendlyUrl };
  }, [title, imageUrl, username, toolId, ordinal, finalSiteUrl]);

  const qrUrl = useMemo(() => {
    try {
      const target = encodeURIComponent(site.siteUrl || "");
      if (!target) return "";
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${target}`;
    } catch {
      return "";
    }
  }, [site.siteUrl]);

  const downloadHtml = () => {
    const blob = new Blob([site.html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${toolId}-${ordinal}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadQr = () => {
    if (!qrUrl) return;
    // Open QR in a new tab to avoid cross-origin download aborts
    window.open(qrUrl, "_blank");
  };

  // Helpers
  const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "_");
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

  const saveInstance = async () => {
    if (!user) return alert("You need to be logged in.");
    if (!imageFile) return alert("Please upload an image first.");

    try {
      setSaving(true);
      console.log("[ImageToSite] saveInstance start", { user, username, toolId, ordinal });
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

      const safeName = sanitizeFilename(imageFile.name || `menu_${Date.now()}.png`);
      const imagePath = `${username}/${toolId}/${ordForPath}/${safeName}`;
      // Debug: log upload target
      console.log("Uploading image to:", IMAGE_BUCKET, imagePath);
      let imagePublicUrl = "";
      try {
        imagePublicUrl = await uploadToStorage(IMAGE_BUCKET, imagePath, imageFile, imageFile.type || "image/png");
        console.log("[ImageToSite] image uploaded:", imagePublicUrl);
      } catch (err) {
        const msg = err?.message || String(err);
        alert(`فشل رفع الصورة: ${msg}`);
        throw err; // rethrow to exit save flow
      }

      const sitePath = `${username}/${toolId}/${ordForPath}/index.html`;
      const { data: sitePubData } = supabase.storage.from(SITE_BUCKET).getPublicUrl(sitePath);
      const sitePublicUrl = cleanUrl(sitePubData.publicUrl);
      console.log("[ImageToSite] site public URL (pre-upload):", sitePublicUrl);

      const finalHtml = generateSiteHtml({ title, imageUrl: imagePublicUrl, username }).html;
      const htmlBlob = new Blob([finalHtml], { type: "text/html; charset=utf-8" });
      console.log("Uploading site HTML to:", SITE_BUCKET, sitePath);
      try {
        await uploadToStorage(SITE_BUCKET, sitePath, htmlBlob, "text/html; charset=utf-8");
        console.log("[ImageToSite] site HTML uploaded:", sitePublicUrl);
      } catch (err) {
        const msg = err?.message || String(err);
        alert(`فشل رفع صفحة الموقع: ${msg}`);
        throw err;
      }

      // Atomic wallet check + deduction + instance + transaction
      console.log("[ImageToSite] calling RPC purchase_tool_instance", {
        p_client_id: user.id,
        p_tool_id: toolId,
        p_price: PRICE_EGP,
        p_site_url: sitePublicUrl,
        p_source_image_url: imagePublicUrl,
        p_title: title,
      });
      const { data: purchase, error: purchaseErr } = await supabase.rpc("purchase_tool_instance", {
        p_client_id: user.id,
        p_tool_id: toolId,
        p_price: PRICE_EGP,
        p_site_url: sitePublicUrl,
        p_source_image_url: imagePublicUrl,
        p_title: title,
      });
      console.log("[ImageToSite] RPC result:", { purchase, purchaseErr });
      if (purchaseErr) throw purchaseErr;

      const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://truefolio.tech";
      const friendlyUrl = `${origin}/${username}/${toolId}/${ordForPath}`;
      setFinalSiteUrl(friendlyUrl);
      if (purchase?.ordinal_id) setOrdinal(purchase.ordinal_id);
      alert("تم إنشاء الموقع بنجاح وخصم قيمة الأداة من المحفظة. QR جاهز للتحميل.");
    } catch (e) {
      const msg = e?.message || String(e);
      if (/insufficient/i.test(msg)) {
        alert("رصيد المحفظة غير كافٍ لشراء هذه الأداة.");
      } else {
        alert(`فشل حفظ الأداة: ${msg}`);
      }
      console.error("[ImageToSite] saveInstance error:", e);
    } finally {
      setSaving(false);
      console.log("[ImageToSite] saveInstance end");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Image to Site
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Price: 100 EGP • Upload an image, generate a simple website, and get a downloadable QR code for access.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Site Title</span>
                <input
                  className="mt-1 w-full rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Auto Site"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 w-full"
                  onChange={handleFileChange}
                />
              </label>

              {imageUrl && (
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={imageUrl} alt="Uploaded" className="w-full" />
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={saveInstance}
                  disabled={saving || !imageUrl}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create & Save"}
                </button>
                <button
                  onClick={downloadHtml}
                  disabled={!imageUrl}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                >
                  Download Website HTML
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Access</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Generated URL</p>
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
              <button
                onClick={downloadQr}
                disabled={!qrUrl}
                className="mt-3 px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
              >
                Download QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
