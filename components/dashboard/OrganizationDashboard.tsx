'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  location: string
  status: string
  goal: number
  raised: number
  applications: {
    id: string
    status: string
    volunteer: {
      user: {
        name: string
        email: string
      }
    }
  }[]
}

export default function OrganizationDashboard() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects/organization')
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Organization
          </h2>
          <Link
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create New Project
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Active Projects</p>
            <p className="text-2xl font-bold text-gray-900">
              {projects.filter(p => p.status === 'ACTIVE').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Raised</p>
            <p className="text-2xl font-bold text-gray-900">
              ${projects.reduce((sum, p) => sum + p.raised, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Applications</p>
            <p className="text-2xl font-bold text-gray-900">
              {projects.reduce(
                (sum, p) =>
                  sum + p.applications.filter(a => a.status === 'PENDING').length,
                0
              )}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white shadow rounded-lg overflow-hidden">
              <ProjectCard project={project} />
              {project.applications.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Recent Applications
                  </h3>
                  <ul className="space-y-2">
                    {project.applications.slice(0, 3).map((application) => (
                      <li
                        key={application.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-900">
                          {application.volunteer.user.name}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            application.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : application.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {application.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {project.applications.length > 3 && (
                    <Link
                      href={`/projects/${project.id}/applications`}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-500"
                    >
                      View all applications
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 