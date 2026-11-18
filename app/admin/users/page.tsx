
"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  Users,
  ShieldCheck,
  Search,
  Plus,
  X,
  UserPlus,
  Eye,
  EyeOff,
  Copy,
  Check,
KeyRound,
Power,
Trash2,
} from "lucide-react";

import {
  getAllUsers,
  createCMSUser,
  changeCMSUserPassword,
  deleteCMSUser,
  type CMSUser,
  updateUserStatus,
} from "@/app/lib/users";

import {
  getAllRoles,
  type CMSRole,
} from "@/app/lib/roles";

export default function UsersPage() {
  const [users, setUsers] = useState<CMSUser[]>([]);
  const [roles, setRoles] = useState<CMSRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CMSUser | null>(null);
const [newPassword, setNewPassword] = useState("");
const [savingPassword, setSavingPassword] = useState(false);
const [passwordError, setPasswordError] = useState("");
const [showNewPassword, setShowNewPassword] = useState(false);
const [statusUser, setStatusUser] = useState<CMSUser | null>(null);
const [updatingStatus, setUpdatingStatus] = useState(false);
const [statusError, setStatusError] = useState("");
const [deleteUser, setDeleteUser] = useState<CMSUser | null>(null);
const [deletingUser, setDeletingUser] = useState(false);
const [deleteError, setDeleteError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const [formError, setFormError] = useState("");

  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [userData, roleData] = await Promise.all([
        getAllUsers(),
        getAllRoles(),
      ]);

      setUsers(userData);
      setRoles(roleData);
    } catch (err) {
      console.error("Error loading user management data:", err);
      setError("Unable to load users. Please check your permissions.");
    } finally {
      setLoading(false);
    }
  }

async function handleChangePassword(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  if (!selectedUser) return;

  try {
    setSavingPassword(true);
    setPasswordError("");

    await changeCMSUserPassword(selectedUser.id, newPassword);

    setSelectedUser(null);
    setNewPassword("");
    setShowNewPassword(false);

    alert("User password updated successfully.");
  } catch (err) {
    setPasswordError(
      err instanceof Error
        ? err.message
        : "Unable to update password."
    );
  } finally {
    setSavingPassword(false);
  }
}

async function handleToggleUserStatus() {
  if (!statusUser) return;

  const newStatus = !statusUser.isActive;

  try {
    setUpdatingStatus(true);
    setStatusError("");

    await updateUserStatus(statusUser.id, newStatus);

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === statusUser.id
          ? { ...user, isActive: newStatus }
          : user
      )
    );

    setStatusUser(null);

  } catch (err) {
    setStatusError(
      err instanceof Error
        ? err.message
        : "Unable to update user status."
    );
  } finally {
    setUpdatingStatus(false);
  }
}

async function handleDeleteUser() {
  if (!deleteUser) return;

  try {
    setDeletingUser(true);
    setDeleteError("");

    await deleteCMSUser(deleteUser.id);
    setUsers((previousUsers) =>
      previousUsers.filter((user) => user.id !== deleteUser.id)
    );
    setDeleteUser(null);
  } catch (err) {
    setDeleteError(
      err instanceof Error ? err.message : "Unable to delete the user."
    );
  } finally {
    setDeletingUser(false);
  }
}

  useEffect(() => {
    loadData();
  }, []);

  function getRoleName(user: CMSUser) {
    if (user.roleId) {
      return (
        roles.find((role) => role.id === user.roleId)?.name ||
        "Unknown Role"
      );
    }

    if ((user as any).role === "admin") return "Administrator";
    if ((user as any).role === "writer") return "Content Writer";

    return "Role not assigned";
  }

  function isProtectedAdmin(user: CMSUser) {
  const roleName = getRoleName(user).toLowerCase();

  return (
    roleName === "administrator" ||
    roleName === "admin" ||
    user.roleId === "system-admin"
  );
}

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    return (
      (user.name || "").toLowerCase().includes(searchValue) ||
      (user.email || "").toLowerCase().includes(searchValue) ||
      getRoleName(user).toLowerCase().includes(searchValue)
    );
  });

  const activeCount = users.filter((user) => user.isActive).length;
  const inactiveCount = users.length - activeCount;

  const availableRoles = roles.filter(
    (role) => role.isActive && role.id !== "system-admin"
  );

  function closeCreateModal() {
    setShowCreateModal(false);
    setFormError("");
    setShowPassword(false);
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setCreating(true);
      setFormError("");

      const result = await createCMSUser(form);

      setCreatedCredentials({
        name: result.name,
        email: result.email,
        password: form.password,
      });

      setForm({
        name: "",
        email: "",
        password: "",
        roleId: "",
      });

      closeCreateModal();

      await loadData();
    } catch (err) {
      console.error("Create user error:", err);

      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to create user. Please try again."
      );
    } finally {
      setCreating(false);
    }
  }

  async function copyCredentials() {
    if (!createdCredentials) return;

    const text = [
      "GrowthEnzyme CMS Login Credentials",
      `Name: ${createdCredentials.name}`,
      `Email: ${createdCredentials.email}`,
      `Temporary Password: ${createdCredentials.password}`,
      "Login: /admin/login",
      
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setFormError("Unable to copy credentials. Please copy them manually.");
    }
  }
