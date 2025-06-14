
import React from "react";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Legal = () => {
  return (
    <>
      <Helmet>
        <title>Legal Information | Maker Brains</title>
        <meta name="description" content="Legal information for Maker Brains website, including terms of service, privacy policy, and copyright information." />
        <meta name="keywords" content="maker brains legal, privacy policy, terms of service, copyright" />
        <link rel="canonical" href="https://makerbrains.com/legal" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Legal Information</h1>
          
          <Tabs defaultValue="terms">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="copyright">Copyright</TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Last updated: May 5, 2025</p>
                
                <div className="prose dark:prose-invert max-w-none">
                  <h3>1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using Maker Brains ("the Website"), you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this Website.
                  </p>
                  
                  <h3>2. Use License</h3>
                  <p>
                    Permission is granted to temporarily download one copy of the materials on Maker Brains's website for personal, 
                    non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul>
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose</li>
                    <li>Attempt to decompile or reverse engineer any software contained on the Website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                  
                  <h3>3. Disclaimer</h3>
                  <p>
                    The materials on Maker Brains's website are provided on an 'as is' basis. Maker Brains makes no warranties, 
                    expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
                    implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                  </p>
                  
                  <h3>4. Limitations</h3>
                  <p>
                    In no event shall Maker Brains or its suppliers be liable for any damages (including, without limitation, 
                    damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                    to use the materials on Maker Brains's website, even if Maker Brains or a Maker Brains authorized representative 
                    has been notified orally or in writing of the possibility of such damage.
                  </p>
                  
                  <h3>5. Links</h3>
                  <p>
                    Maker Brains has not reviewed all of the sites linked to its website and is not responsible for the contents 
                    of any such linked site. The inclusion of any link does not imply endorsement by Maker Brains of the site. 
                    Use of any such linked website is at the user's own risk.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Last updated: May 5, 2025</p>
                
                <div className="prose dark:prose-invert max-w-none">
                  <h3>1. Information Collection</h3>
                  <p>
                    We collect information from you when you register on our site, subscribe to our newsletter, 
                    respond to a survey, fill out a form, or enter information on our site.
                  </p>
                  <p>
                    When registering on our site, as appropriate, you may be asked to enter your name, email address, 
                    or other details to help you with your experience.
                  </p>
                  
                  <h3>2. Use of Information</h3>
                  <p>We may use the information we collect from you in the following ways:</p>
                  <ul>
                    <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested</li>
                    <li>To improve our website in order to better serve you</li>
                    <li>To allow us to better service you in responding to your customer service requests</li>
                    <li>To administer a contest, promotion, survey or other site feature</li>
                    <li>To send periodic emails regarding your projects or other products and services</li>
                  </ul>
                  
                  <h3>3. Protection of Information</h3>
                  <p>
                    We implement a variety of security measures when a user enters, submits, or accesses their information to 
                    maintain the safety of your personal information. All transactions are processed through a secure gateway provider 
                    and are not stored or processed on our servers.
                  </p>
                  
                  <h3>4. Cookies</h3>
                  <p>
                    We use cookies for tracking purposes. You can choose to have your computer warn you each time a cookie is 
                    being sent, or you can choose to turn off all cookies. You do this through your browser settings. 
                    Since browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.
                  </p>
                  
                  <h3>5. Third-Party Disclosure</h3>
                  <p>
                    We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless 
                    we provide users with advance notice. This does not include website hosting partners and other parties who assist 
                    us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep 
                    this information confidential.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="copyright" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Copyright Information</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Last updated: May 5, 2025</p>
                
                <div className="prose dark:prose-invert max-w-none">
                  <h3>Copyright Policy</h3>
                  <p>
                    All content included on this site, such as text, graphics, logos, button icons, images, audio clips, 
                    digital downloads, data compilations, and software, is the property of Maker Brains or its content suppliers 
                    and protected by international copyright laws.
                  </p>
                  
                  <h3>Fair Use Notice</h3>
                  <p>
                    This site contains copyrighted material the use of which has not always been specifically authorized by the 
                    copyright owner. We are making such material available in our efforts to advance understanding of electronics, 
                    maker culture, and DIY technology. We believe this constitutes a 'fair use' of any such copyrighted material as 
                    provided for in section 107 of the US Copyright Law.
                  </p>
                  
                  <h3>Project Licenses</h3>
                  <p>
                    Unless otherwise stated, all DIY projects, schematics, and designs shared on Maker Brains are released under 
                    the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
                  </p>
                  <p>
                    This means you are free to:
                  </p>
                  <ul>
                    <li>Share — copy and redistribute the material in any medium or format</li>
                    <li>Adapt — remix, transform, and build upon the material</li>
                  </ul>
                  <p>
                    Under the following terms:
                  </p>
                  <ul>
                    <li>Attribution — You must give appropriate credit to Maker Brains, provide a link to the license, and indicate if changes were made.</li>
                    <li>NonCommercial — You may not use the material for commercial purposes without explicit permission.</li>
                    <li>ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.</li>
                  </ul>
                  
                  <h3>Digital Millennium Copyright Act (DMCA)</h3>
                  <p>
                    If you believe that content available on or through our Website infringes one or more of your copyrights, 
                    please immediately notify us by providing a written notice to the address below.
                  </p>
                  <p>
                    Contact: mukeshdiy1@gmail.com
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default Legal;
