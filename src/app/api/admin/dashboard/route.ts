import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Album from '@/models/Album';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Calculate date ranges
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get all orders count
    const totalOrders = await Order.countDocuments();

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ 
      orderStatus: 'pending' 
    });

    // Get this month's revenue
    const thisMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Get last month's revenue for comparison
    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth, $lt: thisMonth },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Get this month's orders count
    const thisMonthOrders = await Order.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    // Get last month's orders count
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });

    // Get albums created this month
    const albumsCreated = await Album.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    // Calculate revenue totals
    const currentRevenue = thisMonthRevenue[0]?.total || 0;
    const previousRevenue = lastMonthRevenue[0]?.total || 0;

    // Calculate percentage changes
    let revenueChange = 0;
    if (previousRevenue > 0) {
      revenueChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    } else if (currentRevenue > 0) {
      revenueChange = 100;
    }

    let ordersChange = 0;
    if (lastMonthOrders > 0) {
      ordersChange = ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;
    } else if (thisMonthOrders > 0) {
      ordersChange = 100;
    }

    const stats = {
      totalOrders,
      pendingOrders,
      revenue: currentRevenue,
      albumsCreated,
      revenueChange,
      ordersChange
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
