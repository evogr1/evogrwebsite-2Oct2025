# Client Logos Directory

This directory contains client logos for the homepage carousel.

## Adding Client Logos

1. **Image Format**: Use PNG, SVG, or JPG formats
2. **Size**: Recommended dimensions are 200x80px (max height 80px)
3. **Background**: Use transparent backgrounds for PNG/SVG files
4. **Naming**: Use descriptive names like `company-name-logo.png`

## Updating the Carousel

To add your actual client logos, edit the `clientLogos` array in `/index.html`:

```javascript
const clientLogos = [
  { name: 'Company Name', type: 'image', src: '/assets/logos/company-logo.png' },
  { name: 'Another Company', type: 'image', src: '/assets/logos/another-logo.svg' },
  // Add more logos here
];
```

## Example Logo Structure

```
assets/logos/
├── client1-logo.png
├── client2-logo.svg
├── client3-logo.jpg
└── README.md
```

## Tips for Best Results

- **Consistent sizing**: Keep logos roughly the same height for visual consistency
- **High quality**: Use high-resolution images that look good on retina displays
- **Brand guidelines**: Ensure you have permission to use client logos
- **Fallback text**: Always provide the company name as fallback text

## Carousel Features

- ✅ Continuous scrolling animation
- ✅ Hover to pause functionality
- ✅ Responsive design (mobile-friendly)
- ✅ Smooth fade-in/fade-out edges
- ✅ Glass-morphism design matching your site theme
- ✅ Automatic positioning between homepage sections
