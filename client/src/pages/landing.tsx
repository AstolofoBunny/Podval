import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FirebaseAuth from "@/components/firebase-auth";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-brand-700">ContentHub</h1>
            <Button onClick={() => window.location.href = '/firebase-test'}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Share Your Ideas with the World
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            ContentHub is a modern platform for sharing knowledge, insights, and stories. 
            Join our community of writers and readers to explore ideas that matter.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/firebase-test'}
            className="text-lg px-8 py-3"
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-edit text-brand-600"></i>
                </div>
                Write & Share
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create beautiful posts with rich content, images, and file attachments. 
                Share your knowledge with our growing community.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-brand-600"></i>
                </div>
                Engage & Connect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Like, comment, and engage with content from fellow creators. 
                Build meaningful connections through shared interests.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-brand-600"></i>
                </div>
                Track & Grow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your content's performance with detailed analytics. 
                See how your posts are performing and growing your audience.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Ready to Join Our Community?</CardTitle>
              <CardDescription>
                Start sharing your ideas and connecting with like-minded individuals today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FirebaseAuth />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2024 ContentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
