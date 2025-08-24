"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Webhook, Copy, CheckCircle, Clock, Activity, Settings, RefreshCw, Eye, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface WebhookLog {
  id: string
  timestamp: string
  method: string
  endpoint: string
  status: number
  responseTime: number
  groupId?: string
  userId?: string
  command?: string
  error?: string
}

interface WebhookStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  lastRequest: string
}

export default function WebhooksPage() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [webhookToken, setWebhookToken] = useState("")
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [stats, setStats] = useState<WebhookStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Generate webhook URL and token
    const baseUrl = window.location.origin
    setWebhookUrl(`${baseUrl}/api/webhook`)
    setWebhookToken(generateWebhookToken())

    fetchWebhookData()
  }, [])

  const generateWebhookToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const fetchWebhookData = async () => {
    try {
      setLoading(true)

      // Simulate webhook logs and stats
      const mockLogs: WebhookLog[] = [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          method: "POST",
          endpoint: "/api/webhook",
          status: 200,
          responseTime: 145,
          groupId: "group_1",
          userId: "user_123",
          command: "!fogo",
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          method: "POST",
          endpoint: "/api/webhook",
          status: 200,
          responseTime: 89,
          groupId: "group_2",
          userId: "user_456",
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          method: "POST",
          endpoint: "/api/webhook",
          status: 500,
          responseTime: 2340,
          groupId: "group_1",
          error: "Database connection timeout",
        },
      ]

      const mockStats: WebhookStats = {
        totalRequests: 1247,
        successfulRequests: 1198,
        failedRequests: 49,
        averageResponseTime: 156,
        lastRequest: new Date().toISOString(),
      }

      setLogs(mockLogs)
      setStats(mockStats)
    } catch (error) {
      console.error("[v0] Error fetching webhook data:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados dos webhooks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência",
    })
  }

  const testWebhook = async () => {
    try {
      const testPayload = {
        from: "5511999999999@c.us",
        to: "120363123456789@g.us",
        body: "!fogo",
        timestamp: Date.now(),
        isGroup: true,
        groupId: "120363123456789@g.us",
        participantId: "5511999999999@c.us",
      }

      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      })

      if (response.ok) {
        toast({
          title: "Teste Realizado!",
          description: "Webhook testado com sucesso",
        })
        fetchWebhookData() // Refresh logs
      } else {
        throw new Error("Webhook test failed")
      }
    } catch (error) {
      toast({
        title: "Erro no Teste",
        description: "Não foi possível testar o webhook",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Sucesso
        </Badge>
      )
    } else if (status >= 400 && status < 500) {
      return <Badge variant="destructive">Erro Cliente</Badge>
    } else if (status >= 500) {
      return <Badge variant="destructive">Erro Servidor</Badge>
    }
    return <Badge variant="outline">Desconhecido</Badge>
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Carregando configurações de webhook...</span>
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
                <Webhook className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Configuração de Webhooks</h1>
                <p className="text-sm text-muted-foreground">Configure e monitore webhooks do WhatsApp</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={fetchWebhookData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuração do Webhook
                </CardTitle>
                <CardDescription>
                  Configure seu bot do WhatsApp para enviar mensagens para este endpoint
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">URL do Webhook</Label>
                  <div className="flex gap-2">
                    <Input id="webhook-url" value={webhookUrl} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookUrl)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="webhook-token">Token de Segurança</Label>
                  <div className="flex gap-2">
                    <Input id="webhook-token" value={webhookToken} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookToken)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use este token no cabeçalho Authorization do seu bot
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={testWebhook}>
                    <Activity className="h-4 w-4 mr-2" />
                    Testar Webhook
                  </Button>
                  <Button variant="outline" onClick={() => setWebhookToken(generateWebhookToken())}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Gerar Novo Token
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exemplo de Configuração</CardTitle>
                <CardDescription>Como configurar seu bot do WhatsApp</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={`// Exemplo de configuração para bot Node.js
const webhook = {
  url: "${webhookUrl}",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${webhookToken}"
  }
}

// Enviar mensagem para o webhook
client.on('message', async (message) => {
  const payload = {
    from: message.from,
    to: message.to,
    body: message.body,
    timestamp: message.timestamp,
    isGroup: message.isGroupMsg,
    groupId: message.chatId,
    participantId: message.author
  }
  
  await fetch(webhook.url, {
    method: 'POST',
    headers: webhook.headers,
    body: JSON.stringify(payload)
  })
})`}
                  className="font-mono text-xs h-64"
                />
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total de Requests</span>
                      <span className="font-bold">{stats.totalRequests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sucessos</span>
                      <span className="font-bold text-green-600">{stats.successfulRequests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Falhas</span>
                      <span className="font-bold text-red-600">{stats.failedRequests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tempo Médio</span>
                      <span className="font-bold">{formatResponseTime(stats.averageResponseTime)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
                      <span className="font-bold text-blue-600">
                        {((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Webhook Endpoint Ativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Database Conectado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Última Request: há 2 min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Logs Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Logs de Webhook
            </CardTitle>
            <CardDescription>Histórico das últimas requisições recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Comando</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Erro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.groupId ? log.groupId.substring(0, 12) + "..." : "-"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.userId ? log.userId.substring(0, 12) + "..." : "-"}
                    </TableCell>
                    <TableCell>
                      {log.command ? (
                        <Badge variant="outline">{log.command}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{formatResponseTime(log.responseTime)}</TableCell>
                    <TableCell>
                      {log.error ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">{log.error}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
