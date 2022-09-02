export const getSearchResults = async (searchTerm) => {
  if(searchTerm.length > 0) {
    const res = await fetch(`${process.env.SEARCH_URL}/${searchTerm}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    console.log("RES", data);
    return await data;
  }
}