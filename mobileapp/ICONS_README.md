# Pizza Calc App Icons

## Generated Icons

All app icons have been generated with a custom pizza theme! 🍕

### Icon Files

- **icon.png** (1024x1024) - Main app icon
- **adaptive-icon.png** (1024x1024) - Android adaptive icon
- **favicon.png** (48x48) - Web favicon
- **splash-icon.png** (1024x1024) - Splash screen icon

### Design

The icons feature:
- **Orange gradient background** (#FF6B35 → #FF8C42) matching the app theme
- **Golden pizza base** with crust details
- **Red pepperoni slices** arranged in a classic pattern
- **Professional finish** with highlights and shadows

### Regenerating Icons

If you want to regenerate the icons:

```bash
node generate-icons.js
```

This will recreate all icon files in the `assets/` directory.

### Customizing Icons

To customize the icon design, edit `generate-icons.js`:

1. **Change colors**: Modify the color values in the `generateIcon()` function
2. **Add elements**: Add more shapes/patterns to the pizza design
3. **Adjust sizes**: Modify the `sizes` object at the top of the file

Example color changes:
```javascript
// Background gradient
gradient.addColorStop(0, '#YOUR_COLOR_1');
gradient.addColorStop(1, '#YOUR_COLOR_2');

// Pizza base
ctx.fillStyle = '#YOUR_PIZZA_COLOR';
```

### Using Different Icons

To use your own custom icons:

1. Replace the PNG files in `assets/` directory
2. Keep the same filenames and sizes
3. Update `app.json` if you change the file paths

### Icon Sizes Reference

- **App Icon**: 1024x1024 (will be scaled down automatically)
- **Adaptive Icon**: 1024x1024 (Android only, with safe zone)
- **Favicon**: 48x48 (web browsers)
- **Splash Screen**: 1024x1024 (shown when app loads)

## App Branding

The `app.json` has been updated with:
- **App name**: "Pizza Calc"
- **Splash screen background**: Orange (#FF6B35)
- **Adaptive icon background**: Orange (#FF6B35)
- **Package name**: com.pizzacalc.app

All branding is consistent with the orange pizza theme throughout the app!
