import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import { supabase } from "@/lib/supabase";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Sparkles, Globe, Type, Languages, ListChecks, Link as LinkIcon, Copy, Download, Trash2 } from "lucide-react";

// Pricing
const PRICE_EGP = 50;
const SITE_BUCKET = "tool-sites"; // Public bucket in Supabase Storage

// Gemini API (user requested gemini-2.0-flash)
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_API_KEY = "AIzaSyBpknrp9hVYU6zgY86QIQedSl4NmjrPCj4"; // dev key (user will rotate in production)

const clean = (s) => String(s || "").trim();

// Build prompt for Gemini
function buildPrompt({ sourceText, sourceUrl, style, dialect, paragraphs, keywords }) {
  const srcText = clean(sourceText);
  const srcUrl = clean(sourceUrl);
  const kw = Array.isArray(keywords)
    ? keywords
    : String(keywords || "").split(",").map((k) => clean(k)).filter(Boolean);
  const kwStr = kw.length ? `Keywords: ${kw.join(", ")}.` : "";
  const sourceBlock = srcText
    ? `Write an article based on the following text:\n\n"""\n${srcText}\n"""\n\n`
    : (srcUrl
        ? `Write an article inspired by the page at: ${srcUrl}. If direct fetching is blocked by the browser, use the general topic of the URL without verbatim copying.`
        : `Write an article on a suitable general topic.`);
  return [
    sourceBlock,
    `Requirements: Style: ${style}. Paragraphs: ${paragraphs}. ${kwStr}`,
    `Formatting: Divide into clear paragraphs of 3–6 sentences each. Use simple headings if helpful. Integrate the keywords naturally without stuffing. Return plain text only (no Markdown). Language: English.`,
  ].join("\n\n");
}

