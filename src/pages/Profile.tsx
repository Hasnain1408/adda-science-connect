
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CircleArrowLeft } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  institution: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { language } = useAppContext();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      institution: '',
      address: '',
      phone_number: '',
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/auth');
        return;
      }
      
      setUser(data.session.user);
      fetchProfile(data.session.user.id);
    };

    checkUser();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        
        form.reset({
          name: data.name || '',
          institution: data.institution || '',
          address: data.address || '',
          phone_number: data.phone_number || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
      toast({
        title: language === 'en' ? 'Error' : 'ত্রুটি',
        description: language === 'en' ? 'Failed to load profile.' : 'প্রোফাইল লোড করতে ব্যর্থ হয়েছে।',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: values.name,
          institution: values.institution,
          address: values.address,
          phone_number: values.phone_number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: language === 'en' ? 'Success' : 'সফল',
        description: language === 'en' ? 'Profile updated successfully!' : 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!',
      });
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'ত্রুটি',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow container mx-auto flex items-center justify-center">
          <div className="text-center">
            {language === 'en' ? 'Loading profile...' : 'প্রোফাইল লোড হচ্ছে...'}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/')}
        >
          <CircleArrowLeft className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
        </Button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Profile Statistics' : 'প্রোফাইল পরিসংখ্যান'}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Your activity on SciConnect' 
                    : 'সাইকানেক্টে আপনার কার্যকলাপ'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === 'en' ? 'Email' : 'ইমেইল'}
                    </p>
                    <p className="text-lg font-medium">{user?.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === 'en' ? 'Quiz Points' : 'কুইজ পয়েন্ট'}
                    </p>
                    <p className="text-2xl font-bold">{profile?.quiz_points || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === 'en' ? 'Articles Posted' : 'পোস্ট করা নিবন্ধ'}
                    </p>
                    <p className="text-2xl font-bold">{profile?.articles_count || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {language === 'en' ? 'Chapters Read' : 'পড়া অধ্যায়'}
                    </p>
                    <p className="text-2xl font-bold">{profile?.chapters_read || 0}</p>
                  </div>

                  <Button 
                    variant="destructive" 
                    className="w-full mt-6" 
                    onClick={handleLogout}
                  >
                    {language === 'en' ? 'Logout' : 'লগআউট'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit Profile' : 'প্রোফাইল সম্পাদনা করুন'}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Update your personal information' 
                    : 'আপনার ব্যক্তিগত তথ্য আপডেট করুন'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'Full Name' : 'পুরো নাম'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'Institution' : 'প্রতিষ্ঠান'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'Address' : 'ঠিকানা'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === 'en' ? 'Phone Number' : 'ফোন নম্বর'}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      {language === 'en' ? 'Update Profile' : 'প্রোফাইল আপডেট করুন'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
