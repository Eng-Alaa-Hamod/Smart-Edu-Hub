export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin === env.FRONTEND_ORIGIN ? origin : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const { userId, title, message, targetPath = "/" } = await request.json();

      if (!userId || !title || !message) {
        return new Response("userId, title, and message are required", {
          status: 400,
          headers: corsHeaders,
        });
      }

      if (!targetPath.startsWith("/") || targetPath.startsWith("//")) {
        return new Response("targetPath must be a local path", {
          status: 400,
          headers: corsHeaders,
        });
      }

      const notificationUrl = new URL(targetPath, env.FRONTEND_ORIGIN).toString();

      const response = await fetch("https://api.onesignal.com/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${env.ONESIGNAL_REST_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: env.ONESIGNAL_APP_ID,
          target_channel: "push",
          include_aliases: { external_id: [userId] },
          headings: { en: title },
          contents: { en: message },
          url: notificationUrl,
        }),
      });

      return new Response(response.body, {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": response.headers.get("Content-Type") || "application/json",
        },
      });
    } catch (error) {
      return new Response(error.message, { status: 500, headers: corsHeaders });
    }
  },
};