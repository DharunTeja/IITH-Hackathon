import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Heart,
  Pill,
  Calendar,
  MessageSquare,
  Activity,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  FileText,
} from 'lucide-react';
import heroImage from '@/assets/hero-healthcare.jpg';

const features = [
  {
    icon: Pill,
    title: 'Medication Tracking',
    description: 'Never miss a dose with smart reminders and stock alerts for your medications.',
  },
  {
    icon: Activity,
    title: 'Symptom Diary',
    description: 'Log and track your symptoms over time to share meaningful insights with your doctor.',
  },
  {
    icon: Calendar,
    title: 'Easy Appointments',
    description: 'Book and manage appointments with your healthcare providers seamlessly.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Communication',
    description: 'Chat directly with your doctor for quick consultations and follow-ups.',
  },
  {
    icon: FileText,
    title: 'Health Records',
    description: 'Keep all your medical records, prescriptions, and reports in one secure place.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your health data is encrypted and protected with industry-leading security.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500+', label: 'Healthcare Providers' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Support Available' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="gradient-hero rounded-lg p-2">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">HealthCare+</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          <img
            src={heroImage}
            alt="Healthcare hero"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 text-sm text-secondary-foreground animate-fade-in">
              <Heart className="h-4 w-4 text-primary" />
              <span>Your Health, Our Priority</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-up">
              Complete Healthcare
              <span className="block mt-2 bg-gradient-to-r from-primary via-medical-mint to-medical-blue bg-clip-text text-transparent">
                Management Platform
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Track medications, log symptoms, book appointments, and communicate with your healthcare providers—all in one secure, intuitive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Start Free Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline-hero" size="xl" className="w-full sm:w-auto">
                  I'm a Healthcare Provider
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
              {[
                'HIPAA Compliant',
                'End-to-End Encrypted',
                'Free to Start',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-medical-mint bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need for
              <span className="block text-primary">Better Health Management</span>
            </h2>
            <p className="text-muted-foreground">
              Powerful features designed to help patients take control of their health and doctors provide better care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-muted-foreground">
              Whether you're a patient managing your health or a doctor caring for patients, we have you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Patient Card */}
            <Link to="/register?role=patient" className="group">
              <div className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-card p-8 shadow-lg transition-all duration-300 hover:border-primary hover:shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                <div className="relative space-y-4">
                  <div className="inline-flex rounded-2xl gradient-primary p-4 shadow-glow">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">I'm a Patient</h3>
                  <p className="text-muted-foreground">
                    Track medications, log symptoms, book appointments, and access your health records securely.
                  </p>
                  <ul className="space-y-2 text-sm">
                    {['Medication reminders', 'Symptom tracking', 'Doctor chat', 'Health records'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="hero" className="w-full mt-4 group-hover:shadow-glow">
                    Get Started as Patient
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Link>

            {/* Doctor Card */}
            <Link to="/register?role=doctor" className="group">
              <div className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-card p-8 shadow-lg transition-all duration-300 hover:border-primary hover:shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-medical-blue/5 rounded-bl-full" />
                <div className="relative space-y-4">
                  <div className="inline-flex rounded-2xl bg-medical-blue p-4 shadow-lg">
                    <Stethoscope className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">I'm a Doctor</h3>
                  <p className="text-muted-foreground">
                    Manage patient records, handle appointments, prescribe medications, and communicate efficiently.
                  </p>
                  <ul className="space-y-2 text-sm">
                    {['Patient management', 'Appointment control', 'E-Prescriptions', 'Secure messaging'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="default" className="w-full mt-4 bg-medical-blue hover:bg-medical-blue/90">
                    Register as Doctor
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 lg:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Join thousands of users who are already managing their health more effectively with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button variant="glass" size="xl" className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="gradient-hero rounded-lg p-2">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">HealthCare+</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 HealthCare+. Built for IIT-H Hackathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
