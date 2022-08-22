export const prismaGetAllCategories = async (userEmail) => {
    const categories = await prisma.category.findMany({
        where: {
            owner: { email: userEmail },
        },
    });

    return categories;
}

export const getAllCategories = async () => {
    const res = await fetch(`/api/categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
}

export const addNewCategory = async (newCategory) => {
    const res = await fetch(`/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
    });
    return res.json();
}

export const updateCategory = async (modifiedCategory) => {
    const res = await fetch(`/api/categories/${modifiedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedCategory),
    });

    return res.json(); 
}