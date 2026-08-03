import { useState } from "react";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { getCategories, saveCategories, type BlogCategory } from "../lib/store";

export default function Categories({ onUpdate }: { onUpdate: () => void }) {
  const [cats, setCats] = useState<BlogCategory[]>(getCategories);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const add = () => {
    if (!newName.trim()) return;
    const updated = [...cats, { id: Date.now().toString(), name: newName.trim() }];
    setCats(updated);
    saveCategories(updated);
    setNewName("");
    onUpdate();
  };

  const rename = (id: string) => {
    if (!editName.trim()) return;
    const updated = cats.map((c) => (c.id === id ? { ...c, name: editName.trim() } : c));
    setCats(updated);
    saveCategories(updated);
    setEditingId(null);
    setEditName("");
    onUpdate();
  };

  const remove = (id: string) => {
    const updated = cats.filter((c) => c.id !== id);
    setCats(updated);
    saveCategories(updated);
    onUpdate();
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Content</p>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mt-0.5">Categories</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-5">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="New category name"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
          <button onClick={add} className="px-4 py-2 bg-[#0F2B4A] text-white text-xs font-semibold rounded-xl hover:bg-[#1a3d5c] transition-all flex items-center gap-1.5 shrink-0">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="space-y-1">
          {cats.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No categories yet</p>
          ) : (
            cats.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                <FolderOpen className="w-4 h-4 text-sky-600 shrink-0" />
                {editingId === cat.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && rename(cat.id)}
                    onBlur={() => rename(cat.id)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded-lg outline-none focus:border-sky-400"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 text-sm text-[#1a1a1a]">{cat.name}</span>
                )}
                <div className="flex items-center gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                    className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remove(cat.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
