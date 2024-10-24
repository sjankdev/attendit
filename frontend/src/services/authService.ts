export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const getUserRoles = async (): Promise<string[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/user/roles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch roles:", response.statusText);
    return [];
  }

  const data = await response.json();
  console.log("Fetched roles:", data.roles);
  return data.roles || [];
};
