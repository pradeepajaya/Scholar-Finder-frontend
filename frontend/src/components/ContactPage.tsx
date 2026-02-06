import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Mail, Phone, MapPin, Clock, Send, HelpCircle, ChevronDown, User } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Contact Us</h1>
        <p className="text-slate-600">
          Have questions? We're here to help you on your scholarship journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    First Name *
                  </Label>
                  <Input 
                    id="firstName" 
                    placeholder="e.g., John" 
                    className="pl-4 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Doe" className="mx-[0px] my-[10px]" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" className="mx-[0px] my-[10px]" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+94 XX XXX XXXX" className="mx-[0px] my-[10px]" />
              </div>

              <div className="px-[0px] py-[3px]">
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" placeholder="How can we help you?" className="mx-[0px] my-[4px] px-[12px] py-[10px]" />
              </div>

              <div>
                <Label htmlFor="message" className="block mb-2">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* FAQ Section - Moved and Enhanced */}
          <Card className="p-6 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
                <p className="text-sm text-slate-600">Find quick answers to common questions</p>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="border rounded-lg px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <span className="font-semibold text-slate-900">How do I register as a student?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9 pt-2 pb-4 text-slate-700">
                  <p className="mb-3">
                    Registration is simple and free! Click the <strong>"Register"</strong> button in the navigation menu or on the homepage.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Fill out the 6-step registration form with your personal information, academic qualifications, and preferences</li>
                    <li>The entire process takes about 10-15 minutes</li>
                    <li>You can save your progress and continue later</li>
                    <li>Once registered, you'll immediately see your scholarship matches</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-4 bg-gradient-to-r from-green-50 to-emerald-50">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <span className="font-semibold text-slate-900">How accurate is the scholarship matching algorithm?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9 pt-2 pb-4 text-slate-700">
                  <p className="mb-3">
                    Our intelligent matching system has a <strong>95% accuracy rate</strong> and uses multiple criteria to find the best scholarships for you:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong>Academic qualifications:</strong> O/L, A/L grades, Z-score, and current education level</li>
                    <li><strong>English proficiency:</strong> IELTS, TOEFL, or PTE scores</li>
                    <li><strong>Financial need:</strong> Household income and background</li>
                    <li><strong>Preferences:</strong> Preferred countries, fields of study, and scholarship type</li>
                    <li><strong>Special categories:</strong> Sports, leadership, first-generation status</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    Each scholarship match shows you a <strong>percentage score</strong> and clearly displays which requirements you meet and which you don't.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-4 bg-gradient-to-r from-orange-50 to-amber-50">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <span className="font-semibold text-slate-900">Can institutions and organizations post scholarships?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9 pt-2 pb-4 text-slate-700">
                  <p className="mb-3">
                    <strong>Yes!</strong> We welcome universities, government agencies, NGOs, and private organizations to post scholarship opportunities.
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-orange-200">
                      <p className="font-semibold text-slate-900 mb-1">How to post a scholarship:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Click "Register as Institution" on the homepage</li>
                        <li>Complete the institution registration form</li>
                        <li>Fill in scholarship details and eligibility criteria</li>
                        <li>Your scholarship will be matched with eligible students automatically</li>
                      </ol>
                    </div>
                    <p>
                      Our platform helps you reach <strong>10,000+ registered Sri Lankan students</strong> actively seeking scholarships.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-4 bg-gradient-to-r from-purple-50 to-pink-50">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <span className="font-semibold text-slate-900">Is Scholar-Finder completely free to use?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9 pt-2 pb-4 text-slate-700">
                  <p className="mb-3">
                    <strong>Yes, absolutely!</strong> Scholar-Finder is 100% free for students.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong>Free registration:</strong> No hidden fees or charges</li>
                    <li><strong>Unlimited access:</strong> View all scholarship matches without restrictions</li>
                    <li><strong>No commission:</strong> We don't take any percentage from your scholarship</li>
                    <li><strong>Free updates:</strong> Get notified about new scholarships that match your profile</li>
                  </ul>
                  <p className="mt-3 bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                    💡 <strong>Our mission:</strong> To make scholarship opportunities accessible to all Sri Lankan students, regardless of their financial background.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-4 bg-gradient-to-r from-cyan-50 to-blue-50">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      5
                    </div>
                    <span className="font-semibold text-slate-900">Can I update my profile after registration?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9 pt-2 pb-4 text-slate-700">
                  <p className="mb-3">
                    <strong>Yes!</strong> You can update your profile anytime to improve your scholarship matches.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Go to <strong>"My Profile"</strong> in the navigation menu</li>
                    <li>Update your academic qualifications (e.g., new A/L results, English test scores)</li>
                    <li>Modify your preferences (countries, fields of study)</li>
                    <li>Add new achievements or experiences</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    Our system will automatically recalculate your matches based on the updated information.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-4 bg-gradient-to-r from-rose-50 to-pink-50">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-start gap-3">
                    <div className="bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      6
                    </div>
                    <span className="font-semibold text-slate-900">What if I don't have IELTS or TOEFL scores yet?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9 pt-2 pb-4 text-slate-700">
                  <p className="mb-3">
                    <strong>No problem!</strong> You can still register and find scholarships.
                  </p>
                  <div className="space-y-3 text-sm">
                    <p>Many scholarships don't require English proficiency tests or accept O/L English grades. You can:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Register without test scores and update later</li>
                      <li>Filter scholarships that don't require IELTS/TOEFL</li>
                      <li>See which scholarships accept O/L or A/L English</li>
                    </ul>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <p className="font-semibold text-amber-900 mb-1">💡 Pro Tip:</p>
                      <p className="text-amber-800">
                        Most international scholarships require IELTS 6.5-7.0 or TOEFL 90-100. Consider taking the test soon if you're planning to study abroad!
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
              <p className="font-semibold mb-2">Still have questions?</p>
              <p className="text-sm text-blue-100 mb-3">
                Can't find what you're looking for? Feel free to contact us directly!
              </p>
              <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Email</p>
                  <p className="text-sm text-slate-600">info@scholarfinder.lk</p>
                  <p className="text-sm text-slate-600">support@scholarfinder.lk</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Phone</p>
                  <p className="text-sm text-slate-600">+94 11 234 5678</p>
                  <p className="text-sm text-slate-600">+94 77 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Address</p>
                  <p className="text-sm text-slate-600">
                    123 Galle Road,<br />
                    Colombo 03,<br />
                    Sri Lanka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Office Hours</p>
                  <p className="text-sm text-slate-600">Monday - Friday</p>
                  <p className="text-sm text-slate-600">9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-slate-900 mb-2">Quick Response</h3>
            <p className="text-sm text-slate-600 mb-4">
              We typically respond to inquiries within 24 hours during business days.
            </p>
            <p className="text-sm text-slate-600">
              For urgent matters, please call our hotline at{' '}
              <span className="font-semibold text-blue-600">+94 77 123 4567</span>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}