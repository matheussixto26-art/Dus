"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Flame, Users, Calendar, RotateCcw, TrendingUp, Settings, RefreshCw, Eye, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface GroupData {
  id: string
  name: string
  streak: number
  level: string
  activeUsers: number
  totalUsers: number
  status: "active" | "at_risk"
  lastActivity: string
  restorationsUsed: number
  maxRestorations: number
}

interface StatsData {
  totalGroups: number
  activeGroups: number
  atRiskGroups: number
  maxStreak: number
  totalRestorations: number
}

export default function Dashboard() {
  const [groups, setGroups] = useState<GroupData[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchGroupsData()
  }, [])

  const fetchGroupsData = async () => {
    try {
      console.log("[v0] Loading static data...")
      setLoading(true)

      // Simular delay de carregamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const staticData = {
        groups: [
          {
            id: "group_1",
            name: "Amigos da Escola",
            streak: 15,
            level: "Fogo Azul",
            activeUsers: 8,
            totalUsers: 12,
            status: "active" as const,
            lastActivity: "2024-01-15T10:30:00Z",
            restorationsUsed: 1,
            maxRestorations: 5,
          },
          {
            id: "group_2",
            name: "Família Silva",
            streak: 3,
            level: "Fogo Laranja",
            activeUsers: 1,
            totalUsers: 6,
            status: "at_risk" as const,
            lastActivity: "2024-01-14T15:45:00Z",
            restorationsUsed: 0,
            maxRestorations: 5,
          },
          {
            id: "group_3",
            name: "Trabalho Dev Team",
            streak: 42,
            level: "Fogo Roxo",
            activeUsers: 15,
            totalUsers: 18,
            status: "active" as const,
            lastActivity: "2024-01-15T09:15:00Z",
            restorationsUsed: 2,
            maxRestorations: 5,
          },
        ],
        stats: {
          totalGroups: 3,
          activeGroups: 2,
          atRiskGroups: 1,
          maxStreak: 42,
          totalRestorations: 3,
        },
      }

      setGroups(staticData.groups)
      setStats(staticData.stats)

      console.log("[v0] Static data loaded successfully")
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({
        title: "Erro",
        description: `Não foi possível carregar os dados: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreFire = async (groupId: string) => {
    try {
      setRestoring(groupId)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Encontrar o grupo e simular restauração
      const updatedGroups = groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            status: "active" as const,
            restorationsUsed: group.restorationsUsed + 1,
            activeUsers: Math.max(2, group.activeUsers),
          }
        }
        return group
      })

      setGroups(updatedGroups)

      toast({
        title: "Fogo Restaurado!",
        description: `O foguinho do grupo foi reaceso com sucesso!`,
      })
    } catch (error) {
      console.error("[v0] Error restoring fire:", error)
      toast({
        title: "Erro",
        description: "Não foi possível restaurar o foguinho",
        variant: "destructive",
      })
    } finally {
      setRestoring(null)
    }
  }

  const getFireLevelColor = (level: string) => {
    if (level.includes("purple") || level.includes("roxo")) return "bg-purple-100 text-purple-600"
    if (level.includes("green") || level.includes("verde")) return "bg-green-100 text-green-600"
    if (level.includes("blue") || level.includes("azul")) return "bg-blue-100 text-blue-600"
    if (level.includes("yellow") || level.includes("amarelo")) return "bg-yellow-100 text-yellow-600"
    return "bg-orange-100 text-orange-600"
  }

  const getFireLevelBadge = (level: string) => {
    if (level.includes("purple") || level.includes("roxo")) return "secondary"
    return "outline"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Carregando dados do foguinho...</span>
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
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Foguinho WhatsApp</h1>
                <p className="text-sm text-muted-foreground">Sistema de Streak para Grupos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchGroupsData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Grupo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Grupo</DialogTitle>
                    <DialogDescription>Configure um novo grupo para o sistema de foguinho</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="groupId">ID do Grupo WhatsApp</Label>
                      <Input id="groupId" placeholder="Ex: 120363123456789@g.us" />
                    </div>
                    <div>
                      <Label htmlFor="groupName">Nome do Grupo</Label>
                      <Input id="groupName" placeholder="Ex: Amigos da Escola" />
                    </div>
                    <Button className="w-full">Adicionar Grupo</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grupos Ativos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.activeGroups || 0}</div>
              <p className="text-xs text-muted-foreground">de {stats?.totalGroups || 0} grupos</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak Máximo</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats?.maxStreak || 0}</div>
              <p className="text-xs text-muted-foreground">dias consecutivos</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fogos Ativos</CardTitle>
              <Flame className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats?.activeGroups || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalGroups ? Math.round(((stats.activeGroups || 0) / stats.totalGroups) * 100) : 0}% dos grupos
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Restaurações Hoje</CardTitle>
              <RotateCcw className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats?.totalRestorations || 0}</div>
              <p className="text-xs text-muted-foreground">este mês</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Grupos com Fogo Ativo
              </CardTitle>
              <CardDescription>Grupos que mantiveram o streak hoje</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groups
                .filter((group) => group.status === "active")
                .map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getFireLevelColor(group.level)}`}>
                        <Flame className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {group.activeUsers}/{group.totalUsers} usuários ativos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <Badge variant={getFireLevelBadge(group.level)} className="mb-1">
                          {group.level.split(" ")[1] || group.level}
                        </Badge>
                        <p className="text-sm font-bold">{group.streak} dias</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedGroup(group)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{group.name}</DialogTitle>
                            <DialogDescription>Detalhes do grupo e controles</DialogDescription>
                          </DialogHeader>
                          {selectedGroup && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Streak Atual</Label>
                                  <p className="text-2xl font-bold text-primary">{selectedGroup.streak} dias</p>
                                </div>
                                <div>
                                  <Label>Nível do Fogo</Label>
                                  <Badge variant={getFireLevelBadge(selectedGroup.level)}>{selectedGroup.level}</Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Usuários Ativos</Label>
                                  <p className="text-lg font-semibold">
                                    {selectedGroup.activeUsers}/{selectedGroup.totalUsers}
                                  </p>
                                </div>
                                <div>
                                  <Label>Restaurações Usadas</Label>
                                  <p className="text-lg font-semibold">
                                    {selectedGroup.restorationsUsed}/{selectedGroup.maxRestorations}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Grupos em Risco
              </CardTitle>
              <CardDescription>Grupos que podem perder o streak hoje</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groups
                .filter((group) => group.status === "at_risk")
                .map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                        <Flame className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-destructive">
                          Precisa de {2 - group.activeUsers} usuário{2 - group.activeUsers > 1 ? "s" : ""} ativo
                          {2 - group.activeUsers > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1 border-destructive/30">
                          {group.level.split(" ")[1] || group.level}
                        </Badge>
                        <p className="text-sm font-bold text-destructive">{group.streak} dias</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreFire(group.id)}
                        disabled={restoring === group.id || group.restorationsUsed >= group.maxRestorations}
                      >
                        {restoring === group.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              {groups.filter((group) => group.status === "at_risk").length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Flame className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum grupo em risco no momento!</p>
                  <p className="text-sm">Todos os fogos estão bem mantidos 🔥</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
