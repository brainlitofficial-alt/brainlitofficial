import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, Registration, WebinarSettings } from "@/lib/supabase";
import { toast } from "sonner";
import { Helmet } from "react-helmet";
import { Home, RefreshCw, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [webinarDate, setWebinarDate] = useState<string>("");
  const [isSavingDate, setIsSavingDate] = useState(false);

  useEffect(() => {
    fetchRegistrations();
    fetchWebinarSettings();
  }, []);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching registrations from Supabase...");
      
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("registered_at", { ascending: false });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error details:", error);
        toast.error(`Database error: ${error.message}`);
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} registrations`);
      setRegistrations(data || []);
      
      if (!data || data.length === 0) {
        toast.info("No registrations found in database");
      }
    } catch (error: any) {
      console.error("Error fetching registrations:", error);
      toast.error(`Failed to fetch registrations: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWebinarSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("webinar_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching webinar settings:", error);
        return;
      }

      if (data?.next_webinar_date) {
        // Convert to datetime-local format (YYYY-MM-DDTHH:MM)
        const date = new Date(data.next_webinar_date);
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setWebinarDate(localDate.toISOString().slice(0, 16));
      }
    } catch (error: any) {
      console.error("Error fetching webinar settings:", error);
    }
  };

  const saveWebinarDate = async () => {
    if (!webinarDate) {
      toast.error("Please select a date and time");
      return;
    }

    setIsSavingDate(true);
    try {
      // Check if a settings row exists
      const { data: existing } = await supabase
        .from("webinar_settings")
        .select("*")
        .limit(1)
        .single();

      const dateToSave = new Date(webinarDate).toISOString();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("webinar_settings")
          .update({ 
            next_webinar_date: dateToSave,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("webinar_settings")
          .insert({ 
            next_webinar_date: dateToSave,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      toast.success("Webinar date updated successfully!");
    } catch (error: any) {
      console.error("Error saving webinar date:", error);
      toast.error(`Failed to save webinar date: ${error.message}`);
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    const headers = ["ID", "Parent Name", "WhatsApp", "Email", "Location", "Registered At"];
    const csvData = registrations.map((reg) => [
      reg.id,
      reg.parent_name,
      reg.whatsapp,
      reg.email,
      reg.location,
      reg.registered_at,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `brainlit-registrations-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin Dashboard - BrainLit</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Webinar Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Webinar Settings
              </CardTitle>
              <CardDescription>Set the next webinar date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="webinarDate">Next Webinar Date & Time</Label>
                  <Input
                    id="webinarDate"
                    type="datetime-local"
                    value={webinarDate}
                    onChange={(e) => setWebinarDate(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button 
                  onClick={saveWebinarDate} 
                  disabled={isSavingDate}
                  className="h-12"
                >
                  {isSavingDate ? "Saving..." : "Save Webinar Date"}
                </Button>
              </div>
              {webinarDate && (
                <p className="text-sm text-muted-foreground mt-2">
                  Current: {new Date(webinarDate).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Registrations Card */}
        <Card className="max-w-7xl mx-auto">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">Admin Dashboard</CardTitle>
                <CardDescription className="mt-2">
                  Manage webinar registrations ({registrations.length} total)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRegistrations}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No registrations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">ID</TableHead>
                      <TableHead>Parent Name</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Registered At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium">{registration.id}</TableCell>
                        <TableCell>{registration.parent_name}</TableCell>
                        <TableCell>{registration.whatsapp}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {registration.email}
                        </TableCell>
                        <TableCell>{registration.location}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(registration.registered_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
