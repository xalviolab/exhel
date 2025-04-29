import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const data = await request.json()

    const { error } = await supabase.from("feedback").insert({
      user_id: data.userId,
      title: data.title,
      description: data.description,
      satisfaction_level: data.satisfactionLevel,
      feedback_type: data.feedbackType,
      screenshot_url: data.screenshotUrl || null,
      status: "new",
    })

    if (error) {
      console.error("Feedback insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
