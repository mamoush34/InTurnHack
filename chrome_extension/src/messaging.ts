export async function messageActiveTab(message: any) {
    const tabParameters = { active: true, currentWindow: true };
    return new Promise<any>(resolve => {
        chrome.tabs.query(tabParameters, tabs => {
            const target = tabs[0].id!;
            chrome.tabs.sendMessage(target, message, resolve);
        });
    });
} 