import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function GET(req: NextRequest) {
  const { CUSTOMER_ID, API_KEY, API_SECRET } = process.env;
  const method = "GET";
  if (!CUSTOMER_ID || !API_KEY || !API_SECRET) {
    return NextResponse.json(
      { error: "Credentials are missing" },
      { status: 500 }
    );
  }

  try {
    const api_url = "/keywordstool";
    const timestamp = new Date().valueOf().toString();

    // Check if hintKeywords exists in req.url
    const keyword: string = req.url.split("?")[1].split("=")[1];

    if (!keyword) {
      return NextResponse.json(
        { error: "hintKeywords is missing in the query" },
        { status: 400 }
      );
    }

    // Create the HMAC-SHA256 hash
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, API_SECRET);
    hmac.update(timestamp + "." + method + "." + api_url);
    const hash = hmac.finalize();

    const requestOptions = {
      headers: {
        "X-Timestamp": timestamp,
        "X-API-KEY": API_KEY,
        "X-API-SECRET": API_SECRET,
        "X-CUSTOMER": CUSTOMER_ID,
        "X-Signature": hash.toString(CryptoJS.enc.Base64),
      },
    };

    const response = await fetch(
      `https://api.naver.com/keywordstool?hintKeywords=${keyword}&showDetail=1`,
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
