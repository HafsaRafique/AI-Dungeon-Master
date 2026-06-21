import axios from "axios";

export async function forgeWorld(input: string, world: any) {
  const response = await axios.post("http://127.0.0.1:8000/forge", {
    input,
    world,
  });

  return response.data;
}
