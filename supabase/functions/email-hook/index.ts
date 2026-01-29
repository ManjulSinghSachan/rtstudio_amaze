import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EmailHookPayload {
  user: {
    email: string;
    user_metadata?: Record<string, unknown>;
  };
  email_data: {
    token?: string;
    token_hash?: string;
    redirect_to?: string;
    email_action_type: string;
    site_url?: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

// Studio brand colors (warm craft palette)
const BRAND = {
  primary: "#c2622d", // hsl(16, 55%, 50%) - warm terracotta
  background: "#f7f0e8", // hsl(30, 40%, 92%) - warm cream
  foreground: "#3d3129", // hsl(20, 30%, 22%) - warm dark brown
  muted: "#7a6d61", // hsl(20, 25%, 48%) - warm gray
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailHookPayload = await req.json();
    console.log("Email hook received:", payload.email_data.email_action_type);

    const { user, email_data } = payload;
    const { email_action_type, token_hash, redirect_to, site_url } = email_data;

    // Build the magic link URL
    const baseUrl = redirect_to || site_url || "https://rtstudio.lovable.app";
    const magicLink = `${baseUrl.replace(/\/$/, '')}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}`;

    let subject = "";
    let heading = "";
    let bodyText = "";
    let buttonText = "";

    switch (email_action_type) {
      case "signup":
      case "magiclink":
        subject = "Enter the Relational Tech Studio";
        heading = "Welcome to the Studio";
        bodyText = "Click below to enter the Relational Tech Studio — your space to craft technology that serves your people and place.";
        buttonText = "Enter the Studio";
        break;
      case "recovery":
        subject = "Reset your Studio access";
        heading = "Reset Your Access";
        bodyText = "Click below to reset your access to the Relational Tech Studio.";
        buttonText = "Reset Access";
        break;
      case "email_change":
        subject = "Confirm your new email";
        heading = "Confirm Email Change";
        bodyText = "Click below to confirm your new email address for the Relational Tech Studio.";
        buttonText = "Confirm Email";
        break;
      default:
        subject = "Relational Tech Studio";
        heading = "Welcome";
        bodyText = "Click below to continue.";
        buttonText = "Continue";
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: ${BRAND.background};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${BRAND.background}; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 480px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #e8e0d8;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: ${BRAND.foreground}; font-family: Georgia, serif;">
                Relational Tech Studio
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: ${BRAND.foreground}; font-family: Georgia, serif; text-align: center;">
                ${heading}
              </h2>
              <p style="margin: 0 0 28px 0; font-size: 16px; line-height: 1.6; color: ${BRAND.muted}; text-align: center;">
                ${bodyText}
              </p>
              
              <!-- Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${magicLink}" style="display: inline-block; background-color: ${BRAND.primary}; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
                      ${buttonText}
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 28px 0 0 0; font-size: 13px; color: ${BRAND.muted}; text-align: center; line-height: 1.5;">
                This link expires in 1 hour. If you didn't request this, you can safely ignore it.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: ${BRAND.background}; text-align: center; border-top: 1px solid #e8e0d8;">
              <p style="margin: 0; font-size: 12px; color: ${BRAND.muted};">
                Made with care for neighbors everywhere
              </p>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: ${BRAND.muted};">
                <a href="https://relationaltechproject.org" style="color: ${BRAND.primary}; text-decoration: none;">Relational Tech Project</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailResponse = await resend.emails.send({
      from: "Relational Tech Studio <notifications@relationaltechproject.org>",
      to: [user.email],
      subject: subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in email-hook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
