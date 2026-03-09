import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'

const COLORS = ['#0F766E', '#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899']

// Shared tooltip style
const tooltipStyle = {
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
}

// ============ PIE CHART ============
export function CauseAreaChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-text-primary">Funding by Cause Area</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`₹${(value / 100000).toFixed(1)}L`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ============ BAR CHART ============
export function GeographicChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-text-primary">Geographic Distribution</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              tickFormatter={(v) => `₹${v / 100000}L`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`₹${(value / 100000).toFixed(1)}L`, 'Funding']}
            />
            <Bar dataKey="value" fill="#0F766E" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// ============ LINE CHART ============
export function ImpactTimelineChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-text-primary">Impact Over Time</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line
              type="monotone"
              dataKey="beneficiaries"
              stroke="#0F766E"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              name="Beneficiaries"
            />
            <Line
              type="monotone"
              dataKey="funding"
              stroke="#6366F1"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              name="Funding (₹L)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}