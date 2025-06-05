// For role checking (optional)
export function hasRole(user, requiredRole) {
  return user?.roles?.includes(requiredRole);
}

export function isAdmin(user) {
  return hasRole(user, 'admin');
}