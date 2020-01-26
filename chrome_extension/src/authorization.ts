async function getToken(): Promise<string> {
    return new Promise<string>(resolve => chrome.identity.getAuthToken({ interactive: true }, resolve));
}

export async function logout(): Promise<void> {
    const token = await getToken();
    if (!token) {
        alert("Already logged out!");
        return;
    } 
    const response = await window.fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
    console.log(await response.text());
    return new Promise<void>(resolve => chrome.identity.removeCachedAuthToken({ token }, resolve));
}

export interface UserInfo {
    id: string;
    email: string;
    verified_email: boolean;
    picture: string;
    hd: string;
}

export async function getUserInfo() {    
    var x = new XMLHttpRequest();
    x.open('GET', `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${await getToken()}`);
    return new Promise<UserInfo>(resolve => {
        x.onload = () => resolve(JSON.parse(x.response));
        x.send();
    });
}