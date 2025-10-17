import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      userId: session.user.id
    }).populate('items.albumId', 'title coverImage description');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        items: order.items,
        shippingInfo: order.shippingInfo,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { action, trackingNumber, estimatedDelivery } = body;

    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      userId: session.user.id
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only allow certain status updates for regular users
    if (action === 'cancel' && order.orderStatus === 'pending') {
      order.orderStatus = 'cancelled';
      order.updatedAt = new Date();
      await order.save();
    } else if (action === 'update-tracking' && session.user.role === 'admin') {
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
      order.updatedAt = new Date();
      await order.save();
    } else {
      return NextResponse.json({ error: 'Invalid action or insufficient permissions' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        status: order.orderStatus,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery
      }
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
