export function getAuthUser() {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    userId: localStorage.getItem("userId"),
    name: localStorage.getItem("name") || "User"
  };
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

export function logout(navigate) {
  localStorage.clear();
  navigate("/");
}
