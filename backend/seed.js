const User = require('./models/User');
const Helper = require('./models/Helper');
const Notice = require('./models/Notice');

module.exports = async function seed() {
  try {
    // Only seed if DB is empty
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) return; // Already seeded

    console.log('🌱 Seeding database...');

    // ── Admin User ──────────────────────────────────────
    const admin = await User.create({
      name: 'Society Admin',
      email: 'admin@panchayat.com',
      password: 'Admin@123',
      houseNo: '001',
      wing: 'Admin',
      role: 'admin',
      isVerified: true,
    });

    // ── Sample Residents ────────────────────────────────
    const r1 = await User.create({
      name: 'Mrs. Priya Sharma',
      email: 'priya@example.com',
      password: 'Resident@123',
      houseNo: '201',
      wing: 'A',
      role: 'resident',
      isVerified: true,
    });
    const r2 = await User.create({
      name: 'Mr. Rajesh Gupta',
      email: 'rajesh@example.com',
      password: 'Resident@123',
      houseNo: '405',
      wing: 'B',
      role: 'resident',
      isVerified: true,
    });
    const r3 = await User.create({
      name: 'Mrs. Anita Mehta',
      email: 'anita@example.com',
      password: 'Resident@123',
      houseNo: '102',
      wing: 'A',
      role: 'resident',
      isVerified: true,
    });

    // Pending resident (not yet verified)
    await User.create({
      name: 'Mr. Vikram Singh',
      email: 'vikram@example.com',
      password: 'Resident@123',
      houseNo: '303',
      wing: 'C',
      role: 'resident',
      isVerified: false,
    });

    // ── Helpers ─────────────────────────────────────────
    await Helper.create([
      {
        name: 'Ramesh Kumar',
        category: 'Electrician',
        contact: '+91 98765-43210',
        status: 'Available',
        tags: ['Punctual', 'Owns Toolbox', 'Licensed'],
        experience: '8 years',
        rating: 4.8,
        verifiedByAdmin: true,
        vouchedBy: [
          { houseNo: '201', wing: 'A', name: 'Mrs. Priya Sharma', userId: r1._id },
          { houseNo: '405', wing: 'B', name: 'Mr. Rajesh Gupta', userId: r2._id },
        ],
        createdBy: admin._id,
      },
      {
        name: 'Sunita Devi',
        category: 'Cook',
        contact: '+91 97654-32109',
        status: 'Available',
        tags: ['Punctual', 'Great with Kids', 'Veg Specialist'],
        experience: '6 years',
        rating: 4.9,
        verifiedByAdmin: true,
        vouchedBy: [
          { houseNo: '201', wing: 'A', name: 'Mrs. Priya Sharma', userId: r1._id },
          { houseNo: '102', wing: 'A', name: 'Mrs. Anita Mehta', userId: r3._id },
        ],
        createdBy: admin._id,
      },
      {
        name: 'Anil Singh',
        category: 'Driver',
        contact: '+91 91234-56789',
        status: 'Available',
        tags: ['Night Shift OK', 'Clean Record', 'GPS Savvy'],
        experience: '10 years',
        rating: 4.5,
        verifiedByAdmin: true,
        vouchedBy: [
          { houseNo: '405', wing: 'B', name: 'Mr. Rajesh Gupta', userId: r2._id },
        ],
        createdBy: admin._id,
      },
      {
        name: 'Meena Kumari',
        category: 'Maid',
        contact: '+91 99887-76655',
        status: 'Busy',
        tags: ['Trustworthy', 'Owns Mop Kit', 'Non-veg cook too'],
        experience: '4 years',
        rating: 4.6,
        verifiedByAdmin: true,
        vouchedBy: [
          { houseNo: '102', wing: 'A', name: 'Mrs. Anita Mehta', userId: r3._id },
        ],
        createdBy: admin._id,
      },
      {
        name: 'Suresh Plumber',
        category: 'Plumber',
        contact: '+91 90011-22334',
        status: 'Available',
        tags: ['Emergency Call OK', '24/7', 'Fair Pricing'],
        experience: '12 years',
        rating: 4.7,
        verifiedByAdmin: true,
        vouchedBy: [
          { houseNo: '201', wing: 'A', name: 'Mrs. Priya Sharma', userId: r1._id },
          { houseNo: '405', wing: 'B', name: 'Mr. Rajesh Gupta', userId: r2._id },
          { houseNo: '102', wing: 'A', name: 'Mrs. Anita Mehta', userId: r3._id },
        ],
        createdBy: admin._id,
      },
    ]);

    // ── Notices ─────────────────────────────────────────
    const futureDate = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await Notice.create([
      {
        title: '⚠️ Water Supply Shutdown – Block B',
        content:
          'Due to pipeline repair work, water supply in Block B will be shut from 10 AM to 4 PM on 3rd May 2026. Please store water in advance. Inconvenience is regretted.',
        priority: 'Emergency',
        expiresAt: futureDate(7),
        isPinned: true,
        createdBy: admin._id,
      },
      {
        title: '🪔 Diwali Celebration – Society Courtyard',
        content:
          'All residents are cordially invited to the annual Diwali Puja and celebration in the main courtyard on 5th May 2026 at 7:00 PM. Cultural events, rangoli competition, and dinner for all!',
        priority: 'Event',
        expiresAt: futureDate(10),
        isPinned: false,
        createdBy: admin._id,
      },
      {
        title: '🚗 Parking Rule Reminder',
        content:
          'Residents are reminded NOT to park in visitor spots after 8 PM. Violating vehicles will be towed at the owner\'s expense. Visitor passes must be displayed on the dashboard.',
        priority: 'General',
        expiresAt: futureDate(30),
        isPinned: false,
        createdBy: admin._id,
      },
      {
        title: '🏋️ Gym Maintenance – Closed This Weekend',
        content:
          'The society gym (Block A, Ground Floor) will remain closed on Saturday and Sunday, 4th–5th May, for equipment servicing and floor polishing.',
        priority: 'General',
        expiresAt: futureDate(5),
        isPinned: false,
        createdBy: admin._id,
      },
      {
        title: '🔥 Fire Drill on 6th May',
        content:
          'A mandatory fire safety drill will be conducted on 6th May at 9 AM. All residents must assemble at the designated muster point near the main gate. Attendance is compulsory.',
        priority: 'Emergency',
        expiresAt: futureDate(8),
        isPinned: false,
        createdBy: admin._id,
      },
    ]);

    console.log('✅ Seed complete! Admin: admin@panchayat.com / Admin@123');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};
