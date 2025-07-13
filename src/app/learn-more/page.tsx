
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Lock, Scale, TriangleAlert } from 'lucide-react';

export default function LearnMorePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8 flex items-center justify-center pt-24">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 max-w-3xl w-full">
        <header className="text-center mb-8">
          <h1 className="text-indigo-700 font-bold text-4xl mb-2">SoulCircle</h1>
          <h2 className="text-gray-800 font-semibold text-3xl">
            Legal & Information Hub
          </h2>
          <p className="text-gray-600 mt-2">
            Your trust is important to us. Here you can find our policies and
            disclaimers.
          </p>
        </header>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:bg-gray-50 p-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-indigo-600" />
                Privacy Policy
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>Last Updated: July 2024</strong>
              </p>
              <p>
                Your privacy is critically important to us. This Privacy Policy
                outlines how SoulCircle collects, uses, and protects your
                personal information.
              </p>
              <h3 className="font-semibold text-md text-gray-800">
                1. Information We Collect
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>
                  <strong>Account Information:</strong> When you create an
                  account, we collect your authentication details (UID) provided
                  by Firebase Authentication.
                </li>
                <li>
                  <strong>Profile & Journal Data:</strong> We store the data you
                  voluntarily provide in your profile, mood logs, and journal
                  entries. This data is linked to your UID.
                </li>
                <li>
                  <strong>Usage Data:</strong> We may collect anonymous data
                  about your interactions with the app to improve our services.
                </li>
              </ul>
              <h3 className="font-semibold text-md text-gray-800">
                2. How We Use Your Information
              </h3>
              <p>
                Your data is used to personalize your experience, provide AI-driven
                insights, track your well-being journey, and improve the app's
                functionality. We do not sell your personal data to third
                parties.
              </p>
              <h3 className="font-semibold text-md text-gray-800">
                3. Data Security
              </h3>
              <p>
                We use Firebase, a secure platform by Google, to store your
                data. Access is protected by Firestore Security Rules, which
                ensure that only you can access your personal data.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-indigo-600" />
                Terms of Use
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 text-gray-700 leading-relaxed space-y-4">
              <p>
                By using the SoulCircle application, you agree to these Terms
                of Use.
              </p>
              <h3 className="font-semibold text-md text-gray-800">
                1. Non-Medical Service
              </h3>
              <p>
                SoulCircle is a mental wellness tool, not a medical device or
                healthcare provider. It does not provide medical advice,
                diagnosis, or treatment. It is not a substitute for professional
                therapy or crisis support.
              </p>
              <h3 className="font-semibold text-md text-gray-800">
                2. User Conduct
              </h3>
              <p>
                You agree to use the app responsibly and not to misuse the service
                or its AI components. You are responsible for the content you
                create and store.
              </p>
              <h3 className="font-semibold text-md text-gray-800">
                3. Limitation of Liability
              </h3>
              <p>
                SoulCircle and its creators are not liable for any actions you
                take based on the information or guidance provided by the app.
                Your use of the app is at your own risk.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:bg-gray-50 p-4 rounded-b-lg">
              <div className="flex items-center gap-3">
                <TriangleAlert className="h-5 w-5 text-amber-600" />
                Disclaimer
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6">
              <div
                className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-md"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <TriangleAlert className="h-6 w-6 text-red-500 mr-4" />
                  </div>
                  <div>
                    <p className="font-bold">Important Medical Disclaimer</p>
                    <p className="text-sm">
                      SoulCircle is a supportive tool for emotional well-being and
                      is not a crisis support service or a substitute for
                      professional therapy, medical treatment, or psychiatric
                      care. The AI counsellors are advanced language models, not
                      licensed therapists. The guidance provided is for
                      informational and emotional support purposes only.
                    </p>
                    <p className="mt-2 font-semibold">
                      If you are in a mental health crisis or have thoughts of
                      self-harm, please contact a qualified mental health
                      professional or your local emergency services immediately.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
