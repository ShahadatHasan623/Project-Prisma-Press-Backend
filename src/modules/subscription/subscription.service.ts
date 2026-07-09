import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { subscriptionStatus } from "../../../generated/prisma/enums";
import { handleChangeSubscription, handleCheckoutSessionCompleted } from "./subscription.utils";

const createSubscriptionSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    let stripeCustomerId = user.subscription?.stripeCoustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });
    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};
const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // Occurs when a Checkout Session has been successfully completed.
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case "customer.subscription.updated":
      // Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
      handleChangeSubscription(event.data.object)

      break;
    case "customer.subscription.deleted":
      //Occurs whenever a customer’s subscription ends.
      handleChangeSubscription(event.data.object)
      break;
    // ... handle other event types
    default:
      console.log(`No Unhandled event type ${event.type}`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
 const isSubscriptionExists = await prisma.subscription.findUnique({
  where: {
    userId,
  },
});

if (!isSubscriptionExists) {
  return {
    isSubscribed: false,
  };
}
  const isActive =isSubscriptionExists.status === "ACTIVE" && isSubscriptionExists.currentPeriodEnd && new Date(isSubscriptionExists.currentPeriodEnd) > new Date();

  return{
    status:isSubscriptionExists.status,
    isSubscibed:isActive,
    currentPeriodEnd:isSubscriptionExists.currentPeriodEnd
  }
}


export const subscriptionService = {
  createSubscriptionSession,
  handleWebhook,
  getSubscriptionStatus
};
