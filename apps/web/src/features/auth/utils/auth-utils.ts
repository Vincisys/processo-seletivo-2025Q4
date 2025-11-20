export const authUtils = {
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("tokenExpiration");

    if (!token || !expiration) {
      return false;
    }

    const expirationTime = parseInt(expiration, 10);
    const now = Date.now();

    if (now >= expirationTime) {
      authUtils.logout();
      return false;
    }

    return true;
  },

  saveToken(token: string, expiresIn?: number): void {
    localStorage.setItem("token", token);

    if (expiresIn) {
      const expirationTime = Date.now() + expiresIn * 1000;
      localStorage.setItem("tokenExpiration", expirationTime.toString());
    } else {
      const defaultExpiration = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("tokenExpiration", defaultExpiration.toString());
    }
  },
};
