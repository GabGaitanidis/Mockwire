import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { conditionSetsTable, projects } from "../../db/schema";

export type ConditionBranch = {
  if: Record<string, string>;
  then: Record<string, unknown>;
};

export type ConditionSetInput = {
  name: string;
  description?: string;
  conditions: ConditionBranch[];
};

export type ConditionSetUpdateInput = Partial<ConditionSetInput>;

export async function createConditionSet(
  userId: number,
  projectId: number,
  data: ConditionSetInput,
) {
  const [conditionSet] = await db
    .insert(conditionSetsTable)
    .values({
      user_id: userId,
      project_id: projectId,
      name: data.name,
      description: data.description,
      conditions: data.conditions,
    })
    .returning();

  return conditionSet;
}

export async function getConditionSets(userId: number, projectId: number) {
  return db
    .select()
    .from(conditionSetsTable)
    .where(
      and(
        eq(conditionSetsTable.user_id, userId),
        eq(conditionSetsTable.project_id, projectId),
      ),
    );
}

export async function getConditionSetById(
  userId: number,
  projectId: number,
  id: number,
) {
  const [conditionSet] = await db
    .select()
    .from(conditionSetsTable)
    .where(
      and(
        eq(conditionSetsTable.user_id, userId),
        eq(conditionSetsTable.project_id, projectId),
        eq(conditionSetsTable.id, id),
      ),
    );

  return conditionSet;
}

export async function updateConditionSet(
  userId: number,
  projectId: number,
  id: number,
  data: ConditionSetUpdateInput,
) {
  const [conditionSet] = await db
    .update(conditionSetsTable)
    .set(data)
    .where(
      and(
        eq(conditionSetsTable.user_id, userId),
        eq(conditionSetsTable.project_id, projectId),
        eq(conditionSetsTable.id, id),
      ),
    )
    .returning();

  return conditionSet;
}

export async function deleteConditionSet(
  userId: number,
  projectId: number,
  id: number,
) {
  const [conditionSet] = await db
    .delete(conditionSetsTable)
    .where(
      and(
        eq(conditionSetsTable.user_id, userId),
        eq(conditionSetsTable.project_id, projectId),
        eq(conditionSetsTable.id, id),
      ),
    )
    .returning();

  return conditionSet;
}

export async function projectExists(userId: number, projectId: number) {
  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.user_id, userId), eq(projects.id, projectId)));

  return Boolean(project);
}
