import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order, { IOrderItem } from '@/models/Order';
import Album from '@/models/Album';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const {
      albumId,
      printSize,
      paperType,
      coverType,
      quantity,
      shippingInfo,
      specialInstructions
    } = body;

    // Validate album exists and belongs to user
    const album = await Album.findOne({ _id: albumId, userId: session.user.id });
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    // Calculate pricing based on specifications
    const basePrice = getBasePrice(printSize);
    const paperPrice = getPaperPrice(paperType);
    const coverPrice = getCoverPrice(coverType);
    const pagePrice = getPagePrice(album.pageCount || 20);

    const subtotal = (basePrice + paperPrice + coverPrice + pagePrice) * quantity;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = calculateShipping(shippingInfo.country);
    const total = subtotal + tax + shipping;

    // Create order
    const order = new Order({
      userId: session.user.id,
      items: [{
        albumId,
        albumTitle: album.title,
        printSize,
        paperType,
        coverType,
        quantity,
        unitPrice: basePrice + paperPrice + coverPrice + pagePrice,
        totalPrice: subtotal
      }],
      shippingInfo,
      subtotal,
      shipping,
      tax,
      total,
      specialInstructions,
      orderStatus: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Create Stripe Payment Intent
    try {
      const paymentResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          orderId: order._id,
          metadata: {
            orderNumber: order.orderNumber,
            customerEmail: shippingInfo.email,
            albumTitle: album.title
          }
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await paymentResponse.json();

      // Update order with payment intent ID
      order.stripePaymentIntentId = paymentIntentId;
      await order.save();

      return NextResponse.json({
        success: true,
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.orderStatus
        },
        clientSecret
      });

    } catch (paymentError) {
      console.error('Payment intent creation failed:', paymentError);
      
      // Return order without payment intent - can be paid later
      return NextResponse.json({
        success: true,
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.orderStatus
        },
        paymentError: 'Payment system temporarily unavailable. Order created successfully.'
      });
    }

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const query: Record<string, unknown> = { userId: session.user.id };
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('items.albumId', 'title coverImage');

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map((item: IOrderItem) => ({
          albumTitle: item.albumTitle,
          printSize: item.printSize,
          quantity: item.quantity
        }))
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions for pricing calculations
function getBasePrice(printSize: string): number {
  const prices: { [key: string]: number } = {
    '8x10': 12.99,
    '11x14': 18.99,
    '16x20': 29.99,
    '24x30': 49.99
  };
  return prices[printSize] || 12.99;
}

function getPaperPrice(paperType: string): number {
  const prices: { [key: string]: number } = {
    'standard': 0,
    'premium': 3,
    'museum': 8
  };
  return prices[paperType] || 0;
}

function getCoverPrice(coverType: string): number {
  const prices: { [key: string]: number } = {
    'softcover': 0,
    'hardcover': 12
  };
  return prices[coverType] || 0;
}

function getPagePrice(pageCount: number): number {
  if (pageCount <= 20) return 0;
  if (pageCount <= 40) return 15;
  if (pageCount <= 60) return 25;
  if (pageCount <= 80) return 35;
  return 50;
}

function calculateShipping(country: string): number {
  return country === 'US' ? 9.99 : 24.99;
}
