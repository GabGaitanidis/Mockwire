import { db } from "../../db/index";
import { projects } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export const createProject = async (data: {
  user_id: number;
  name: string;
}) => {
  const [project] = await db.insert(projects).values(data).returning();
  return project;
};

export const getProjects = async (user_id: number) => {
  return db.select().from(projects).where(eq(projects.user_id, user_id));
};

export const getProjectById = async (user_id: number, id: number) => {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.user_id, user_id), eq(projects.id, id)));
  return project;
};

export const updateProject = async (
  user_id: number,
  id: number,
  data: { name?: string },
) => {
  const [project] = await db
    .update(projects)
    .set(data)
    .where(and(eq(projects.user_id, user_id), eq(projects.id, id)))
    .returning();
  return project;
};

export const deleteProject = async (user_id: number, id: number) => {
  const [project] = await db
    .delete(projects)
    .where(and(eq(projects.user_id, user_id), eq(projects.id, id)))
    .returning();
  return project;
};
