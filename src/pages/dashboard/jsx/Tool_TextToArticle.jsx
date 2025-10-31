import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import { supabase } from "@/lib/supabase";
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
  const kw = Array.isArray(keywords) ? keywords : String(keywords || "").split(",").map((k) => clean(k)).filter(Boolean);
  const kwStr = kw.length ? `الكلمات المفتاحية: ${kw.join(", ")}.` : "";
  const sourceBlock = srcText
    ? `اكتب مقالًا معتمدًا على النص التالي:\n\n"""\n${srcText}\n"""\n\n`
    : (srcUrl ? `اكتب مقالًا مستلهمًا من الصفحة المشار إليها بالرابط التالي: ${srcUrl}. إذا تعذر الوصول المباشر للمحتوى بسبب قيود المتصفح، استخدم سياق الرابط كموضوع عام دون نقل حرفي.` : `اكتب مقالًا حول موضوع عام مناسب.`);
  return [
    sourceBlock,
    `المتطلبات: الأسلوب: ${style}. اللهجة: ${dialect}. عدد الفقرات: ${paragraphs}. ${kwStr}`,
    `التنسيق: قسّم النص إلى فقرات واضحة، كل فقرة 3-6 جمل. استخدم عناوين فرعية عند الحاجة. أدخل الكلمات المفتاحية طبيعيًا دون حشو أو تكرار مزعج. لا تُدرج تنسيق Markdown، أعد النص عاديًا.`,
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

function buildArticleHtml({ title, articleText, username }) {
  const safeTitle = clean(title) || "AI Article";
  const safeText = clean(articleText).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="robots" content="index, follow" />
    <meta name="description" content="مقال مولّد بواسطة الذكاء الاصطناعي" />
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
  const [title, setTitle] = useState("مقال جديد");
  const [sourceType, setSourceType] = useState("text"); // 'text' | 'url'
  const [sourceText, setSourceText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [style, setStyle] = useState("رسمية");
  const [dialect, setDialect] = useState("فصحى");
  const [paragraphs, setParagraphs] = useState(5);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [articleText, setArticleText] = useState("");
  const [finalSiteUrl, setFinalSiteUrl] = useState("");
  const [history, setHistory] = useState([]);
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
        dialect,
        paragraphs,
        keywords: keywordsInput,
      });
      const text = await callGemini(prompt);
      setArticleText(text);
      if (!title || title === "مقال جديد") {
        const base = clean(sourceText).slice(0, 24) || clean(sourceUrl).slice(0, 24) || "مقال";
        setTitle(`${base} — ${style}`);
      }
    } catch (e) {
      alert("فشل توليد المقال: " + (e.message || String(e)));
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

  const saveArticleInstance = async () => {
    if (!user) return alert("يجب تسجيل الدخول.");
    if (!articleText) return alert("فضلاً قم بتوليد المقال أولًا.");
    try {
      setSaving(true);
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
      alert("تم حفظ المقال وخصم تكلفة الخدمة.");
      await loadHistory();
    } catch (e) {
      const msg = e?.message || String(e);
      if (/insufficient/i.test(msg)) {
        alert("رصيد المحفظة غير كافٍ لهذه الخدمة.");
      } else {
        alert(`فشل الحفظ: ${msg}`);
      }
      console.error("[TextToArticle] save error:", e);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">نص إلى مقال</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">السعر: {PRICE_EGP} EGP • أدخل نصًا أو رابطًا واختر الأسلوب واللهجة وعدد الفقرات، وسيولّد Gemini المقال مع كلمات SEO.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Inputs & Generation */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Type className="h-4 w-4" /> العنوان</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان المقال"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Languages className="h-4 w-4" /> اللهجة</label>
                  <div className="mt-1 flex items-center gap-2">
                    <button onClick={() => setDialect("فصحى")} className={`px-3 py-1.5 text-xs rounded ${dialect === "فصحى" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>فصحى</button>
                    <button onClick={() => setDialect("مصري")} className={`px-3 py-1.5 text-xs rounded ${dialect === "مصري" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>مصري</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Sparkles className="h-4 w-4" /> الأسلوب</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option>رسمية</option>
                    <option>مبدعة</option>
                    <option>تقنية</option>
                    <option>قصصية</option>
                    <option>إعلانية</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><ListChecks className="h-4 w-4" /> عدد الفقرات</label>
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Globe className="h-4 w-4" /> المصدر</label>
                <div className="mt-1 flex items-center gap-2">
                  <button onClick={() => setSourceType("text")} className={`px-3 py-1.5 text-xs rounded ${sourceType === "text" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>نص</button>
                  <button onClick={() => setSourceType("url")} className={`px-3 py-1.5 text-xs rounded ${sourceType === "url" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>رابط</button>
                </div>
                {sourceType === "text" ? (
                  <textarea
                    className="mt-2 w-full min-h-32 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="ألصق النص هنا..."
                  />
                ) : (
                  <input
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="ضع رابط صفحة تحتوي على نص... (قد تمنع المواقع الجلب المباشر)"
                  />
                )}
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">كلمات SEO (مفصولة بفاصلة)</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="مثال: تسويق رقمي, تحسين محركات البحث, محتوى"
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={generateArticle}
                  disabled={generating}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
                >
                  {generating ? "جاري التوليد..." : "اكتب المقال"}
                </button>
                <button
                  onClick={saveArticleInstance}
                  disabled={saving || !articleText}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                >
                  {saving ? "جاري الحفظ..." : "حفظ وشراء الخدمة"}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">المعاينة</h3>
              {articleText ? (
                <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{articleText}</pre>
              ) : (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">لا توجد معاينة بعد — قم بتوليد المقال.</div>
              )}
            </div>
          </div>

          {/* Right: Access & History */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">الوصول</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">أحدث رابط محفوظ</p>
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
                  فتح QR
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Usage History</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">عرض وإدارة الروابط السابقة.</p>
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">لا توجد سجلات بعد.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
