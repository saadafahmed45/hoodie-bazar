import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Brand-tailored SweetAlert2 instance
export const brandSwal = Swal.mixin({
  customClass: {
    popup: "font-sans border border-[#E2E2E2] rounded-none shadow-2xl",
    title: "font-editorial text-lg tracking-tight uppercase text-[#111111]",
    htmlContainer: "text-xs text-[#666666]",
    confirmButton:
      "bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none transition-colors",
    cancelButton:
      "bg-[#F5F5F3] hover:bg-[#E2E2E2] text-[#111111] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none border border-[#CCCCCC] transition-colors",
    denyButton:
      "bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none transition-colors",
  },
  buttonsStyling: false,
});

/**
 * Confirm deletion modal
 * @param {string} itemName Name of the item being deleted
 * @param {string} customText Optional custom warning text
 * @returns {Promise<boolean>} True if confirmed, false otherwise
 */
export async function confirmDelete(
  itemName = "this item",
  customText = "This action is permanent and cannot be reversed."
) {
  const result = await brandSwal.fire({
    title: "CONFIRM DELETION",
    html: `Are you sure you want to permanently delete <strong>"${itemName}"</strong>?<br/><span class="text-[11px] text-[#888888] mt-1 block">${customText}</span>`,
    icon: "warning",
    iconColor: "#DC2626",
    showCancelButton: true,
    confirmButtonText: "YES, DELETE",
    cancelButtonText: "CANCEL",
    reverseButtons: true,
    customClass: {
      popup: "font-sans border border-[#E2E2E2] rounded-none shadow-2xl",
      title: "font-editorial text-lg tracking-tight uppercase text-[#111111]",
      htmlContainer: "text-xs text-[#666666]",
      confirmButton:
        "bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none transition-colors",
      cancelButton:
        "bg-[#F5F5F3] hover:bg-[#E2E2E2] text-[#111111] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-none border border-[#CCCCCC] transition-colors",
    },
  });

  return result.isConfirmed;
}

/**
 * Confirm status change or action
 * @param {string} title Dialog title
 * @param {string} text Description or HTML
 * @param {string} confirmText Label for confirm button
 * @returns {Promise<boolean>}
 */
export async function confirmAction({
  title = "ARE YOU SURE?",
  text = "",
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  icon = "question",
}) {
  const result = await brandSwal.fire({
    title: title.toUpperCase(),
    html: text,
    icon,
    iconColor: "#111111",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });

  return result.isConfirmed;
}

/**
 * Show operation success modal
 * @param {string} title
 * @param {string} text
 * @param {number} timer Auto-close timer in ms
 */
export async function showSuccess(title = "SUCCESS", text = "", timer = 2200) {
  return await brandSwal.fire({
    title: title.toUpperCase(),
    text,
    icon: "success",
    iconColor: "#10B981",
    timer,
    showConfirmButton: timer ? false : true,
    confirmButtonText: "CLOSE",
  });
}

/**
 * Show operation error modal
 * @param {string} title
 * @param {string} text
 */
export async function showError(title = "ERROR OCCURRED", text = "An unexpected error occurred.") {
  return await brandSwal.fire({
    title: title.toUpperCase(),
    text,
    icon: "error",
    iconColor: "#DC2626",
    confirmButtonText: "UNDERSTOOD",
  });
}

/**
 * Small toast notification via SweetAlert2
 */
export const swalToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "font-sans border border-[#E2E2E2] rounded-none shadow-lg text-xs bg-white",
    title: "font-bold uppercase tracking-wider text-[11px] text-[#111111]",
  },
});

export default brandSwal;
