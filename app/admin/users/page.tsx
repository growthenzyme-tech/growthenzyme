
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
} from "lucide-react";

import {
  getAllUsers,
  createCMSUser,
  type CMSUser,
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
      "Please change your password after your first login.",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setFormError("Unable to copy credentials. Please copy them manually.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#829080]">
            Access Control
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#252B25]">
            User Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View CMS users, their assigned roles and account status.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Refresh Users
          </button>

          <button
            onClick={() => {
              setFormError("");
              setShowCreateModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#405C48] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#334A3A]"
          >
            <Plus size={17} />
            Create User
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Users</p>
            <Users size={19} className="text-[#405C48]" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#29382F]">
            {users.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="mt-3 text-3xl font-semibold text-green-700">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Inactive Users</p>
          <p className="mt-3 text-3xl font-semibold text-red-600">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
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
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#405C48]"
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
              <thead className="bg-[#FAFBF9]">
                <tr className="text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4 font-semibold">User</th>
                  <th className="px-5 py-4 font-semibold">Assigned Role</th>
                  <th className="px-5 py-4 font-semibold">Account Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDF2EC] text-sm font-semibold text-[#405C48]">
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
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl">

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
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#405C48]"
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
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#405C48]"
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
                  Minimum 6 characters. The user must change it after first login.
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

    </div>
  );
}
