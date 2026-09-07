import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Missing webhook signature or secret" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err?.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerEmail = session.customer_email || session.metadata?.email;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: "PRO",
              usageLimit: 999999,
              stripeCustomerId: (session.customer as string) || undefined,
            },
          });
        } else if (customerEmail) {
          await prisma.user.update({
            where: { email: customerEmail },
            data: {
              plan: "PRO",
              usageLimit: 999999,
              stripeCustomerId: (session.customer as string) || undefined,
            },
          });
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscription.id },
            update: {
              status: subscription.status,
              stripeCustomerId: subscription.customer as string,
            },
            create: {
              userId,
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: subscription.customer as string,
              status: subscription.status,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (subscription.status === "active") {
          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: { plan: "PRO", usageLimit: 999999 },
            });
          }
        } else if (
          subscription.status === "canceled" ||
          subscription.status === "unpaid" ||
          subscription.status === "past_due"
        ) {
          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: { plan: "FREE", usageLimit: 3 },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: "FREE", usageLimit: 3 },
          });
          await prisma.subscription.deleteMany({
            where: { stripeSubscriptionId: subscription.id },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handling error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
