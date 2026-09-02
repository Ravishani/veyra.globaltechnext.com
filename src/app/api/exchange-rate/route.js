import { NextResponse } from "next/server";

const API_URL = "https://api.frankfurter.dev/v2";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from")?.toUpperCase();
    const to = searchParams.get("to")?.toUpperCase();

    if (!from || !to) {
      return NextResponse.json(
        {
          success: false,
          message: "From and To currencies are required.",
        },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json({
        success: true,
        rate: 1,
        from,
        to,
        date: new Date().toISOString(),
      });
    }

    const response = await fetch(
      `${API_URL}/rate/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      return NextResponse.json(
        {
          success: false,
          message: errorData?.message || "Unable to fetch exchange rate.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      rate: Number(data.rate),
      from: data.base,
      to: data.quote,
      date: data.date,
    });
  } catch (error) {
    console.error("Exchange Rate API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Exchange rate service is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}