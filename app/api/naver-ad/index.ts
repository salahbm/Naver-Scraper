import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { CUSTOMER_ID, ACCESS_LICENSE, SECRET_KEY } = process.env;
  if (!CUSTOMER_ID && !ACCESS_LICENSE && !SECRET_KEY) return;

  try {
    const api_url = "/keywordstool";
    const timestamp = Date.now().toString();

    const keyword = req.query.hintKeywords as string;

    const requestOptions = {
      method: "GET",
      headers: {
        "X-Timestamp": timestamp || "",
        "X-API-KEY": ACCESS_LICENSE || "",
        "X-API-SECRET": SECRET_KEY || "",
        "X-CUSTOMER": CUSTOMER_ID || "",
      },
    };

    const response = await fetch(
      `https://api.naver.com${api_url}?hintKeywords=${encodeURIComponent(
        keyword
      )}&showDetail=1`,
      requestOptions
    );

    if (response.ok) {
      const data = await response.json();
      res
        .status(200)
        .json({ message: `API Response: ${JSON.stringify(data)}` });
    } else {
      console.error("Error:", response.status);
      res.status(response.status).end();
    }
  } catch (error) {
    console.error("Naver Search Ad API request error:", error);

    if (error instanceof Error) {
      // Handle specific error types if needed
      res
        .status(500)
        .json({ message: `Internal Server Error: ${error.message}` });
    } else {
      // Something went wrong on the client or network
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
