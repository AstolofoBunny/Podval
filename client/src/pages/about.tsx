import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/back-button";

export default function About() {
  const { data: aboutUsData } = useQuery({
    queryKey: ["/api/settings/about_us"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About ContentHub</h1>
          <p className="text-xl text-slate-600">
            Learn more about our platform and mission
          </p>
        </div>

        {/* Main Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-slate max-w-none">
              {(aboutUsData as any)?.value ? (
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {(aboutUsData as any).value}
                </div>
              ) : (
                <div className="space-y-6 text-slate-700 leading-relaxed">
                  <p className="text-lg">
                    ContentHub is a modern platform designed for sharing knowledge, insights, and stories. 
                    Our community brings together writers and readers from all walks of life to explore ideas that matter.
                  </p>
                  
                  <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Our Mission</h2>
                  <p>
                    We believe in the power of shared knowledge and meaningful conversations. Our platform provides 
                    a space where individuals can express their thoughts, share their expertise, and connect with 
                    like-minded people from around the world.
                  </p>
                  
                  <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">What We Offer</h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Easy-to-use content creation tools</li>
                    <li>Organized categories for better content discovery</li>
                    <li>Engagement features including comments and likes</li>
                    <li>File uploads and rich media support</li>
                    <li>Community-driven content curation</li>
                  </ul>
                  
                  <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Join Our Community</h2>
                  <p>
                    Whether you're a seasoned writer or just starting your journey, ContentHub welcomes you. 
                    Create an account today and become part of our growing community of content creators and enthusiasts.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-edit text-brand-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Easy Writing</h3>
              <p className="text-slate-600">
                Intuitive editor with rich formatting options and file upload support
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-brand-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Community</h3>
              <p className="text-slate-600">
                Connect with readers and writers through comments and engagement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-brand-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Discovery</h3>
              <p className="text-slate-600">
                Find content that interests you through our organized category system
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">1000+</div>
                <div className="text-slate-600">Articles Published</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">500+</div>
                <div className="text-slate-600">Active Writers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">5000+</div>
                <div className="text-slate-600">Monthly Readers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">10+</div>
                <div className="text-slate-600">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}