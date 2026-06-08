import "server-only";

export type WhatsAppTemplateComponent =
  | {
      type: "body";
      parameters: Array<
        | { type: "text"; text: string }
        | {
            type: "currency";
            currency: {
              fallback_value: string;
              code: string;
              amount_1000: number;
            };
          }
        | { type: "date_time"; date_time: { fallback_value: string } }
      >;
    }
  | {
      type: "header";
      parameters: Array<
        | { type: "text"; text: string }
        | { type: "image"; image: { link: string } }
        | { type: "video"; video: { link: string } }
        | { type: "document"; document: { link: string; filename?: string } }
      >;
    }
  | {
      type: "button";
      sub_type: "quick_reply" | "url";
      index: string; // "0", "1", ...
      parameters: Array<{ type: "text"; text: string }>;
    };

export type SendTextMessageInput = {
  to: string; // E.164 format e.g. +2547xxxxxxx
  text: string;
  previewUrl?: boolean;
  metadata?: Record<string, unknown>;
};

export type SendTemplateMessageInput = {
  to: string;
  type: "template";
  template: {
    name: string;
    language?: string; // e.g. "en_US"
    components?: WhatsAppTemplateComponent[];
  };
  metadata?: Record<string, unknown>;
};

export type SendMediaMessageInput = {
  to: string;
  type: "image" | "video" | "audio" | "document";
  media: {
    // use one of these depending on SaaS design
    link?: string; // hosted file url
    mediaId?: string; // uploaded via /media/upload
    caption?: string;
    filename?: string; // for documents
  };
  metadata?: Record<string, unknown>;
};

export type SendLocationMessageInput = {
  to: string;
  location: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  metadata?: Record<string, unknown>;
};

export type SendInteractiveMessageInput = {
  to: string;
  interactive: {
    type: "button" | "list";
    body: { text: string };
    header?: { type: "text"; text: string };
    footer?: { text: string };

    // button type
    action?:
      | {
          buttons: Array<{
            type: "reply";
            reply: { id: string; title: string };
          }>;
        }
      // list type
      | {
          button: string;
          sections: Array<{
            title?: string;
            rows: Array<{ id: string; title: string; description?: string }>;
          }>;
        };
  };
  metadata?: Record<string, unknown>;
};

export type UploadMediaInput = {
  file: Blob | File;
  mimeType: string;
  filename?: string;
};

export type WhatsAppMessageStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "rejected";

export type SendMessageResponse = {
  messageId: string;
  to: string;
  status: WhatsAppMessageStatus;
  provider?: string;
  raw?: unknown;
};

export type TemplateSummary = {
  name: string;
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "PAUSED" | string;
  category?: string;
};

export type WebhookEventType =
  | "message.received"
  | "message.status"
  | "template.status"
  | "health"
  | string;

export type RegisterWebhookInput = {
  url: string;
  events: WebhookEventType[];
  secret?: string; // used to sign webhook payloads
};

export type RegisterWebhookResponse = {
  webhookId: string;
  url: string;
  events: WebhookEventType[];
};

export type WhatsAppClientConfig = {
  baseUrl: string; // e.g. https://api.whatsapp-saas.com/v1
  apiKey: string; // Bearer token
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
};

