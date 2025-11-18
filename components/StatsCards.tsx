interface StatCardProps {
  title: string
  value: string | number
  description?: string
}

export default function StatsCards({ stats }: { stats: StatCardProps[] }) {
  const cols = stats.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200 overflow-hidden"
        >
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-orange-500"></div>
          
          <div className="relative">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">{stat.title}</h3>
            <p className="text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              {stat.value}
            </p>
            {stat.description && (
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{stat.description}</p>
            )}
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  )
}

