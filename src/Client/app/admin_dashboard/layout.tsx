'use client'
import '../../styles/globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <main>{children}</main>
        </div>
    );
}
