import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Trophy, MapPin, Download, Check, X } from "lucide-react";

const stats = [
  {
    title: "Total Athletes",
    value: "10",
    icon: Users,
    change: "+5% from last month"
  },
  {
    title: "Pending Reviews",
    value: "4",
    icon: AlertTriangle,
    change: "3 flagged for review"
  },
  {
    title: "Top Performers",
    value: "2",
    icon: Trophy,
    change: "Above 90th percentile"
  },
  {
    title: "Active Regions",
    value: "8",
    icon: MapPin,
    change: "Across 8 states"
  }
];

const recentActions = [
  {
    id: 1,
    athlete: "Amrutha",
    test: "Vertical Jump",
    score: "50cm",
    status: "flagged",
    timestamp: "2 mins ago"
  },
  {
    id: 2,
    athlete: "Sumadhwa",
    test: "Squats",
    score: "30 reps",
    status: "verified",
    timestamp: "15 mins ago"
  },
  {
    id: 3,
    athlete: "Anirudh",
    test: "Sit-ups",
    score: "45 reps",
    status: "pending",
    timestamp: "1 hour ago"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Flagged Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Actions Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{action.athlete}</p>
                    <p className="text-sm text-muted-foreground">
                      {action.test} - {action.score}
                    </p>
                    <p className="text-xs text-muted-foreground">{action.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={action.status === 'flagged' ? 'destructive' : 
                               action.status === 'verified' ? 'default' : 'secondary'}
                    >
                      {action.status}
                    </Badge>
                    {action.status === 'flagged' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}