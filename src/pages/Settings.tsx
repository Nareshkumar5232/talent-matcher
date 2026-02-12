import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useSearchParams } from 'react-router-dom';
import { User, Lock, Bell, Globe, Moon, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [searchParams] = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'profile';
    const { user } = useAuth();

    const [profileForm, setProfileForm] = useState({
        name: user?.name || 'HR Admin',
        email: user?.email || 'admin@gmail.com',
        role: user?.role || 'Administrator',
        bio: 'Lead HR Manager responsible for talent acquisition and recruitment strategy.'
    });

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Profile updated successfully');
    };

    return (
        <div className="min-h-screen">
            <Header title="Settings" subtitle="Manage your account preferences and application settings" />

            <div className="p-6 max-w-5xl mx-auto">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[400px] mb-8">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                        <TabsTrigger value="notifications">Notify</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Picture</CardTitle>
                                    <CardDescription>Click to upload a new avatar</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center pt-4 pb-8">
                                    <Avatar className="h-32 w-32 cursor-pointer hover:opacity-80 transition-opacity">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="text-4xl bg-primary/10 text-primary">HA</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline" size="sm" className="mt-4">Change Avatar</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your personal details here.</CardDescription>
                                </CardHeader>
                                <form onSubmit={handleProfileSave}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="name"
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Input
                                                id="role"
                                                value={profileForm.role}
                                                disabled
                                                className="bg-muted"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Input
                                                id="bio"
                                                value={profileForm.bio}
                                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end">
                                        <Button type="submit">Save Changes</Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="account" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password & Security</CardTitle>
                                <CardDescription>Manage your password and security preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="current-password" type="password" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="new-password" type="password" className="pl-9" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button>Update Password</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                <CardDescription>Irreversible actions for your account.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                                    <div>
                                        <h4 className="font-medium text-destructive">Delete Account</h4>
                                        <p className="text-sm text-muted-foreground">Permanently remove your account and all data.</p>
                                    </div>
                                    <Button variant="destructive">Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Preferences</CardTitle>
                                <CardDescription>Customize how the application looks.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Moon className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Dark Mode</p>
                                            <p className="text-sm text-muted-foreground">Enable dark mode for better viewing at night.</p>
                                        </div>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Globe className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Language</p>
                                            <p className="text-sm text-muted-foreground">Select your preferred language.</p>
                                        </div>
                                    </div>
                                    <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Manage how you receive notifications.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Bell className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive weekly digest and important updates.</p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Security Alerts</p>
                                            <p className="text-sm text-muted-foreground">Get notified about suspicious activity.</p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked disabled />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
