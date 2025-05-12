import Link from 'next/link'
import { Organization, Project } from '@prisma/client'

interface OrganizationWithProjects extends Organization {
  projects: Project[]
}

export default function OrganizationCard({ organization }: { organization: OrganizationWithProjects }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={organization.name}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <span className="text-primary-600 font-semibold">
                {organization.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {organization.name}
            </h3>
            <p className="text-sm text-gray-500">{organization.location}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{organization.description}</p>

        {organization.website && (
          <a
            href={organization.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Visit Website
          </a>
        )}

        {organization.projects.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Active Projects
            </h4>
            <ul className="space-y-2">
              {organization.projects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <Link
            href={`/organizations/${organization.id}`}
            className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
} 