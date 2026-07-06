"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import type { ContactMessage } from "@portfolio/types";

export default function MessagesAdmin() {
  const toast = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setMessages(await adminApi<ContactMessage[]>("/messages"));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to load", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleRead(m: ContactMessage) {
    try {
      await adminApi(`/messages/${m.id}/read`, {
        method: "PATCH",
        body: { is_read: !m.is_read },
      });
      setMessages((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, is_read: !m.is_read } : x)),
      );
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await adminApi(`/messages/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((x) => x.id !== id));
      toast("Message deleted");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Messages"
        description="Enquiries submitted through the contact form."
      />

      {loading ? (
        <p className="text-ink-500">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="rounded-xl border border-base-800 px-4 py-16 text-center text-sm text-ink-500">
          No messages yet.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-5 ${
                m.is_read
                  ? "border-base-800 bg-base-900/30"
                  : "border-accent-500/40 bg-base-900/60"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink-50">
                      {m.name}
                    </span>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-xs text-accent-300 hover:underline"
                    >
                      {m.email}
                    </a>
                    {!m.is_read && (
                      <span className="rounded-full bg-accent-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-300">
                        New
                      </span>
                    )}
                  </div>
                  {m.subject && (
                    <div className="mt-1 text-sm text-ink-300">{m.subject}</div>
                  )}
                </div>
                <div className="flex shrink-0 gap-3 text-xs">
                  <button
                    onClick={() => toggleRead(m)}
                    className="text-ink-400 hover:text-accent-300"
                  >
                    Mark {m.is_read ? "unread" : "read"}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    className="text-ink-500 hover:text-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-300">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
