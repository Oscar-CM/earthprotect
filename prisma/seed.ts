import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient().$extends(withAccelerate())

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@earthprotect.org'
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!'
  const name = process.env.ADMIN_NAME ?? 'Admin'

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.adminUser.create({ data: { email, password: hashed, name } })
  console.log(`✅ Admin user created: ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   ⚠️  Change this password after first login!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
