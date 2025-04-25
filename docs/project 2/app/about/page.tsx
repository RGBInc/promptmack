import { Sparkles, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mr-4">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">About PromptVault</h1>
            <p className="text-muted-foreground">
              The largest and best prompt library known to mankind
            </p>
          </div>
        </div>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            PromptVault was created with a simple mission: to build the most comprehensive, 
            high-quality library of AI prompts in the world.
          </p>
          <p className="text-lg mb-4">
            We believe that the right prompt can unlock extraordinary capabilities in AI systems, 
            enabling anyone to achieve results that were previously only possible with specialized training.
          </p>
          <p className="text-lg">
            Our goal is to democratize access to these powerful tools and create a community 
            of prompt engineers who continually push the boundaries of what's possible.
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Curated Library</CardTitle>
                <CardDescription>Expert-validated prompts</CardDescription>
              </CardHeader>
              <CardContent>
                Every prompt in our library is carefully crafted, tested, and optimized 
                to deliver the best results across a wide range of applications.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Token Management</CardTitle>
                <CardDescription>Optimize your token usage</CardDescription>
              </CardHeader>
              <CardContent>
                Our platform helps you track and manage token usage, ensuring you get 
                the most value from your AI interactions without unnecessary costs.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Personal Collections</CardTitle>
                <CardDescription>Organize your favorites</CardDescription>
              </CardHeader>
              <CardContent>
                Create personalized collections of prompts for different projects or 
                use cases, making it easy to access your most-used tools.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>Always stay current</CardDescription>
              </CardHeader>
              <CardContent>
                Our library is constantly growing with new prompts added regularly. 
                See new additions in real-time without refreshing the page.
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <p className="text-lg mb-6">
            PromptVault is made by a team of AI enthusiasts, engineers, and designers 
            passionate about making artificial intelligence more accessible and useful.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['CEO & Founder', 'CTO', 'Head of Content'].map((role, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-muted rounded-full mb-4"></div>
                <h3 className="font-medium text-lg">Team Member {index + 1}</h3>
                <p className="text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-6">
            Connect with fellow prompt engineers and AI enthusiasts to share ideas, 
            techniques, and discover new ways to leverage AI technology.
          </p>
          <div className="flex flex-wrap gap-4">
            {['Twitter', 'Discord', 'GitHub'].map((platform) => (
              <a 
                key={platform}
                href="#"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                {platform}
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}