"use client";

import { useState } from "react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteMedia } from "./actions";
import { MediaAltTextForm } from "./MediaAltTextForm";
import type { AdminMediaRow } from "@/lib/supabase/queries/admin/media";

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function MediaGrid({ items }: { items: AdminMediaRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase()) ||
    (item.alt_text ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by filename or alt text..."
        className="mb-6 w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange"
      />

      {filtered.length === 0 && <p className="text-sm text-brand-grey">No media found.</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item) => (
          <div key={item.id} className="border border-brand-white/5 p-3">
            {item.mime_type?.startsWith("video/") ? (
              <video src={item.url} className="h-32 w-full bg-brand-black object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.alt_text ?? item.filename} className="h-32 w-full object-cover" />
            )}
            <p className="mt-2 truncate text-xs text-brand-white" title={item.filename}>
              {item.filename}
            </p>
            <p className="text-xs text-brand-grey">
              {item.context ?? "general"} · {formatBytes(item.size_bytes)}
            </p>
            <MediaAltTextForm id={item.id} altText={item.alt_text} />
            <div className="mt-2 flex items-center justify-between">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-orange hover:underline"
              >
                Open
              </a>
              <DeleteButton
                action={deleteMedia.bind(null, item.id, item.url)}
                confirmMessage={`Delete "${item.filename}"? This removes the file permanently.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
