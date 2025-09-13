import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, MapPin, Download, Calendar } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analysis of athlete performance data</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last30">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
              <SelectItem value="lastyear">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.4</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2.1%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions Active</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-500">+3</span> new regions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+1.2%</span> vs last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution by Age Group</CardTitle>
            <CardDescription>Performance breakdown across different age categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { age: "Under 18", count: 1247, avg: 82.1, color: "bg-blue-500" },
                { age: "18-25", count: 986, avg: 78.9, color: "bg-green-500" },
                { age: "26-35", count: 543, avg: 75.3, color: "bg-yellow-500" },
                { age: "Over 35", count: 71, avg: 71.8, color: "bg-red-500" },
              ].map((group) => (
                <div key={group.age} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded ${group.color}`} />
                    <span className="font-medium">{group.age}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{group.count} athletes</div>
                    <div className="text-sm text-muted-foreground">Avg: {group.avg}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Tests</CardTitle>
            <CardDescription>Most popular and highest scoring assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { test: "Vertical Jump", participants: 2534, avgScore: 84.2, trend: "up" },
                { test: "Shuttle Run", participants: 2398, avgScore: 79.8, trend: "up" },
                { test: "Sit-ups (1 min)", participants: 2156, avgScore: 76.5, trend: "down" },
                { test: "Push-ups", participants: 1987, avgScore: 81.3, trend: "up" },
              ].map((test) => (
                <div key={test.test} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{test.test}</div>
                    <div className="text-sm text-muted-foreground">{test.participants} participants</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{test.avgScore}</span>
                      <Badge variant={test.trend === "up" ? "default" : "secondary"}>
                        {test.trend === "up" ? "↗" : "↘"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regional Performance Map</CardTitle>
          <CardDescription>Geographic distribution of athlete participation and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { region: "North Region", athletes: 892, avgScore: 81.2, status: "high" },
              { region: "South Region", athletes: 743, avgScore: 78.9, status: "medium" },
              { region: "East Region", athletes: 634, avgScore: 76.4, status: "medium" },
              { region: "West Region", athletes: 578, avgScore: 82.8, status: "high" },
              { region: "Central Region", athletes: 456, avgScore: 74.1, status: "low" },
              { region: "Northeast", athletes: 298, avgScore: 79.6, status: "medium" },
            ].map((region) => (
              <Card key={region.region} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{region.region}</h4>
                  <Badge 
                    variant={
                      region.status === "high" ? "default" : 
                      region.status === "medium" ? "secondary" : "outline"
                    }
                  >
                    {region.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{region.athletes} athletes</div>
                  <div className="font-medium">Avg Score: {region.avgScore}</div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}