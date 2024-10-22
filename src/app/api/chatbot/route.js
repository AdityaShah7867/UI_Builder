import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const websiteInfo = `
Our website is a powerful and intuitive website builder platform. Here's a comprehensive overview:

User Flow:
1. Registration: Users start by registering an account on our platform.
2. Dashboard: After registration, users are directed to their personal dashboard.
3. Page Management: From the dashboard, users can view all their pages and have options to create, edit, or delete pages.
4. Live Preview: A prominent "Live Link" button is available at the top of the dashboard, allowing users to access the hosted version of their website instantly.
5. UI Builder: Clicking on 'Edit' or 'Create Page' takes the user to our advanced UI builder.

Dashboard Features:
- Overview of all created pages
- Quick access to edit, delete, or create new pages
- Live preview button for instant access to the hosted site
- Site statistics and analytics (if applicable)

UI Builder:
Our UI builder is the heart of the platform, offering a drag-and-drop interface with a wide array of features:
1. Drag-and-Drop Functionality: Easily place and arrange elements on the page.
2. AI-Powered Components: Utilize AI to generate and suggest components based on your needs.
3. Download HTML: Option to download the HTML of your created pages.
4. View Code: See the underlying code of your design in real-time.
5. YouTube Integration: Easily embed and customize YouTube videos.
6. Image Editing: Built-in image editing capabilities for quick adjustments.
7. Font Customization: Access to a wide range of fonts and typography options.
8. Custom Code Injection: Add your own CSS, JavaScript, or HTML for advanced customization.
9. Responsive Design Tools: Ensure your site looks great on all devices.
10. Template Library: Access pre-designed templates as starting points.
11. Component Library: A vast selection of pre-built components to use.
12. Undo/Redo Functionality: Easily revert or reapply changes.
13. Layout Grids: Use grid systems for precise element placement.
14. Color Palette Tools: Create and apply consistent color schemes across your site.
15. Asset Management: Organize and reuse images, videos, and other media.

Saving and Publishing:
1. Auto-Save: Changes are automatically saved as you work.
2. Version History: Access previous versions of your pages.
3. One-Click Publish: Instantly make your changes live.
4. Preview Mode: Check how your site looks before publishing.

Sharing and Access:
1. Custom Domain: Option to use your own domain name.
2. Shareable URL: Each site gets a unique URL in the format username.ourplatform.com.
3. Access Control: Set pages as public or private.
4. Collaboration Tools: Invite team members to work on the site together.

Additional Features:
- SEO Tools: Built-in features to improve search engine rankings.
- Performance Optimization: Automatic optimization for fast loading times.
- Analytics Integration: Track visitor data and site performance.
- Third-Party Integrations: Connect with popular services and APIs.
- Mobile App: Manage your site on-the-go with our mobile application.
- Customer Support: Access to tutorials, documentation, and support team.

Our platform is designed to cater to both beginners and advanced users, providing an intuitive yet powerful website building experience. Whether you're creating a simple landing page or a complex multi-page website, our tools and features are here to help you bring your vision to life quickly and efficiently.
`;

export async function POST(req) {
  const { messages } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = result.response;

    return NextResponse.json({ response: response.text() });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
