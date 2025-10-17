# PhotoHub - Photo Album Web Application

A full-stack photo album application built with Next.js 14, MongoDB, and Cloudinary for creating, sharing, and printing beautiful photo albums.

## 🚀 Features

- **Authentication**: Email/password and Google OAuth with NextAuth
- **Photo Management**: Upload, organize, and manage photos with Cloudinary
- **Album Creation**: Custom layouts, themes, and privacy settings
- **Sharing**: Public, private, and password-protected albums
- **Print Orders**: Professional printing with Stripe integration
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary
- **Payment**: Stripe (for print orders)
- **State Management**: Zustand
- **File Upload**: react-dropzone

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Google OAuth credentials (optional)
- Stripe account (for payments)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/PhotoHubWeb.git
   cd PhotoHubWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your credentials:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/photohub
   # For production: mongodb+srv://username:password@cluster.mongodb.net/photohub

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Cloudinary (required)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Stripe (for payments)
   STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
   ```

4. **Set up MongoDB**
   
   Local MongoDB:
   ```bash
   # Install MongoDB locally or use Docker
   docker run --name photohub-mongo -p 27017:27017 -d mongo:latest
   ```

   Or use MongoDB Atlas (cloud) and update the `MONGODB_URI` in `.env.local`

5. **Set up Cloudinary**
   
   - Create a [Cloudinary account](https://cloudinary.com/)
   - Get your Cloud Name, API Key, and API Secret from the dashboard
   - Update the Cloudinary variables in `.env.local`

6. **Set up Google OAuth (Optional)**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
   - Update the Google variables in `.env.local`

## 🚗 Running the Application

1. **Development mode**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   npm start
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── album/             # Album-related pages
│   ├── dashboard/         # User dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── context/              # State management (Zustand)
├── lib/                  # Utility functions
└── models/               # MongoDB schemas
```

## 🔗 API Endpoints

- **Authentication**
  - `POST /api/auth/[...nextauth]` - NextAuth endpoints

- **Albums**
  - `GET /api/albums` - Get user albums
  - `POST /api/albums` - Create new album
  - `GET /api/albums/[id]` - Get album details
  - `PUT /api/albums/[id]` - Update album
  - `DELETE /api/albums/[id]` - Delete album

- **Photos**
  - `POST /api/photos/upload` - Upload photo to Cloudinary
  - `DELETE /api/photos/delete` - Delete photo

- **Orders**
  - `GET /api/orders` - Get user orders
  - `POST /api/orders` - Create new order

## 🎨 Customization

### Adding New Themes
1. Update the theme options in `src/app/album/create/page.tsx`
2. Add corresponding styles in your CSS

### Adding New Layouts
1. Update the layout options in the album creation form
2. Implement the layout logic in the album display component

## 🔒 Security Features

- **Authentication**: Secure user authentication with NextAuth
- **Authorization**: Role-based access control
- **Input Validation**: Server-side input validation
- **Image Security**: Cloudinary handles image security and optimization
- **Password Protection**: Albums can be password-protected

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Update URLs** in environment variables for production

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t photohub .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 --env-file .env.local photohub
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/yourusername/PhotoHubWeb/issues) page
2. Create a new issue with detailed description
3. Include error logs and environment details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Cloudinary](https://cloudinary.com/) for image management
- [MongoDB](https://www.mongodb.com/) for the database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [NextAuth.js](https://next-auth.js.org/) for authentication
