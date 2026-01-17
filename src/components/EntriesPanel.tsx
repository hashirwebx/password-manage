"use client";

import { useEffect, useState } from "react";

type Entry = {
  _id: string;
  name: string;
  username: string;
  password: string;
};

export default function EntriesPanel() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadEntries = async () => {
    try {
      const response = await fetch("/api/entries");
      const data = await response.json();
      setEntries(data);
    } catch {
      setError("Failed to load entries");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/entries?id=${id}`, {
        method: "DELETE",
      });
      loadEntries();
    } catch {
      setError("Failed to delete entry");
    }
  };

  const confirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const proceedDelete = async () => {
    if (!confirmDeleteId) {
      return;
    }
    await handleDelete(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const endpoint = editingId ? `/api/entries?id=${editingId}` : "/api/entries";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      if (!response.ok) {
        throw new Error("Create failed");
      }

      setName("");
      setUsername("");
      setPassword("");
      setEditingId(null);
      loadEntries();
    } catch {
      setError(editingId ? "Failed to update entry" : "Failed to save entry");
    }
  };

  const handleEdit = (entry: Entry) => {
    setEditingId(entry._id);
    setName(entry.name);
    setUsername(entry.username);
    setPassword(entry.password);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <h2 className="text-lg font-semibold">Live entries</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Simple form connected to Next.js API + MongoDB.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
        />
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
        />
        <div className="flex flex-wrap gap-3 md:col-span-3">
          <button className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950">
            {editingId ? "Save changes" : "Save entry"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/80"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

      <div className="mt-4 space-y-2 text-sm text-zinc-300">
        {entries.length === 0 ? (
          <p className="text-zinc-500">No entries yet.</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
            >
              <div>
                <p className="text-sm text-white">{entry.name}</p>
                <p className="text-xs text-zinc-500">{entry.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Saved</span>
                <button
                  onClick={() => handleEdit(entry)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(entry._id)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {confirmDeleteId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Delete entry?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              This will permanently remove the entry from the database.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={proceedDelete}
                className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-rose-50"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
