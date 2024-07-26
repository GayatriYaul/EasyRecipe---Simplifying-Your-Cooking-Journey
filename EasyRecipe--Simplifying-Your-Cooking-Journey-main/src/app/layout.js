import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className="bg-white dark:bg-gray-900"
      >{children}</body>
    </html>
  );
} 
// not required