
"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  ShieldCheck,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Check,
} from "lucide-react";

import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
  defaultPermissions,
  type CMSRole,
  type RolePermissions,
} from "@/app/lib/roles";


const permissionOptions: {
  key: keyof RolePermissions;
  label: string;
  description: string;
}[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "View CMS dashboard and statistics.",
  },
  {
    key: "blogs",
    label: "Blog Management",
    description: "Access the Blog Management section.",
  },
  {
    key: "blogsCreate",
    label: "Create Blogs",
    description: "Create new blog articles and save drafts.",
  },
  {
    key: "blogsEdit",
    label: "Edit Blogs",
    description: "Edit all existing blog articles.",
  },
  {
    key: "blogsPublish",
    label: "Publish Blogs",
    description: "Publish and unpublish blog articles.",
  },
  {
    key: "blogsDelete",
    label: "Delete Blogs",
    description: "Permanently delete blog articles.",
  },
  {
    key: "comments",
    label: "Comment Management",
    description: "Review, approve, reject and delete comments.",
  },
  {
    key: "media",
    label: "Media Library",
    description: "Access images and uploaded documents.",
  },
  {
    key: "caseStudies",
    label: "Case Studies",
    description: "Manage published case studies and projects.",
  },
  {
    key: "users",
    label: "User Management",
    description: "Create and manage CMS user accounts.",
  },
  {
    key: "settings",
    label: "Website Settings",
    description: "Manage website configuration.",
  },
];


const emptyPermissions: RolePermissions = {
  ...defaultPermissions,
};

