import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import Profile from "/src/images/cert.jpg";

export default function Features() {
 return (
   <section>
    <div className="max-w-full space-y-2">
      <h2 className="text-4xl">Failure and Growth</h2>
       <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow bg-[#f2f2f2] dark:bg-[#2f2f2f]">
         <CardHeader className="flex flex-col items-center">
           <div className="w-full">
             <img
               src={Profile}
               alt="Maker working on project"
               className="w-full h-full object-cover rounded-lg"
             />
           </div>
         </CardHeader>
         <CardContent className="flex-grow">
           <p className="text-muted-foreground text-left text-xl">
            My journey with Grotoy Smart Farms was all about making home gardening easy and fun using hydroponics and IoT. Grotoy was a startup with a big dream, and I was excited to be part of it.
            As the Tech Lead and MVP developer, I worked on every part of the product. I started with the structural design and used 3D printing to create the components, which saved us millions in prototyping costs. I then moved on to the electronics and communication systems to ensure everything worked smoothly. Finally, I developed a mobile app so users could monitor and control their plants' health in real-time.
            Even though we created a great product that only cost ₹15,000, there wasn't a big market for it in India at the time. The startup didn't succeed, but I learned a lot from the experience. I understood how to develop a product from start to finish, the importance of market research, and how to keep going even when things don't work out. This experience has helped me grow and prepared me for future challenges in technology and entrepreneurship.
           </p>
         </CardContent>
       </Card>
     </div>
   </section>
 );
}