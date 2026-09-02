import { NextResponse } from "next/server";

const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg/orders";

export async function POST(request) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);
    const currency = body.currency || "INR";

    const customerName = body.customerName || "Guest Customer";
    const customerEmail = body.customerEmail || "customer@example.com";
    const customerPhone = body.customerPhone || "9999999999";

    if (!amount || amount <= 0) {
      console.log("CASHFREE ENV:", process.env.CASHFREE_ENV);
      console.log("CASHFREE APP ID:", process.env.CASHFREE_APP_ID);
      console.log("CASHFREE SECRET EXISTS:", !!process.env.CASHFREE_SECRET_KEY);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount.",
        },
        { status: 400 },
      );
    }

    if (!process.env.CASHFREE_APP_ID) {
      return NextResponse.json(
        {
          success: false,
          message: "Cashfree Sandbox App ID is not configured.",
        },
        { status: 500 },
      );
    }

    if (!process.env.CASHFREE_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Cashfree Sandbox Secret Key is not configured.",
        },
        { status: 500 },
      );
    }

    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const customerId = `customer_${Date.now()}`;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const payload = {
      order_id: orderId,

      order_amount: Number(amount.toFixed(2)),

      order_currency: currency,

      customer_details: {
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },

      order_meta: {
        return_url: `${siteUrl}/payment/success?order_id={order_id}`,
        notify_url: `${siteUrl}/api/cashfree/webhook`,
      },

      order_note: "Currency conversion payment",
    };

    console.log("Cashfree Sandbox Request:", {
      orderId,
      amount,
      currency,
    });

    const response = await fetch(CASHFREE_API_URL, {
      method: "POST",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

        "x-api-version": "2025-01-01",

        "x-client-id": process.env.CASHFREE_APP_ID,

        "x-client-secret": process.env.CASHFREE_SECRET_KEY,

        "x-idempotency-key": crypto.randomUUID(),
      },

      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree Sandbox Create Order Error:", data);

      return NextResponse.json(
        {
          success: false,
          message:
            data?.message ||
            data?.error_description ||
            "Unable to create Cashfree sandbox order.",

          data,
        },
        {
          status: response.status,
        },
      );
    }

    console.log("Cashfree Sandbox Order Created:", {
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      orderStatus: data.order_status,
    });

    return NextResponse.json({
      success: true,

      environment: "sandbox",

      orderId: data.order_id || orderId,

      paymentSessionId: data.payment_session_id,
      
      orderStatus: data.order_status,
      data,
    });
  } catch (error) {
    console.error("Cashfree Sandbox Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Cashfree sandbox payment service is unavailable.",
      },
      {
        status: 500,
      },
    );
  }
}
