export const getUserSettings = async () => {
    const res = await fetch(`/api/settings`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
}

export const updateUserSettings = async (modifiedUserSettings) => {
    await fetch(`/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedUserSettings),
    })
}