"use client";

import { useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  Plus,
  Trash2,
  Edit,
  Mail,
  Lock,
  User,
  Shield,
  Loader2,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { confirmAction, showSuccess } from "@/lib/swal";

export default function AdminStaffClient({ initialAdmins = [], currentAdmin }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer_manager",
    status: "active",
  });

  const superAdminsCount = admins.filter((a) => a.role === "super_admin" || a.role === "admin").length;
  const customerManagersCount = admins.filter((a) => a.role === "customer_manager").length;
  const activeCount = admins.filter((a) => a.status === "active").length;

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      (admin.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer_manager",
      status: "active",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      password: "",
      role: admin.role || "customer_manager",
      status: admin.status || "active",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAdmin) {
        // Update admin
        const payload = {
          name: formData.name,
          role: formData.role,
          status: formData.status,
        };
        if (formData.password) {
          payload.password = formData.password;
        }

        const res = await fetch(`/api/admin/admins/${editingAdmin._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update staff");

        setAdmins((prev) =>
          prev.map((a) => (a._id === editingAdmin._id ? { ...a, ...data.admin } : a))
        );
        toast.success("Admin staff updated successfully");
      } else {
        // Create new admin
        const res = await fetch("/api/admin/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to create staff");

        setAdmins((prev) => [data.admin, ...prev]);
        toast.success("New admin staff created successfully");
      }

      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (admin) => {
    if (admin._id === "admin-root" || admin.email === "admin@nivora.com") {
      toast.error("Cannot delete root Super Administrator.");
      return;
    }

    if (admin._id === currentAdmin.id || admin.email === currentAdmin.email) {
      toast.error("You cannot delete your own active session account.");
      return;
    }

    const confirmed = await confirmAction({
      title: "DELETE STAFF USER?",
      text: `Are you sure you want to remove ${admin.name} (${admin.email}) from administrative access?`,
      confirmText: "DELETE STAFF",
      cancelText: "CANCEL",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/admins/${admin._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete staff");

      setAdmins((prev) => prev.filter((a) => a._id !== admin._id));
      showSuccess("STAFF REMOVED", `${admin.name} was removed from administrative access.`);
    } catch (err) {
      toast.error(err.message || "Failed to delete staff");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
            SECURITY & STAFF ACCESS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase text-[#111111]">
            Admin Users & Staff Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage admin users, assign roles (Super Admin vs Customer Manager), and control store access
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#b6e600] hover:bg-[#a4cf00] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* 4 Metric Cards in Site Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Admin Users */}
        <div className="bg-[#111111] text-white rounded-2xl p-5 border border-[#222222] flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
              Total Staff
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#222222] flex items-center justify-center text-[#b6e600]">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black">{admins.length}</div>
            <p className="text-[11px] text-[#b6e600] font-bold uppercase tracking-wider mt-1">
              • Authorized accounts
            </p>
          </div>
        </div>

        {/* Super Admins */}
        <div className="bg-white text-[#111111] rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
              Super Admins
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#111111]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black">{superAdminsCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Full control & permissions
            </p>
          </div>
        </div>

        {/* Customer Managers */}
        <div className="bg-white text-[#111111] rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
              Customer Managers
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black text-blue-700">{customerManagersCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Customer & order operations
            </p>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white text-[#111111] rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
              Active Status
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black text-emerald-600">{activeCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Ready for authentication
            </p>
          </div>
        </div>
      </div>

      {/* Role explanation banner */}
      <div className="bg-[#F8F9FA] border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#111111] text-[#b6e600] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#111111] block">
              Role-Based Access Control (RBAC) System
            </span>
            <span className="text-slate-500">
              <strong>Super Admin:</strong> Manages products, categories, orders, customers, and administrative staff. <br />
              <strong>Customer Management User:</strong> Dedicated to customer support, customer profile lookups, order status updates & fulfillment.
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          {/* Search bar */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition"
            />
          </div>

          {/* Role selector tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider">
            {["ALL", "super_admin", "customer_manager"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  roleFilter === role
                    ? "bg-[#111111] text-white shadow-xs"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                {role === "ALL"
                  ? "All Staff"
                  : role === "super_admin"
                  ? "Super Admin"
                  : "Customer Manager"}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                <th className="py-3 px-3">Staff Member</th>
                <th className="py-3 px-3">Role & Permissions</th>
                <th className="py-3 px-3">Account Status</th>
                <th className="py-3 px-3">Created Date</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No staff members match the selected search or filter.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => {
                  const isRoot = admin._id === "admin-root" || admin.email === "admin@nivora.com";
                  const isCurrent = admin._id === currentAdmin.id || admin.email === currentAdmin.email;
                  const isSuper = admin.role === "super_admin" || admin.role === "admin";

                  return (
                    <tr key={admin._id} className="hover:bg-slate-50 transition group">
                      {/* Name & Email */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#b6e600] font-black text-xs flex items-center justify-center shrink-0 border border-[#222222]">
                            {admin.name?.slice(0, 2).toUpperCase() || "AD"}
                          </div>
                          <div>
                            <div className="font-bold text-[#111111] flex items-center gap-1.5">
                              <span>{admin.name}</span>
                              {isCurrent && (
                                <span className="bg-[#b6e600] text-[#111111] text-[9px] font-black px-1.5 py-0.2 rounded-sm">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#888888] font-mono">
                              {admin.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-3">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#111111] text-[#b6e600] border border-[#222222]">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Super Admin</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                            <UserCheck className="w-3 h-3" />
                            <span>Customer Manager</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            admin.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              admin.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          <span>{admin.status || "active"}</span>
                        </span>
                      </td>

                      {/* Created */}
                      <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(admin.createdAt || Date.now()).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {admin.lastLogin ? (
                          new Date(admin.lastLogin).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        ) : (
                          <span className="text-slate-300">Never</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(admin)}
                            className="p-1.5 text-slate-600 hover:text-[#111111] hover:bg-slate-100 rounded-lg transition"
                            title="Edit Role / Status"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {!isRoot && !isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleDelete(admin)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Staff"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Admin User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black font-editorial tracking-tight uppercase text-[#111111]">
                  {editingAdmin ? "Edit Staff User" : "Add New Admin Staff"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingAdmin
                    ? "Update administrative role, credentials, and access status"
                    : "Create a new administrative user with tailored permissions"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block text-[11px]">
                  Staff Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-[#F8F9FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block text-[11px]">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    disabled={!!editingAdmin}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. staff@hoodiebazar.com"
                    className="w-full bg-[#F8F9FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block text-[11px]">
                  {editingAdmin ? "New Password (Leave blank to keep unchanged)" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required={!editingAdmin}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingAdmin ? "••••••••" : "Minimum 6 characters"}
                    className="w-full bg-[#F8F9FB] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111]"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block text-[11px]">
                  Assigned Administrative Role
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <label
                    className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition flex flex-col gap-1 ${
                      formData.role === "customer_manager"
                        ? "border-[#111111] bg-slate-50 text-[#111111] ring-1 ring-[#111111]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Customer Manager</span>
                      </span>
                      <input
                        type="radio"
                        name="role"
                        value="customer_manager"
                        checked={formData.role === "customer_manager"}
                        onChange={() => setFormData({ ...formData, role: "customer_manager" })}
                        className="sr-only"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Order management & customer support
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition flex flex-col gap-1 ${
                      formData.role === "super_admin"
                        ? "border-[#111111] bg-[#111111] text-white ring-1 ring-[#111111]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#b6e600]" />
                        <span>Super Admin</span>
                      </span>
                      <input
                        type="radio"
                        name="role"
                        value="super_admin"
                        checked={formData.role === "super_admin"}
                        onChange={() => setFormData({ ...formData, role: "super_admin" })}
                        className="sr-only"
                      />
                    </div>
                    <span className={`text-[10px] font-normal ${formData.role === "super_admin" ? "text-slate-300" : "text-slate-400"}`}>
                      Full store & staff management
                    </span>
                  </label>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block text-[11px]">
                  Account Status
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={() => setFormData({ ...formData, status: "active" })}
                      className="accent-[#111111]"
                    />
                    <span>Active (Can sign in)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      value="suspended"
                      checked={formData.status === "suspended"}
                      onChange={() => setFormData({ ...formData, status: "suspended" })}
                      className="accent-rose-600"
                    />
                    <span>Suspended (Disabled)</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-black transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#b6e600] hover:bg-[#a4cf00] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingAdmin ? "Update Staff" : "Create User"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
