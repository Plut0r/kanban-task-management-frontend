import { NextApiRequest, NextApiResponse } from "next";
import axiosInstance from "@/http/axiosInstance";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password } = req.body;

    try {
      const { data } = await axiosInstance.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      res.status(200).json(data);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Registration failed", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
