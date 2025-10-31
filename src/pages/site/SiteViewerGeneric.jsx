import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function SiteViewerGeneric() {
  const { username, toolId, ordinal } = useParams();
  const [html, setHtml] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const sitePath = `${username}/${toolId}/${ordinal}/index.html`;
        const { data } = supabase.storage.from("tool-sites").getPublicUrl(sitePath);
        const siteUrl = data?.publicUrl;
        if (!siteUrl) throw new Error("Site URL not found");
        const res = await fetch(siteUrl);
        if (!res.ok) throw new Error(`Failed to load site HTML (${res.status})`);
        const text = await res.text();
        setHtml(text);
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username, toolId, ordinal]);

  if (loading) return <div style={{padding:20, color:'#555'}}>Loading site...</div>;
  if (error) return <div style={{padding:20, color:'#b91c1c'}}>Error: {error}</div>;

  return (
    <iframe
      title="Generated Site"
      srcDoc={html}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}

