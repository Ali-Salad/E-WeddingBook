import { NextRequest, NextResponse } from "next/server";
import {
  clearCuratorCookie,
  curatorAuthed,
  passphraseMatches,
  setCuratorCookie,
} from "@/lib/auth";

export async function GET() {
  const authenticated = await curatorAuthed();
  return NextResponse.json({ authenticated });
}

export async function POST(request: NextRequest) {
  try {
    const { passphrase } = await request.json();
    if (!passphrase || !passphraseMatches(String(passphrase))) {
      return NextResponse.json(
        { error: "Incorrect curator passphrase." },
        { status: 401 },
      );
    }

    await setCuratorCookie();
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  await clearCuratorCookie();
  return NextResponse.json({ authenticated: false });
}
