import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewAccountRequest {
  email: string;
  companyName: string;
  firstName: string;
  lastName: string;
  phone: string;
  businessInfo: string;
}

// Simple rate limiting map (in-memory, resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Max 5 requests per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// Sanitize inputs for HTML (basic XSS prevention)
function sanitize(str: string | undefined): string {
  if (!str) return '';
  return str.replace(/[<>&"']/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[char] || char;
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, companyName, firstName, lastName, phone, businessInfo }: NewAccountRequest = await req.json();

    // Validate required fields
    if (!email || !companyName) {
      console.error("Missing required fields: email or companyName");
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Input length validation to prevent abuse
    if (email.length > 255 || companyName.length > 200 || 
        (firstName && firstName.length > 100) || 
        (lastName && lastName.length > 100) ||
        (phone && phone.length > 30) ||
        (businessInfo && businessInfo.length > 1000)) {
      console.error("Input too long");
      return new Response(JSON.stringify({ error: "Input too long" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Rate limiting by email to prevent spam
    if (isRateLimited(email)) {
      console.error("Rate limited:", email);
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    console.log("[NEW-ACCOUNT] Sending notification for:", email);

    // Initialize SMTP client
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUsername = Deno.env.get("SMTP_USERNAME");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "noreply@digitalemenukaart.nl";

    if (!smtpHost || !smtpUsername || !smtpPassword) {
      console.error("SMTP configuration missing");
      return new Response(JSON.stringify({ error: "Email configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUsername,
          password: smtpPassword,
        },
      },
    });

    // Send notification to admin with sanitized inputs
    await client.send({
      from: fromEmail,
      to: "info@digitalemenukaart.nl",
      subject: `Nieuw account aangemaakt: ${sanitize(companyName)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #10b981; }
            .field-label { font-weight: 600; color: #059669; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
            .field-value { font-size: 16px; color: #1f2937; }
            h1 { margin: 0; font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Nieuw Account</h1>
            </div>
            <div class="content">
              <p>Er is een nieuw account aangemaakt op Digitale Menukaart:</p>
              
              <div class="field">
                <div class="field-label">Bedrijfsnaam</div>
                <div class="field-value">${sanitize(companyName)}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Naam</div>
                <div class="field-value">${sanitize(firstName)} ${sanitize(lastName)}</div>
              </div>
              
              <div class="field">
                <div class="field-label">E-mailadres</div>
                <div class="field-value">${sanitize(email)}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Telefoonnummer</div>
                <div class="field-value">${sanitize(phone)}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Bedrijfsinfo & Interesse</div>
                <div class="field-value">${sanitize(businessInfo) || 'Geen informatie opgegeven'}</div>
              </div>
              
              <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                Dit account heeft automatisch een proefperiode van 30 dagen.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    await client.close();

    console.log("[NEW-ACCOUNT] Notification sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[NEW-ACCOUNT] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});