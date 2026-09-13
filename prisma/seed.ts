import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding KING DAY Database baseline...');

  // Create default Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@king-day.shop' },
    update: {},
    create: {
      email: 'admin@king-day.shop',
      password: hashedPassword,
      name: 'KING DAY Admin',
      phone: '+919495902904',
      role: Role.ADMIN,
    },
  });
  console.log('Admin user created:', admin.email);

  // Baseline Products (Zero invention rule)
  const product1 = await prisma.product.upsert({
    where: { sku: 'KD-TZ-WIZ-01' },
    update: {},
    create: {
      sku: 'KD-TZ-WIZ-01',
      slug: 'toyzone-wizard-electric-scooty',
      name: 'Toyzone Wizard Electric Scooty',
      shortDescription: 'Fun, safe, and vibrant electric scooty for kids with headlights and audio.',
      description: 'The Toyzone Wizard Electric Scooty is designed for kids to enjoy a smooth, fun, and safe ride. Equipped with rechargeable batteries, realistic controls, bright LED headlights, and built-in music.',
      category: 'Kids Ride-On',
      brand: 'Toyzone',
      images: [
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80'
      ],
      mrp: 12999.00,
      salePrice: 6999.00,
      stock: 15,
      isPublished: true,
      panIndiaEligible: true,
      ageSuitability: '2–5 Years',
      weightCapacity: '25 kg',
      specifications: {
        battery: '6V 4.5Ah',
        motor: 'Single Motor',
        speed: '3 km/h',
        chargeTime: '6-8 Hours'
      }
    },
  });

  const product2 = await prisma.product.upsert({
    where: { sku: 'KD-JEEP-ALP-12' },
    update: {},
    create: {
      sku: 'KD-JEEP-ALP-12',
      slug: 'king-day-alpine-off-road-electric-jeep-12v',
      name: 'KING DAY Alpine Off-Road Electric Jeep 12V',
      shortDescription: 'Heavy-duty 12V dual-motor electric jeep with remote control and suspension.',
      description: 'The KING DAY Alpine Off-Road Electric Jeep 12V brings luxury off-road adventures to kids. Powered by a high-torque 12V battery system with parental remote control, suspension, and rugged tread tires.',
      category: 'Kids Ride-On',
      brand: 'KING DAY',
      images: [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80'
      ],
      mrp: 24999.00,
      salePrice: 17999.00,
      stock: 6,
      isPublished: true,
      panIndiaEligible: false,
      ageSuitability: '3–8 Years',
      weightCapacity: '40 kg',
      specifications: {
        battery: '12V 7Ah',
        motor: 'Dual 35W Motors',
        speed: '5-7 km/h',
        features: ['Parental 2.4G Remote', 'USB/AUX Player', 'Spring Suspension']
      }
    },
  });

  console.log('Seeded products:', product1.sku, product2.sku);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
