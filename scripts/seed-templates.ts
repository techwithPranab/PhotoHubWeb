import mongoose from 'mongoose';
import connectDB from '../src/lib/mongodb';
import Template from '../src/models/Template';

const templates = [
  {
    name: 'Classic Wedding',
    description: 'Elegant and timeless wedding photo book with sophisticated layouts',
    image: '/api/placeholder/400/300',
    category: 'wedding',
    size: '8.5x11',
    pages: '40',
    binding: 'Hardcover',
    price: '49.99',
    features: ['Premium Paper', 'Gold Foiling', 'Custom Monogram', 'Photo Enhancement'],
    popular: true
  },
  {
    name: 'Romantic Garden',
    description: 'Beautiful floral designs perfect for outdoor wedding ceremonies',
    image: '/api/placeholder/400/300',
    category: 'wedding',
    size: '8.5x11',
    pages: '36',
    binding: 'Layflat',
    price: '44.99',
    features: ['Floral Motifs', 'Watercolor Accents', 'Ribbon Closure', 'Arch Layouts'],
    popular: false
  },
  {
    name: 'Modern Elegance',
    description: 'Contemporary design with clean lines and minimalist aesthetics',
    image: '/api/placeholder/400/300',
    category: 'wedding',
    size: '8.5x11',
    pages: '32',
    binding: 'Hardcover',
    price: '39.99',
    features: ['Modern Typography', 'Geometric Elements', 'Matte Finish', 'Minimalist Design'],
    popular: true
  },
  {
    name: 'Family Heritage',
    description: 'Preserve your family history with this beautiful heirloom book',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '10x8',
    pages: '50',
    binding: 'Leather',
    price: '69.99',
    features: ['Leather Binding', 'Gold Embossing', 'Family Tree Layout', 'Archival Quality'],
    popular: true
  },
  {
    name: 'Growing Family',
    description: 'Document your family\'s growth and precious moments',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '8.5x11',
    pages: '40',
    binding: 'Hardcover',
    price: '49.99',
    features: ['Timeline Layout', 'Baby Photos', 'Growth Charts', 'Memory Pages'],
    popular: false
  },
  {
    name: 'Adventure Awaits',
    description: 'Capture your travel adventures with stunning scenic layouts',
    image: '/api/placeholder/400/300',
    category: 'travel',
    size: '9x7',
    pages: '48',
    binding: 'Layflat',
    price: '54.99',
    features: ['Map Integration', 'Itinerary Pages', 'Scenic Layouts', 'Travel Tips'],
    popular: true
  },
  {
    name: 'World Explorer',
    description: 'Document your global adventures with world map designs',
    image: '/api/placeholder/400/300',
    category: 'travel',
    size: '8.5x11',
    pages: '44',
    binding: 'Hardcover',
    price: '52.99',
    features: ['World Maps', 'Country Flags', 'Currency Notes', 'Language Phrases'],
    popular: false
  },
  {
    name: 'Graduation Memories',
    description: 'Celebrate academic achievements with this milestone book',
    image: '/api/placeholder/400/300',
    category: 'yearbook',
    size: '8.5x11',
    pages: '32',
    binding: 'Hardcover',
    price: '39.99',
    features: ['Diploma Display', 'Achievement Timeline', 'Future Goals', 'Memory Quotes'],
    popular: true
  },
  {
    name: 'Baby\'s First Year',
    description: 'Document every precious moment of your baby\'s first year',
    image: '/api/placeholder/400/300',
    category: 'baby',
    size: '7x7',
    pages: '52',
    binding: 'Hardcover',
    price: '44.99',
    features: ['Monthly Layouts', 'Growth Charts', 'Firsts Tracking', 'Handprint Pages'],
    popular: true
  },
  {
    name: 'Holiday Cheer',
    description: 'Create magical holiday memories with festive designs',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '8.5x11',
    pages: '36',
    binding: 'Hardcover',
    price: '42.99',
    features: ['Festive Colors', 'Holiday Themes', 'Recipe Pages', 'Gift Lists'],
    popular: false
  },
  {
    name: 'Portrait Studio',
    description: 'Professional portrait layouts for headshots and family portraits',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '10x8',
    pages: '28',
    binding: 'Softcover',
    price: '34.99',
    features: ['Professional Layouts', 'Color Correction', 'Print Ready', 'Multiple Sizes'],
    popular: false
  },
  {
    name: 'Custom Canvas',
    description: 'Design your own photo book with complete creative freedom',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '8.5x11',
    pages: '40',
    binding: 'Hardcover',
    price: '59.99',
    features: ['Custom Layouts', 'Unlimited Photos', 'Text Editing', 'Color Themes'],
    popular: true
  },
  {
    name: 'Destination Wedding',
    description: 'Perfect for beach, mountain, and destination weddings',
    image: '/api/placeholder/400/300',
    category: 'wedding',
    size: '9x7',
    pages: '38',
    binding: 'Layflat',
    price: '47.99',
    features: ['Destination Themes', 'Weather Resistant', 'Travel Details', 'Local Culture'],
    popular: false
  },
  {
    name: 'Family Reunion',
    description: 'Document large family gatherings and reunions',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '11x8.5',
    pages: '48',
    binding: 'Hardcover',
    price: '56.99',
    features: ['Group Photos', 'Family Tree', 'Guest Book', 'Recipe Collection'],
    popular: false
  },
  {
    name: 'European Adventure',
    description: 'Capture the romance and beauty of European travel',
    image: '/api/placeholder/400/300',
    category: 'travel',
    size: '8.5x11',
    pages: '46',
    binding: 'Hardcover',
    price: '51.99',
    features: ['European Maps', 'City Guides', 'Cultural Notes', 'Language Tips'],
    popular: false
  },
  {
    name: 'College Journey',
    description: 'Document the college experience and academic achievements',
    image: '/api/placeholder/400/300',
    category: 'yearbook',
    size: '8.5x11',
    pages: '40',
    binding: 'Hardcover',
    price: '45.99',
    features: ['Campus Life', 'Academic Timeline', 'Sports Memories', 'Future Plans'],
    popular: false
  },
  {
    name: 'Baby Milestone',
    description: 'Track developmental milestones and precious moments',
    image: '/api/placeholder/400/300',
    category: 'baby',
    size: '7x7',
    pages: '48',
    binding: 'Hardcover',
    price: '41.99',
    features: ['Milestone Tracking', 'Development Charts', 'Memory Journal', 'Photo Timeline'],
    popular: false
  },
  {
    name: 'Christmas Magic',
    description: 'Create cherished Christmas memories with festive layouts',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '8.5x11',
    pages: '34',
    binding: 'Hardcover',
    price: '39.99',
    features: ['Christmas Themes', 'Family Traditions', 'Gift Photos', 'Holiday Recipes'],
    popular: false
  },
  {
    name: 'Senior Portraits',
    description: 'Professional layouts for senior photos and graduation portraits',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '10x8',
    pages: '24',
    binding: 'Softcover',
    price: '32.99',
    features: ['Senior Quotes', 'Achievement Display', 'Memory Pages', 'Future Plans'],
    popular: false
  },
  {
    name: 'Luxury Wedding',
    description: 'Premium wedding album with luxury materials and designs',
    image: '/api/placeholder/400/300',
    category: 'wedding',
    size: '11x8.5',
    pages: '42',
    binding: 'Premium Leather',
    price: '89.99',
    features: ['Premium Leather', 'Gold Embossing', 'Crystal Details', 'Luxury Box'],
    popular: true
  },
  {
    name: 'Generations',
    description: 'Connect generations with beautiful family history layouts',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '10x8',
    pages: '56',
    binding: 'Leather',
    price: '74.99',
    features: ['Generational Photos', 'Family History', 'Legacy Stories', 'Heirloom Quality'],
    popular: false
  },
  {
    name: 'Safari Adventure',
    description: 'Document wildlife and safari experiences',
    image: '/api/placeholder/400/300',
    category: 'travel',
    size: '9x7',
    pages: '44',
    binding: 'Hardcover',
    price: '49.99',
    features: ['Wildlife Layouts', 'Safari Maps', 'Animal Tracking', 'Adventure Journal'],
    popular: false
  },
  {
    name: 'Thanksgiving Feast',
    description: 'Celebrate Thanksgiving with family and food-focused layouts',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '8.5x11',
    pages: '38',
    binding: 'Hardcover',
    price: '43.99',
    features: ['Thanksgiving Themes', 'Recipe Pages', 'Family Photos', 'Gratitude Journal'],
    popular: false
  },
  {
    name: 'Designer Collection',
    description: 'Premium custom designs with professional photography layouts',
    image: '/api/placeholder/400/300',
    category: 'photo-books',
    size: '11x8.5',
    pages: '50',
    binding: 'Premium Hardcover',
    price: '79.99',
    features: ['Designer Templates', 'Premium Materials', 'Custom Binding', 'Professional Quality'],
    popular: true
  }
];

async function seedTemplates() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    const insertedTemplates = await Template.insertMany(templates);
    console.log(`Seeded ${insertedTemplates.length} templates successfully`);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding templates:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
(async () => {
  try {
    await seedTemplates();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
})();