export default function RolesPage() {
  const [roles, setRoles] = useState<CMSRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CMSRole | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] =
    useState<RolePermissions>(emptyPermissions);

  async function loadRoles() {
    try {
      setError("");
      setLoading(true);
      const data = await getAllRoles();
      setRoles(data);
    } catch (err) {
      console.error("Error loading roles:", err);
      setError("Unable to load roles. Check your Firestore rules.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setPermissions({ ...emptyPermissions });
    setEditingRole(null);
    setFormOpen(false);
  }

  function openCreateForm() {
    resetForm();
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(role: CMSRole) {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description || "");
    setPermissions({
      ...emptyPermissions,
      ...role.permissions,
    });
    setFormOpen(true);
    setError("");
    setSuccess("");
  }

  function togglePermission(key: keyof RolePermissions) {
    setPermissions((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter a role name.");
      return;
    }

    if (!Object.values(permissions).some(Boolean)) {
      setError("Select at least one permission.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const roleData = {
        name: name.trim(),
        description: description.trim(),
        permissions,
        isActive: editingRole?.isActive ?? true,
      };

      if (editingRole) {
        await updateRole(editingRole.id, roleData);
        setSuccess("Role updated successfully.");
      } else {
        await createRole(roleData);
        setSuccess("New role created successfully.");
      }

      resetForm();
      await loadRoles();
    } catch (err) {
      console.error("Error saving role:", err);
      setError(
        err instanceof Error ? err.message : "Unable to save this role."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(role: CMSRole) {
    if (!role.isActive) {
      const confirmed = window.confirm(
        `Activate the "${role.name}" role?`
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm(
        `Deactivate the "${role.name}" role? Users assigned to it will lose CMS access.`
      );
      if (!confirmed) return;
    }

    try {
      setError("");
      setSuccess("");

      await updateRole(role.id, {
        isActive: !role.isActive,
      });

      setSuccess(
        `${role.name} ${role.isActive ? "deactivated" : "activated"}.`
      );

      await loadRoles();
    } catch (err) {
      console.error("Error changing role status:", err);
      setError(
        err instanceof Error ? err.message : "Unable to update role."
      );
    }
  }

  async function handleDelete(role: CMSRole) {
    const confirmed = window.confirm(
      `Permanently delete "${role.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteRole(role.id);

      setSuccess("Role deleted successfully.");
      await loadRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
      setError(
        err instanceof Error ? err.message : "Unable to delete role."
      );
    }
  }

 

return (
  <div className="w-full max-w-none space-y-8 pb-12">

    {/* PAGE HEADER */}
    <section className="relative isolate w-full overflow-hidden rounded-[28px] border border-[#A5B59F]/40 bg-[#B6CBA9] px-6 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#D78359]/10 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/15 bg-white/40 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#29382F]">
            <span className="h-2 w-2 rounded-full bg-[#D78359]" />
            <ShieldCheck size={14} />
            Access Control
          </div>

          <h1
            className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Roles & Permissions
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#29382F]/80 sm:text-base">
            Manage team roles and control access to different areas of your CMS.
          </p>
        </div>

        <div className="relative flex flex-wrap gap-3">
   <button
  onClick={loadRoles}
  disabled={loading}
  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5E1CC] bg-white px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_4px_0_#D5E1CC,0_8px_16px_rgba(41,56,47,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_0_#D5E1CC,0_11px_20px_rgba(41,56,47,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
>
  <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
  Refresh
</button>

         <button
  onClick={openCreateForm}
  className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)]"
>
  <Plus size={17} />
  Create Role
</button>
        </div>
      </div>
    </section>

    {/* STATUS MESSAGES */}
    {error && (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )}

    {success && (
      <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        {success}
      </div>
    )}

    {/* CREATE / EDIT FORM */}
    {formOpen && (
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] shadow-sm"
      >
        <div className="flex items-start justify-between border-b border-[#E8EDE3] bg-[#F5F0E5]/60 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F7D70]">
              Role Configuration
            </p>

            <h2
              className="mt-1 text-2xl font-semibold text-[#29382F]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {editingRole ? "Edit Role" : "Create New Role"}
            </h2>

            <p className="mt-1 text-sm text-[#6F7D70]">
              Define the role details and assign permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="rounded-full p-2 text-[#6F7D70] transition hover:bg-[#E8EDE3] hover:text-[#29382F]"
            aria-label="Close form"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-8 p-6 sm:p-8">

          {/* ROLE DETAILS */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#29382F]">
              Basic Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#506B59]">
                  Role Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SEO Manager"
                  maxLength={50}
                  required
                  className="w-full rounded-xl border border-[#DDE4D9] bg-[#FFFDF8] px-4 py-3 text-sm text-[#29382F] outline-none placeholder:text-[#92998F] transition focus:border-[#506B59] focus:ring-4 focus:ring-[#B6CBA9]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#506B59]">
                  Description
                </label>

                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this role"
                  maxLength={160}
                  className="w-full rounded-xl border border-[#DDE4D9] bg-[#FFFDF8] px-4 py-3 text-sm text-[#29382F] outline-none placeholder:text-[#92998F] transition focus:border-[#506B59] focus:ring-4 focus:ring-[#B6CBA9]/20"
                />
              </div>
            </div>
          </div>

          {/* PERMISSIONS */}
          <div>
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h3 className="text-sm font-semibold text-[#29382F]">
                  Feature Permissions
                </h3>

                <p className="mt-1 text-xs text-[#6F7D70]">
                  Choose which sections this role can access.
                </p>
              </div>

              <span className="rounded-full bg-[#E8EDE3] px-3 py-1.5 text-xs font-semibold text-[#29382F]">
                {Object.values(permissions).filter(Boolean).length} of{" "}
                {permissionOptions.length} selected
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {permissionOptions.map((item) => (
                <label
                  key={item.key}
                  className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 ${
                    permissions[item.key]
                      ? "border-[#A5B59F] bg-[#E8EDE3]"
                      : "border-[#DDE4D9] bg-[#FFFDF8] hover:border-[#A5B59F] hover:bg-[#F5F0E5]/60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions[item.key]}
                    onChange={() => togglePermission(item.key)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#29382F]"
                  />

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[#29382F]">
                      {item.label}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#6F7D70]">
                      {item.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#E8EDE3] pt-6">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-[#DDE4D9] bg-[#FFFDF8] px-5 py-3 text-sm font-medium text-[#506B59] transition hover:bg-[#F5F0E5]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#29382F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#506B59] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={16} />
              {saving
                ? "Saving..."
                : editingRole
                ? "Save Changes"
                : "Create Role"}
            </button>
          </div>
        </div>
      </form>
    )}

    {/* ROLES LIST HEADER */}
    <div className="flex items-end justify-between border-b border-[#DDE4D9] pb-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F7D70]">
          Team Access
        </p>

        <h2
          className="mt-1 text-2xl font-semibold text-[#29382F]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Available Roles
        </h2>
      </div>

      <span className="rounded-full bg-[#E8EDE3] px-3 py-1.5 text-xs font-semibold text-[#29382F]">
        {roles.length} {roles.length === 1 ? "Role" : "Roles"}
      </span>
    </div>

    {/* ROLE CARDS */}
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {loading ? (
        <div className="col-span-full rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] p-14 text-center text-sm text-[#6F7D70]">
          Loading roles...
        </div>
      ) : roles.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-dashed border-[#A5B59F] bg-[#FFFDF8] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8EDE3] text-[#29382F]">
            <ShieldCheck size={27} />
          </div>

          <h3
            className="mt-5 text-2xl font-semibold text-[#29382F]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            No custom roles yet
          </h3>

          <p className="mt-2 text-sm text-[#6F7D70]">
            Create your first role to start managing CMS permissions.
          </p>

          <button
            onClick={openCreateForm}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#29382F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#506B59]"
          >
            <Plus size={16} />
            Create First Role
          </button>
        </div>
      ) : (
        roles.map((role) => (
          <div
            key={role.id}
            className="group rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#A5B59F] hover:shadow-lg hover:shadow-[#29382F]/5"
          >
            {/* CARD HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EDE3] text-[#29382F]">
                <ShieldCheck size={23} />
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                  role.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {role.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* ROLE DETAILS */}
            <h3
              className="mt-5 text-2xl font-semibold text-[#29382F]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {role.name}
            </h3>

            <p className="mt-2 min-h-10 text-sm leading-6 text-[#6F7D70]">
              {role.description || "No description provided."}
            </p>

            {/* PERMISSION TAGS */}
            <div className="mt-5 border-t border-[#E8EDE3] pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#92998F]">
                  Assigned Permissions
                </p>

                <span className="text-xs font-semibold text-[#29382F]">
                  {
                    permissionOptions.filter(
                      (item) => role.permissions?.[item.key]
                    ).length
                  }
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {permissionOptions
                  .filter((item) => role.permissions?.[item.key])
                  .map((item) => (
                    <span
                      key={item.key}
                      className="rounded-lg border border-[#DDE4D9] bg-[#E8EDE3] px-2.5 py-1.5 text-[11px] font-medium text-[#29382F]"
                    >
                      {item.label}
                    </span>
                  ))}

                {!permissionOptions.some(
                  (item) => role.permissions?.[item.key]
                ) && (
                  <span className="text-xs text-[#92998F]">
                    No permissions assigned
                  </span>
                )}
              </div>
            </div>

            {/* CARD ACTIONS */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#E8EDE3] pt-4">
              <button
                onClick={() => openEditForm(role)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#DDE4D9] bg-[#FFFDF8] px-3 py-2 text-xs font-semibold text-[#29382F] transition hover:border-[#A5B59F] hover:bg-[#E8EDE3]"
              >
                <Pencil size={13} />
                Edit
              </button>

              <button
                onClick={() => handleToggleActive(role)}
                className="rounded-lg border border-[#DDE4D9] bg-[#FFFDF8] px-3 py-2 text-xs font-semibold text-[#506B59] transition hover:border-[#A5B59F] hover:bg-[#E8EDE3]"
              >
                {role.isActive ? "Deactivate" : "Activate"}
              </button>

              <button
                onClick={() => handleDelete(role)}
                className="ml-auto rounded-lg p-2 text-[#C66B5C] transition hover:bg-red-50"
                aria-label={`Delete ${role.name}`}
                title="Delete role"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);


}
