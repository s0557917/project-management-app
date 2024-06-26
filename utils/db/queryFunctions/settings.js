export const getTheme = async () => {
  const res = await fetch(`/api/theme?email=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateTheme = async (updatedTheme) => {
  if (updateTheme && updateTheme !== "") {
    const res = await fetch(`/api/theme`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTheme),
    });
    return res.json();
  }
};

export const getDefaultView = async (email) => {
  const res = await fetch(`/api/defaultView?email=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateDefaultView = async (updatedDefaultView) => {
  const res = await fetch("/api/defaultView", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedDefaultView),
  });
  return res.json();
};

export const getFilters = async (email) => {
  const res = await fetch(`/api/filters?email=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateFilters = async (updatedFilters) => {
  if (updatedFilters && updatedFilters.length == 2) {
    const res = await fetch("/api/filters", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFilters),
    });
    return res.json();
  }
};

export const getSorting = async () => {
  const res = await fetch("/api/sorting", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateSorting = async (updatedSorting) => {
  if (updatedSorting && updatedSorting != "") {
    const res = await fetch("/api/sorting", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSorting),
    });
    return res.json();
  }
};

export const getUserSettings = async () => {
  const res = await fetch(`/api/settings`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const updateUserSettings = async (modifiedUserSettings) => {
  if (
    modifiedUserSettings &&
    modifiedUserSettings.theme &&
    modifiedUserSettings.filters &&
    modifiedUserSettings.defaultView
  ) {
    const res = await fetch(`/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modifiedUserSettings),
    });
    return res.json();
  }
};
