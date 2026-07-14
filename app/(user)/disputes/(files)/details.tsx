'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { HeaderCard } from '@/components/ui/header-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Timestamp } from '@/components/ui/timestamp';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EntityLink, userDetailHref } from '@/components/shared/entity-link';
// import { Select } from '@/components/ui/select';
import { formatCurrency } from '@/lib/currency';
import { Dispute, disputeApi } from '@/lib/dispute-api';
import { disputeQuickResponses } from '@/lib/reason-presets';
import { apiRequest } from '@/lib/api';
import type { ItemResponse } from '@/lib/base-api';
import {
  MessageSquare,
  XCircle,
  Send,
  Paperclip,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useDisputeSSE, SSEConversation } from '@/hooks/useDisputeSSE';
import { SelectInput } from '@/components/ui/select-input';

interface DisputeDetailsProps {
  data: Dispute;
  onRefresh?: () => void;
}

export function DisputeDetails({ data, onRefresh }: DisputeDetailsProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [conversations, setConversations] = useState(
    (data.conversations || []).map((c) => ({
      ...c,
      sender_type: (c.sender_type === 'agent' ? 'admin' : c.sender_type) as
        | 'user'
        | 'admin',
    })),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isClosed =
    data.status_code === 'closed' || data.status_code === 'resolved';

  // Real-time SSE subscription for new messages
  const handleSSEMessage = useCallback((msg: SSEConversation) => {
    setConversations((prev) => {
      // Dedup rules:
      //  1. Real server IDs match — this is the SSE echo of a message we
      //     already have in state (either from initial load, an earlier
      //     SSE event, or the admin's own POST response).
      //  2. There's an optimistic admin bubble (negative id) with the
      //     same text — swap it for the server's real record so the id
      //     becomes stable and future dedup works.
      //
      // We do NOT dedup on message+sender alone, because two different
      // messages with the same text (e.g. "Chai", "Chai") are legitimate
      // separate bubbles and would otherwise get swallowed.
      if (prev.some((c) => c.id === msg.id)) return prev;

      const incomingSender = (
        msg.sender_type === 'agent' ? 'admin' : msg.sender_type
      ) as 'user' | 'admin';
      const optimisticIdx = prev.findIndex(
        (c) =>
          c.id < 0 &&
          c.sender_type === incomingSender &&
          c.message === msg.message,
      );
      if (optimisticIdx !== -1) {
        const next = [...prev];
        next[optimisticIdx] = {
          id: msg.id,
          user_id: null,
          sender_type: incomingSender,
          message: msg.message,
          createdAt: msg.created_at,
          created_at: msg.created_at,
        };
        return next;
      }

      return [
        ...prev,
        {
          id: msg.id,
          user_id: null,
          sender_type: incomingSender,
          message: msg.message,
          createdAt: msg.created_at,
          created_at: msg.created_at,
        },
      ];
    });
  }, []);

  const { connected } = useDisputeSSE({
    disputeId: data.id,
    enabled: !isClosed,
    onMessage: handleSSEMessage,
  });

  // Anything the server broadcasts between the initial HTTP fetch and the
  // EventSource opening is lost, because the stream starts at "connected".
  // Refetch on every SSE (re)connect to close that gap — dedup in the SSE
  // handler keeps the list consistent. This also backfills messages that
  // were sent while the admin didn't have the panel open.
  useEffect(() => {
    if (!connected || !data.id) return;
    let cancelled = false;
    apiRequest<ItemResponse<Dispute>>(`/disputes/${data.id}`, {
      suppressToast: true,
    })
      .then((resp) => {
        if (cancelled) return;
        const fresh = resp?.data?.conversations;
        if (!fresh) return;
        setConversations((prev) => {
          const byId = new Map<number, (typeof prev)[number]>();
          // Keep optimistic entries (negative ids) — they'll be reconciled
          // by their matching SSE/server echo later.
          for (const c of prev) {
            if (c.id < 0) byId.set(c.id, c);
          }
          for (const c of fresh) {
            byId.set(c.id, {
              ...c,
              sender_type: (c.sender_type === 'agent'
                ? 'admin'
                : c.sender_type) as 'user' | 'admin',
            });
          }
          return Array.from(byId.values()).sort((a, b) => {
            const ta = new Date(a.createdAt || a.created_at || 0).getTime();
            const tb = new Date(b.createdAt || b.created_at || 0).getTime();
            return ta - tb;
          });
        });
      })
      .catch(() => {
        // Non-fatal — next SSE event will bring state back in sync.
      });
    return () => {
      cancelled = true;
    };
  }, [connected, data.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    const text = message.trim();
    setSending(true);

    // Optimistic bubble with a negative id so the SSE echo can find it
    // and swap in the server's real record. Adding it BEFORE awaiting
    // the POST is important: dispute svc publishes to Kafka before
    // returning from gRPC, so on a fast cluster the SSE echo arrives
    // first. If we added the optimistic bubble only after the POST
    // resolved, dedup would miss it and both bubbles would show.
    const optimisticId = -Date.now();
    setConversations((prev) => [
      ...prev,
      {
        id: optimisticId,
        user_id: null,
        sender_type: 'admin' as const,
        message: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await disputeApi.addConversation(data.id, text);
      // Success path: either the SSE echo has already arrived and
      // swapped the placeholder, or it is in flight and will swap
      // it when it lands. Nothing to do here.
    } catch (err) {
      // Roll back the optimistic bubble on failure so the admin
      // doesn't see a ghost message that never reached the server.
      setConversations((prev) => prev.filter((c) => c.id !== optimisticId));
      throw err;
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    setClosing(true);
    try {
      await disputeApi.close(data.id);
      if (onRefresh) onRefresh();
    } finally {
      setClosing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !sending) {
      e.preventDefault();
      handleSend();
    }
  };

  const disputeFields = [
    { label: 'ID', value: String(data.id) },
    {
      label: 'Transaction Reference',
      value: data.transaction_reference || '',
      copiable: true,
      truncate: true,
    },
    { label: 'Status', value: <StatusBadge status={data.status_code || ''} /> },
    { label: 'Date', value: <Timestamp value={data.created_at} /> },
  ];

  const contentFields = [
    { label: 'Reason', value: data.reason || '' },
    { label: 'Description', value: data.description || 'N/A' },
  ];

  // User who filed the dispute. Name links through to the user detail page
  // so the admin can jump to the full profile from the chat panel.
  const user = data.user;
  const userFields = user
    ? [
        {
          label: 'Name',
          value: (
            <EntityLink
              href={userDetailHref({
                id: user.id,
                name: user.name,
                email: user.email,
              })}
              label={user.name || user.email || `User #${user.id}`}
            />
          ),
        },
        { label: 'Email', value: user.email || 'N/A' },
        { label: 'Phone', value: user.phone_number || 'N/A' },
      ]
    : [];

  // The transaction the dispute is about. The reference is also shown above
  // in Dispute Information, but the amount/status/product/date give the admin
  // the context to resolve the dispute without leaving the panel.
  const transaction = data.transaction;
  const transactionFields = transaction
    ? [
        {
          label: 'Reference',
          value: transaction.reference || '',
          copiable: true,
          truncate: true,
        },
        { label: 'Amount', value: formatCurrency(transaction.amount) },
        {
          label: 'Status',
          value: transaction.status ? (
            <StatusBadge status={transaction.status.code} />
          ) : (
            'N/A'
          ),
        },
        { label: 'Product', value: transaction.product || 'N/A' },
        {
          label: 'Date',
          value: <Timestamp value={transaction.created_at || ''} />,
        },
      ]
    : [];

  const quickResponseOptions = disputeQuickResponses.map((preset) => ({
    value: preset.title,
    label: preset.title,
    body: preset.body,
  }));

  const attachmentUrl = (data as any).attachment_url as string | undefined;
  const hasAttachment = !!attachmentUrl;

  return (
    <>
      {!isClosed && (
        <div className='flex justify-end mb-4'>
          <Button
            variant='danger'
            icon={XCircle}
            onClick={handleClose}
            loading={closing}
          >
            Close Dispute
          </Button>
        </div>
      )}

      <HeaderCard title='Dispute Information' fields={disputeFields} />
      {user && <HeaderCard title='User Information' fields={userFields} />}
      {transaction && (
        <HeaderCard
          title='Transaction Information'
          fields={transactionFields}
        />
      )}
      <HeaderCard title='Details' fields={contentFields} />

      {hasAttachment && (
        <Card>
          <div className='flex items-center gap-2 pb-3'>
            <Paperclip className='h-4 w-4 text-muted-foreground' />
            <h2 className='text-base font-semibold text-foreground'>
              Attachment
            </h2>
          </div>
          <div className='border-t border-border' />
          <div className='pt-4'>
            <div className='border border-border rounded-lg overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attachmentUrl}
                alt='Dispute attachment'
                className='w-full max-h-64 object-contain bg-muted'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                                        <div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2 opacity-40"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                            <p class="text-sm">Attachment not accessible</p>
                                            <p class="text-xs mt-1">${attachmentUrl}</p>
                                        </div>
                                    `;
                }}
              />
            </div>
            <p className='text-xs text-muted-foreground mt-2 truncate'>
              {attachmentUrl}
            </p>
          </div>
        </Card>
      )}

      <Card>
        <div className='flex items-center gap-2 pb-3'>
          <MessageSquare className='h-4 w-4 text-muted-foreground' />
          <h2 className='text-base font-semibold text-foreground'>
            Conversations
          </h2>
          <span className='text-xs text-muted-foreground'>
            ({conversations.length})
          </span>
          {!isClosed && (
            <div
              className='ml-auto flex items-center gap-1.5'
              title={connected ? 'Live updates active' : 'Connecting...'}
            >
              {connected ? (
                <Wifi className='h-3.5 w-3.5 text-cms-green-20' />
              ) : (
                <WifiOff className='h-3.5 w-3.5 text-muted-foreground animate-pulse' />
              )}
              <span
                className={`text-[11px] ${connected ? 'text-cms-green-20' : 'text-muted-foreground'}`}
              >
                {connected ? 'Live' : 'Connecting'}
              </span>
            </div>
          )}
        </div>
        <div className='border-t border-border' />

        <div className='pt-4 space-y-4 max-h-96 overflow-y-auto px-1'>
          {conversations.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
              <MessageSquare className='h-8 w-8 mb-2 opacity-40' />
              <p className='text-sm'>No messages yet</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isAdmin = (conv.sender_type || 'user') === 'admin';
              return (
                <div
                  key={conv.id}
                  className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isAdmin
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    }`}
                  >
                    <div className='flex items-center gap-2 mb-0.5'>
                      <span
                        className={`text-[11px] font-semibold ${isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
                      >
                        {isAdmin ? 'Admin' : 'User'}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${isAdmin ? 'text-primary-foreground' : 'text-foreground'}`}
                    >
                      {conv.message}
                    </p>
                    <p
                      className={`text-[10px] mt-1 ${isAdmin ? 'text-primary-foreground/50 text-right' : 'text-muted-foreground'}`}
                    >
                      {new Date(
                        conv.createdAt || conv.created_at || '',
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isClosed && (
          <div className='mt-4 pt-4 border-t border-border space-y-2'>
            <SelectInput
              value=''
              placeholder='Quick response (select to fill the message box)'
              options={quickResponseOptions}
              className='text-sm'
              onChange={(value) => {
                const match = disputeQuickResponses.find(
                  (r) => r.title === value,
                );
                if (match) {
                  setMessage(match.body);
                  requestAnimationFrame(() => {
                    autoResize();
                    textareaRef.current?.focus();
                  });
                }
              }}
            />
            <div className='flex items-end gap-2'>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  autoResize();
                }}
                onKeyDown={handleKeyDown}
                placeholder='Type a message...'
                rows={2}
                className='flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring leading-relaxed min-h-10'
              />
              <Button
                variant='theme'
                icon={Send}
                onClick={handleSend}
                loading={sending}
                disabled={!message.trim()}
                className='rounded-xl h-10 px-4 self-end'
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
