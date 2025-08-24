import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const groupId = params.id

    console.log("[v0] Restore request:", { groupId, userId })

    if (!groupId || !userId) {
      return NextResponse.json({ success: false, message: "GroupId e userId são obrigatórios" }, { status: 400 })
    }

    // Verificar se o grupo existe e pode ser restaurado
    const restorationsThisMonth = 2 // Simulado - buscar do banco
    const maxRestorations = 5

    if (restorationsThisMonth >= maxRestorations) {
      return NextResponse.json(
        {
          success: false,
          message: "Limite de restaurações atingido para este mês",
          restorationsUsed: restorationsThisMonth,
          maxRestorations,
        },
        { status: 400 },
      )
    }

    // Simular restauração
    const result = {
      success: true,
      groupId,
      newStreak: 1,
      fireLevel: "🟠 Laranja Iniciante",
      restorationsUsed: restorationsThisMonth + 1,
      maxRestorations,
      restoredBy: userId,
      restoredAt: new Date().toISOString(),
    }

    console.log("[v0] Restore successful:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Restore API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
