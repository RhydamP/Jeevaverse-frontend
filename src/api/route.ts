import { NextResponse } from "next/server";
import { listRegions } from "@lib/data/regions";

export async function GET() {
  try {
    const regions = await listRegions();
    return NextResponse.json(regions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch regions" }, { status: 500 });
  }
}
