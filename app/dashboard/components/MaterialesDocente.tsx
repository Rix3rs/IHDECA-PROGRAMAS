"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink, FileText, Link2, Video, Upload, Loader2, Globe } from "lucide-react";

interface Material {
  id: number;
  title: string;
  type: string;
  url: string;
  createdAt: string;
}

export default function MaterialesDocente({ courseSlug }: { courseSlug: string }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"file" | "url">("file");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  useEffect(() => {
    if (!courseSlug) { setLoading(false); return; }
    fetch(`/api/materials?courseSlug=${courseSlug}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMaterials(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseSlug]);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newTitle || !courseSlug) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.message || "Error al subir archivo");
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const typeMap: Record<string, string> = { pdf: "pdf", doc: "doc", docx: "doc", ppt: "ppt", pptx: "ppt", xls: "xlsx", xlsx: "xlsx", mp4: "video", mov: "video", webm: "video" };
      const fileType = typeMap[ext] || "file";

      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, title: newTitle, type: fileType, url: uploadData.url })
      });
      const data = await res.json();
      if (res.ok) {
        setMaterials(prev => [data.material, ...prev]);
        setNewTitle("");
        setNewUrl("");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      setFileKey(prev => prev + 1);
    }
  };

  const handleAddUrl = async () => {
    if (!newTitle || !newUrl || !courseSlug) return;
    const typeMap: Record<string, string> = { link: "link", pdf: "pdf", video: "video" };
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug, title: newTitle, type: typeMap[newUrl.startsWith("http") ? "link" : "link"] || "link", url: newUrl })
    });
    const data = await res.json();
    if (res.ok) {
      setMaterials(prev => [data.material, ...prev]);
      setNewTitle("");
      setNewUrl("");
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/materials?id=${id}`, { method: "DELETE" });
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const typeIcon = (t: string) => {
    if (t === "pdf" || t === "doc" || t === "ppt" || t === "xlsx" || t === "file") return <FileText className="w-4 h-4" />;
    if (t === "video") return <Video className="w-4 h-4" />;
    return <Link2 className="w-4 h-4" />;
  };

  if (loading) return <div className="text-center py-8 text-xs text-slate-400">Cargando materiales...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-primary border-l-4 border-accent pl-3">Materiales del curso</h3>

      <div className="bg-white border border-slate-200 rounded-[32px_32px_32px_0px] p-6 shadow-sm space-y-4 font-sans text-xs">
        <div className="flex gap-2">
          <button onClick={() => setMode("file")}
            className={`flex-1 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer ${mode === "file" ? "bg-accent text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            <Upload className="w-3.5 h-3.5 inline mr-1" />
            Subir archivo
          </button>
          <button onClick={() => setMode("url")}
            className={`flex-1 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer ${mode === "url" ? "bg-accent text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            <Globe className="w-3.5 h-3.5 inline mr-1" />
            Agregar enlace
          </button>
        </div>

        {mode === "file" ? (
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <label className="block font-bold text-slate-600">Titulo</label>
              <input type="text" placeholder="Ej. PDF de Liderazgo" value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="flex-1 space-y-1">
              <label className="block font-bold text-slate-600">Archivo</label>
              <input key={fileKey} type="file" onChange={handleUploadFile}
                disabled={uploading || !newTitle}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-accent file:text-white hover:file:bg-primary file:cursor-pointer" />
            </div>
            <div className="flex-shrink-0">
              {uploading && <Loader2 className="w-5 h-5 animate-spin text-accent" />}
            </div>
          </div>
        ) : (
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <label className="block font-bold text-slate-600">Titulo</label>
              <input type="text" placeholder="Ej. Video de YouTube" value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="flex-[2] space-y-1">
              <label className="block font-bold text-slate-600">URL</label>
              <input type="url" placeholder="https://..." value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <button onClick={handleAddUrl} disabled={!newTitle || !newUrl}
              className="px-4 py-2 bg-accent text-white rounded-lg nicdark-btn-radius text-xs font-bold uppercase hover:bg-primary transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {materials.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No hay materiales. Agrega recursos para tus alumnos.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {materials.map(m => (
              <div key={m.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{typeIcon(m.type)}</span>
                  <div>
                    <span className="font-bold text-primary text-xs">{m.title}</span>
                    <span className="text-[9px] text-slate-400 block">{m.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={m.url} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-accent transition-colors" title="Abrir">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
