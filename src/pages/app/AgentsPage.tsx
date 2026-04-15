import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Bot, Compass, Cpu, Crown, MessagesSquare, Radar, Sparkles, WandSparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import Button from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Input'
import { agentsApi } from '../../api/agents'
import { telemetryApi } from '../../api/telemetry'
import type { AgentArtifact } from '../../types'

const CHANNEL_KEY = 'apex-council'

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function toObjectArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    : []
}

function ArtifactCard({ artifact }: { artifact: AgentArtifact }) {
  const steps = toObjectArray(artifact.content.steps)
  const sections = toObjectArray(artifact.content.sections)
  const principles = toStringArray(artifact.content.principles)
  const motionPrinciples = toStringArray(artifact.content.motionPrinciples)
  const dopamineLoops = toStringArray(artifact.content.dopamineLoops)
  const metrics = toStringArray(artifact.content.metrics)
  const founderSignals = toStringArray(artifact.content.founderSignals)

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/95 p-5 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.75)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-500">
            {artifact.artifactType.replace('_', ' ')}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{artifact.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{artifact.summary}</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
          {new Date(artifact.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {typeof artifact.content.overview === 'string' && (
        <p className="mt-4 rounded-2xl bg-slate-950 px-4 py-4 text-sm leading-relaxed text-slate-200">
          {artifact.content.overview}
        </p>
      )}

      {founderSignals.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Founder signals</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {founderSignals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      )}

      {principles.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Principles</p>
          <div className="mt-3 grid gap-2">
            {principles.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.length > 0 && (
        <div className="mt-5 grid gap-3">
          {sections.map((section) => {
            const bullets = toStringArray(section.bullets)
            const sources = toObjectArray(section.sources)

            return (
              <div key={`${section.agentKey as string}-${section.displayName as string}`} className="rounded-[26px] border border-slate-100 bg-white px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{section.displayName as string}</p>
                    <p className="text-xs text-slate-500">{section.roleLabel as string}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2">
                  {bullets.map((bullet) => (
                    <div key={bullet} className="rounded-2xl bg-slate-50 px-3 py-3 text-sm leading-relaxed text-slate-700">
                      {bullet}
                    </div>
                  ))}
                </div>
                {sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sources.map((source) => (
                      <a
                        key={`${source.label as string}-${source.url as string}`}
                        href={source.url as string}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-violet-300 hover:text-violet-700"
                      >
                        {source.label as string}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {steps.length > 0 && (
        <div className="mt-5 grid gap-3">
          {steps.map((step, index) => (
            <div key={`${step.title as string}-${index}`} className="rounded-[26px] border border-slate-100 bg-slate-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{step.title as string}</p>
                  {typeof step.owner === 'string' && (
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{step.owner}</p>
                  )}
                  {typeof step.detail === 'string' && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{step.detail}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(motionPrinciples.length > 0 || dopamineLoops.length > 0 || metrics.length > 0) && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[{ title: 'Motion', items: motionPrinciples }, { title: 'Dopamine', items: dopamineLoops }, { title: 'Metrics', items: metrics }].map(
            (group) =>
              group.items.length > 0 ? (
                <div key={group.title} className="rounded-[26px] bg-slate-950 px-4 py-4 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">{group.title}</p>
                  <div className="mt-3 grid gap-2">
                    {group.items.map((item) => (
                      <div key={item} className="rounded-2xl bg-white/5 px-3 py-3 text-sm leading-relaxed text-slate-200">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
          )}
        </div>
      )}
    </div>
  )
}

export default function AgentsPage() {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState(
    'Make the app feel more premium, more habit-forming, and more campus-native without becoming cheap.'
  )

  const channelQuery = useQuery({
    queryKey: ['agent-channel', CHANNEL_KEY],
    queryFn: () => agentsApi.getChannel(CHANNEL_KEY),
  })

  const telemetryQuery = useQuery({
    queryKey: ['telemetry-summary', 14],
    queryFn: () => telemetryApi.getSummary(14),
    staleTime: 60_000,
  })

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      agentsApi.postMessage(CHANNEL_KEY, {
        speakerType: 'founder',
        content,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(['agent-channel', CHANNEL_KEY], data)
      setDraft('')
    },
  })

  const compileMutation = useMutation({
    mutationFn: () => agentsApi.compileArtifact(CHANNEL_KEY, { artifactType: 'implementation_plan' }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['agent-channel', CHANNEL_KEY] }),
        queryClient.invalidateQueries({ queryKey: ['telemetry-summary', 14] }),
      ])
    },
  })

  const roster = channelQuery.data?.roster ?? []
  const messages = channelQuery.data?.messages ?? []
  const artifacts = channelQuery.data?.artifacts ?? []
  const primaryArtifact = useMemo(
    () => artifacts.find((artifact) => artifact.artifactType === 'implementation_plan') ?? artifacts[0],
    [artifacts]
  )

  return (
    <AppLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.22),_transparent_35%),linear-gradient(180deg,#0f172a_0%,#111827_26%,#f6f0e8_26%,#f8f5ef_100%)] pb-24">
        <div className="px-5 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[34px] border border-white/10 bg-slate-950/90 px-5 py-6 text-white shadow-[0_32px_120px_-40px_rgba(2,6,23,0.95)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet-300">Apex Council</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight">A living channel where the agents talk back.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                  Research, planning, frontend, and backend all operate in one shared thread. Use it to pressure-test
                  retention ideas, compile a step-by-step plan, and keep the product direction aligned.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Cpu size={16} className="text-violet-300" />
                  Council status
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {roster.length} active agents, shared memory, compiled artifacts, live founder prompts.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {roster.map((agent) => (
                <div
                  key={agent.key}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/85"
                  style={{ backgroundColor: `${agent.accent}22` }}
                >
                  {agent.displayName} - {agent.roleLabel}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="px-5 pt-5">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] border border-white/50 bg-white/80 p-5 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
                <div className="flex items-center gap-2">
                  <Crown size={16} className="text-violet-500" />
                  <p className="text-sm font-semibold text-slate-900">Founder prompt</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Drop a product direction note and the council will respond in-channel with coordinated research and execution guidance.
                </p>
                <div className="mt-4">
                  <Textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={4}
                    className="!rounded-[24px] !border-slate-200 !bg-[#fffdf9]"
                    placeholder="What should the agents solve next?"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    loading={sendMessageMutation.isPending}
                    onClick={() => {
                      const next = draft.trim()
                      if (next) {
                        sendMessageMutation.mutate(next)
                      }
                    }}
                  >
                    <MessagesSquare size={16} />
                    Send to council
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    loading={compileMutation.isPending}
                    onClick={() => compileMutation.mutate()}
                  >
                    <Sparkles size={16} />
                    Compile fresh plan
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'Make onboarding more addictive for high-value college users.',
                    'How do we make Discover feel premium and not generic?',
                    'What should the dopamine loop be without looking cheap?',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setDraft(prompt)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-violet-300 hover:text-violet-700"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/30 bg-slate-950 p-5 text-white shadow-[0_28px_80px_-40px_rgba(15,23,42,0.75)]">
                <div className="flex items-center gap-2">
                  <Radar size={16} className="text-emerald-300" />
                  <p className="text-sm font-semibold text-white">Telemetry pulse</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  The council uses recent behavior to decide what to tune next.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Events', value: telemetryQuery.data?.totalEvents ?? 0 },
                    { label: 'Page views', value: telemetryQuery.data?.pageViews ?? 0 },
                    { label: 'Top routes', value: telemetryQuery.data?.topRoutes.length ?? 0 },
                    { label: 'Top actions', value: telemetryQuery.data?.topEventTypes.length ?? 0 },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-[24px] bg-white/5 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {telemetryQuery.data?.topRoutes?.length ? (
                  <div className="mt-4 rounded-[24px] bg-white/5 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Most visited routes</p>
                    <div className="mt-3 grid gap-2">
                      {telemetryQuery.data.topRoutes.map((route) => (
                        <div key={route.route} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5 text-sm">
                          <span className="text-slate-200">{route.route}</span>
                          <span className="text-emerald-300">{route.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-relaxed text-slate-300">
                    Browse the app and the council will start seeing what pages actually hold attention.
                  </div>
                )}
              </div>
            </div>

            {primaryArtifact && <ArtifactCard artifact={primaryArtifact} />}

            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[30px] border border-white/40 bg-white/85 p-5 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
                <div className="flex items-center gap-2">
                  <Bot size={16} className="text-violet-500" />
                  <p className="text-sm font-semibold text-slate-900">Roster</p>
                </div>
                <div className="mt-4 grid gap-3">
                  {roster.map((agent) => (
                    <div key={agent.key} className="rounded-[26px] border border-slate-100 bg-[#fffdf9] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
                          style={{ backgroundColor: agent.accent }}
                        >
                          {agent.displayName.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{agent.displayName}</p>
                          <p className="text-xs text-slate-500">{agent.roleLabel}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{agent.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {agent.focusAreas.map((focus) => (
                          <span
                            key={focus}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/30 bg-slate-950 p-5 text-white shadow-[0_28px_80px_-40px_rgba(15,23,42,0.8)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Compass size={16} className="text-violet-300" />
                    <p className="text-sm font-semibold text-white">Shared channel</p>
                  </div>
                  <Link
                    to="/rizzassist"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10"
                  >
                    <WandSparkles size={13} />
                    Open RizzAssist
                  </Link>
                </div>

                <div className="mt-4 grid gap-3">
                  {channelQuery.isLoading && (
                    <div className="rounded-[24px] bg-white/5 px-4 py-4 text-sm text-slate-300">Loading council...</div>
                  )}

                  {messages.map((message) => {
                    const accent = roster.find((agent) => agent.key === message.agentKey)?.accent ?? '#64748b'
                    const isFounder = message.speakerType === 'founder'

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-[26px] px-4 py-4 ${isFounder ? 'bg-violet-600 text-white' : 'bg-white/5 text-white'}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold text-white"
                              style={{ backgroundColor: isFounder ? 'rgba(255,255,255,0.18)' : accent }}
                            >
                              {message.displayName.slice(0, 1)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{message.displayName}</p>
                              <p className={`text-xs ${isFounder ? 'text-violet-100' : 'text-slate-400'}`}>
                                {message.roleLabel ?? 'Council'}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[11px] ${isFounder ? 'text-violet-100' : 'text-slate-500'}`}>
                            {formatTimestamp(message.createdAt)}
                          </span>
                        </div>
                        <p className={`mt-3 text-sm leading-relaxed ${isFounder ? 'text-white' : 'text-slate-200'}`}>
                          {message.content}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
