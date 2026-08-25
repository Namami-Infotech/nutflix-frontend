import { redirect } from 'next/navigation';

export default function MyOrdersRedirectPage() {
  redirect('/profile?tab=orders');
}
