const Student = require('../models/Student');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Revenue (Sum of all payment amounts)
    const totalRevenueResult = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // 2. Total Students (Unique individuals)
    const totalStudents = await Student.countDocuments();

    // 3. Today's Collection
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayCollectionResult = await Payment.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const todayCollection = todayCollectionResult[0]?.total || 0;

    // 4. Pending Amount (Sum of all enrollment balances)
    const totalPendingResult = await Enrollment.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);
    const totalPending = totalPendingResult[0]?.total || 0;

    // 5. Recent Transactions
    const recentTransactions = await Payment.find()
      .populate('studentId')
      .populate('enrollmentId')
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Chart Data (Dynamic based on view)
    const view = req.query.view || 'monthly';
    let chartData = [];

    if (view === 'weekly') {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      
      const weeklyRevenue = await Payment.aggregate([
        { $match: { createdAt: { $gte: last7Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: '$amountPaid' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      chartData = weeklyRevenue.map(item => ({
        name: days[new Date(item._id).getDay()],
        revenue: item.revenue
      }));

      if (chartData.length === 0) {
        chartData = days.map(d => ({ name: d, revenue: 0 }));
      }
    } else {
      const monthlyRevenue = await Payment.aggregate([
        {
          $group: {
            _id: { 
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            revenue: { $sum: '$amountPaid' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chartData = monthlyRevenue.map(item => ({
        name: months[item._id.month - 1],
        revenue: item.revenue
      }));

      if (chartData.length === 0) {
        chartData = [
          { name: 'Jan', revenue: 0 },
          { name: 'Feb', revenue: 0 },
          { name: 'Mar', revenue: 0 },
          { name: 'Apr', revenue: 0 },
          { name: 'May', revenue: 0 },
          { name: 'Jun', revenue: 0 },
        ];
      }
    }

    // 7. Course Distribution (Revenue & Student count per course)
    const courseDistribution = await Enrollment.aggregate([
      {
        $group: {
          _id: '$courseName',
          revenue: { $sum: '$paidAmount' },
          studentsCount: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      totalRevenue,
      totalStudents,
      todayCollection,
      totalPending,
      recentTransactions: recentTransactions.map(t => ({
        _id: t._id,
        receiptNumber: t.transactionId || `TXN-${t._id.toString().slice(-6).toUpperCase()}`,
        student: t.studentId,
        course: t.enrollmentId?.courseName,
        amount: t.amountPaid,
        paymentMode: t.paymentMode,
        createdAt: t.createdAt
      })),
      chartData,
      courseDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
