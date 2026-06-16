// Validation utility functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateAnswer = (answer) => {
  const minLength = 10;
  const maxLength = 500;

  if (!answer || answer.trim().length === 0) {
    return { valid: false, message: "Answer cannot be empty" };
  }

  if (answer.trim().length < minLength) {
    return {
      valid: false,
      message: `Answer must be at least ${minLength} characters`,
    };
  }

  if (answer.length > maxLength) {
    return {
      valid: false,
      message: `Answer cannot exceed ${maxLength} characters`,
    };
  }

  return { valid: true, message: "" };
};

export const validatePDF = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    return { valid: false, message: "No file selected" };
  }

  if (file.type !== "application/pdf") {
    return { valid: false, message: "Only PDF files are supported" };
  }

  if (file.size > maxSize) {
    return { valid: false, message: "File size must be less than 5MB" };
  }

  return { valid: true, message: "" };
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required && (!value || value.trim() === "")) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }

    if (rule.type === "email" && value && !validateEmail(value)) {
      errors[field] = "Invalid email address";
      return;
    }

    if (rule.type === "password" && value && !validatePassword(value)) {
      errors[field] = `${rule.label || field} must be at least 6 characters`;
      return;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] =
        `${rule.label || field} must be at least ${rule.minLength} characters`;
      return;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] =
        `${rule.label || field} cannot exceed ${rule.maxLength} characters`;
      return;
    }

    if (rule.match && value !== formData[rule.match]) {
      errors[field] = `${rule.label || field} does not match`;
      return;
    }
  });

  return errors;
};
