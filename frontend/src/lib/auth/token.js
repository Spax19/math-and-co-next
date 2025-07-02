// Secure token storage with checks
export function setToken(token) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Failed to store token:", error);
    }
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("token") || null;
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  }
}
