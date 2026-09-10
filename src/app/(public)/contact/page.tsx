import type { Metadata } from 'next';
import ContactPageClient from '@/components/templates/ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact & Collaboration | Tech Team Studio',
  description: 'Initiate a project or reach out to Tech Team Studio for full-stack engineering, AI development, and digital design.',
};

export default function ContactPage() {
  return <ContactPageClient />;
}
