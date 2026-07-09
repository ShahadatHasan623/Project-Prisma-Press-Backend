import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { subscriptionStatus } from "../../../generated/prisma/enums";

const getPeriodEnd = (payload: Stripe.Subscription) => {
  const currentPeriodEndInMilliseconds =
    payload.items.data[0]?.current_period_end!;

  const currentPeriodEnd = new Date(currentPeriodEndInMilliseconds * 1000);
  return currentPeriodEnd;
};
export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const userId = session.metadata?.userId;
  const stripeCoustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;
  if (!userId || !stripeSubscriptionId || !stripeCoustomerId) {
    console.log(`Webhook : Missing required data in session metadata. userId: ${userId}, stripeSubscriptionId: ${stripeSubscriptionId}, stripeCoustomerId: ${stripeCoustomerId}`);
    return;
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId
  );

  const currentPeriodEnd = getPeriodEnd(stripeSubscription);

  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCoustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
    update: {
      stripeCoustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};
export const handleChangeSubscription =async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;
  const status =
    payload.status === "active" || payload.status === "trialing"
      ? subscriptionStatus.ACTIVE
      : payload.status === "canceled"
      ? subscriptionStatus.CANCELED
      : subscriptionStatus.EXPRIED;

  const currentPeriodEnd = getPeriodEnd(payload);

  const isSubscriptionExist =await prisma.subscription.findUnique({
    where:{
      stripeSubscriptionId
    }
  })

  if(!isSubscriptionExist){
    console.log(`Webhook : No Subscription found for subscription id :${stripeSubscriptionId}`);
    return;
  }

 await prisma.subscription.update({
  where:{
    stripeSubscriptionId
  },
  data:{
    status,
    currentPeriodEnd
  }
 })


};