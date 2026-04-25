/**
 * Database Seed Script
 * 
 * Populate the database with initial test data
 * 
 * Usage: npm run seed
 */

import { db } from './db.js';  
import { users, groups, groupMembers } from '@models/schema.js';

/**
 * Seed the database with test data
 */
async function seed(): Promise<void> {
  try {
    console.log('🌱 Starting database seed...\n');

    // Seed users
    console.log('👥 Seeding users...');
    const userIds = await db
      .insert(users)
      .values([
        {
          email: 'alice@example.com',
          name: 'Alice Johnson',
          passwordHash: 'placeholder_hash_1', // In production, use bcrypt
        },
        {
          email: 'bob@example.com',
          name: 'Bob Smith',
          passwordHash: 'placeholder_hash_2',
        },
        {
          email: 'charlie@example.com',
          name: 'Charlie Brown',
          passwordHash: 'placeholder_hash_3',
        },
      ])
      .returning({ id: users.id });

    console.log(`✅ Created ${userIds.length} users\n`);

    // Seed groups
    console.log('👨‍👩‍👧‍👦 Seeding groups...');
    const groupIds = await db
      .insert(groups)
      .values([
        {
          name: 'Baguio Trip',
          description: 'Weekend trip to Baguio City',
          adminId: userIds[0].id,
        },
        {
          name: 'Apartment Expenses',
          description: 'Shared apartment expenses',
          adminId: userIds[0].id,
        },
      ])
      .returning({ id: groups.id });

    console.log(`✅ Created ${groupIds.length} groups\n`);

    // Seed group members
    console.log('📋 Seeding group members...');
    const allUserIds = userIds.map((u) => u.id);

    for (const groupId of groupIds) {
        await db.insert(groupMembers).values(
            allUserIds.map((userId, index) => {
                const role: 'admin' | 'member' = index === 0 ? 'admin' : 'member';
                return {
                    groupId: groupId.id,
                    userId,
                    role,
                };
            })
        );
    }

    console.log(
      `✅ Added ${allUserIds.length} members to each group\n`
    );

    console.log('✅ Database seed completed successfully!');
    console.log('\n📝 Seeded Data:');
    console.log(`   - ${userIds.length} users`);
    console.log(`   - ${groupIds.length} groups`);
    console.log(`   - ${allUserIds.length * groupIds.length} group memberships\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
