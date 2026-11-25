import type { RouteObject } from 'react-router'
import { CompaniesPage } from '../../pages/companies/ui/CompaniesPage'
import { CompanyPage } from '../../pages/company/ui/CompanyPage'
import { NotFoundPage } from '../../pages/not-found/ui/NotFoundPage'
import { DashboardLayout } from '../../widgets/dashboard-layout/ui/DashboardLayout'

// Конфигурация маршрутов в виде объекта: добавить страницу = добавить запись.
// Пути фронтенда не должны совпадать с путями проксируемого backend (например, /companies).
export const routes: RouteObject[] = [
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <CompaniesPage />,
      },
      {
        path: '/company/:companyId',
        element: <CompanyPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]
