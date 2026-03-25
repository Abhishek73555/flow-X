export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-6">Welcome, guest!</p>
        
        <div className="bg-gray-50 border rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Session Details</h2>
          <pre className="text-sm text-gray-800 overflow-x-auto">
            {JSON.stringify({ user: "guest" }, null, 2)}
          </pre>
        </div>

      </div>
    </div>
  )
}
