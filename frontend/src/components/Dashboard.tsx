import { useState, useEffect, useRef } from 'react'
import { Activity, Server, AlertCircle, Wifi, WifiOff } from 'lucide-react'

interface Device {
  id: number
  name: string
  type: string
  status: string
  battery_level: number
  location_x: number
  location_y: number
  is_online: boolean
  last_updated: string
}

const WS_URL = 'ws://localhost:8000/ws'

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(WS_URL)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setWsConnected(true)
        setError(null)
      }
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type === 'devices_update') {
          setDevices(message.data)
          setLoading(false)
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setWsConnected(false)
        setError('WebSocket connection failed')
      }
      
      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setWsConnected(false)
        setTimeout(connectWebSocket, 3000)
      }
      
      wsRef.current = ws
    }
    
    connectWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'inactive':
        return 'bg-gray-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600'
    if (level > 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Enterprise Monitoring Platform
            </h1>
            <p className="text-gray-600">Real-time device monitoring dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            {wsConnected ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-600 font-medium">Disconnected</span>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Devices</div>
          <div className="text-2xl font-bold">{devices.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Online</div>
          <div className="text-2xl font-bold text-green-600">
            {devices.filter(d => d.is_online).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Offline</div>
          <div className="text-2xl font-bold text-red-600">
            {devices.filter(d => !d.is_online).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Avg Battery</div>
          <div className="text-2xl font-bold text-blue-600">
            {devices.length > 0 
              ? (devices.reduce((acc, d) => acc + d.battery_level, 0) / devices.length).toFixed(1)
              : 0}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div key={device.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {device.type === 'robot' ? (
                  <Activity className="w-8 h-8 text-blue-500 mr-3" />
                ) : (
                  <Server className="w-8 h-8 text-purple-500 mr-3" />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.type}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`}></div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-medium">{device.status}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Battery:</span>
                <span className={`text-sm font-medium ${getBatteryColor(device.battery_level)}`}>
                  {device.battery_level}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm font-medium">
                  ({device.location_x.toFixed(1)}, {device.location_y.toFixed(1)})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Online:</span>
                <span className={`text-sm font-medium ${device.is_online ? 'text-green-600' : 'text-red-600'}`}>
                  {device.is_online ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="pt-2 border-t">
                <span className="text-xs text-gray-400">
                  Updated: {new Date(device.last_updated).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No devices found</p>
          <p className="text-gray-500 text-sm mt-2">Add some devices to get started</p>
        </div>
      )}
    </div>
  )
}