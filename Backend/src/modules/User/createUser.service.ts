import { generateApiKey } from "../../data_generation/apiKeyGenerator";
import { createUser } from "./user.repo";
import { validateCreateUser } from "./user.validation";

async function createUserService(body: unknown) {
  const { name, email, password } = validateCreateUser(body);
  const key = generateApiKey();
  const user = await createUser(name, key, email, password);
  return user;
}

export default createUserService;
