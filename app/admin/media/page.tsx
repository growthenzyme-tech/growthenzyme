"use client";

import { useEffect, useState, useRef } from "react";
import {
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Eye,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Download,
  AlertCircle,
  HardDrive,
  LayoutGrid,
  List as ListIcon,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  getAllMediaItems,
  uploadMediaFile,
  deleteMediaItem,
  validateMediaFile,
  formatFileSize,
  type MediaItem,
  type MediaCategory,
} from "@/app/lib/media";
import { auth } from "@/app/lib/firebase";

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Assets", value: "all" },
  { label: "Blog Covers", value: "blog-cover" },
  { label: "Inline Images", value: "blog-inline" },
  { label: "Case Studies", value: "case-study-cover" },
  { label: "Project Gallery", value: "project-gallery" },
  { label: "PDF Documents", value: "pdf-document" },
  { label: "General", value: "general" },
];

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filtering & View state
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "document">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Preview Modal state
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Delete Confirmation state
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>("blog-cover");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<{ [filename: string]: number }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      setLoading(true);
      setError("");
      const items = await getAllMediaItems();
      setMediaList(items);
    } catch (err: any) {
      console.error("Error loading media:", err);
      setError("Unable to load media assets from Cloud Storage.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyUrl(url: string, id: string) {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const validation = validateMediaFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      setUploadError(errors.join(" | "));
    } else {
      setUploadError("");
    }

    setUploadFiles((prev) => [...prev, ...validFiles]);
  }

  async function handleBatchUpload() {
    if (uploadFiles.length === 0) return;

    try {
      setUploading(true);
      setUploadError("");
      setError("");
      const newItems: MediaItem[] = [];

      for (const file of uploadFiles) {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 15 }));
        const item = await uploadMediaFile(file, {
          category: uploadCategory,
          onProgress: (pct) => {
            setUploadProgress((prev) => ({ ...prev, [file.name]: pct }));
          },
        });
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
        newItems.push(item);
      }

      setMediaList((prev) => [...newItems, ...prev]);
      setSuccessMsg(`Successfully uploaded ${newItems.length} asset(s) to Cloud Storage.`);
      setTimeout(() => setSuccessMsg(""), 4000);

      // Reset upload state
      setUploadFiles([]);
      setUploadProgress({});
      setUploadError("");
      setUploadModalOpen(false);
    } catch (err: any) {
      console.error("Batch upload error:", err);
      setUploadError(err.message || "Failed uploading assets to Cloud Storage.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteMediaItem(deleteTarget.id, deleteTarget.storagePath);
      setMediaList((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setSuccessMsg(`Deleted asset: ${deleteTarget.name}`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setDeleteTarget(null);
      if (previewItem?.id === deleteTarget.id) {
        setPreviewItem(null);
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      setError("Failed to delete asset. Please check your permissions.");
    } finally {
      setDeleting(false);
    }
  }

  // Filter calculations
  const filteredList = mediaList.filter((item) => {
    // Type filter
    if (typeFilter === "image" && item.type !== "image") return false;
    if (typeFilter === "document" && item.type !== "document") return false;

    // Category filter
    if (activeCategory !== "all" && item.category !== activeCategory) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchFileName = item.fileName.toLowerCase().includes(q);
      const matchEmail = (item.uploaderEmail || "").toLowerCase().includes(q);
      if (!matchName && !matchFileName && !matchEmail) return false;
    }

    return true;
  });

  // Calculate stats
  const totalAssets = mediaList.length;
  const imageAssets = mediaList.filter((m) => m.type === "image").length;
  const docAssets = mediaList.filter((m) => m.type === "document").length;
  const totalBytes = mediaList.reduce((acc, curr) => acc + (curr.size || 0), 0);

return (
  <div className="w-full max-w-none space-y-8">
        
        {/* HEADER SECTION */}
      
{/* HERO SECTION */}
<section className="relative isolate w-full overflow-hidden rounded-[28px] border border-[#A5B59F]/40 bg-[#B6CBA9] px-6 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
  {/* Decorative elements */}
  <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#D78359]/10 blur-3xl" />

  <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/15 bg-white/40 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#29382F]">
        <span className="h-2 w-2 rounded-full bg-[#D78359]" />
        Cloud Storage Assets
      </div>

      <h1 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-5xl lg:text-6xl">
        Media
        <span className="block text-[#506B59]">Library</span>
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#29382F]/80 sm:text-base">
        Organize and manage your digital assets in one place. Access blog
        covers, inline images, case study media, and documents from your
        centralized cloud library.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="rounded-xl border border-white/50 bg-white/40 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#506B59]">
            Total Assets
          </p>
          <p className="mt-1 text-2xl font-bold text-[#29382F]">
            {totalAssets}
          </p>
        </div>

        <div className="rounded-xl border border-white/50 bg-white/40 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#506B59]">
            Images
          </p>
          <p className="mt-1 text-2xl font-bold text-[#29382F]">
            {imageAssets}
          </p>
        </div>

        <div className="rounded-xl border border-white/50 bg-white/40 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#506B59]">
            Documents
          </p>
          <p className="mt-1 text-2xl font-bold text-[#29382F]">
            {docAssets}
          </p>
        </div>
      </div>
    </div>

    <div className="relative shrink-0">
<button
  type="button"
  onClick={() => {
    setUploadError("");
    setUploadFiles([]);
    setUploadModalOpen(true);
  }}
  className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)]"
>
  <Upload size={16} />
  Upload Assets
</button>
    </div>
  </div>
</section>


        {/* FEEDBACK BANNERS */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">
              <X size={14} />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#B6CBA9] bg-[#E8EEE5] p-4 text-xs sm:text-sm text-[#29382F]">
            <Check size={16} className="shrink-0 text-[#29382F]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">Total Assets</span>
              <FolderOpen size={16} className="text-[#29382F]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{totalAssets}</p>
          </div>

          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">Images</span>
              <ImageIcon size={16} className="text-[#D78359]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{imageAssets}</p>
          </div>

          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">PDFs & Docs</span>
              <FileText size={16} className="text-[#29382F]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{docAssets}</p>
          </div>

          <div className="rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#506B59] uppercase tracking-wider">Cloud Storage</span>
              <HardDrive size={16} className="text-[#506B59]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#29382F]">{formatFileSize(totalBytes)}</p>
          </div>
        </div>

        {/* CONTROLS TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl border border-[#29382F]/10 bg-[#FAFBF9]">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by name, filename, or uploader..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#29382F]/15 bg-white text-[#29382F] placeholder-gray-400 focus:outline-none focus:border-[#29382F]"
            />
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="text-xs rounded-xl border border-[#29382F]/15 bg-white px-3 py-2 text-[#29382F] focus:outline-none focus:border-[#29382F]"
            >
              <option value="all">All File Types</option>
              <option value="image">Images Only</option>
              <option value="document">PDFs & Documents</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-[#29382F]/15 bg-white p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid" ? "bg-[#29382F] text-white" : "text-[#506B59] hover:text-[#29382F]"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list" ? "bg-[#29382F] text-white" : "text-[#506B59] hover:text-[#29382F]"
                }`}
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat.value
                  ? "bg-[#29382F] text-white shadow-xs"
                  : "bg-white border border-[#29382F]/15 text-[#506B59] hover:border-[#29382F]/40 hover:text-[#29382F]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* MAIN ASSET CONTENT */}
        {loading ? (
          <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-[#29382F]/10 bg-white">
            <Loader2 size={28} className="animate-spin text-[#29382F]" />
            <p className="text-xs sm:text-sm font-medium text-[#506B59]">Loading cloud assets...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-[#29382F]/15 bg-[#FAFBF9]">
            <FolderOpen size={40} className="text-[#506B59]/40 mb-3" />
            <h3 className="font-heading text-base font-bold text-[#29382F]">No media assets found</h3>
            <p className="mt-1 text-xs text-[#506B59] max-w-sm">
              {search || activeCategory !== "all" || typeFilter !== "all"
                ? "No assets match your active filters. Try resetting the search or category."
                : "Your media library is currently empty. Upload your first cloud asset to get started."}
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#29382F] px-5 py-2 text-xs font-semibold text-white hover:bg-[#D78359] transition"
            >
              <Upload size={14} />
              <span>Upload Assets</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          
          /* GRID VIEW */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredList.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-2xl overflow-hidden border border-[#29382F]/12 bg-white shadow-xs hover:shadow-md transition-all duration-200"
                >
                  {/* Thumbnail / Preview Area */}
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="relative aspect-[4/3] w-full bg-[#E8EEE5] flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4 text-center">
                        <FileText size={36} className="text-[#D78359]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#29382F]">
                          PDF Document
                        </span>
                      </div>
                    )}

                    {/* Category Pill */}
                    <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      {item.category.replace("-", " ")}
                    </span>

                    {/* Hover Overlay with Action Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        title="Preview & Details"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#29382F] hover:bg-[#D78359] hover:text-white transition shadow-sm"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(item.url, item.id);
                        }}
                        title="Copy Download URL"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#29382F] hover:bg-[#D78359] hover:text-white transition shadow-sm"
                      >
                        {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(item);
                        }}
                        title="Delete Asset"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Asset Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs font-bold text-[#29382F] truncate" title={item.name}>
                      {item.name}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#506B59]">
                      <span>{formatFileSize(item.size)}</span>
                      {item.dimensions && (
                        <span>
                          {item.dimensions.width}×{item.dimensions.height}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (

          /* LIST VIEW */
          <div className="rounded-2xl border border-[#29382F]/12 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFBF9] border-b border-[#29382F]/10 text-[#506B59] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Uploaded By</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#29382F]/8 text-[#29382F]">
                  {filteredList.map((item) => {
                    const isCopied = copiedId === item.id;
                    return (
                      <tr key={item.id} className="hover:bg-[#FAFBF9] transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#E8EEE5] flex items-center justify-center border border-[#29382F]/10">
                              {item.type === "image" ? (
                                <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                              ) : (
                                <FileText size={18} className="text-[#D78359]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#29382F] truncate max-w-xs">{item.name}</p>
                              <p className="text-[10px] text-[#506B59] truncate">{item.fileName}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-block rounded-md bg-[#FAFBF9] border border-[#29382F]/10 px-2 py-0.5 text-[10px] font-semibold text-[#29382F] uppercase">
                            {item.category.replace("-", " ")}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-[#506B59] uppercase">
                          {item.mimeType.split("/")[1] || item.type}
                        </td>

                        <td className="py-3 px-4 text-[#506B59]">
                          {formatFileSize(item.size)}
                        </td>

                        <td className="py-3 px-4 text-[#506B59] truncate max-w-[140px]">
                          {item.uploaderEmail || "Unknown"}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setPreviewItem(item)}
                              title="Preview"
                              className="p-1.5 rounded-lg text-[#506B59] hover:bg-[#29382F]/5 hover:text-[#29382F] transition"
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              onClick={() => handleCopyUrl(item.url, item.id)}
                              title="Copy URL"
                              className="p-1.5 rounded-lg text-[#506B59] hover:bg-[#29382F]/5 hover:text-[#29382F] transition"
                            >
                              {isCopied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                            </button>

                            <button
                              onClick={() => setDeleteTarget(item)}
                              title="Delete"
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      

      {/* ========================================================= */}
      {/* PREVIEW & METADATA MODAL                                  */}
      {/* ========================================================= */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative flex flex-col w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#29382F]/15 overflow-hidden max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#29382F]/10 bg-[#FAFBF9]">
              <div className="min-w-0 pr-4">
                <h3 className="font-heading text-lg font-bold text-[#29382F] truncate">
                  {previewItem.name}
                </h3>
                <p className="text-xs text-[#506B59]">{previewItem.fileName}</p>
              </div>

              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-[#506B59] hover:bg-black/5 hover:text-[#29382F]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Visual preview */}
              <div className="w-full max-h-72 rounded-xl bg-[#FAFBF9] border border-[#29382F]/10 flex items-center justify-center overflow-hidden">
                {previewItem.type === "image" ? (
                  <img
                    src={previewItem.url}
                    alt={previewItem.name}
                    className="max-h-72 w-auto object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 p-8 text-center">
                    <FileText size={48} className="text-[#D78359]" />
                    <p className="text-sm font-bold text-[#29382F]">PDF / Document Asset</p>
                    <a
                      href={previewItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#29382F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#D78359] transition"
                    >
                      <span>Open Document</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>

              {/* Metadata details table */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#29382F]/8">
                  <span className="text-[#506B59] block mb-0.5">Category</span>
                  <span className="font-semibold text-[#29382F] uppercase">
                    {previewItem.category.replace("-", " ")}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#29382F]/8">
                  <span className="text-[#506B59] block mb-0.5">File Size</span>
                  <span className="font-semibold text-[#29382F]">{formatFileSize(previewItem.size)}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#29382F]/8">
                  <span className="text-[#506B59] block mb-0.5">Format</span>
                  <span className="font-semibold text-[#29382F] uppercase">{previewItem.mimeType}</span>
                </div>

                {previewItem.dimensions && (
                  <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#29382F]/8">
                    <span className="text-[#506B59] block mb-0.5">Dimensions</span>
                    <span className="font-semibold text-[#29382F]">
                      {previewItem.dimensions.width} × {previewItem.dimensions.height} px
                    </span>
                  </div>
                )}
              </div>

              {/* URL Display */}
              <div>
                <label className="block text-xs font-bold text-[#29382F] mb-1">Direct Cloud URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={previewItem.url}
                    className="flex-1 rounded-xl border border-[#29382F]/15 bg-[#FAFBF9] px-3 py-2 text-xs text-[#29382F] select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyUrl(previewItem.url, previewItem.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#29382F]/15 bg-white px-3 py-2 text-xs font-semibold text-[#29382F] hover:bg-[#29382F] hover:text-white transition"
                  >
                    {copiedId === previewItem.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span>{copiedId === previewItem.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#29382F]/10 bg-[#FAFBF9]">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(previewItem);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
              >
                <Trash2 size={14} />
                <span>Delete Asset</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={previewItem.url}
                  download={previewItem.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#29382F]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#29382F] hover:border-[#29382F] transition"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="rounded-full bg-[#29382F] px-5 py-1.5 text-xs font-semibold text-white hover:bg-[#D78359] transition"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* UPLOAD ASSETS MODAL                                       */}
      {/* ========================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative flex flex-col w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#29382F]/15 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#29382F]/10 bg-[#FAFBF9]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#29382F] text-white">
                  <Upload size={16} />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#29382F]">
                  Upload to Cloud Storage
                </h3>
              </div>
              <button
                onClick={() => {
                  if (!uploading) setUploadModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-[#506B59] hover:bg-black/5 hover:text-[#29382F]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileSelect(e.dataTransfer.files);
                }}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#29382F]/20 rounded-2xl bg-[#FAFBF9] hover:bg-[#FAFBF9]/80 cursor-pointer transition text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#29382F]/10 text-[#D78359] mb-3 shadow-xs">
                  <Upload size={22} />
                </div>

                <p className="text-sm font-bold text-[#29382F]">
                  Click to browse or drag & drop files
                </p>
                <p className="text-xs text-[#506B59] mt-1">
                  Supported formats: JPG, PNG, WEBP, SVG, GIF, AVIF, PDF (up to 25MB)
                </p>
              </div>

              {/* Target Category */}
              <div>
                <label className="block text-xs font-bold text-[#29382F] mb-1.5">Default Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as MediaCategory)}
                  className="w-full text-xs rounded-xl border border-[#29382F]/15 bg-white p-2.5 text-[#29382F] focus:outline-none focus:border-[#29382F]"
                >
                  <option value="blog-cover">Blog Cover Image</option>
                  <option value="blog-inline">Inline Blog Image</option>
                  <option value="case-study-cover">Case Study Cover</option>
                  <option value="project-gallery">Project Gallery Image</option>
                  <option value="pdf-document">PDF Document</option>
                  <option value="general">General Asset</option>
                </select>
              </div>

              {/* Staged files list */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  <p className="text-xs font-bold text-[#29382F]">
                    Files ready to upload ({uploadFiles.length}):
                  </p>
                  {uploadFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#FAFBF9] border border-[#29382F]/10 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {f.type.startsWith("image/") ? (
                          <ImageIcon size={14} className="text-[#D78359] shrink-0" />
                        ) : (
                          <FileText size={14} className="text-[#D78359] shrink-0" />
                        )}
                        <span className="truncate text-[#29382F]">{f.name}</span>
                        <span className="text-[10px] text-[#506B59]">({formatFileSize(f.size)})</span>
                      </div>

                      {uploadProgress[f.name] !== undefined ? (
                        <span className="text-[10px] font-bold text-[#D78359]">
                          {uploadProgress[f.name]}%
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setUploadFiles((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {uploadError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                  <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <p className="font-semibold text-red-800">Upload Issue</p>
                    <p className="mt-0.5">{uploadError}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#29382F]/10 bg-[#FAFBF9]">
              <button
                type="button"
                disabled={uploading}
                onClick={() => setUploadModalOpen(false)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-[#506B59] hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={uploadFiles.length === 0 || uploading}
                onClick={handleBatchUpload}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#29382F] px-5 py-2 text-xs font-semibold text-white disabled:opacity-40 hover:bg-[#D78359] transition shadow-xs"
              >
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    <span>Upload to Cloud</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL                                 */}
      {/* ========================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative flex flex-col w-full max-w-md bg-white rounded-2xl shadow-2xl border border-red-200 p-6">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <Trash2 size={20} />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#29382F]">
                Delete Asset?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#506B59] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#29382F]">{deleteTarget.name}</strong>?
              This will remove the file from dedicated Cloud Storage and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-[#506B59] hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirmed}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white hover:bg-red-700 transition shadow-xs"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
    )}
  </div>
);
}