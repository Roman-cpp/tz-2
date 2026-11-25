import { NavLink, Outlet } from 'react-router'

// Общий макет: фоновая подложка, боковое меню слева и содержимое страницы справа.
export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-surface bg-[url(/dashboard-bg.jpg)] bg-cover bg-center bg-no-repeat">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-64">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-body">Добро пожаловать</p>
            <h2 className="mt-1 font-semibold text-heading">Панель управления</h2>

            <nav className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body">Меню</p>
              <ul className="flex flex-col gap-1">
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                        isActive ? 'bg-primary text-white' : 'text-heading hover:bg-surface'
                      }`
                    }
                  >
                    Компании
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
