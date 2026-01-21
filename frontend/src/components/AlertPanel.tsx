import { useState, useEffect } from 'react'
import { AlertTriangle, WifiOff, Battery } from 'lucide-react'
import axios from 'axios'

interface Device {
  id: number
  name: string
  type: string
  status: string
  battery_level: number
  is_online: boolean
}

const API_URL = 'http://localhost:8000'

export default function AlertPanel() {
  const [lowBattery, setLowBattery] = useState<Device[]>([])
  const [offline, setOffline] = useState<Device[]>([])
  const [critical, setCritical] = useState<Device[]>([])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const [lowBatteryRes, offlineRes, criticalRes] = await Promise.all([
        axios.get(`${API_URL}/alerts/low-battery`),
        axios.get(`${API_URL}/alerts/offline`),
        axios.get(`${API_URL}/alerts/critical`)
      ])
      setLowBattery(lowBatteryRes.data)
      setOffline(offlineRes.data)
      setCritical(criticalRes.data)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  const totalAlerts = lowBattery.length + offline.length + critical.length

  if (totalAlerts === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <p className="text-green-800 font-medium">All systems operational</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 space-y-4">
      {critical.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-800">
              Critical Alerts ({critical.length})
            </h3>
          </div>
          <div className="space-y-1">
            {critical.map((device) => (
              <p key={device.id} className="text-sm text-red-700">
                • {device.name}: {device.status === 'error' ? 'Error status' : `Battery at ${device.battery_level}%`}
              </p>
            ))}
          </div>
        </div>
      )}

      {lowBattery.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-center mb-2">
            <Battery className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-semibold text-yellow-800">
              Low Battery Warnings ({lowBattery.length})
            </h3>
          </div>
          <div className="space-y-1">
            {lowBattery.map((device) => (
              <p key={device.id} className="text-sm text-yellow-700">
                • {device.name}: {device.battery_level}%
              </p>
            ))}
          </div>
        </div>
      )}

      {offline.length > 0 && (
        <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
          <div className="flex items-center mb-2">
            <WifiOff className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-800">
              Offline Devices ({offline.length})
            </h3>
          </div>
          <div className="space-y-1">
            {offline.map((device) => (
              <p key={device.id} className="text-sm text-gray-700">
                • {device.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}