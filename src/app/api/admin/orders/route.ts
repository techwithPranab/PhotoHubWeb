import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order, { IOrder, IOrderItem } from '@/models/Order';

interface PopulatedOrder extends Omit<IOrder, 'userId'> {
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

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
      query.status = status;
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
      orders: orders.map(order => {
        const populatedOrder = order as unknown as PopulatedOrder;
        return {
          id: populatedOrder._id,
          orderNumber: populatedOrder.orderNumber,
          customer: {
            name: populatedOrder.userId?.name || 'Unknown',
            email: populatedOrder.userId?.email || 'Unknown'
          },
          status: populatedOrder.status,
          paymentStatus: populatedOrder.paymentStatus,
          total: populatedOrder.total,
          items: populatedOrder.items.map((item: IOrderItem) => ({
            albumTitle: item.albumTitle,
            quantity: item.quantity,
            printSize: item.printSize
          })),
          shippingInfo: populatedOrder.shippingInfo,
          createdAt: populatedOrder.createdAt,
          trackingNumber: populatedOrder.trackingNumber,
          estimatedDelivery: populatedOrder.estimatedDelivery
        };
      }),
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
      order.status = newStatus;
    }

    if (action === 'update-tracking') {
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    }

    if (action === 'update-payment-status') {
      const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'bypassed'];
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
        status: order.status,
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
