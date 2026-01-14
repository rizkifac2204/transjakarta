import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(
    `${process.env.HOST}/api/publik/laporan/akses-informasi-publik`
  );
}
