'use client'
import '../../../styles/globals.css'
interface RootLayoutProps {
    children: React.ReactNode;
  }
  
export default function Layout({ children }: RootLayoutProps) {
    return (
        <div>
            <main>{children}</main>
        </div>
    );
}
