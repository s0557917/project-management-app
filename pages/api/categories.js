import prisma from "../../utils/prisma";

export default async function handler(req, res) {
  const { email } = req.query;
  if (req.method === "POST" && email) {
    try {
      const categoryData = {
        owner: { connect: { email: email } },
        name: req.body.name,
        color: req.body.color,
        active: true,
      };

      const categories = await prisma.category.create({
        data: categoryData,
      });

      res.status(201).json(categories);
    } catch (e) {
      console.log("ERROR", e);
      res.status(500).json({ error: e });
    }
  } else if (req.method === "GET" && email) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          owner: { email: email },
        },
      });
      res.status(201).json(categories);
    } catch (e) {
      console.log("ERROR", e);
      res.status(500).json({ error: e });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ message: `HTTP method ${req.method} not allowed!` });
  }
}
