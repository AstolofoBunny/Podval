import { useQuery } from "@tanstack/react-query";

interface FooterProps {
  onContactClick?: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
  const { data: aboutUsData } = useQuery({
    queryKey: ["/api/settings/about_us"],
    retry: false,
  });

  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">About ContentHub</h3>
            <p className="text-slate-600 mb-4">
              {aboutUsData?.value || 
                "ContentHub is a modern platform for sharing knowledge, insights, and stories. Our community of writers and readers come together to explore ideas that matter."
              }
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-brand-600 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-brand-600 transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-brand-600 transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-brand-600 transition-colors">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-slate-600 hover:text-brand-600 transition-colors">Home</a></li>
              <li><span className="text-slate-600 hover:text-brand-600 transition-colors cursor-pointer">Categories</span></li>
              <li><span className="text-slate-600 hover:text-brand-600 transition-colors cursor-pointer">Featured Posts</span></li>
              <li><span className="text-slate-600 hover:text-brand-600 transition-colors cursor-pointer">Write for Us</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-slate-600">
              <li>support@contenthub.com</li>
              <li>
                <button 
                  onClick={onContactClick}
                  className="hover:text-brand-600 transition-colors"
                >
                  Contact Form
                </button>
              </li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-600">
          <p>&copy; 2024 ContentHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
