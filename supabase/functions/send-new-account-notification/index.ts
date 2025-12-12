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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, companyName, firstName, lastName, phone, businessInfo }: NewAccountRequest = await req.json();

    console.log("[NEW-ACCOUNT] Sending notification for:", email);

    // Initialize SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get("SMTP_HOST") || "",
        port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USERNAME") || "",
          password: Deno.env.get("SMTP_PASSWORD") || "",
        },
      },
    });

    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "noreply@digitalemenukaart.nl";

    // Send notification to admin
    await client.send({
      from: fromEmail,
      to: "info@digitalemenukaart.nl",
      subject: `Nieuw account aangemaakt: ${companyName}`,
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
                <div class="field-value">${companyName}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Naam</div>
                <div class="field-value">${firstName} ${lastName}</div>
              </div>
              
              <div class="field">
                <div class="field-label">E-mailadres</div>
                <div class="field-value">${email}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Telefoonnummer</div>
                <div class="field-value">${phone}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Bedrijfsinfo & Interesse</div>
                <div class="field-value">${businessInfo}</div>
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
