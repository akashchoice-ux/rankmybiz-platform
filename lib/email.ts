import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@rankmybiz.ai";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? process.env.ADMIN_EMAIL ?? "admin@rankmybiz.ai";

/** Notify admin that a new listing was submitted and needs review. */
export async function sendSubmissionNotification(listing: {
  name: string;
  category: string;
  city: string;
  email: string;
  phone: string;
  ssm_number: string;
  package_name: string;
}) {
  try {
    await resend.emails.send({
      from: `RankMyBiz <${FROM}>`,
      to: ADMIN_EMAIL,
      subject: `New Listing Submission: ${listing.name}`,
      html: `
        <h2>New Business Listing Submitted</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;color:#666">Business</td><td style="padding:8px;font-weight:bold">${listing.name}</td></tr>
          <tr><td style="padding:8px;color:#666">Category</td><td style="padding:8px">${listing.category}</td></tr>
          <tr><td style="padding:8px;color:#666">City</td><td style="padding:8px">${listing.city}</td></tr>
          <tr><td style="padding:8px;color:#666">SSM Number</td><td style="padding:8px">${listing.ssm_number}</td></tr>
          <tr><td style="padding:8px;color:#666">Package</td><td style="padding:8px">${listing.package_name}</td></tr>
          <tr><td style="padding:8px;color:#666">Email</td><td style="padding:8px">${listing.email}</td></tr>
          <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px">${listing.phone}</td></tr>
        </table>
        <p style="margin-top:20px">
          <a href="https://rankmybiz.ai/admin/listings" style="background:#4F46E5;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">
            Review in Admin Panel →
          </a>
        </p>
      `,
    });
  } catch (err) {
    console.error("Failed to send submission notification:", err);
  }
}

/** Notify the business owner that their listing was received. */
export async function sendSubmissionConfirmation(listing: {
  name: string;
  email: string;
  package_name: string;
}) {
  try {
    await resend.emails.send({
      from: `RankMyBiz <${FROM}>`,
      to: listing.email,
      subject: `Your listing "${listing.name}" has been submitted`,
      html: `
        <h2>Thank you for submitting your business!</h2>
        <p>We've received your listing for <strong>${listing.name}</strong> on the <strong>${listing.package_name}</strong> plan.</p>
        <p>Our team will review and verify your business within <strong>24–48 hours</strong>. We'll email you once your listing is live.</p>
        ${listing.package_name !== "Free" ? "<p>If you selected a paid plan, please complete your bank transfer payment. Your listing will go live after payment verification.</p>" : ""}
        <p style="margin-top:20px;color:#666;font-size:13px">— The RankMyBiz Team</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }
}

/** Notify the business owner when a lead enquiry comes in. */
export async function sendLeadNotification(params: {
  business_email: string;
  business_name: string;
  lead_name: string;
  lead_phone: string;
  lead_message?: string;
}) {
  try {
    await resend.emails.send({
      from: `RankMyBiz <${FROM}>`,
      to: params.business_email,
      subject: `New customer enquiry for ${params.business_name}`,
      html: `
        <h2>You have a new customer enquiry!</h2>
        <p>Someone is interested in your business <strong>${params.business_name}</strong>.</p>
        <table style="border-collapse:collapse;width:100%;max-width:400px;margin-top:16px">
          <tr><td style="padding:8px;color:#666">Name</td><td style="padding:8px;font-weight:bold">${params.lead_name}</td></tr>
          <tr><td style="padding:8px;color:#666">Phone</td><td style="padding:8px;font-weight:bold">${params.lead_phone}</td></tr>
          ${params.lead_message ? `<tr><td style="padding:8px;color:#666">Message</td><td style="padding:8px">${params.lead_message}</td></tr>` : ""}
        </table>
        <p style="margin-top:16px"><strong>Respond quickly</strong> — customers who get a fast reply are more likely to buy.</p>
        <p style="margin-top:20px;color:#666;font-size:13px">— Sent via RankMyBiz</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send lead notification:", err);
  }
}