function closePasswordModal() {
  if (savingPassword) return;

  setSelectedUser(null);
  setNewPassword("");
  setPasswordError("");
  setShowNewPassword(false);
}

  return (
     <div className="w-full max-w-none space-y-8">

      {/* Header */}
       <section className="relative isolate w-full overflow-hidden rounded-[28px] border border-[#A5B59F]/40 bg-[#B6CBA9] px-6 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#D78359]/10 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#29382F]/15 bg-white/40 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#29382F]">
            <span className="h-2 w-2 rounded-full bg-[#D78359]" />
            Access Control
          </div>

          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-5xl">
            User Management
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#29382F]/80 sm:text-base">
            View CMS users, their assigned roles and account status.
          </p>
        </div>

        <div className="relative flex flex-wrap gap-3">
        <button
  onClick={loadData}
  disabled={loading}
  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5E1CC] bg-white px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_4px_0_#D5E1CC,0_8px_16px_rgba(41,56,47,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_0_#D5E1CC,0_11px_20px_rgba(41,56,47,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
>
  <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
  Refresh Users
</button>

    <button
  onClick={() => {
    setFormError("");
    setShowCreateModal(true);
  }}
  className="group inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-5 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)]"
>
  <Plus size={17} />
  Create User
</button>
        </div>
      </div>
    </section>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Users</p>
            <Users size={19} className="text-[#405C48]" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#29382F]">
            {users.length}
          </p>
        </div>

  <div className="rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
  <div className="flex items-center justify-between">
    <p className="text-sm text-[#6F7D70]">Active Users</p>
    <Users size={19} className="text-green-700" />
  </div>
  <p className="mt-3 text-3xl font-semibold text-green-700">
    {activeCount}
  </p>
</div>

       <div className="rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
  <div className="flex items-center justify-between">
    <p className="text-sm text-[#6F7D70]">Inactive Users</p>
    <Users size={19} className="text-red-600" />
  </div>
  <p className="mt-3 text-3xl font-semibold text-red-600">
    {inactiveCount}
  </p>
