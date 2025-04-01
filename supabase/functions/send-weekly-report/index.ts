
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface EmailRequest {
  email: string;
  skips: number;
  savings: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set in environment variables');
    }
    
    const { email, skips, savings } = await req.json() as EmailRequest;
    
    if (!email || skips === undefined || savings === undefined) {
      throw new Error('Missing required fields: email, skips, savings');
    }
    
    // Format the savings to 2 decimal places
    const formattedSavings = savings.toFixed(2);
    
    // Create email content
    const emailContent = {
      from: 'Skiipper <onboarding@resend.dev>',
      to: email,
      subject: 'Your Weekly Savings Report',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3B82F6;">Skiipper Weekly Report</h1>
          </div>
          
          <p>Hi there,</p>
          
          <p>Here's your weekly savings report:</p>
          
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Habits Skipped:</strong> ${skips}</p>
            <p style="margin: 5px 0;"><strong>Total Savings:</strong> $${formattedSavings}</p>
          </div>
          
          <p>Don't forget to transfer $${formattedSavings} to your savings account!</p>
          
          <p>Keep up the good work. Every skip gets you closer to your financial goals.</p>
          
          <p>Best regards,<br/>The Skiipper Team</p>
        </div>
      `
    };
    
    // Send email with Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailContent)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${JSON.stringify(result)}`);
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", data: result }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error(`Error in send-weekly-report function:`, error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
})
