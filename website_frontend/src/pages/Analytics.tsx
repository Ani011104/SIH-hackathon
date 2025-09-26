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
            <div className="text-2xl font-bold">20</div>
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


      <Card>
        <CardHeader>
          <CardTitle>Regional Performance Map</CardTitle>
          <CardDescription>Geographic distribution of athlete participation and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { region: "North Region", athletes: 10, avgScore: 81.2, status: "high" },
              { region: "South Region", athletes: 5, avgScore: 78.9, status: "medium" },
              { region: "East Region", athletes: 3, avgScore: 76.4, status: "medium" },
              { region: "West Region", athletes: 5, avgScore: 82.8, status: "high" },
              
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