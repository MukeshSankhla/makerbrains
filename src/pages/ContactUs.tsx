import React from "react";
import { Helmet } from "react-helmet-async";
import { Mail, Link as LinkIcon, Info, Heart, UserPlus } from "lucide-react";
import { Youtube, Github, Linkedin, Instagram } from "lucide-react"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ContactUs = () => {
  // Define structured data for the page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Maker Brains",
    "description": "Get in touch with Maker Brains for collaborations, questions, or feedback about electronics and DIY projects.",
    "url": "https://makerbrains.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Maker Brains",
      "email": "mukeshdiy1@gmail.com",
      "sameAs": [
        "https://www.youtube.com/@makerbrains",
        "https://github.com/MukeshSankhla",
        "https://www.linkedin.com/in/mukeshsankhla/",
        "https://www.instagram.com/makerbrains_official/"
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Maker Brains | Get in Touch With Our Electronics & DIY Community</title>
        <meta name="description" content="Contact Maker Brains for collaborations, questions, or feedback. We're always excited to connect with fellow makers and electronics enthusiasts." />
        <meta name="keywords" content="contact maker brains, maker community, electronics help, diy project support, electronics tutorials, arduino projects, raspberry pi help" />
        <link rel="canonical" href="https://makerbrains.com/contact" />
        
        {/* Social Media Meta Tags */}
        <meta property="og:title" content="Contact Maker Brains | Get in Touch With Us" />
        <meta property="og:description" content="Connect with Maker Brains for collaborations, questions, or feedback about electronics and DIY projects." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://makerbrains.com/contact" />
        <meta property="og:image" content="https://makerbrains.com/images/contact-banner.jpg" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Maker Brains | Get in Touch With Us" />
        <meta name="twitter:description" content="Connect with Maker Brains for collaborations, questions, or feedback about electronics and DIY projects." />
        <meta name="twitter:image" content="https://makerbrains.com/images/contact-banner.jpg" />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Maker Brains" />
        
        {/* Structured data for better indexing */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <section className="py-12" aria-label="Contact Information">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text">
              Connect With Maker Brains
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mx-auto max-w-3xl">
              Reach out through our social channels or email. We would love to hear from you about electronics projects, DIY collaborations, or tutorials!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Contact Information */}
            <Card className="flex flex-col overflow-hidden mx-auto hover:shadow-lg transition-shadow bg-[#f2f2f2] dark:bg-[#2f2f2f] p-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" id="contact-methods">
                <Info className="text-primary" />
                How to Reach Us
              </h2>
              
              <div className="">
                <div className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Us</h3>
                    <a 
                      href="mailto:mukeshdiy1@gmail.com" 
                      className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                      aria-label="Send email to mukeshdiy1@gmail.com"
                    >
                      mukeshdiy1@gmail.com
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      For business inquiries, collaborations, and project questions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    <LinkIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2" id="social-media">Social Media</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      Follow us for daily updates, electronics tutorials, and maker community interaction
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a 
                        href="https://www.youtube.com/@makerbrains" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-gray-700 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                        aria-label="Visit our YouTube channel"
                      >
                        <Youtube className="w-6 h-6 text-red-600" aria-hidden="true" />
                        <span>YouTube</span>
                      </a>
                      <a 
                        href="https://github.com/MukeshSankhla" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Visit our GitHub profile"
                      >
                        <Github className="w-6 h-6" aria-hidden="true" />
                        <span>GitHub</span>
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/mukeshsankhla/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-gray-700 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                        aria-label="Visit our LinkedIn profile"
                      >
                        <Linkedin className="w-6 h-6 text-blue-600" aria-hidden="true" />
                        <span>LinkedIn</span>
                      </a>
                      <a 
                        href="https://www.instagram.com/makerbrains_official/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-gray-700 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-colors"
                        aria-label="Visit our Instagram profile"
                      >
                        <Instagram className="w-6 h-6 text-pink-600" aria-hidden="true" />
                        <span>Instagram</span>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4">
                  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                    <UserPlus className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" id="collaborations">Collaborations</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      Interested in collaborating on electronics projects, sponsorships, or content features? 
                      Reach out via email or our social channels with your proposal details.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* FAQ Section with Schema.org markup */}
            <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow bg-[#f2f2f2] dark:bg-[#2f2f2f] p-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" id="faq">
                <Info className="text-primary" aria-hidden="true" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
                <div itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
                  <details className="group bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                      <span itemProp="name" className="text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                        How can I support Maker Brains?
                      </span>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-primary transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </summary>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <div itemProp="text" className="mt-3 pl-2 text-gray-600 dark:text-gray-300 border-l-2 border-primary/50">
                        <p className="flex items-start gap-2">
                          <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                          The best ways to support us are by subscribing to our YouTube channel, liking and sharing our videos, engaging with our content, and telling others about our electronics projects. Your support helps us create more DIY tutorials and maker content!
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
                
                <div itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
                  <details className="group bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                      <span itemProp="name" className="text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                        Do you accept guest contributions?
                      </span>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-primary transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </summary>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <div itemProp="text" className="mt-3 pl-2 text-gray-600 dark:text-gray-300 border-l-2 border-primary/50">
                        <p className="flex items-start gap-2">
                          <UserPlus className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                          Absolutely! We welcome guest contributions from fellow makers and electronics enthusiasts. If you have an interesting project or tutorial you'd like to share, please reach out with your idea via email or social media.
                        </p>
                      </div>
                    </div>
                  </details>
                </div>

                <div itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
                  <details className="group bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                      <span itemProp="name" className="text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                        Where can I find your project files?
                      </span>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-primary transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </summary>
                    <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                      <div itemProp="text" className="mt-3 pl-2 text-gray-600 dark:text-gray-300 border-l-2 border-primary/50">
                        <p className="flex items-start gap-2">
                          <Github className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                          Most of our project files, schematics, and Arduino/Raspberry Pi code are available on our GitHub repository. Check the description of our YouTube videos for specific links to each electronics project's resources.
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;