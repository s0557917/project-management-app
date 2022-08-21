export const fetchCategories = async () => {

}

export const updateCategory = async (categoryId, modifiedCategory) => {
    const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedCategory),
    });

    return res.json(); 
}