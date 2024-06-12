import prisma from "../../utils/prisma";

export default async function handler(req, res) {
  const { email } = req.query;
  if (req.method === "POST" && email) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (Object.prototype.toString.call(req.body) === "[object Array]") {
        const mappedTasks = req.body.map((task) => {
          return {
            id: task.id || undefined,
            ownerId: user.id,
            title: task.title,
            details: task.details || undefined,
            completed: task.completed || false,
            dueDate: task.dueDate || undefined,
            start: undefined,
            end: undefined,
            priority: task.priority || 1,
            category: task.category || undefined,
            reminders: undefined,
            subtasks: undefined,
          };
        });

        const tasks = await prisma.task.createMany({
          data: mappedTasks,
        });

        res.status(201).json(tasks);
      } else {
        const taskData = {
          owner: { connect: { email: email } },
          title: req.body.title,
          details: req.body.details || "",
          completed: req.body.completed || false,
          dueDate: req.body.dueDate || undefined,
          start: req.body.start || undefined,
          end: req.body.end || undefined,
          priority: req.body.priority,
          category:
            req.body.categoryId !== "" &&
            req.body.categoryId !== null &&
            req.body.categoryId !== undefined
              ? { connect: { id: req.body.categoryId } }
              : undefined,
          reminders: req.body.reminders || [],
          subtasks: req.body.subtasks || [],
        };

        const task = await prisma.task.create({
          data: taskData,
        });

        res.status(201).json(task);
      }
    } catch (e) {
      console.log("ERROR", e);
      res.status(500).json({ error: e });
    }
  } else if (req.method === "GET" && email) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          owner: { email: email },
        },
      });
      res.status(200).json(tasks);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `HTTP method ${req.method} not allowed!` });
  }
}
