"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Trophy, Star, Crown, Zap, Target, Calendar, RotateCcw, Award, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface FireLevel {
  id: string
  name: string
  color: string
  icon: string
  minStreak: number
  maxStreak?: number
  description: string
  rewards: string[]
  bgColor: string
  textColor: string
}

interface GroupProgress {
  groupId: string
  groupName: string
  currentStreak: number
  currentLevel: FireLevel
  nextLevel?: FireLevel
  progressToNext: number
  achievements: string[]
  levelHistory: Array<{
    level: string
    achievedAt: string
    streak: number
  }>
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlocked: boolean
  unlockedAt?: string
}

export default function LevelsPage() {
  const [groups, setGroups] = useState<GroupProgress[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  const firelevels: FireLevel[] = [
    {
      id: "orange",
      name: "Laranja Iniciante",
      color: "orange",
      icon: "🟠",
      minStreak: 1,
      maxStreak: 6,
      description: "Primeiros passos no mundo do foguinho",
      rewards: ["Acesso aos comandos básicos"],
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
    },
    {
      id: "yellow",
      name: "Amarelo Comum",
      color: "yellow",
      icon: "🟡",
      minStreak: 7,
      maxStreak: 14,
      description: "Consistência está começando a aparecer",
      rewards: ["Comando !ranking desbloqueado", "Estatísticas básicas"],
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      id: "blue",
      name: "Azul Raro",
      color: "blue",
      icon: "🔵",
      minStreak: 15,
      maxStreak: 29,
      description: "Grupo dedicado com boa disciplina",
      rewards: ["Histórico detalhado", "Notificações personalizadas"],
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      id: "green",
      name: "Verde Épico",
      color: "green",
      icon: "🟢",
      minStreak: 30,
      maxStreak: 49,
      description: "Excelência em manter o foguinho aceso",
      rewards: ["Comandos avançados", "Estatísticas premium", "Badge especial"],
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      id: "purple",
      name: "Roxo Lendário",
      color: "purple",
      icon: "🟣",
      minStreak: 50,
      description: "O nível máximo de dedicação ao foguinho",
      rewards: ["Status lendário", "Todos os recursos", "Reconhecimento especial"],
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
    },
  ]

  useEffect(() => {
    fetchLevelsData()
  }, [])

  const fetchLevelsData = async () => {
    try {
      setLoading(true)

      // Simulate groups progress data
      const mockGroups: GroupProgress[] = [
        {
          groupId: "group_1",
          groupName: "Amigos da Escola",
          currentStreak: 47,
          currentLevel: firelevels[3], // Verde
          nextLevel: firelevels[4], // Roxo
          progressToNext: 94, // (47-30)/(50-30) * 100
          achievements: ["first_week", "month_master", "epic_streak"],
          levelHistory: [
            { level: "Verde Épico", achievedAt: "2024-01-15", streak: 30 },
            { level: "Azul Raro", achievedAt: "2024-01-01", streak: 15 },
            { level: "Amarelo Comum", achievedAt: "2023-12-25", streak: 7 },
          ],
        },
        {
          groupId: "group_2",
          groupName: "Família Silva",
          currentStreak: 23,
          currentLevel: firelevels[2], // Azul
          nextLevel: firelevels[3], // Verde
          progressToNext: 53, // (23-15)/(30-15) * 100
          achievements: ["first_week", "consistency_king"],
          levelHistory: [
            { level: "Azul Raro", achievedAt: "2024-01-10", streak: 15 },
            { level: "Amarelo Comum", achievedAt: "2023-12-28", streak: 7 },
          ],
        },
      ]

      const mockAchievements: Achievement[] = [
        {
          id: "first_week",
          name: "Primeira Semana",
          description: "Mantenha o fogo por 7 dias consecutivos",
          icon: "🔥",
          rarity: "common",
          unlocked: true,
          unlockedAt: "2023-12-25",
        },
        {
          id: "month_master",
          name: "Mestre do Mês",
          description: "Mantenha o fogo por 30 dias consecutivos",
          icon: "👑",
          rarity: "epic",
          unlocked: true,
          unlockedAt: "2024-01-15",
        },
        {
          id: "epic_streak",
          name: "Sequência Épica",
          description: "Alcance 45 dias de streak",
          icon: "⚡",
          rarity: "legendary",
          unlocked: true,
          unlockedAt: "2024-01-20",
        },
        {
          id: "legendary_fire",
          name: "Fogo Lendário",
          description: "Alcance o nível Roxo Lendário",
          icon: "🏆",
          rarity: "legendary",
          unlocked: false,
        },
      ]

      setGroups(mockGroups)
      setAchievements(mockAchievements)
    } catch (error) {
      console.error("[v0] Error fetching levels data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Carregando sistema de níveis...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sistema de Níveis</h1>
                <p className="text-sm text-muted-foreground">Progressão e conquistas do foguinho</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchLevelsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="levels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="levels">Níveis do Fogo</TabsTrigger>
            <TabsTrigger value="progress">Progresso dos Grupos</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Todos os Níveis do Foguinho
                </CardTitle>
                <CardDescription>Sistema completo de progressão baseado em dias consecutivos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {firelevels.map((level, index) => (
                    <Card key={level.id} className={`border-2 ${level.bgColor} border-opacity-50`}>
                      <CardHeader className="text-center">
                        <div className="text-4xl mb-2">{level.icon}</div>
                        <CardTitle className={`text-lg ${level.textColor}`}>{level.name}</CardTitle>
                        <CardDescription className="font-medium">
                          {level.maxStreak
                            ? `${level.minStreak} - ${level.maxStreak} dias`
                            : `${level.minStreak}+ dias`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground text-center">{level.description}</p>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Recompensas:</h4>
                          <ul className="text-xs space-y-1">
                            {level.rewards.map((reward, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {reward}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {groups.map((group) => (
              <Card key={group.groupId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${group.currentLevel.bgColor}`}>
                          <span className="text-lg">{group.currentLevel.icon}</span>
                        </div>
                        {group.groupName}
                      </CardTitle>
                      <CardDescription>
                        Nível atual: {group.currentLevel.name} • {group.currentStreak} dias de streak
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {group.currentStreak} 🔥
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {group.nextLevel && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso para {group.nextLevel.name}</span>
                        <span>{group.progressToNext}%</span>
                      </div>
                      <Progress value={group.progressToNext} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Faltam {group.nextLevel.minStreak - group.currentStreak} dias para o próximo nível
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Histórico de Níveis
                      </h4>
                      <div className="space-y-2">
                        {group.levelHistory.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div>
                              <p className="font-medium text-sm">{entry.level}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(entry.achievedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">{entry.streak} dias</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Conquistas Desbloqueadas
                      </h4>
                      <div className="space-y-2">
                        {group.achievements.map((achievementId) => {
                          const achievement = achievements.find((a) => a.id === achievementId)
                          if (!achievement) return null

                          return (
                            <div key={achievementId} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <span className="text-lg">{achievement.icon}</span>
                              <div>
                                <p className="font-medium text-sm">{achievement.name}</p>
                                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Sistema de Conquistas
                </CardTitle>
                <CardDescription>Desbloqueie conquistas especiais mantendo o foguinho ativo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`border-2 ${
                        achievement.unlocked
                          ? getRarityColor(achievement.rarity)
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <CardHeader className="text-center pb-3">
                        <div className="text-3xl mb-2">{achievement.unlocked ? achievement.icon : "🔒"}</div>
                        <CardTitle className="text-base">{achievement.name}</CardTitle>
                        <Badge variant={achievement.unlocked ? "default" : "secondary"} className="capitalize">
                          {achievement.rarity}
                        </Badge>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-center text-muted-foreground mb-3">{achievement.description}</p>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <p className="text-xs text-center text-green-600 font-medium">
                            Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                        {!achievement.unlocked && (
                          <p className="text-xs text-center text-muted-foreground">Ainda não desbloqueado</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Sistema de Restaurações
                </CardTitle>
                <CardDescription>Cada grupo tem direito a 5 restaurações por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Como Funciona:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 mt-0.5 text-primary" />
                        Cada grupo pode restaurar o fogo até 5 vezes por mês
                      </li>
                      <li className="flex items-start gap-2">
                        <Zap className="h-4 w-4 mt-0.5 text-primary" />
                        Restauração reinicia o streak em 1 dia
                      </li>
                      <li className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-primary" />
                        Contador reseta todo dia 1º do mês
                      </li>
                      <li className="flex items-start gap-2">
                        <Crown className="h-4 w-4 mt-0.5 text-primary" />
                        Use com sabedoria para manter streaks longos
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Uso Este Mês:</h4>
                    {groups.map((group) => (
                      <div key={group.groupId} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <span className="font-medium">{group.groupName}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(2 / 5) * 100} className="w-16 h-2" />
                          <span className="text-sm text-muted-foreground">2/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
