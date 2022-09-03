export const getSearchResults = async (searchTerm) => {
  if(searchTerm.length > 0) {
    const res = await fetch(`${process.env.SEARCH_URL}/${searchTerm}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    return res.json();
  }
}