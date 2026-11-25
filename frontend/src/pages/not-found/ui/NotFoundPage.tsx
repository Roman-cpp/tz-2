import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-semibold text-heading">Страница не найдена</h1>
      <p className="mt-4">
        <Link to="/" className="font-medium text-primary underline-offset-4 hover:underline">
          Вернуться к списку компаний
        </Link>
      </p>
    </section>
  )
}
