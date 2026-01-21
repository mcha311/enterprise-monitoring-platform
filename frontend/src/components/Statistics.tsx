import { TrendingUp, Activity, Server, Battery } from 'lucide-react'

interface Device {
  id: number
  name: string
  type: string
  status: string
  battery_level: number
  is_online: boolean
}

interface StatisticsProps {
  devices: Device[]
}

export default function Statistics({ devices }: StatisticsProps) {
  const totalDevices = devices.length
  const onlineDevices = devices.filter(d => d.is_online).length
  const robots = devices.filter(d => d.type === 'robot').length
  const servers = devices.filter(d => d.type === 'server').length
  const avgBattery = devices.length > 0
    ? (devices.reduce((sum, d) => sum + d.battery_level, 0) / devices.length).toFixed(1)
    : 0

  const stats = [
    {
      title: 'Total Devices',
      value: totalDevices,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Online',
      value: `${onlineDevices}/${totalDevices}`,
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Robots / Servers',
      value: `${robots} / ${servers}`,
      icon: Server,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Avg Battery',
      value: `${avgBattery}%`,
      icon: Battery,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-full`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}