export class LociClient {
  private baseUrl: string;
  private apiKey: string;
  private timeoutMs: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: WhatsAppClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs ?? 25_000;
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  // -----------------------------
  // Low-level request helper
  // -----------------------------
  private async request<T>(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    console.log(`[${method} request BODY] - `, body);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "api-key": this.apiKey,
          "Content-Type": "application/json",
          ...this.defaultHeaders,
        },
        body: body ? JSON.stringify(body) : undefined,
        redirect: "follow",
        signal: controller.signal,
      });

      const contentType = res.headers.get("content-type") ?? "";
      const isJson = contentType.includes("application/json");
      const payload = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        throw new Error(
          `WhatsApp SaaS API Error: ${res.status} ${res.statusText} | ${typeof payload === "string" ? payload : JSON.stringify(payload)}`,
        );
      }

      return payload as T;
    } finally {
      // clearTimeout(timer);
      console.log("COMPLETED fetch");
    }
  }

  // -----------------------------
  // Health / Auth
  // -----------------------------
  async healthCheck(): Promise<{ status: "ok"; time?: string }> {
    return this.request("GET", "/integrations/health");
  }

  async getMe(): Promise<{ accountId: string; name?: string; plan?: string }> {
    return this.request("GET", "/auth/me");
  }

  // -----------------------------
  // Messaging (Core)
  // -----------------------------
  async sendTextMessage(
    input: SendTextMessageInput,
  ): Promise<SendMessageResponse> {
    return this.request("POST", "/integrations/message", {
      to: input.to,
      text: input.text,
      previewUrl: input.previewUrl ?? false,
      metadata: input.metadata,
    });
  }

  async sendTemplateMessage(
    input: SendTemplateMessageInput,
  ): Promise<SendMessageResponse> {
    return this.request("POST", "/integrations/message", input);
  }

  async sendMediaMessage(
    input: SendMediaMessageInput,
  ): Promise<SendMessageResponse> {
    return this.request("POST", "/integrations/message", {
      to: input.to,
      type: input.type,
      media: input.media,
      metadata: input.metadata,
    });
  }

  async sendLocationMessage(
    input: SendLocationMessageInput,
  ): Promise<SendMessageResponse> {
    return this.request("POST", "/integrations/message", {
      to: input.to,
      location: input.location,
      metadata: input.metadata,
    });
  }

  async sendInteractiveMessage(
    input: SendInteractiveMessageInput,
  ): Promise<SendMessageResponse> {
    return this.request("POST", "/integrations/message", {
      to: input.to,
      interactive: input.interactive,
      metadata: input.metadata,
    });
  }

  // -----------------------------
  // Message status / history
  // -----------------------------
  async getMessage(messageId: string): Promise<{
    messageId: string;
    to: string;
    status: WhatsAppMessageStatus;
    createdAt?: string;
    updatedAt?: string;
    raw?: unknown;
  }> {
    return this.request(
      "GET",
      `/integrations/message/${encodeURIComponent(messageId)}`,
    );
  }

  async listMessages(params?: {
    to?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    data: Array<{
      messageId: string;
      to: string;
      status: WhatsAppMessageStatus;
      createdAt?: string;
    }>;
    nextCursor?: string;
  }> {
    const qs = new URLSearchParams();
    if (params?.to) qs.set("to", params.to);
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.cursor) qs.set("cursor", params.cursor);

    const query = qs.toString() ? `?${qs.toString()}` : "";
    return this.request("GET", `/messages${query}`);
  }

  async resendMessage(messageId: string): Promise<SendMessageResponse> {
    return this.request(
      "POST",
      `/messages/${encodeURIComponent(messageId)}/resend`,
    );
  }

  // -----------------------------
  // Templates
  // -----------------------------
  async listTemplates(params?: {
    status?: string;
    language?: string;
    limit?: number;
  }): Promise<{ data: TemplateSummary[] }> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.language) qs.set("language", params.language);
    if (params?.limit) qs.set("limit", String(params.limit));

    const query = qs.toString() ? `?${qs.toString()}` : "";
    return this.request("GET", `/integrations/message${query}`);
  }

  async getTemplate(name: string): Promise<{ template: unknown }> {
    return this.request(
      "GET",
      `/integrations/message/${encodeURIComponent(name)}`,
    );
  }

  // -----------------------------
  // Contacts / Validation
  // -----------------------------
  async validateContact(phone: string): Promise<{
    phone: string;
    isWhatsApp: boolean;
    waId?: string;
  }> {
    return this.request("POST", "/integrations/contact/validate", { phone });
  }

  // -----------------------------
  // Webhooks
  // -----------------------------
  async registerWebhook(
    input: RegisterWebhookInput,
  ): Promise<RegisterWebhookResponse> {
    return this.request("POST", "/webhooks", input);
  }

  async listWebhooks(): Promise<{
    data: Array<{ webhookId: string; url: string; events: WebhookEventType[] }>;
  }> {
    return this.request("GET", "/integrations/webhooks");
  }

  async deleteWebhook(webhookId: string): Promise<{ deleted: true }> {
    return this.request(
      "DELETE",
      `/integrations/webhooks/${encodeURIComponent(webhookId)}`,
    );
  }
}
