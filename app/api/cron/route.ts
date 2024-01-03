import { connectDB } from "@/lib/database/mongoose";

export const maxDuration = 10; // This function can run for a maximum of 10 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    connectDB();

    // return NextResponse.json({
    //   message: "Ok",
    //   data: updatedProducts,
    // });
  } catch (error: any) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}
