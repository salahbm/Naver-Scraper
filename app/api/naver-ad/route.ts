import { createHmac } from "crypto";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { CUSTOMER_ID, ACCESS_LICENSE, SECRET_KEY } = process.env;

  if (!CUSTOMER_ID || !ACCESS_LICENSE || !SECRET_KEY) {
    return NextResponse.json(
      { error: "Credentials are missing" },
      { status: 500 }
    );
  }

  try {
    const api_url = "/keywordstool";
    const timestamp = Date.now().toString();

    // Check if hintKeywords exists in req.query
    const keyword: string = req.url.split("?")[1].split("=")[1];

    if (!keyword) {
      return NextResponse.json(
        { error: "hintKeywords is missing in the query" },
        { status: 400 }
      );
    }

    // Create the HMAC-SHA256 hash
    const hmac = createHmac("sha256", SECRET_KEY);
    hmac.update(`${timestamp}.${api_url}.${keyword}`);
    console.log("Timestamp:", timestamp);
    console.log("API URL:", api_url);
    console.log("Keyword:", keyword);
    console.log("Generated Signature:", hmac.digest("base64"));

    const requestOptions = {
      headers: {
        "X-Timestamp": timestamp,
        "X-API-KEY": ACCESS_LICENSE,
        "X-API-SECRET": SECRET_KEY,
        "X-CUSTOMER": CUSTOMER_ID,
        "X-Signature": hmac.digest("base64"),
      },
    };

    const response = await fetch(
      `https://api.naver.com/${api_url}?hintKeywords=${keyword}&showDetail=1`,
      requestOptions
    );

    if (response.ok) {
      const data = await response.json();

      return NextResponse.json({
        message: "Api Response: ",
        data: JSON.stringify(data),
      });
    } else {
      console.error("Response from API:", response.status);

      return NextResponse.json({ error: "Error" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Naver Search Ad API request error:", error.message);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Internal Server Error: ${error.message}` },
        { status: 500 }
      );
    }

    // If the error is not an instance of Error, return a generic error response
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
