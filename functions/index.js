/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const sgMail = require("@sendgrid/mail");
// import * as sgMail from '@sendgrid/mail';

exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  // Stripe initialization
  const stripe = require("stripe")(functions.config().stripe.secret_key);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: "http://localhost:3000/orderSuccess",
    cancel_url: "http://localhost:3000/paymentCancelled",
    metadata: {
      pieceId: data.pieceId,
      orderId: data.orderId,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: 100 * data.totalPrice,
          product_data: {
            name: data.pieceTitle,
            images: [data.pieceImage],
          },
        },
      },
    ],
  });

  return {
    id: session.id,
  };
});

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripe = require("stripe")(functions.config().stripe.secret_key);
  let event;

  try {
    const whSec = functions.config().stripe.payments_webhook_secret;

    event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        whSec,
    );
  } catch (err) {
    console.error("Webhook signature verification failed.");
    return res.sendStatus(400);
  }

  try {
    const dataObject = event.data.object;
  
    const pieceId = event.data.object.metadata.pieceId;
    const orderId = event.data.object.metadata.orderId;
  
    if (dataObject.payment_status === "paid") {
      await admin.firestore().collection("orders").doc(orderId).update({
        checkoutSessionId: dataObject.id,
        paymentStatus: dataObject.payment_status,
        status: "paid online",
      });
  
      await admin.firestore().collection("pieces").doc(pieceId).update({
        isAvailable: false,
      });
    } else {
      await admin.firestore().collection("orders").doc(orderId).update({
        checkoutSessionId: dataObject.id,
        paymentStatus: dataObject.payment_status,
        status: "rejected",
      });
    }
  } catch (err) {
    alert(err.message);
    return res.sendStatus(400);
  }
  
  return res.sendStatus(200);
});



exports.newOrderPlacedSender = functions.firestore.document('orders/{orderId}').onCreate( async (change, context) => {
    const API_SENDGRID_KEY = functions.config().sendgrid.key;
    sgMail.setApiKey(API_SENDGRID_KEY);
    const TEMPLATE_RECIEVE_ID = functions.config().sendgrid.template_recieve;
  
      //get the order details
      const orderDetails = change.data();
      
      // get sender email
      const senderSnap = await admin.firestore().collection('users').doc(orderDetails.sender).get();
      const sender = senderSnap.data();
  
      // get reciever email
      const recieverSnap = await admin.firestore().collection('users').doc(orderDetails.reciever).get();
      const reciever = recieverSnap.data();
  
      // email
      const msg = {
        to: [sender.email, reciever.email],
        from: "theartclique.office@gmail.com",
        template_id: TEMPLATE_RECIEVE_ID,
        dynamic_template_data: {
          subject: `New order #${context.params.orderId}`,
          orderId: context.params.orderId,
        },
      };
    // sending the email
    return sgMail.send(msg);
});

exports.orderStatusChanged = functions.firestore.document('orders/{orderId}').onUpdate(async (change, context) => {
  const API_SENDGRID_KEY = functions.config().sendgrid.key;
    sgMail.setApiKey(API_SENDGRID_KEY);
    const TEMPLATE_STATUS_ID = functions.config().sendgrid.template_status;

  // Early exit if the 'status' field has not changed
  if (change.after.data().status === change.before.data().status) {
    return null;
  }

  const orderChanged = change.after.data();

  // get sender email
  const senderSnap = await admin.firestore().collection('users').doc(orderChanged.sender).get();
  const sender = senderSnap.data();

  // email
  const msg = {
    to: sender.email,
    from: "theartclique.office@gmail.com",
    template_id: TEMPLATE_STATUS_ID,
    dynamic_template_data: {
      subject: `Order #${context.params.orderId} status has changed`,
      orderId: context.params.orderId,
      orderStatus: orderChanged.status,
    },
  };

  // sending the email
  return sgMail.send(msg);
});
