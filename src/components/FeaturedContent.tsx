
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function FeaturedContent() {
  const { language } = useAppContext();
  
  const featuredLessons = [
    {
      id: 'newton-laws',
      title: language === 'en' ? "Newton's Laws of Motion" : "নিউটনের গতির সূত্র",
      description: language === 'en' 
        ? "Learn about the three fundamental laws that describe the relationship between a body and the forces acting upon it."
        : "একটি বস্তু এবং এর উপর কার্যকর বলগুলির মধ্যে সম্পর্ক বর্ণনাকারী তিনটি মৌলিক সূত্র সম্পর্কে জানুন।",
      image: '/placeholder.svg',
      link: '/lessons/newton-laws'
    },
    {
      id: 'pendulum',
      title: language === 'en' ? "Pendulum Motion" : "দোলকের গতি",
      description: language === 'en'
        ? "Explore the physics of pendulum motion through an interactive simulation."
        : "একটি ইন্টারেক্টিভ সিমুলেশনের মাধ্যমে দোলক গতির পদার্থবিজ্ঞান অন্বেষণ করুন।",
      image: '/placeholder.svg',
      link: '/simulations/pendulum'
    },
    {
      id: 'chemical-reactions',
      title: language === 'en' ? "Chemical Reactions" : "রাসায়নিক বিক্রিয়া",
      description: language === 'en'
        ? "Understand the basics of chemical reactions and how they work."
        : "রাসায়নিক বিক্রিয়ার মৌলিক বিষয়গুলি এবং সেগুলি কীভাবে কাজ করে তা বুঝুন।",
      image: '/placeholder.svg',
      link: '/lessons/chemical-reactions'
    }
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {language === 'en' ? 'Featured Content' : 'বৈশিষ্ট্যযুক্ত কন্টেন্ট'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredLessons.map((lesson) => (
            <Card key={lesson.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                  <img 
                    src={lesson.image} 
                    alt={lesson.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl">{lesson.title}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
              <CardFooter>
                <Link 
                  to={lesson.link}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded text-center w-full"
                >
                  {language === 'en' ? 'Explore' : 'অন্বেষণ করুন'}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
