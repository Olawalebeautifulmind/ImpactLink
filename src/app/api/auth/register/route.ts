import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { Role } from '@/types/auth'

export async function POST(req: Request) {
  try {
    const { name, email, password, role, profile } = await req.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        profile: {
          create: {
            bio: profile.bio,
            location: profile.location,
            skills: profile.skills,
            interests: profile.interests,
            languages: profile.languages
          }
        },
        ...(role === Role.VOLUNTEER && {
          volunteer: {
            create: {
              hours: 0
            }
          }
        }),
        ...(role === Role.SPONSOR && {
          sponsor: {
            create: {
              totalDonated: 0
            }
          }
        })
      },
    })

    if (role === 'ORGANIZATION') {
      await prisma.organization.create({
        data: {
          name,
          description: 'Organization description',
          location: 'Location to be updated',
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    } else if (role === 'VOLUNTEER') {
      await prisma.volunteer.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })
    }

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    )
  }
} 