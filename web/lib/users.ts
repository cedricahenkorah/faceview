import axios from "axios";

const uri = process.env.NEXT_PUBLIC_SERVER_URL;

export async function CreateUser(data: any) {
  const path = "users";

  try {
    console.log("trying");
    const response = await axios.post(`${uri}/${path}/`, data);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
