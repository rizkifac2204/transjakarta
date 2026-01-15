import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const serviceTypes = await prisma.service_type.findMany();
    return NextResponse.json(serviceTypes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch service types" },
      { status: 500 }
    );
  }
}
