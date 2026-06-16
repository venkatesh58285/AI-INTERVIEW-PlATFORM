// Error handling utility functions
export const getErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};

export const handleApiError = (error) => {
  const status = error?.response?.status;
  const message = getErrorMessage(error);

  const errorInfo = {
    status,
    message,
    type: "error",
  };

  switch (status) {
    case 400:
      errorInfo.type = "validation";
      break;
    case 401:
      errorInfo.type = "unauthorized";
      errorInfo.message = "Your session has expired. Please login again.";
      break;
    case 403:
      errorInfo.type = "forbidden";
      errorInfo.message = "You do not have permission to perform this action.";
      break;
    case 404:
      errorInfo.type = "not-found";
      errorInfo.message = "The requested resource was not found.";
      break;
    case 500:
      errorInfo.type = "server";
      errorInfo.message = "Server error. Please try again later.";
      break;
    case 503:
      errorInfo.type = "unavailable";
      errorInfo.message =
        "Service temporarily unavailable. Please try again later.";
      break;
    default:
      break;
  }

  return errorInfo;
};

export const logError = (error, context = "") => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    ...handleApiError(error),
  };

  console.error("[Error Log]", errorInfo);

  // Here you could send to error tracking service
  // Sentry.captureException(error, { contexts: { errorInfo } });

  return errorInfo;
};

export const createErrorBoundary = (error) => {
  return {
    hasError: true,
    error: getErrorMessage(error),
    retry: true,
  };
};