async function callGemini(prompt) {
  const models = [
    GEMINI_MODEL,
    "gemini-2.0-flash-latest",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
  ];
  let lastErr = null;
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const body = {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Gemini error ${res.status}`);
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (text) return clean(text);
      lastErr = new Error("Gemini returned empty text");
    } catch (e) {
      console.warn(`[TextToArticle] Gemini model ${model} failed:`, e);
      lastErr = e;
    }
  }
  throw lastErr || new Error("Gemini failed");
}

// Translate English article to Arabic in a chosen dialect
async function translateToArabic(text, dialect) {
  const dialectHint = String(dialect || "فصحى").includes("مصري") ? "Egyptian Arabic" : "Modern Standard Arabic";
  const prompt = [
    `Translate the following English article into Arabic (${dialectHint}).`,
    `Keep the structure and paragraphing. Return plain text only (no Markdown).`,
    `Avoid diacritics; keep language natural and readable.`,
    `\n\n"""\n${clean(text)}\n"""\n`
  ].join(" \n");
  return await callGemini(prompt);
}

// Generate concise English and Arabic titles for the article
async function generateTitles(articleEn) {
  const prompt = [
    `Propose compelling titles in English and Arabic for the following article.`,
    `Respond STRICTLY as JSON with keys: title_en, title_ar. Each <= 60 characters.`,
    `\n\n"""\n${clean(articleEn)}\n"""\n`
  ].join(" \n");
  const raw = await callGemini(prompt);
  try {
    const obj = JSON.parse(raw);
    return { en: clean(obj.title_en), ar: clean(obj.title_ar) };
  } catch {
    // Fallback: try to parse lines
    const lines = raw.split(/\r?\n/).map((l) => clean(l)).filter(Boolean);
    const en = lines.find((l) => /english|en/i.test(l)) || lines[0] || "Untitled";
    const ar = lines.find((l) => /arabic|ar/i.test(l)) || lines[1] || "بدون عنوان";
    return { en: clean(en.replace(/^[^:]*:\s*/, "")), ar: clean(ar.replace(/^[^:]*:\s*/, "")) };
  }
}

function buildArticleHtml({ title, articleText, username }) {
  const safeTitle = clean(title) || "AI Article";
  const safeText = clean(articleText).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="robots" content="index, follow" />
    <meta name="description" content="AI-generated article" />
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background:#0b0f17; color:#e5e7eb; }
      .wrap { max-width: 900px; margin: 0 auto; padding: 24px; }
      h1 { font-size: 22px; margin: 0 0 16px; }
      .article { white-space: pre-wrap; line-height: 1.9; }
      .credit { width:100%; background:#111827; border-top:1px solid #374151; padding:8px 12px; margin-top:24px; }
      .credit-row { display:flex; align-items:center; justify-content:center; gap:6px; }
      .credit-text { font-size:11px; color:#d1d5db; }
      .credit-link { font-size:11px; color:#818cf8; text-decoration:none; display:inline-flex; align-items:center; gap:4px; transition: color .2s ease; }
      .credit-link:hover { color:#fff; }
      .ext { width:12px; height:12px; vertical-align:middle; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <h1>${safeTitle}</h1>
      <div class="article">${safeText}</div>
    </main>
    <div class="credit">
      <div class="credit-row">
        <span class="credit-text">Crafted by</span>
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
  </body>
</html>`;
}

export default function Tool_TextToArticle() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("guest");
  const [ordinal, setOrdinal] = useState(1);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [title, setTitle] = useState("New Article");
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [sourceType, setSourceType] = useState("text"); // 'text' | 'url'
  const [sourceText, setSourceText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [style, setStyle] = useState("Formal");
  const [dialect, setDialect] = useState("فصحى");
  const [paragraphs, setParagraphs] = useState(5);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [articleText, setArticleText] = useState("");
  const [articleTextAr, setArticleTextAr] = useState("");
  const [finalSiteUrl, setFinalSiteUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [purchasedThisRun, setPurchasedThisRun] = useState(false);
  const toolId = "text-to-article";

  useEffect(() => {
    const init = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (auth?.user) {
          setUser(auth.user);
          const { data: clients } = await supabase
            .from("client")
            .select("id, first_name, company_name, email, wallet")
            .eq("id", auth.user.id)
            .limit(1);
          const client = clients?.[0];
          const rawName = client?.company_name || client?.first_name || (auth.user.email ? auth.user.email.split("@")[0] : "user");
          const uname = String(rawName || "user").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "-");
          setUsername(uname);

          const { count } = await supabase
            .from("tool_instances")
            .select("id", { count: "exact" })
            .eq("client_id", auth.user.id)
            .eq("tool_id", toolId)
            .range(0, 0);
          if (typeof count === "number") setOrdinal((count || 0) + 1);

          // Load user projects
          const { data: projData, error: projErr } = await supabase
            .from("project")
            .select("id, name, supabase_url, supabase_anon, blog_tabel_name, client_id")
            .eq("client_id", auth.user.id);
          if (!projErr) setProjects(projData || []);
        }
      } catch (e) {
        console.error("[TextToArticle] init error:", e);
      }
    };
    init();
  }, []);

  const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://truefolio.tech";
  const friendly = (uname, ord) => `${origin}/${uname}/${toolId}/${ord}`;

  const site = useMemo(() => {
    const previewFriendlyUrl = friendly(username, ordinal);
    return { siteUrl: finalSiteUrl || previewFriendlyUrl };
  }, [username, ordinal, finalSiteUrl]);

  const makeQrUrl = (u) => {
    try {
      const target = encodeURIComponent(String(u || ""));
      if (!target) return "";
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${target}`;
    } catch {
      return "";
    }
  };

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
      console.warn("[TextToArticle] QR download fallback:", err);
      window.open(url, "_blank");
    }
  };

  const generateArticle = async () => {
    try {
      setGenerating(true);
      const prompt = buildPrompt({
        sourceText,
        sourceUrl,
        style,
        paragraphs,
        keywords: keywordsInput,
      });
      const text = await callGemini(prompt);
      setArticleText(text);
      // Arabic translation for convenience
      try {
        const ar = await translateToArabic(text, dialect);
        setArticleTextAr(ar);
      } catch (e) {
        console.warn("[TextToArticle] Arabic translation failed:", e);
      }
      // Titles EN/AR
      try {
        const t = await generateTitles(text);
        setTitleEn(t.en || "Untitled");
        setTitleAr(t.ar || "بدون عنوان");
        setTitle(t.en || "Untitled");
      } catch (e) {
        console.warn("[TextToArticle] Title generation failed:", e);
        if (!title || title === "New Article") {
          const base = clean(sourceText).slice(0, 24) || clean(sourceUrl).slice(0, 24) || "Article";
          setTitle(`${base} — ${style}`);
        }
      }
    } catch (e) {
      alert("Failed to generate the article: " + (e.message || String(e)));
      console.error("[TextToArticle] generate error:", e);
    } finally {
      setGenerating(false);
    }
  };

  const uploadToStorage = async (bucket, path, fileData, contentType) => {
    const { error } = await supabase.storage.from(bucket).upload(path, fileData, {
      upsert: true,
      cacheControl: "3600",
      contentType: contentType || "application/octet-stream",
    });
    if (error) throw error;
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    return pub.publicUrl;
  };

  // Ensure the tool record exists to satisfy FK constraints
  const ensureToolExists = async () => {
    try {
      const { data: existsData, error: existsErr } = await supabase
        .from("tools")
        .select("tool_id")
        .eq("tool_id", toolId)
        .limit(1);
      if (existsErr) {
        // RLS may prevent reads; continue and try insert
        console.warn("[TextToArticle] Unable to check tools table:", existsErr.message || existsErr);
      }
      const exists = Array.isArray(existsData) && existsData.length > 0;
      if (!exists) {
        const { error: insertErr } = await supabase.from("tools").insert({
          tool_id: toolId,
          name: "Text to Article",
          price: PRICE_EGP,
          is_active: true,
        });
        if (insertErr) {
          // If insert fails due to RLS, instructive log only; purchase may still fail
          console.warn("[TextToArticle] Tool insert failed (likely RLS):", insertErr.message || insertErr);
        }
      }
    } catch (e) {
      console.warn("[TextToArticle] ensureToolExists error:", e);
    }
  };

  const saveArticleInstance = async () => {
    if (!user) return alert("Please login.");
    if (!articleText) return alert("Generate the article first.");
    try {
      setSaving(true);
      await ensureToolExists();
      const { count } = await supabase
        .from("tool_instances")
        .select("id", { count: "exact" })
        .eq("client_id", user.id)
        .eq("tool_id", toolId)
        .range(0, 0);
      if (typeof count === "number") setOrdinal((count || 0) + 1);

      const ordForPath = Number.isFinite(ordinal) && ordinal > 0 ? ordinal : Math.floor(Date.now());
      const sitePath = `${username}/${toolId}/${ordForPath}/index.html`;
      const html = buildArticleHtml({ title, articleText, username });
      const htmlBlob = new Blob([html], { type: "text/html; charset=utf-8" });
      const sitePublicUrl = await uploadToStorage(SITE_BUCKET, sitePath, htmlBlob, "text/html; charset=utf-8");
      const friendlyUrl = friendly(username, ordForPath);

      // Charge wallet + record instance
      const { data: purchase, error: purchaseErr } = await supabase.rpc("purchase_tool_instance", {
        p_client_id: user.id,
        p_tool_id: toolId,
        p_price: PRICE_EGP,
        p_site_url: friendlyUrl,
        p_source_image_url: "",
        p_title: title,
      });
      if (purchaseErr) throw purchaseErr;

      setFinalSiteUrl(friendlyUrl);
      setPurchasedThisRun(true);
      alert("Article saved and service purchased.");
      await loadHistory();
    } catch (e) {
      const msg = e?.message || String(e);
      if (/insufficient/i.test(msg)) {
        alert("Insufficient wallet balance for this service.");
      } else {
        alert(`Save failed: ${msg}`);
      }
      console.error("[TextToArticle] save error:", e);
    } finally {
      setSaving(false);
    }
  };

  // Derived selected project
  const selectedProject = useMemo(() => {
    return projects.find((p) => String(p.id) === String(selectedProjectId)) || null;
  }, [projects, selectedProjectId]);

  // Save to selected project's articles table
  const saveToProject = async () => {
    if (!user) return alert("Please login.");
    if (!selectedProject) return alert("Select a project first.");
    if (!articleText) return alert("Generate the article first.");
    if (!articleTextAr) return alert("Generate the Arabic version first.");
    try {
      setSaving(true);
      await ensureToolExists();
      // Gate: must purchase before sending to project
      if (!purchasedThisRun) {
        // compute ordinal and friendly URL without uploading a site page
        const { count } = await supabase
          .from("tool_instances")
          .select("id", { count: "exact" })
          .eq("client_id", user.id)
          .eq("tool_id", toolId)
          .range(0, 0);
        if (typeof count === "number") setOrdinal((count || 0) + 1);
        const ordForPath = Number.isFinite(ordinal) && ordinal > 0 ? ordinal : Math.floor(Date.now());
        const friendlyUrl = friendly(username, ordForPath);
        const { error: purchaseErr } = await supabase.rpc("purchase_tool_instance", {
          p_client_id: user.id,
          p_tool_id: toolId,
          p_price: PRICE_EGP,
          p_site_url: friendlyUrl,
          p_source_image_url: "",
          p_title: title,
        });
        if (purchaseErr) throw purchaseErr;
        setPurchasedThisRun(true);
      }

      const blogTable = clean(selectedProject.blog_tabel_name) || "articles";
      const remote = createSupabaseClient(clean(selectedProject.supabase_url), clean(selectedProject.supabase_anon));
      const { error } = await remote.from(blogTable).insert({
        title_en: clean(titleEn || title),
        title_ar: clean(titleAr),
        content_en: clean(articleText),
        content_ar: clean(articleTextAr),
        image_url: null,
        show_on_homepage: true,
      });
      if (error) throw error;
      alert("Article sent to the selected project database.");
    } catch (e) {
      alert("Failed to save to project: " + (e.message || String(e)));
      console.error("[TextToArticle] saveToProject error:", e);
    } finally {
      setSaving(false);
    }
  };

  const toFriendlyFromStorageUrl = (u) => {
    try {
      const m = String(u || "").match(/tool-sites\/(.*?)\/text-to-article\/(\d+)\/index\.html/);
      if (!m) return u;
      const uname = m[1];
      const ord = m[2];
      return friendly(uname, ord);
    } catch {
      return u;
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
      console.error("[TextToArticle] history error:", error);
      return;
    }
    const mapped = (data || []).map((row) => ({ ...row, site_url: toFriendlyFromStorageUrl(row.site_url) }));
    setHistory(mapped);
  };

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); alert("تم نسخ الرابط"); } catch {}
  };

  const deleteInstance = async (id) => {
    if (!confirm("هل تريد حذف هذا السجل؟")) return;
    const { error } = await supabase.from("tool_instances").delete().eq("id", id).eq("client_id", user.id);
    if (error) {
      alert("فشل الحذف: " + (error.message || ""));
      return;
    }
    await loadHistory();
  };

  const qrUrl = useMemo(() => {
    try {
      const target = encodeURIComponent(site.siteUrl || "");
      if (!target) return "";
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${target}`;
    } catch {
      return "";
    }
  }, [site.siteUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Text to Article</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Price: {PRICE_EGP} EGP • Paste text or a URL, choose style and paragraphs, and generate a clean English article with helpful SEO keywords.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Inputs & Generation */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Type className="h-4 w-4" /> Title (EN)</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={titleEn}
                    onChange={(e) => { setTitleEn(e.target.value); setTitle(e.target.value); }}
                    placeholder="Article title in English"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Languages className="h-4 w-4" /> Title (AR)</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="عنوان المقال بالعربية"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Style</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option>Formal</option>
                    <option>Creative</option>
                    <option>Technical</option>
                    <option>Narrative</option>
                    <option>Promotional</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><ListChecks className="h-4 w-4" /> Paragraphs</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={paragraphs}
                    onChange={(e) => setParagraphs(Math.max(1, Math.min(10, Number(e.target.value) || 5)))}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Globe className="h-4 w-4" /> Source</label>
                <div className="mt-1 flex items-center gap-2">
                  <button onClick={() => setSourceType("text")} className={`px-3 py-1.5 text-xs rounded ${sourceType === "text" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>Text</button>
                  <button onClick={() => setSourceType("url")} className={`px-3 py-1.5 text-xs rounded ${sourceType === "url" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>URL</button>
                </div>
                {sourceType === "text" ? (
                  <textarea
                    className="mt-2 w-full min-h-32 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Paste the source text here..."
                  />
                ) : (
                  <input
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="Provide a page URL with text... (some sites block direct fetching)"
                  />
                )}
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SEO Keywords (comma-separated)</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="Example: digital marketing, SEO, content"
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={generateArticle}
                  disabled={generating}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
                >
                  {generating ? "Generating..." : "Generate Article"}
                </button>
                <button
                  onClick={saveArticleInstance}
                  disabled={saving || !articleText}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save & Purchase"}
                </button>
                <button
                  onClick={saveToProject}
                  disabled={saving || !articleText || !selectedProjectId}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save to Project"}
                </button>
                {!purchasedThisRun && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">Payment required: You’ll be charged before sending to project.</div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preview (EN)</h3>
              {articleText ? (
                <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{articleText}</pre>
              ) : (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">No preview yet — generate the article.</div>
              )}
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">Preview (AR)</h3>
              {articleTextAr ? (
                <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{articleTextAr}</pre>
              ) : (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Arabic preview will appear after generation.</div>
              )}
            </div>
          </div>

          {/* Right: Access & History */}
          <div className="space-y-6">
            {/* Project selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Target Project</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Select a project to save the article to its Supabase database.</p>
              <select
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name || p.id}</option>
                ))}
              </select>
              {selectedProject && (
                <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                  <div>Supabase URL: {selectedProject.supabase_url}</div>
                  <div>Blog table: {selectedProject.blog_tabel_name || "articles"}</div>
                </div>
              )}
              <button
                onClick={saveToProject}
                disabled={saving || !articleText || !selectedProjectId}
                className="mt-3 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save to Project"}
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Access</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest saved link</p>
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
                <button onClick={() => window.open(qrUrl, "_blank")} disabled={!qrUrl} className="mt-3 px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50">
                  Open QR
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Usage History</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">View and manage previous links.</p>
              <div className="mt-3 space-y-3">
                {history.map((row) => (
                  <div
                    key={row.id}
                    className="group relative overflow-hidden rounded-xl border border-gray-200/70 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500/40 via-emerald-500/40 to-sky-500/40" />
                    <div className="p-3 sm:p-4 flex items-center gap-4">
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
