import prisma from "../../utils/prisma";

export default async function handler(req, res) {
  const { email } = req.query;
  if (req.method === "PUT" && email) {
    try {
      const settings = await prisma.user.update({
        where: { email: email },
        data: {
          name: undefined,
          email: undefined,
          email_verified: undefined,
          password: undefined,
          image: undefined,
          settings: undefined,
          defaultView: req.body,
        },
      });

      res.status(201).json(settings);
    } catch (e) {
      console.log("ERROR", e);
      res.status(500).json({ error: e });
    }
  } else if (req.method === "GET" && email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      res.status(200).json(user.defaultView);
    } catch (e) {
      console.log("ERROR", e);
      res.status(500).json({ error: e });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ message: `HTTP method ${req.method} not allowed!` });
  }
}
