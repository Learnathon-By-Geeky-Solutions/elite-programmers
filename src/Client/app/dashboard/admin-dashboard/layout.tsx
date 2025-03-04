'use client'
import '../../../styles/globals.css'
import SideBar from './sidebar/page'
interface RootLayoutProps {
    children: React.ReactNode;
  }
  
  export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <div>
            <SideBar/>
            <main >{children}</main>
        </div>
    );
}
