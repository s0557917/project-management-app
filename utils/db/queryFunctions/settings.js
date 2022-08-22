export const getUserSettings = async () => {
    const res = await fetch(`/api/settings`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
}

export const updateUserSettings = async (modifiedUserSettings) => {
    if(modifiedUserSettings && modifiedUserSettings.theme && modifiedUserSettings.filters && modifiedUserSettings.defaultView) {
        const res = await fetch(`/api/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedUserSettings),
        })
        return res.json();
    }
}