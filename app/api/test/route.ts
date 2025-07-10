import { NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { getChatsByUserId } from "@/db/queries";

export async function GET() {
  try {
    // Test authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ 
        status: "error", 
        message: "Not authenticated",
        timestamp: new Date().toISOString()
      });
    }

    // Test database connection
    const chats = await getChatsByUserId({ id: session.user.id! });
    
    return NextResponse.json({
      status: "success",
      message: "All systems operational",
      user: {
        id: session.user.id,
        email: session.user.email
      },
      chatCount: chats.length,
      timestamp: new Date().toISOString(),
      environment: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        hasAuthSecret: !!process.env.AUTH_SECRET
      }
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}