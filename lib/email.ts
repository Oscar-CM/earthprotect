import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// ⚠️  Resend only accepts verified domains as FROM address.
// Gmail addresses will be rejected. For development, use onboarding@resend.dev.
// For production, verify your domain at resend.com/domains and set:
//   EMAIL_FROM="Earth Protect <no-reply@yourdomain.com>"
const FROM = process.env.EMAIL_FROM ?? 'Earth Protect <onboarding@resend.dev>'

async function send(payload: Parameters<typeof resend.emails.send>[0]) {
  const { data, error } = await resend.emails.send(payload)
  if (error) console.error('[Resend] Failed to send email:', error)
  else console.log('[Resend] Email sent:', data?.id, '→', payload.to)
}

export async function sendDonationThankYou({
  to, name, amount, frequency,
}: { to: string; name: string; amount: number; frequency: string }) {
  const freqLabel = frequency === 'one-time' ? 'one-time gift' : `${frequency} donation`
  await send({
    from: FROM,
    to,
    subject: 'Thank you for your donation to Earth Protect 🌍',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1a5c3a;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Earth Protect</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Protecting Africa's Wildlife</p>
        </div>
        <div style="background:#fff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <h2 style="color:#1a5c3a;margin-top:0">Thank you, ${name}!</h2>
          <p>Your <strong>$${amount}</strong> ${freqLabel} has been received. Every dollar goes directly to protecting African wildlife and their habitats.</p>
          <div style="background:#f0fdf4;border-left:4px solid #1a5c3a;padding:16px;border-radius:4px;margin:24px 0">
            <p style="margin:0;font-weight:bold;color:#1a5c3a">Your impact:</p>
            <ul style="margin:8px 0 0;padding-left:20px;color:#374151">
              <li>Funds anti-poaching ranger patrols</li>
              <li>Supports wildlife corridor protection</li>
              <li>Helps local community conservation programs</li>
            </ul>
          </div>
          <p>You'll receive our monthly newsletter with updates on the animals and projects your donation supports.</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="display:inline-block;background:#1a5c3a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;margin-top:8px">Visit Earth Protect</a>
          <p style="color:#6b7280;font-size:14px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px">
            Earth Protect · Conservation for Africa's Wildlife<br>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/donate" style="color:#1a5c3a">Manage your donation</a>
          </p>
        </div>
      </div>`,
  })
}

export async function sendAdoptionConfirmation({
  to, name, animalName, tierLabel, amount, interval,
}: { to: string; name: string; animalName: string; tierLabel: string; amount: number; interval: string }) {
  await send({
    from: FROM,
    to,
    subject: `You've adopted a ${animalName}! 🐾`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1a5c3a;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Earth Protect</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Your Adoption Certificate</p>
        </div>
        <div style="background:#fff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <h2 style="color:#1a5c3a;margin-top:0">Welcome, ${name}!</h2>
          <p>You are now officially sponsoring a <strong>${animalName}</strong> through the <strong>${tierLabel}</strong> plan.</p>
          <div style="background:#fefce8;border:2px solid #ca8a04;padding:20px;border-radius:8px;text-align:center;margin:24px 0">
            <p style="font-size:32px;margin:0">🐾</p>
            <h3 style="color:#92400e;margin:8px 0">Adoption Certificate</h3>
            <p style="margin:4px 0;font-weight:bold;font-size:18px">${name}</p>
            <p style="margin:4px 0;color:#6b7280">has adopted a ${animalName}</p>
            <p style="margin:8px 0;color:#374151"><strong>Plan:</strong> ${tierLabel} · $${amount}/${interval}</p>
          </div>
          <p>Your monthly sponsorship directly funds protection efforts for this species.</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/animals" style="display:inline-block;background:#1a5c3a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;margin-top:8px">Learn About ${animalName}s</a>
          <p style="color:#6b7280;font-size:14px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px">
            Earth Protect · Conservation for Africa's Wildlife
          </p>
        </div>
      </div>`,
  })
}

export async function sendOrderConfirmation({
  to, name, items, total,
}: { to: string; name: string; items: Array<{ name: string; quantity: number; price: number }>; total: number }) {
  const rows = items.map((i) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb">${i.name}</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right">×${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right">$${(i.price * i.quantity).toFixed(2)}</td></tr>`
  ).join('')

  await send({
    from: FROM,
    to,
    subject: 'Your Earth Protect order is confirmed 📦',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1a5c3a;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Earth Protect Shop</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Order Confirmation</p>
        </div>
        <div style="background:#fff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <h2 style="color:#1a5c3a;margin-top:0">Order confirmed, ${name}!</h2>
          <p>Thank you for your purchase. A portion of every sale goes directly to wildlife conservation.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <thead><tr style="background:#f9fafb">
              <th style="padding:8px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase">Item</th>
              <th style="padding:8px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">Qty</th>
              <th style="padding:8px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">Price</th>
            </tr></thead>
            <tbody>${rows}</tbody>
            <tfoot><tr>
              <td colspan="2" style="padding:12px 0;font-weight:bold;text-align:right">Total:</td>
              <td style="padding:12px 0;font-weight:bold;text-align:right;color:#1a5c3a;font-size:18px">$${total.toFixed(2)}</td>
            </tr></tfoot>
          </table>
          <p style="color:#6b7280;font-size:14px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px">
            Earth Protect · Conservation for Africa's Wildlife
          </p>
        </div>
      </div>`,
  })
}

export async function sendPaymentFailedNotice({ to, name }: { to: string; name: string }) {
  await send({
    from: FROM,
    to,
    subject: 'Action required: payment issue with your Earth Protect subscription',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#dc2626;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Payment Issue</h1>
        </div>
        <div style="background:#fff;padding:32px 24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <h2 style="color:#1a1a1a;margin-top:0">Hi ${name},</h2>
          <p>We were unable to process your recent payment. Please update your payment method to continue supporting Africa's wildlife.</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/donate" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;margin-top:8px">Update Payment Method</a>
          <p style="color:#6b7280;font-size:14px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px">
            Earth Protect · Conservation for Africa's Wildlife
          </p>
        </div>
      </div>`,
  })
}
