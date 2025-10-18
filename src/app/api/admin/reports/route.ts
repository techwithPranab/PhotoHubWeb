import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '12months';

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    switch (range) {
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        break;
      case '12months':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear() - 2, now.getMonth(), 1);
        break;
      case 'all':
      default:
        startDate = new Date(2020, 0, 1); // Start from 2020
        previousStartDate = new Date(2020, 0, 1);
        break;
    }

    // Get total revenue and orders for current period
    const currentPeriodOrders = await Order.find({
      createdAt: { $gte: startDate },
      paymentStatus: { $in: ['completed', 'paid', 'bypassed'] }
    });

    const totalRevenue = currentPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = currentPeriodOrders.length;

    // Get previous period data for comparison
    const previousPeriodOrders = await Order.find({
      createdAt: { $gte: previousStartDate, $lt: startDate },
      paymentStatus: { $in: ['completed', 'paid', 'bypassed'] }
    });

    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const previousOrdersCount = previousPeriodOrders.length;

    // Calculate growth percentages
    let revenueGrowth = 0;
    if (previousRevenue > 0) {
      revenueGrowth = ((totalRevenue - previousRevenue) / previousRevenue) * 100;
    } else if (totalRevenue > 0) {
      revenueGrowth = 100;
    }

    let ordersGrowth = 0;
    if (previousOrdersCount > 0) {
      ordersGrowth = ((totalOrders - previousOrdersCount) / previousOrdersCount) * 100;
    } else if (totalOrders > 0) {
      ordersGrowth = 100;
    }

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get revenue by month
    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: { $in: ['completed', 'paid', 'bypassed'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const monthlyData = revenueByMonth.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      revenue: item.revenue,
      orders: item.orders
    }));

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalOrdersForStatus = ordersByStatus.reduce((sum, item) => sum + item.count, 0);
    const statusData = ordersByStatus.map(item => ({
      status: item._id,
      count: item.count,
      percentage: totalOrdersForStatus > 0 ? (item.count / totalOrdersForStatus) * 100 : 0
    }));

    // Get top products (album types/sizes)
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: { $in: ['completed', 'paid', 'bypassed'] }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: {
            printSize: '$items.printSize',
            paperType: '$items.paperType',
            coverType: '$items.coverType'
          },
          orders: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.totalPrice' }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const productData = topProducts.map(item => ({
      name: `${item._id.printSize} ${item._id.paperType} ${item._id.coverType}`,
      orders: item.orders,
      revenue: item.revenue
    }));

    const data = {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenueGrowth,
      ordersGrowth,
      revenueByMonth: monthlyData,
      ordersByStatus: statusData,
      topProducts: productData
    };

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reports' },
      { status: 500 }
    );
  }
}
