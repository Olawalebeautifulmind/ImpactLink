import Link from 'next/link'
import { Project, Organization, Volunteer, User } from '@prisma/client'

interface ProjectWithRelations extends Project {
  organization: Organization
  volunteers: (Volunteer & {
    user: User
  })[]
}

export default function ProjectCard({ project }: { project: ProjectWithRelations }) {
  const progress = (project.raised / project.goal) * 100

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/organizations/${project.organization.id}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {project.organization.name}
          </Link>
          <span className="text-sm text-gray-500">{project.location}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>${project.raised.toLocaleString()}</span>
            <span>${project.goal.toLocaleString()}</span>
          </div>
        </div>

        {project.volunteers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Recent Volunteers
            </h4>
            <div className="flex -space-x-2">
              {project.volunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <span className="text-xs text-gray-600">
                    {volunteer.user.name?.charAt(0) || '?'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href={`/projects/${project.id}`}
            className="flex-1 text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View Details
          </Link>
          <Link
            href={`/projects/${project.id}/donate`}
            className="flex-1 text-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Donate
          </Link>
        </div>
      </div>
    </div>
  )
} 