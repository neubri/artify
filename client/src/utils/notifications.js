import Swal from 'sweetalert2';

// Artsy-style notification configurations
const artsyTheme = {
  // Common styling
  customClass: {
    popup: 'artsy-modal',
    title: 'artsy-title',
    content: 'artsy-content',
    confirmButton: 'artsy-button artsy-button-primary',
    cancelButton: 'artsy-button artsy-button-secondary',
    closeButton: 'artsy-close'
  },
  buttonsStyling: false,
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster'
  }
};

// Success notification
export const showSuccess = (title, text, options = {}) => {
  return Swal.fire({
    ...artsyTheme,
    title,
    text,
    icon: 'success',
    iconColor: '#059669',
    confirmButtonText: options.confirmText || 'Continue',
    timer: options.timer || 2500,
    timerProgressBar: true,
    ...options
  });
};

// Error notification
export const showError = (title, text, options = {}) => {
  return Swal.fire({
    ...artsyTheme,
    title,
    text,
    icon: 'error',
    iconColor: '#DC2626',
    confirmButtonText: options.confirmText || 'Try Again',
    ...options
  });
};

// Warning notification
export const showWarning = (title, text, options = {}) => {
  return Swal.fire({
    ...artsyTheme,
    title,
    text,
    icon: 'warning',
    iconColor: '#D97706',
    confirmButtonText: options.confirmText || 'Understood',
    showCancelButton: options.showCancel || false,
    cancelButtonText: options.cancelText || 'Cancel',
    ...options
  });
};

// Info notification
export const showInfo = (title, text, options = {}) => {
  return Swal.fire({
    ...artsyTheme,
    title,
    text,
    icon: 'info',
    iconColor: '#2563EB',
    confirmButtonText: options.confirmText || 'Got it',
    showCancelButton: options.showCancel || false,
    cancelButtonText: options.cancelText || 'Cancel',
    ...options
  });
};

// Confirmation dialog
export const showConfirm = (title, text, options = {}) => {
  return Swal.fire({
    ...artsyTheme,
    title,
    text,
    icon: 'question',
    iconColor: '#6366F1',
    showCancelButton: true,
    confirmButtonText: options.confirmText || 'Yes, continue',
    cancelButtonText: options.cancelText || 'Cancel',
    reverseButtons: true,
    ...options
  });
};

// Toast notification (small, corner notification)
export const showToast = (title, type = 'info', options = {}) => {
  const iconColors = {
    success: '#059669',
    error: '#DC2626',
    warning: '#D97706',
    info: '#2563EB'
  };

  return Swal.fire({
    title,
    icon: type,
    iconColor: iconColors[type],
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: options.timer || 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'artsy-toast',
      title: 'artsy-toast-title'
    },
    showClass: {
      popup: 'animate__animated animate__slideInRight animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__slideOutRight animate__faster'
    },
    ...options
  });
};

// Loading notification
export const showLoading = (title = 'Loading...', text = '') => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    customClass: {
      popup: 'artsy-loading',
      title: 'artsy-loading-title'
    },
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close any open notification
export const close = () => {
  Swal.close();
};
