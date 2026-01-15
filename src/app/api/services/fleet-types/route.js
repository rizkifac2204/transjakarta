import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const fleetTypes = await prisma.fleet_type.findMany();
    return NextResponse.json(fleetTypes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch fleet types" },
      { status: 500 }
    );
  }
}