</div>
      </div>

      {/* User List */}
      <div className="overflow-hidden rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E8EDE3] bg-[#F5F0E5]/60 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">CMS Users</h2>
            <p className="mt-1 text-xs text-gray-500">
              Existing accounts registered in your CMS.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
             className="w-full rounded-xl border border-[#DDE4D9] bg-[#FFFDF8] py-2.5 pl-9 pr-3 text-sm text-[#29382F] outline-none placeholder:text-[#92998F] transition focus:border-[#506B59] focus:ring-4 focus:ring-[#B6CBA9]/20"
            />
          </div>
        </div>

        {error && (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={32} className="mx-auto text-gray-300" />
            <h3 className="mt-3 font-semibold text-gray-800">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try another search term."
                : "No CMS user profiles are available yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
             <thead className="bg-[#E8EDE3]/70">
                <tr className="text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Assigned Role</th>
                  <th className="px-5 py-4 font-semibold">Account Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-[#F5F0E5]/60">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B6CBA9]/40 text-sm font-semibold text-[#29382F]">
                          {(user.name || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <ShieldCheck size={15} className="text-[#405C48]" />
                        {getRoleName(user)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

<td className="px-5 py-4">
  {!isProtectedAdmin(user) && (
    <div className="flex flex-wrap items-center gap-2">

      {/* Change Password */}
      <button
        type="button"
        onClick={() => {
          setSelectedUser(user);
          setNewPassword("");
          setPasswordError("");
          setShowNewPassword(false);
        }}
       className="inline-flex items-center gap-2 rounded-lg border border-[#DDE4D9] bg-[#FFFDF8] px-3 py-2 text-xs font-medium text-[#29382F] transition hover:border-[#A5B59F] hover:bg-[#E8EDE3]"
      >
        <KeyRound size={14} />
        Change Password
      </button>

      {/* Activate / Deactivate */}
      <button
        type="button"
        onClick={() => {
          setStatusUser(user);
          setStatusError("");
        }}
        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
          user.isActive
            ? "border-red-200 text-red-600 hover:bg-red-50"
            : "border-green-200 text-green-700 hover:bg-green-50"
        }`}
      >
        <Power size={14} />
        {user.isActive ? "Deactivate" : "Activate"}
      </button>

      <button
        type="button"
        onClick={() => {
          setDeleteUser(user);
          setDeleteError("");
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 size={14} />
        Delete
      </button>

    </div>
  )}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-[#DDE4D9] bg-[#FFFDF8] shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EDF2EC] text-[#405C48]">
                  <UserPlus size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Create New User
                  </h2>
                  <p className="text-xs text-gray-500">
                    Add a user to your CMS.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5 p-6">

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  required
                  maxLength={80}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-[#DDE4D9] bg-[#FFFDF8] px-4 py-3 text-sm text-[#29382F] outline-none placeholder:text-[#92998F] transition focus:border-[#506B59] focus:ring-4 focus:ring-[#B6CBA9]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-[#DDE4D9] bg-[#FFFDF8] px-4 py-3 text-sm text-[#29382F] outline-none placeholder:text-[#92998F] transition focus:border-[#506B59] focus:ring-4 focus:ring-[#B6CBA9]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Temporary Password
                </label>

                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    minLength={6}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Enter temporary password"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#405C48]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

    <p className="mt-1.5 text-xs text-gray-400">
  Minimum 6 characters. This password will be assigned to the new user.
</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Assign Role
                </label>

                <select
                  required
                  value={form.roleId}
                  onChange={(e) =>
                    setForm({ ...form, roleId: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#405C48]"
                >
                  <option value="">Select a role</option>

                  {availableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>

                {availableRoles.length === 0 && (
                  <p className="mt-2 text-xs text-red-600">
                    No active custom roles are available. Create a role first.
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-[#F7F9F6] p-3">
                <p className="text-xs leading-5 text-gray-600">
                  The new account will be active immediately. Its permissions
                  will be determined by the selected role.
                </p>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={creating}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating || availableRoles.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#405C48] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#334A3A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create User"}
                  {!creating && <UserPlus size={16} />}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Newly Created Credentials */}
      {createdCredentials && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
              <Check size={24} />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              User Created Successfully
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Copy these login credentials and share them securely with the new user.
              This temporary password will not be shown again after closing this window.
            </p>

            <div className="mt-5 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {createdCredentials.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="mt-1 break-all text-sm font-medium text-gray-900">
                  {createdCredentials.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Temporary Password</p>
                <p className="mt-1 break-all font-mono text-sm font-medium text-gray-900">
                  {createdCredentials.password}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Login Page</p>
                <p className="mt-1 text-sm font-medium text-[#405C48]">
                  /admin/login
                </p>
              </div>
            </div>

            <button
              onClick={copyCredentials}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#405C48] px-4 py-3 text-sm font-medium text-white hover:bg-[#334A3A]"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Credentials Copied" : "Copy Login Credentials"}
            </button>

            <button
              onClick={() => {
                setCreatedCredentials(null);
                setCopied(false);
              }}
              className="mt-3 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>

          </div>
        </div>
      )}


{selectedUser && !isProtectedAdmin(selectedUser) && (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Change User Password
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Set a new password for this account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedUser(null)}
            disabled={savingPassword}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-5 rounded-lg bg-[#F7F9F6] p-4">
          <p className="text-sm font-medium text-gray-900">
            {selectedUser.name}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {selectedUser.email}
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
          {passwordError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {passwordError}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="relative">
              <input
                required
                minLength={6}
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#405C48]"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-1.5 text-xs text-gray-400">
              Minimum 6 characters.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={savingPassword}
              onClick={() => setSelectedUser(null)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={savingPassword || newPassword.length < 6}
              className="rounded-lg bg-[#405C48] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#334A3A] disabled:opacity-50"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

{/* Activate / Deactivate Confirmation Modal */}
{statusUser && !isProtectedAdmin(statusUser) && (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">

    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {statusUser.isActive
              ? "Deactivate User?"
              : "Activate User?"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Confirm this account status change.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStatusUser(null)}
          disabled={updatingStatus}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
        >
          <X size={19} />
        </button>

      </div>

      <div className="mt-5 rounded-lg bg-[#F7F9F6] p-4">

        <p className="text-sm font-medium text-gray-900">
          {statusUser.name}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {statusUser.email}
        </p>

      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {statusUser.isActive
          ? "This user will no longer be able to sign in to the CMS after deactivation."
          : "This user will regain access to the CMS according to their assigned role permissions."}
      </p>

      {statusError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {statusError}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">

        <button
          type="button"
          disabled={updatingStatus}
          onClick={() => setStatusUser(null)}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleToggleUserStatus}
          disabled={updatingStatus}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 ${
            statusUser.isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-[#29382F] hover:bg-[#506B59]"
          }`}
        >
          {updatingStatus
            ? "Updating..."
            : statusUser.isActive
              ? "Deactivate User"
              : "Activate User"}
        </button>

      </div>

    </div>
  </div>
)}

{deleteUser && !isProtectedAdmin(deleteUser) && (
  <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-title"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2
            id="delete-user-title"
            className="text-xl font-semibold text-gray-900"
          >
            Permanently delete user?
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDeleteUser(null)}
          disabled={deletingUser}
          aria-label="Close delete confirmation"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
        >
          <X size={19} />
        </button>
      </div>

      <div className="mt-5 rounded-lg bg-red-50 p-4">
        <p className="text-sm font-medium text-gray-900">
          {deleteUser.name || "Unnamed User"}
        </p>
        <p className="mt-1 text-xs text-gray-500">{deleteUser.email}</p>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        This permanently removes the user&apos;s sign-in account and CMS profile.
      </p>

      {deleteError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {deleteError}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={deletingUser}
          onClick={() => setDeleteUser(null)}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDeleteUser}
          disabled={deletingUser}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deletingUser ? "Deleting..." : "Delete Permanently"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
