import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? 'admin@earthprotect.org'
  const password = process.env.SUPER_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? 'ChangeMe123!'
  const name = process.env.SUPER_ADMIN_NAME ?? process.env.ADMIN_NAME ?? 'Super Admin'

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    // Upgrade to superAdmin if not already
    if (existing.role !== 'superAdmin') {
      await prisma.adminUser.update({ where: { email }, data: { role: 'superAdmin' } })
      console.log(`✅ Upgraded existing admin to Super Admin: ${email}`)
    } else {
      console.log(`Super Admin already exists: ${email}`)
    }
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.adminUser.create({
    data: { email, password: hashed, name, role: 'superAdmin' },
  })
  console.log(`✅ Super Admin created: ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   ⚠️  Change this password after first login!`)
  console.log(``)
  console.log(`   To change credentials, update .env.local:`)
  console.log(`   SUPER_ADMIN_EMAIL=your@email.com`)
  console.log(`   SUPER_ADMIN_PASSWORD=YourNewPassword`)
  console.log(`   Then run: npm run db:seed`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
