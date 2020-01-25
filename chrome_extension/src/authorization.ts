export async function getToken(): Promise<string> {
    return new Promise<string>(resolve => chrome.identity.getAuthToken({ interactive: true }, resolve));
}

export async function logout(token: string): Promise<void> {
    if (!token) {
        alert("Already logged out!");
        return;
    } 
    window.fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
    return new Promise<void>(resolve => chrome.identity.removeCachedAuthToken({ token }, resolve));
}