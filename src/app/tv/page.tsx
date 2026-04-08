import TvDashboard from './TvDashboard'

export default async function TvPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-gray-400">Token inválido ou ausente.</p>
      </div>
    )
  }

  return <TvDashboard token={token} />
}
