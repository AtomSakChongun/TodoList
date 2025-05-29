import Swal from 'sweetalert2'

// Custom CSS for orange cat theme
const catThemeCSS = `
  .swal2-popup {
    background-color: #fff9f5;
    border-radius: 16px;
    border: 2px solid #ff9d5c;
    padding: 2rem;
  }
  
  .swal2-title {
    color: #e67e22;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }
  
  .swal2-html-container {
    color: #e67e22;
  }
  
  .swal2-confirm {
    background-color: #ff9d5c !important;
    border-radius: 30px !important;
    box-shadow: 0 5px 10px rgba(255, 157, 92, 0.3) !important;
  }
  
  .swal2-cancel {
    background-color: #ffcdab !important;
    color: #e67e22 !important;
    border-radius: 30px !important;
  }
  
  .swal2-icon.swal2-success .swal2-success-ring {
    border-color: #ff9d5c;
  }
  
  .swal2-icon.swal2-success [class^=swal2-success-line] {
    background-color: #ff9d5c;
  }
  
  .swal2-icon.swal2-error [class^=swal2-x-mark-line] {
    background-color: #ff6b6b;
  }
  
  .swal2-icon.swal2-question {
    border-color: #ff9d5c;
    color: #ff9d5c;
  }
  
  .swal2-icon.swal2-warning {
    border-color: #ffb347;
    color: #ffb347;
  }
  
  .swal2-icon.swal2-info {
    border-color: #ff9d5c;
    color: #ff9d5c;
  }
  
  /* Cat ears on top of the modal */
  .swal2-popup:before, .swal2-popup:after {
    content: '';
    position: absolute;
    top: -20px;
    width: 40px;
    height: 40px;
    background-color: #ff9d5c;
    border-radius: 50% 50% 0 0;
  }
  
  .swal2-popup:before {
    left: 30px;
    transform: rotate(-15deg);
  }
  
  .swal2-popup:after {
    right: 30px;
    transform: rotate(15deg);
  }
`;

// Custom orange cat configurations for SweetAlert
const catThemeConfig = {
  customClass: {
    popup: 'cat-theme-popup'
  },
  backdrop: `rgba(255, 221, 196, 0.4)`,
  showClass: {
    popup: 'animate__animated animate__bounceIn'
  },
  hideClass: {
    popup: 'animate__animated animate__bounceOut'
  },
  allowOutsideClick: false,
  buttonsStyling: true
};

// Initialize the cat theme
const initCatTheme = () => {
  // Add the custom CSS to document
  const styleElement = document.createElement('style');
  styleElement.innerHTML = catThemeCSS;
  document.head.appendChild(styleElement);
  
  // Include animate.css for animations if not already in your project
  if (!document.querySelector('link[href*="animate.css"]')) {
    const animateCSS = document.createElement('link');
    animateCSS.rel = 'stylesheet';
    animateCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
    document.head.appendChild(animateCSS);
  }
};

// Success popup with orange cat theme
export const showSuccess = (message = "You clicked the button!") => {
  initCatTheme();
  
  return Swal.fire({
    ...catThemeConfig,
    title: "Complete!",
    text: message,
    icon: "success",
    iconColor: "#ff9d5c",
    confirmButtonText: "OK!"
  });
};

// Error popup with orange cat theme
export const showError = (error = "Something went wrong!") => {
  initCatTheme();
  
  return Swal.fire({
    ...catThemeConfig,
    title: "Error!",
    text: error,
    icon: "error",
    iconColor: "#ff6b6b",
    confirmButtonText: "Try Again"
  });
};

// Warning popup with orange cat theme
export const showWarning = (message = "Are you sure?") => {
  initCatTheme();
  
  return Swal.fire({
    ...catThemeConfig,
    title: "Paws for a moment",
    text: message,
    icon: "warning",
    iconColor: "#ffb347",
    showCancelButton: true,
    confirmButtonText: "Yes, proceed",
    cancelButtonText: "No, go back"
  });
};

// Info popup with orange cat theme
export const showInfo = (message) => {
  initCatTheme();
  
  return Swal.fire({
    ...catThemeConfig,
    title: "Fur Your Information",
    text: message,
    icon: "info",
    iconColor: "#ff9d5c"
  });
};