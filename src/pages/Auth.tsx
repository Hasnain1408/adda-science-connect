
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  institution: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
});

export default function Auth() {
  const navigate = useNavigate();
  const { language } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      institution: "",
      address: "",
      phone_number: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          title: language === 'en' ? 'Error' : 'ত্রুটি',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: language === 'en' ? 'Success' : 'সফল',
        description: language === 'en' ? 'You have successfully logged in!' : 'আপনি সফলভাবে প্রবেশ করেছেন!',
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'ত্রুটি',
        description: language === 'en' ? 'Something went wrong.' : 'কিছু ভুল হয়েছে।',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            institution: values.institution || null,
            address: values.address || null,
            phone_number: values.phone_number || null,
          },
        },
      });

      if (error) {
        toast({
          title: language === 'en' ? 'Error' : 'ত্রুটি',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: language === 'en' ? 'Success' : 'সফল',
        description: language === 'en' 
          ? 'Registration successful! Please check your email for verification.' 
          : 'নিবন্ধন সফল! যাচাইয়ের জন্য অনুগ্রহ করে আপনার ইমেল দেখুন।',
      });
      
      loginForm.setValue('email', values.email);
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'ত্রুটি',
        description: language === 'en' ? 'Something went wrong.' : 'কিছু ভুল হয়েছে।',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {language === 'en' ? 'Welcome to SciConnect' : 'সাইকানেক্ট-এ স্বাগতম'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'en' 
              ? 'Sign in to your account or create a new one' 
              : 'আপনার অ্যাকাউন্টে সাইন ইন করুন বা একটি নতুন তৈরি করুন'}
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{language === 'en' ? 'Login' : 'লগইন'}</TabsTrigger>
            <TabsTrigger value="register">{language === 'en' ? 'Register' : 'নিবন্ধন'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Email' : 'ইমেইল'}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter your email' : 'আপনার ইমেইল লিখুন'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Password' : 'পাসওয়ার্ড'}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={language === 'en' ? 'Enter your password' : 'আপনার পাসওয়ার্ড লিখুন'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading 
                      ? (language === 'en' ? 'Logging in...' : 'লগইন হচ্ছে...') 
                      : (language === 'en' ? 'Login' : 'লগইন')}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Full Name' : 'পুরো নাম'} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter your full name' : 'আপনার পুরো নাম লিখুন'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Email' : 'ইমেইল'} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter your email' : 'আপনার ইমেইল লিখুন'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Password' : 'পাসওয়ার্ড'} *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={language === 'en' ? 'Create a password' : 'একটি পাসওয়ার্ড তৈরি করুন'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Institution' : 'প্রতিষ্ঠান'}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter your institution' : 'আপনার প্রতিষ্ঠানের নাম লিখুন'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Address' : 'ঠিকানা'}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter your address' : 'আপনার ঠিকানা লিখুন'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? 'Phone Number' : 'ফোন নম্বর'}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? 'Enter your phone number' : 'আপনার ফোন নম্বর লিখুন'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading 
                      ? (language === 'en' ? 'Registering...' : 'নিবন্ধন করা হচ্ছে...') 
                      : (language === 'en' ? 'Register' : 'নিবন্ধন করুন')}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
