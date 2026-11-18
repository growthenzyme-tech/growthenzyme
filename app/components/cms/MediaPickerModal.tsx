"use client";

import { useEffect, useState, useRef } from "react";
import {
  X,
  Upload,
  Search,
  Check,
  FileText,
  Image as ImageIcon,
  Loader2,
  FolderOpen,
  Filter,
} from "lucide-react";
import {
  getAllMediaItems,
  uploadMediaFile,
  validateMediaFile,
  formatFileSize,
  type MediaItem,
  type MediaCategory,
} from "@/app/lib/media";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  allowedType?: "all" | "image" | "document";
  defaultCategory?: MediaCategory;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  allowedType = "all",
  defaultCategory = "blog-cover",
  title = "Select Media Asset",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Upload tab state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>(defaultCategory);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
      setSelectedItem(null);
      setUploadError("");
      setUploadFile(null);
      setUploadProgress(0);
    }
  }, [isOpen]);

  async function loadMedia() {
    try {
      setLoading(true);
      const items = await getAllMediaItems();
      setMediaList(items);
    } catch (err) {
      console.error("Failed to load media in modal:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(file: File) {
    setUploadError("");
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid file.");
      return;
    }
    if (allowedType === "image" && !file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed in this selection.");
      return;
    }
    if (allowedType === "document" && file.type.startsWith("image/")) {
      setUploadError("Only document files (such as PDF) are allowed in this selection.");
      return;
    }
    setUploadFile(file);
  }

  async function handleUploadAndSelect() {
    if (!uploadFile) return;

    try {
      setUploading(true);
      setUploadError("");
      setUploadProgress(15);
      const uploadedItem = await uploadMediaFile(uploadFile, {
        category: uploadCategory,
        onProgress: (pct) => setUploadProgress(pct),
      });
      setUploadProgress(100);

      // Add to list, select it, and trigger onSelect
      setMediaList((prev) => [uploadedItem, ...prev]);
      onSelect(uploadedItem);
      onClose();
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((item) => {
    // Check type constraints
    if (allowedType === "image" && item.type !== "image") return false;
    if (allowedType === "document" && item.type !== "document") return false;

    // Filter by type dropdown
    if (typeFilter === "image" && item.type !== "image") return false;
    if (typeFilter === "document" && item.type !== "document") return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchFile = item.fileName.toLowerCase().includes(q);
      const matchCat = (item.category || "").toLowerCase().includes(q);
      if (!matchName && !matchFile && !matchCat) return false;
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#29382F]/15 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#29382F]/10 bg-[#FAFBF9]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#29382F] text-[#FAFBF9]">
              <FolderOpen size={18} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#29382F]">{title}</h3>
              <p className="text-xs text-[#506B59]">Select an existing cloud asset or upload a new one</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#506B59] hover:bg-black/5 hover:text-[#29382F] transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#29382F]/10 bg-white">
          <button
            onClick={() => setActiveTab("library")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === "library"
                ? "border-[#29382F] text-[#29382F]"
                : "border-transparent text-[#506B59] hover:text-[#29382F]"
            }`}
          >
            Browse Library ({mediaList.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition ${
              activeTab === "upload"
                ? "border-[#29382F] text-[#29382F]"
                : "border-transparent text-[#506B59] hover:text-[#29382F]"
            }`}
          >
            Upload New File
          </button>
        </div>

        {/* TAB 1: BROWSE LIBRARY */}
        {activeTab === "library" && (
          <div className="flex-1 overflow-hidden flex flex-col p-6">
            
            {/* SEARCH & FILTERS */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets by filename or tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#29382F]/15 bg-white text-[#29382F] focus:outline-none focus:border-[#29382F]"
                />
              </div>

              {allowedType === "all" && (
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-[#506B59]" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="text-xs rounded-xl border border-[#29382F]/15 bg-white px-3 py-2 text-[#29382F] focus:outline-none focus:border-[#29382F]"
                  >
                    <option value="all">All Types</option>
                    <option value="image">Images Only</option>
                    <option value="document">PDF & Documents</option>
                  </select>
                </div>
              )}
            </div>

            {/* ASSET GRID */}
            <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[420px] pr-1">
              {loading ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <Loader2 size={24} className="animate-spin text-[#29382F]" />
                  <p className="text-xs text-[#506B59]">Loading media assets...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#29382F]/15 rounded-2xl bg-[#FAFBF9]">
                  <FolderOpen size={36} className="text-[#506B59]/40 mb-2" />
                  <p className="text-sm font-semibold text-[#29382F]">No media assets found</p>
                  <p className="text-xs text-[#506B59] mt-1 max-w-sm">
                    {search ? "No assets matched your search." : "Your media library is empty. Upload your first asset to get started."}
                  </p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#29382F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#D78359] transition"
                  >
                    <Upload size={13} />
                    <span>Upload Asset</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative flex flex-col rounded-xl overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#D78359] ring-2 ring-[#D78359] bg-[#FAFBF9] shadow-md"
                            : "border-[#29382F]/15 hover:border-[#29382F]/40 bg-white"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full bg-[#E8EEE5] flex items-center justify-center overflow-hidden">
                          {item.type === "image" ? (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-1 p-2 text-center text-[#29382F]">
                              <FileText size={28} className="text-[#D78359]" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
                            </div>
                          )}

                          {isSelected && (
                            <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D78359] text-white shadow-sm">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-2.5">
                          <p className="text-xs font-bold text-[#29382F] truncate" title={item.name}>
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-[#506B59] mt-1">
                            <span className="uppercase">{item.mimeType.split("/")[1] || item.type}</span>
                            <span>{formatFileSize(item.size)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER ACTION */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#29382F]/10">
              <span className="text-xs text-[#506B59]">
                {selectedItem ? `Selected: ${selectedItem.name}` : "Click any asset to select"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full px-4 py-1.5 text-xs font-semibold text-[#506B59] hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedItem}
                  onClick={() => {
                    if (selectedItem) {
                      onSelect(selectedItem);
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#29382F] px-5 py-2 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D78359] transition shadow-xs"
                >
                  <Check size={14} />
                  <span>Use Selected Asset</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: UPLOAD NEW */}
        {activeTab === "upload" && (
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#29382F]/20 rounded-2xl bg-[#FAFBF9] hover:bg-[#FAFBF9]/80 cursor-pointer transition text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={
                    allowedType === "image"
                      ? "image/*"
                      : allowedType === "document"
                      ? "application/pdf,.doc,.docx"
                      : "image/*,application/pdf,.doc,.docx"
                  }
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-[#29382F]/10 text-[#D78359] mb-3">
                  <Upload size={22} />
                </div>

                <p className="text-sm font-bold text-[#29382F]">
                  {uploadFile ? uploadFile.name : "Click to browse or drag & drop file"}
                </p>
                <p className="text-xs text-[#506B59] mt-1 max-w-sm">
                  Supported formats: JPG, PNG, WEBP, SVG, GIF, AVIF, PDF (up to 25MB)
                </p>

                {uploadFile && (
                  <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 border border-[#29382F]/10 shadow-xs">
                    {uploadFile.type.startsWith("image/") ? (
                      <ImageIcon size={14} className="text-[#D78359]" />
                    ) : (
                      <FileText size={14} className="text-[#D78359]" />
                    )}
                    <span className="text-xs font-semibold text-[#29382F]">{uploadFile.name}</span>
                    <span className="text-[10px] text-[#506B59]">({formatFileSize(uploadFile.size)})</span>
                  </div>
                )}
              </div>

              {/* Category Selector */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#29382F] mb-1.5">Asset Category</label>
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
              </div>

              {uploadProgress > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-xs font-semibold text-[#29382F] mb-1">
                    <span>Uploading to Cloud Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full bg-[#D78359] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {uploadError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-6 border-t border-[#29382F]/10 mt-6">
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className="rounded-full px-4 py-2 text-xs font-semibold text-[#506B59] hover:bg-black/5"
              >
                Back to Library
              </button>
              <button
                type="button"
                disabled={!uploadFile || uploading}
                onClick={handleUploadAndSelect}
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
                    <span>Upload & Select</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
