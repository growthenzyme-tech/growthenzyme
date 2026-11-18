
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
    description: "Create, edit and manage blog articles.",
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
  <div className="mx-auto max-w-7xl space-y-8 pb-12">

    {/* PAGE HEADER */}
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#829181]">
          <ShieldCheck size={15} />
          Access Control
        </div>

        <h1
          className="mt-3 text-3xl font-semibold tracking-tight text-[#29382F] sm:text-4xl"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Roles & Permissions
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#747D73]">
          Manage team roles and control access to different areas of your CMS.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={loadRoles}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#DDE4D9] bg-white px-4 py-3 text-sm font-medium text-[#405C48] transition hover:bg-[#F3F6F0] disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>

        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-xl bg-[#29382F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#405C48]"
        >
          <Plus size={17} />
          Create Role
        </button>
      </div>
    </div>

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
        className="overflow-hidden rounded-2xl border border-[#E3E9E0] bg-white shadow-sm"
      >
        <div className="flex items-start justify-between border-b border-[#E8EEE5] bg-[#F7F9F5] px-6 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#829181]">
              Role Configuration
            </p>

            <h2
              className="mt-1 text-2xl font-semibold text-[#29382F]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {editingRole ? "Edit Role" : "Create New Role"}
            </h2>

            <p className="mt-1 text-sm text-[#747D73]">
              Define the role details and assign permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="rounded-full p-2 text-[#829181] transition hover:bg-[#E8EEE5] hover:text-[#29382F]"
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
                <label className="mb-2 block text-xs font-semibold text-[#405C48]">
                  Role Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SEO Manager"
                  maxLength={50}
                  required
                  className="w-full rounded-xl border border-[#DDE4D9] bg-[#FCFDFB] px-4 py-3 text-sm text-[#29382F] placeholder:text-[#92998F] outline-none transition focus:border-[#405C48] focus:bg-white focus:ring-2 focus:ring-[#405C48]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#405C48]">
                  Description
                </label>

                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this role"
                  maxLength={160}
                  className="w-full rounded-xl border border-[#DDE4D9] bg-[#FCFDFB] px-4 py-3 text-sm text-[#29382F] placeholder:text-[#92998F] outline-none transition focus:border-[#405C48] focus:bg-white focus:ring-2 focus:ring-[#405C48]/10"
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

                <p className="mt-1 text-xs text-[#829181]">
                  Choose which sections this role can access.
                </p>
              </div>

              <span className="text-xs font-medium text-[#657365]">
                {Object.values(permissions).filter(Boolean).length} of{" "}
                {permissionOptions.length} selected
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {permissionOptions.map((item) => (
                <label
                  key={item.key}
                  className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                    permissions[item.key]
                      ? "border-[#829D82] bg-[#F1F5EF]"
                      : "border-[#E5EAE2] bg-white hover:border-[#B6CBA9] hover:bg-[#FAFBF8]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions[item.key]}
                    onChange={() => togglePermission(item.key)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#405C48]"
                  />

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[#29382F]">
                      {item.label}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#829181]">
                      {item.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#E8EEE5] pt-6">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-[#DDE4D9] px-5 py-3 text-sm font-medium text-[#657365] transition hover:bg-[#F5F7F3]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#29382F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#405C48] disabled:cursor-not-allowed disabled:opacity-50"
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
    <div className="flex items-end justify-between border-b border-[#E4E9E0] pb-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#829181]">
          Team Access
        </p>

        <h2
          className="mt-1 text-2xl font-semibold text-[#29382F]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Available Roles
        </h2>
      </div>

      <span className="text-xs text-[#829181]">
        {roles.length} {roles.length === 1 ? "Role" : "Roles"}
      </span>
    </div>

    {/* ROLE CARDS */}
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {loading ? (
        <div className="col-span-full rounded-2xl border border-[#E5EAE2] bg-white p-14 text-center text-sm text-[#829181]">
          Loading roles...
        </div>
      ) : roles.length === 0 ? (
        <div className="col-span-full rounded-2xl border border-dashed border-[#CBD7C6] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3EA] text-[#405C48]">
            <ShieldCheck size={27} />
          </div>

          <h3
            className="mt-5 text-2xl font-semibold text-[#29382F]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            No custom roles yet
          </h3>

          <p className="mt-2 text-sm text-[#829181]">
            Create your first role to start managing CMS permissions.
          </p>

          <button
            onClick={openCreateForm}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#29382F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#405C48]"
          >
            <Plus size={16} />
            Create First Role
          </button>
        </div>
      ) : (
        roles.map((role) => (
          <div
            key={role.id}
            className="group rounded-2xl border border-[#E5EAE2] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8D5C3] hover:shadow-lg hover:shadow-[#29382F]/5"
          >
            {/* CARD HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3EA] text-[#405C48]">
                <ShieldCheck size={23} />
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                  role.isActive
                    ? "bg-[#EAF3E8] text-[#47734D]"
                    : "bg-[#F1F2EF] text-[#858B82]"
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

            <p className="mt-2 min-h-10 text-sm leading-6 text-[#829181]">
              {role.description || "No description provided."}
            </p>

            {/* PERMISSION TAGS */}
            <div className="mt-5 border-t border-[#EDF0EA] pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#92998F]">
                  Assigned Permissions
                </p>

                <span className="text-xs font-medium text-[#405C48]">
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
                      className="rounded-lg bg-[#F1F5EF] px-2.5 py-1.5 text-[11px] font-medium text-[#405C48]"
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
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#EDF0EA] pt-4">
              <button
                onClick={() => openEditForm(role)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#DDE4D9] px-3 py-2 text-xs font-semibold text-[#405C48] transition hover:bg-[#EEF3EA]"
              >
                <Pencil size={13} />
                Edit
              </button>

              <button
                onClick={() => handleToggleActive(role)}
                className="rounded-lg border border-[#DDE4D9] px-3 py-2 text-xs font-semibold text-[#657365] transition hover:bg-[#EEF3EA]"
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
