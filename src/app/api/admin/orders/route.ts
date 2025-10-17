import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order, { IOrderItem } from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};
    if (status) {
      query.orderStatus = status;
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingInfo.name': { $regex: search, $options: 'i' } },
        { 'shippingInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('userId', 'name email')
      .populate('items.albumId', 'title');

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.userId?.name || 'Unknown',
          email: order.userId?.email || 'Unknown'
        },
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        items: order.items.map((item: IOrderItem) => ({
          albumTitle: item.albumTitle,
          quantity: item.quantity,
          printSize: item.printSize
        })),
        shippingInfo: order.shippingInfo,
        createdAt: order.createdAt,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { orderId, action, trackingNumber, estimatedDelivery, newStatus } = body;

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'update-status' && newStatus) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(newStatus)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      order.orderStatus = newStatus;
    }

    if (action === 'update-tracking') {
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    }

    if (action === 'update-payment-status') {
      const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
      if (!validPaymentStatuses.includes(newStatus)) {
        return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
      }
      order.paymentStatus = newStatus;
    }

    order.updatedAt = new Date();
    await order.save();

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery
      }
    });

  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
