import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Eye, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const events = [
  {
    id: 1,
    name: "National Athletics Championship",
    sport: "Athletics",
    date: "2025-10-15",
    location: "Bangalore"
  },
  {
    id: 2,
    name: "Inter-State Football Tournament",
    sport: "Football",
    date: "2025-11-05",
    location: "Mumbai"
  },
  {
    id: 3,
    name: "All India Basketball League",
    sport: "Basketball",
    date: "2025-12-10",
    location: "Delhi"
  },
  {
    id: 4,
    name: "South Zone Cricket Series",
    sport: "Cricket",
    date: "2025-10-20",
    location: "Chennai"
  },
  {
    id: 5,
    name: "Eastern Badminton Open",
    sport: "Badminton",
    date: "2025-11-15",
    location: "Kolkata"
  }
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [newEventName, setNewEventName] = useState("");
  const [newEventSport, setNewEventSport] = useState("");
  const [newEventDateTime, setNewEventDateTime] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const navigate = useNavigate();

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || event.location.toLowerCase() === locationFilter.toLowerCase();
    
    return matchesSearch && matchesLocation;
  });

  const handleAddEvent = () => {
    // Placeholder for adding event logic (e.g., API call or state update)
    console.log("Adding event:", { name: newEventName, sport: newEventSport, dateTime: newEventDateTime, location: newEventLocation });
    // Reset form fields
    setNewEventName("");
    setNewEventSport("");
    setNewEventDateTime("");
    setNewEventLocation("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="kolkata">Kolkata</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.sport}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.location}</TableCell>
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Events Card */}
      <Card>
        <CardHeader>
          <CardTitle>Add Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Name of the event"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
            />
            <Input
              placeholder="Sports/Game name"
              value={newEventSport}
              onChange={(e) => setNewEventSport(e.target.value)}
            />
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="datetime-local"
                placeholder="Date and Time"
                value={newEventDateTime}
                onChange={(e) => setNewEventDateTime(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Location"
              value={newEventLocation}
              onChange={(e) => setNewEventLocation(e.target.value)}
            />
            <Button onClick={handleAddEvent}>Add Event</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}